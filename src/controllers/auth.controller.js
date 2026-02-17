const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")


async function userRegisterController(req,res){
    const {email,password,name} = req.body;

    const isExists = userModel.findOne({
        email:email
    })

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
        data:user
    })


}


module.exports = {
    userRegisterController
}