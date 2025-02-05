import express from 'express';
import bookmark from './routes/bookmarkRoutes';
import home from './routes/homeRoutes';
import question from './routes/questionsRoutes';
import user from './routes/usersRoutes';
import cors from 'cors'

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use('/api/v1/home',home);
app.use('/api/v1/bookmark',bookmark);
app.use('/api/v1/question',question);
// app.use('/api/v1/watch-history');
app.use('/api/v1/user',user);

app.listen(port,()=>{
    console.log(`Server running on https://localhost:${port}`)
});
