import express, { Express, Request, Response } from "express";
const authController = require("../controllers/authController");

var router = express.Router();
router.post('/register',authController.register);
router.post('/login',authController.login);


module.exports = router;