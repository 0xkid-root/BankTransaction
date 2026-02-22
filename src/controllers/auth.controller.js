const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service");
const blackListModel = require("../models/blackList.model");

async function userRegisterController(req,res){
    const {email,password,name} = req.body;
    console.log(email,password,name);

    const isExists = await userModel.findOne({
        email:email
    })
    console.log(isExists);

    if(isExists){
        return res.status(422).json({
            message:"user already exists with this email!",
            status:"failed"
        })
    }
    const user = await userModel.create({
        email,password,name
    })

    const token = jwt.sign
    (
        {userId:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    res.cookie("token",token)

    res.status(201).json({
        message:"user registered successfully",
        status:"success",
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })

    await emailService.sendRegistrationEmail(user.email,user.name);



}

/**
 * - user login controller
 * -POST /api/v1/auth/login
 * - Request Body - {email,password}
 * - Response - {message,status,user,token}
 */

async function userLoginController(req,res){
    const {email,password} = req.body;
    console.log(email,password);
    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({
            message:"user not found",
            status:"failed"
        })
    }

    const isValidPasswd = await user.comparePassword(password);
    console.log("isValidPasswd",isValidPasswd);

    if(!isValidPasswd){
        return res.status(401).json({
            message:"invalide password",
            status:"failed"
        })
    }

    const token =jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    res.cookie("token",token);
    res.status(200).json({
        message:"user logged in successfully",
        status:"success",
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })


}

async function userLogoutController(req,res){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(400).json({
            message:"user not found",
            status:"failed"
        })

    }

    await blackListModel.create({
        token:token
    })
    res.clearCookie("token");

    return res.status(200).json({
        message:"user logged out successfully",
        status:"success"
    })



}


module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}