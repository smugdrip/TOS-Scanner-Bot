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

    res.json({ userId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    console.error('Account creation failed:', err);
    res.status(500).json({ error: 'create account failed' });
  }
});

// submit tos to AI agent for audit
app.post('/api/submit-tos', async (req, res) => {
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
    res.json({ audit: completion.output_text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OpenAI call failed' });
  }
});

// start express server
// port is 4000
const SERVER_PORT = process.env.SERVER_PORT;

app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
});

