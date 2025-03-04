import express from 'express';
import shome from './student/home';
import cors from 'cors'
import ssignup from './student/user/signup'
import tsignup from './teacher/user/signup'
import tlogin from './teacher/user/login'
import slogin from './student/user/login'
import thome from './teacher/home';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/api/v1/student',shome);
app.use('/api/v1/student',slogin)
app.use('/api/v1/student',ssignup)


app.use('/api/v1/teacher',thome);
app.use('/api/v1/teacher',tlogin);
app.use('/api/v1/teacher',tsignup);


app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
});
