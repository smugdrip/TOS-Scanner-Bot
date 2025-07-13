import dotenv from 'dotenv';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import cors from 'cors';
import OpenAI from "openai";
import { readFileSync } from 'node:fs';

dotenv.config();

const openai = new OpenAI({apiKey:process.env.OPENAI_API});
const secret = process.env.JWT_SECRET;

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

const promptTemplate = readFileSync('tos-audit-prompt.md', 'utf8');

// MySQL pool
// host & port is localhost:3306
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// login to existing account and generate a jwt
app.post('/api/login', async (req, res) => {
  
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }

  try {
    const [users] = await  pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'username doesnt exist' });
    }

    const user = users[0];

    const match = await bcrypt.compare(password, user.pswd_hash);
    if (match) {
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        secret,
        { expiresIn: '1h' }
      );
      return res.json({ token });
    } else {
      return res.status(401).json({error: 'wrong password'});
    }
    
  } catch (err) {
    console.error('error loggin in:', err);
    return res.status(500).json({ error: 'server error when logging in' });
  }

});

// create a new account
app.post('/api/create-account', async (req, res) => {
  
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, pswd_hash) VALUES (?, ?)',
      [username, hash]
    );
    return res.json({ userId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'username already exists' });
    }
    console.error('Account creation failed:', err);
    return res.status(500).json({ error: 'server erro when creating account' });
  }

});

// submit tos to AI agent for audit
app.post('/api/submit-tos', verifyToken, async (req, res) => {
  try {
    const tosText = req.body.tos;
    if (!tosText) {
      return res.status(400).json({ error: 'tos field missing' });
    }
    const fullPrompt = promptTemplate.replace('{{TOS_TEXT}}', tosText);
    const completion = await openai.responses.create({
      model: 'gpt-4.1',
      input: fullPrompt,
    });
    return res.json({ audit: completion.output_text });

  } catch (err) {
    console.error('OpenAI call failed: ', err);
    return res.status(500).json({ error: 'OpenAI call failed' });
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// start express server
// port is 4000
const SERVER_PORT = process.env.SERVER_PORT;
app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
});

