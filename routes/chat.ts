import express, { Express, Request, Response } from "express";
const chatController = require("../controllers/chatController");

var router = express.Router();

router.get('/',chatController.getChatChannels);
router.get('/channels',chatController.getChatChannelListByEmailAndGroupType);
router.get('/:id',chatController.getChatIndexDetailsById);
router.post('/',chatController.createChatChannel);


module.exports = router;