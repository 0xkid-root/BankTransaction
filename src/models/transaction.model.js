const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true,"Transaction must be associated with a from account"],
        index: true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true,"Transaction must be associated with a to account"],
        index: true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status can be either PENDING, COMPLETED, FAILED or REVERSED !",
            },
        default:"PENDING" 
    },
    amount:{
        type:Number,
        required:[0,"Transaction amount cannot be negative"],
        min:[0,"Transaction amount cannot be negative"],
    },
    idempotencyKey:{
        type:String,
        required:[true,"Transaction must have an idempotency key"],
        unique:[true,"Idempotency key must be unique"],
        index:true,
    },



},{
    timestamps:true,
});
/**
 *  idempotencyKey key same payment ko do baar krna se rokte hai or ye client side par generate hota hai backend isko generate nhi karta hai 
 * idemidempotencyKey key humasa unique hota hai 

 * 
 */


const transactionModel = mongoose.model('transaction', transactionSchema);
module.exports = transactionModel;
