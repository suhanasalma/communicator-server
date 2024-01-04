import express, { Express, Request, Response } from "express";
const usersController = require("../controllers/userController");

var router = express.Router();
router.get('/',usersController.users);
router.post('/',usersController.register);


router.post('/login',usersController.login);


router.get('/whatsapp-user-by-country',usersController.whatsAppUsersByCountry);


module.exports = router;