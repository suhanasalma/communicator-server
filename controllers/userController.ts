import express, { Request, Response, NextFunction } from "express";
const userModel = require('../models/userModel');
const { UserSchemaModel } = require("../Interfaces/Interfaces")
const util = require('../util/password');

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
