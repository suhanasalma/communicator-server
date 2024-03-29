import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./db/db";
var usersRouter = require('./routes/user');
var chatRouter = require('./routes/chat');
var authRouter = require('./routes/auth');
var messageRouter = require('./routes/message');
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
app.use('/message', messageRouter);



app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Communicator Server is running");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});