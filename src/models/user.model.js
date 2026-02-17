const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true, "Email is required for creating!"],
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    }
})