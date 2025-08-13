import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectToMongo from './utils/database.js';
import Auth from './routes/auth.js';
import Note from './routes/profile.js';
import upload from './routes/upload.js';
import search from './routes/search.js'
import follow from './routes/follow.js';
import home from './routes/home.js'
import like from './routes/like.js'
connectToMongo();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', Auth);
app.use('/api/profile', Note);
app.use('/api/upload', upload);
app.use('/api/search', search);
app.use('/api/follow', follow);
app.use('/api/home', home);
app.use('/api/like', like);
let PORT = process.env.PORT || 5000;
app.listen(`${PORT}`, () => {
    console.log('Server Started With Database');
});