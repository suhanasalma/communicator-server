import express, { Express, Request, Response } from "express";
const usersController = require("../controllers/userController");

var router = express.Router();
router.get('/',usersController.user);
router.post('/',usersController.register);


router.post('/login',usersController.login);



module.exports = router;