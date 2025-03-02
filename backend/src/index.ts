import express, { application } from 'express';
import bookmark from './routes/bookmarkRoutes';
import home from './routes/homeRoutes';
import question from './routes/questionsRoutes';
import user from './routes/usersRoutes';
import cors from 'cors'

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.get('/api/v1/home',home,(req,res)=>{
    
});
app.get('/api/v1/bookmark',bookmark);
app.get('/api/v1/question',question);
app.use('/api/v1/watch-history');
app.get('/api/v1/user',user);


  
  
  
  
  

app.listen(port,()=>{
    console.log(`Server running on https://localhost:${port}`)
});
