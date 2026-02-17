const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true, "Email is required for creating!"],
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Invalid Email address !"]
    },
    name:{
        type:String,
        required:[true,"Name is required for creating!"],
    },
    password:{
        type:String,
        required:[true,"Password is required for creating!"],
        minlength:[6,"password should contain more than 6 characters"],
        select:false//password will not be returned in the response if i m call in the user modal then not return to the password
    }
},{
    timestamps:true
})

// userSchema.pre("save", function(next) means jab v hum userschema me save kare ge to ek function run hoga
userSchema.pre("save",async function(){
    console.log("running before save");

    if(!this.isModified("password")){
        return;
    }
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
})

userSchema.methods.comparePassword = async function(password){
    console.log("running comparePassword",password,this.password);

    return await bcrypt.compare(password,this.password);
}


const userModel = mongoose.model('user', userSchema)

module.exports = userModel;