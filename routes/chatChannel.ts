import express, { Express, Request, Response } from "express";
const chatController = require("../controllers/chatController");

var router = express.Router();
router.get('/list',chatController.getChatChannel);


module.exports = router;