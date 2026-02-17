const express = require("express");
const router = express.Router();
const {userRegisterController} = require("../controllers/auth.controller");




router.post("/register",userRegisterController);





module.exports = router; 