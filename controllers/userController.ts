import express, { Request, Response, NextFunction } from "express";
const userModel = require('../models/userModel');
const { UserSchemaModel } = require("../Interfaces/Interfaces")
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
exports.users = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await userModel.users()
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.whatsAppUsersByCountry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let users = await userModel.whatsAppUsersByCountry({country:req.query.country});
        res.json(users);
    } catch (err) {
        next(err);
    }
};