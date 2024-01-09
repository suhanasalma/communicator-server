import express, { Express, Request, Response } from "express";
const authController = require("../controllers/authController");

var router = express.Router();
router.post('/',authController.register);
router.post('/login',authController.login);


module.exports = router;