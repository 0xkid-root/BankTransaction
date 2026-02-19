const mongoose = require("mongoose");


const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        index:true // creating an index on user field becuase so many user then indexing fast ho isliye humne use kiye


    },
    status:{
        enum:{

            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either ACTIVE, FROZEN or CLOSED !",
            default:"ACTIVE"
        }
    },
    currency:{
        type:String,
        default:"INR",
        required:[true,"Currency is required for creating an account!"]
    }

},
{
    timestamps:true,
})

// bd  me hum balance store nhi karte hai ledger use karte hai balance ko store krna ke liye 

accountSchema.index({
    user:1,status:1
})
 

const accountModel = mongoose.model('account',accountSchema);
module.exports = accountModel;