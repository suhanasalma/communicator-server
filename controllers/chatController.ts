import express, { Request, Response, NextFunction } from "express";
const chatModel = require('../models/chatModel');

exports.getChatChannelsByEmailAndIndexType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await chatModel.getChatChannelsByEmailAndIndexType({email:req.query.email, chat_index_status:req.query.chat_index_status,searchTextName:req.query.searchTextName,filter:req.query.filter, group_type:req.query.group_type,});
        res.json(users);
    } catch (err) {
        next(err);
    }
};
exports.getChatIndexDetailsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let chatIndex = await chatModel.getAllTypeChatChannels({channel_name:req.params.id});
        res.json(chatIndex.channels[0]);
    } catch (err) {
        next(err);
    }
};
exports.createChatChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log("req.body",req.body);
        let response = await chatModel.createChatChannel({channelInfo:req.body});
        res.json(response);
    } catch (err) {
        next(err);
    }
};

exports.getAllTypeChatChannels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let response = await chatModel.getAllTypeChatChannels({email:req.query.email, chat_index_status:req.query.chat_index_status, group_type:req.query.group_type,channel_id:req.query.channel_id,searchTextName:req.query.searchTextName});
        res.json(response);
    } catch (err) {
        next(err);
    }
};


exports.getCommonChannelAndGroups = async (req: Request, res: Response, next: NextFunction) =>{
    let response = await chatModel.getCommonChannelAndGroups({email:req.body.email,participants:req.body.participants});
    res.json(response); 
};
