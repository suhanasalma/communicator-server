import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./db/db";
var usersRouter = require('./routes/user');
var chatRouter = require('./routes/chatChannel');
var authRouter = require('./routes/auth');
const cors = require('cors');
const app: Express = express();
const port = process.env.PORT || 3000;


dotenv.config();
connectDB();
app.use(cors({
  origin: '*', // Allow requests from this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(express.json())



app.use('/users', usersRouter);
app.use('/chat', chatRouter);
app.use('/auth', authRouter);



app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});