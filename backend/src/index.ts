import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';


// Import custom modules
import shome from './student/home';
import ssignup from './student/user/signup';
import slogin from './student/user/login';
import tsignup from './teacher/user/signup';
import tlogin from './teacher/user/login';
import thome from './teacher/home';
import allteacher from './teacher/allteachers';

// Initialize Express app and HTTP server
const app: Application = express();
const server: http.Server = http.createServer(app);
const port: number = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Student routes
app.use('/api/v1/student', shome);
app.use('/api/v1/student', slogin);
app.use('/api/v1/student', ssignup);

// Teacher routes
app.use('/api/v1/teacher', thome);
app.use('/api/v1/teacher', tlogin);
app.use('/api/v1/teacher', tsignup);
app.use('/api/v1/teacher', allteacher);

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
