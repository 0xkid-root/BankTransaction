const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");



const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        index:true // creating an index on user field becuase so many user then indexing fast ho isliye humne use kiye


    },
    status:{
        type:String,
        enum:{

            values:["ACTIVE","FROZEN","CLOSED"],
            message:"Status can be either ACTIVE, FROZEN or CLOSED !",
        },
        default:"ACTIVE",


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

accountSchema.methods.getBalance = async function(){

    const balanceData = await ledgerModel.aggreagate([
        {$match:{account:this._id}},
        {
            $group:{
                _id:null,
                totalDebit:{
                    $sum:{
                        $cond:[
                            { $eq: ["$type","DEBIT"]},
                            "$amount",
                            0

                        ]
                    }
                },
                totalCredit:{
                    $sum:{
                        $cond:[
                            { $eq:["$type","CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                balance:{ $subtract:["$totalDebit","$totalCredit"] }
            }

        }
    ])


    if(balanceData.length === 0){
        return 0;
    }
    return balanceData[0].balance;

 
}
 
 

const accountModel = mongoose.model('account',accountSchema);
module.exports = accountModel;