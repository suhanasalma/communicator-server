import express, { Express, Request, Response } from "express";
const usersController = require("../controllers/userController");

var router = express.Router();
router.get('/',usersController.users);
router.get('/whatsapp-users',usersController.whatsAppUsers);
router.get('/:email',usersController.getUserByEmail);


module.exports = router;