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
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
// });

// hello world get request
app.get('/api/hello', (req, res) => {
  res.send('Hello World!');
});

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

