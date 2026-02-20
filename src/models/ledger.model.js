const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
    account:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with an account"],
        index:true,
        immutable:true,
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a ledger entry"],
        immutable:true,
    },
    transaction:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger must be associated with a transaction"],
        index:true,
        immutable:true,
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can be either CREDIT or DEBIT !",
        },
        required:[true,"Transaction type is required"],
        immutable:true,
    },



},{
    timestamps:true,
})

function preventLedgerModification(next) {
    return next(new Error("Ledger modification is not allowed"));
}
/**
 * ledger ko modify nhi kar sakte hai 
 * isliye hum preventLedgerModification function banate hain jo ledger ko modify nhi kar sake
 * iske liye hum pre middleware use karte hain jo ledger ko modify nhi kar sake
 */

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification)
ledgerSchema.pre('findOneAndDelete', preventLedgerModification)
ledgerSchema.pre('updateOne', preventLedgerModification)
ledgerSchema.pre('deleteOne', preventLedgerModification)
ledgerSchema.pre('updateMany', preventLedgerModification)
ledgerSchema.pre('deleteMany', preventLedgerModification)
ledgerSchema.pre('remove', preventLedgerModification)
ledgerSchema.pre('findOneAndRemove', preventLedgerModification)

const ledgerModel = mongoose.model('ledger', ledgerSchema)
module.exports = ledgerModel






// immutable means once the value is set it cannot be changed because single source of truth hai ye

