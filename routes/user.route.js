const express = require("express");
const { register, login, resetpassword } = require("../controller/user");
const { authenticate } = require("../middleware/authenticate");


const UserRouter = express.Router();

UserRouter.post("/register",register );

UserRouter.post("/login",login);

UserRouter.patch("/:id/reset",authenticate,resetpassword)

module.exports = { UserRouter };