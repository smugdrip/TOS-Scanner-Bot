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
        { expiresIn: '3h' }
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
    const { userId } = req.user;
    const [userRows] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const fullPrompt = promptTemplate.replace('{{TOS_TEXT}}', tosText);
    const completion = await openai.responses.create({
      model: 'gpt-4.1',
      input: fullPrompt,
    });
    const auditText = completion.output_text ?? '';
    const auditScore = 22;
    const companyName = req.body.company_name;
    const description = req.body.description;
    await pool.execute(
      `INSERT INTO tos_audits (tos_text, audit_text, audit_score, company_name, description, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tosText, auditText, auditScore, companyName, description, userId]
    );
    return res.json({ audit: auditText, score: 67 });
  } catch (err) {
    console.error('submit-tos failed:', err);
    return res.status(500).json({ error: 'Server error while submitting TOS' });
  }
});

// get all audits for the current user
app.get('/api/tos-by-user', verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const [rows] = await pool.execute(
      `SELECT id,
              tos_text,
              description,
              audit_text,
              audit_score,
              company_name,
              created_at
       FROM   tos_audits
       WHERE  user_id = ?`,
      [userId]
    );

    return res.json({ audits: rows });

  } catch (err) {
    console.error('get tos-by-user failed:', err);
    return res.status(500).json({ error: 'Server error while fetching TOS' });
  }
});

// verify the jwt and decode user info for later use
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// start express server
// port is 4000
const SERVER_PORT = process.env.SERVER_PORT;
app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
});

