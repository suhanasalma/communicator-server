import express, { Express, Request, Response } from "express";
const usersController = require("../controllers/userController");

var router = express.Router();
router.get('/',usersController.getUsers);
router.get('/communicator-users',usersController.communicatorUsers);
router.get('/:email',usersController.getUserByEmail);


module.exports = router;