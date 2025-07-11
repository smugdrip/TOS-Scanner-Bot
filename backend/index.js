import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

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
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// start express server
// port is 4000
const SERVER_PORT = process.env.SERVER_PORT;

app.listen(SERVER_PORT, () => {
  console.log(`Server running on http://localhost:${SERVER_PORT}`);
});
