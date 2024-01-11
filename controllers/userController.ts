import express, { Request, Response, NextFunction } from "express";
const userModel = require('../models/userModel');

exports.getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await userModel.getUserByEmail({email:req.params.email})
        res.json(users);
    } catch (err) {
        next(err);
    }
};
exports.users = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await userModel.users()
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.whatsAppUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await userModel.whatsAppUsers({country:req.query.country,email:req.query.email});
        res.json(users);
    } catch (err) {
        next(err);
    }
};
