import express, { Express, Request, Response } from "express";
const chatController = require("../controllers/chatController");

var router = express.Router();

router.get('/', chatController.getAllTypeChatChannels);
router.get('/channels', chatController.getChatChannelsByEmailAndIndexType);
router.get('/:id', chatController.getChatIndexDetailsById);
router.post('/', chatController.createChatChannel);
router.post('/common-channel', chatController.getCommonChannelAndGroups);


module.exports = router;