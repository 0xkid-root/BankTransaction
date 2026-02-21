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
        if (isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200)
            .json({
                message:"Transaction already processed",
                transaction:isTransactionAlreadyExists
            });
        }
        if (isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200)
            .json({
                message:"Transaction is still processing",
            });
        }

        if (isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500)
            .json({
                message:"Transaction processing failed please retry",
            });
        }
        if(isTransactionAlreadyExists.status === "REVERSED"){
             return res.status(500)
            .json({
                message:"Transaction was reversed please retry",
            });
        }

    }

    /**
     * check account status
     * 
     */


    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400)
        .json({
            message:"Both fromAccount and toAccount must be ACTIVE to process transaction"
        });

    }
    /**
     * derive sender balance from ledger
     * 
     */
    





}



module.exports = {
    createTransaction
}