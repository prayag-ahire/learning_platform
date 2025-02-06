import express from 'express'
const bookmark = require('./routes/bookmarkRoutes');
const home = require('./routes/homeRoutes');
const question = require('./routes/questionsRoutes');
const user = require('./routes/usersRoutes')

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/v1/home',home);
app.use('/api/v1/bookmark',bookmark);
app.use('/api/v1/question',question);
app.use('/api/v1/watch-history');
app.use('/api/v1/user',user);

app.listen(port,()=>{
    console.log(`Server running on https://localhost:${port}`)
});
