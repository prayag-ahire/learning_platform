import express from 'express';
import cors from 'cors';
import http from 'http';


// Import custom modules
// import shome from './student/home';
import ssignup from './student/user/signup.js';
import slogin from './student/user/login.js';
import tsignup from './teacher/user/signup.js';
import tlogin from './teacher/user/login.js';
import  subscribe  from './student/followingteacher.js';
// import thome from './teacher/home';
import allteacher from './teacher/allteachers.js';
import {WebSocketServer} from "ws"
import webSocketConnection from "./lib/ws.js";
import joinstudent from "./teacher/joinstudents.js"
import getMatrial from "./student/liveclass.js"
import me from "./student/user/me.js"
import me2 from "./teacher/user/me.js"


// Initialize Express app and HTTP server
const app= express();
const server = http.createServer(app);
const wss = new  WebSocketServer({server,path:"/ws"});
// const wss2 = new WebSocketServer({server,path:"/chat"});

webSocketConnection(wss);
// peerchat(wss2);

// Middleware
app.use(express.json());
app.use(cors());
const port = 3000;

// Student routes
// app.use('/api/v1/student', shome);
app.use('/api/v1/student', slogin);
app.use('/api/v1/student', ssignup);
app.use('/api/v1/student',subscribe);
app.use('/api/v1/student',getMatrial);
app.use('/api/v1/student',me);
// Teacher routes
// app.use('/api/v1/teacher', thome);


app.use('/api/v1/teacher', tlogin);
app.use('/api/v1/teacher', tsignup);
app.use('/api/v1/teacher', allteacher);
app.use('/api/v1/teacher/',joinstudent);
app.use('/api/v1/teacher',me2);

// Start server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
