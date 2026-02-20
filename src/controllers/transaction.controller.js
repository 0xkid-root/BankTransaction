const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');



/**
 * - create a new transaction
 *  the 10 step transfer flow :
 * 1. validate request
 * 2. validate idempotencyKey
 * 3. check account status
 * 4. derive sender balance from ledger
 * 5. create transaction pendin g
 * 6. create DEBIT ledger entry
 * 7. crfeate CREDIT ledger entry
 * 8. mark transaction completed
 * 9. commit MongoDb session
 * 10. send email notification
 */


async function createTransaction(req,res){
    const {fromAccount, toAccount, amount,idempotencyKey} = req.body;

    if(!idempotencyKey || !fromAccount || !toAccount || !amount){
        return res.status(400)
        .json({
            message:"Please provide all the required fields"
        });
    }

    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount
    });

    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(404)
        .json({
            message:"From or To account does not exist"
        });
    }

    /**
     * validate idempotencykey
     * 
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey
    });

    if(isTransactionAlreadyExists){
        return res.status(409)
        .json({
            message:"Transaction already exists"
        });
    }




}



module.exports = {
    createTransaction
}