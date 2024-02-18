import express, { Express, Request, Response } from "express";
const messageController = require("../controllers/messageController");

var router = express.Router();

router.get('/',messageController.getMessages);

router.post('/',messageController.createMessage);


module.exports = router;