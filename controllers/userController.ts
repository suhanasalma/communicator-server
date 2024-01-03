import express, { Request, Response, NextFunction } from "express";
const userModel = require('../models/userModel');
const { UserModel } = require("../Interfaces/Interfaces")
const util = require('../util/password');


exports.register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let hasPass = await util.passwordEncription(req.body.password)
        let registerUserInfo = {
            name:req.body.name,
            email:req.body.email,
            password:hasPass,
            img:req?.body?.img
        }
        let response = await userModel.register({user:registerUserInfo});
        res.json(response);
    } catch (err) {
        next(err);
    }
};
exports.login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let response = await userModel.login({email:req.body.email,password:req.body.password});
        res.json(response);
    } catch (err) {
        next(err);
    }
};
exports.user = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await UserModel.find({}, { password: 0 })
        res.json(users);
    } catch (err) {
        next(err);
    }
};
