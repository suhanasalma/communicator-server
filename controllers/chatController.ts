import express, { Request, Response, NextFunction } from "express";
const chatModel = require('../models/chatModel');

exports.getChatChannelListByEmailAndGroupType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req.query getChatChannel",req.query);
        let users = await chatModel.getChatChannelListByEmailAndGroupType({email:req.query.email, chat_index_status:req.query.chat_index_status});
        res.json(users);
    } catch (err) {
        next(err);
    }
};
exports.getChatIndexDetailsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let chatIndex = await chatModel.getChatIndexDetailsById({id:req.params.id});
        res.json(chatIndex);
    } catch (err) {
        next(err);
    }
};
