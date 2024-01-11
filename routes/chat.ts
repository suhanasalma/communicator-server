import express, { Express, Request, Response } from "express";
const chatController = require("../controllers/chatController");

var router = express.Router();

router.get('/list',chatController.getChatChannelListByEmailAndGroupType);
router.get('/:id',chatController.getChatIndexDetailsById);
router.post('/',chatController.createChatChannel);


module.exports = router;