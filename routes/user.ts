import express, { Express, Request, Response } from "express";
const usersController = require("../controllers/userController");

var router = express.Router();
router.get('/',usersController.users);
router.get('/',usersController.getUserByEmail);
router.get('/whatsapp-users',usersController.whatsAppUsers);


module.exports = router;