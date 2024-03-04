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
exports.getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await userModel.getUsers()
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.communicatorUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("object",{country:req.query.country,email:req.query.email,name:req.query.name});
        let users = await userModel.communicatorUsers({country:req.query.country,email:req.query.email,name:req.query.name});
        res.json(users);
    } catch (err) {
        next(err);
    }
};
