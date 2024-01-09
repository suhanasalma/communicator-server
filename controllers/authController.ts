import express, { Request, Response, NextFunction } from "express";
const authModel = require('../models/authMode');
const util = require('../util/password');


exports.register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body);
        let hasPass = await util.passwordEncription(req.body.password)
        let registerUserInfo = {
            name:req.body.name,
            email:req.body.email,
            password:hasPass,
            img:req?.body?.img,
            status:req.body.status,
            country:req.body.country,
        }
        let response = await authModel.register({user:registerUserInfo});
        res.json(response);
    } catch (err) {
        next(err);
    }
};
exports.login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let response = await authModel.login({email:req.body.email,password:req.body.password});
        res.json(response);
    } catch (err) {
        next(err);
    }
};