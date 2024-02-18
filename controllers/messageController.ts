import express, { Request, Response, NextFunction } from "express";
const messageModel = require('../models/messageModel');

exports.createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log("req.body createMessage", req.body);
        let message = await messageModel.createMessage({ message: req.body });
        res.json(message);
    } catch (err) {
        next(err);
    }
};
exports.getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req.query getMessages", req.query);
        let message = await messageModel.getMessages({ channel_name: req.query.channel_name });
        res.json(message);
    } catch (err) {
        next(err);
    }
};