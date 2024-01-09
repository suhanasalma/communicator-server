import express, { Request, Response, NextFunction } from "express";
const chatModel = require('../models/chatModel');


exports.getChatChannel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req.query",req.query);
        let users = await chatModel.getChatChannel({country:req.query.country,email:req.query.email});
        res.json(users);
    } catch (err) {
        next(err);
    }
};