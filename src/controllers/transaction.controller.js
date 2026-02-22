const transactionModel = require('../models/transaction.model');
const ledgerModel = require('../models/ledger.model');
const accountModel = require('../models/account.model');
const emailService = require('../services/email.service');
const mongoose = require('mongoose');


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

    const balance = await fromUserAccount.getBalance();

    if(balance < amount){
        return res.status(400).
        json({
            message:`Insufficient balance. Current balance is 
            ${balance} Requested amount is ${amount}`

        })
    }
    /**
     * create transaction pending
     * 
     */

    const session = await mongoose.startSession();
    session.startTransaction();
    
    /**
     * startTransaction kay karta hai ke aap multiple operations ko transaction ke under kar sakte hain pure ek sath he complate hoga
     * agar kisi bhi ek operation fail hoti hai toh sabhi operations rollback hote hain
     */

    const transaction = new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session}) 

    transaction.status = "COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    await session.endSession();

    /**
     * send email notification
     */
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);
    return res.status(201).json({
        message:"Transaction created successfully",
        transaction
    })





}

async function createInitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey} = req.body;
    if(!idempotencyKey || !toAccount || !amount){
        return res.status(400)
        .json({
            message:"Please provide all the required fields"
        });
    } 

    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })

    if(!toUserAccount){
        return res.status(400)
        .json({
            message:"Invalid Account!!"
        })
    }

    // assuming system user has a predefined account id;
    const fromUserAccount = await accountModel.findOne({
        user:req.user._id
    })

    if(!fromUserAccount){
        return res.status(400)
        .json({
            message:"Invalid System Account!!"
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new transactionModel({
        fromAccount:fromUserAccount._id,
        toUserAccount,
        amount,
        idempotencyKey,
        status:"PENDING",
        
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session})

    transaction.status = "COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    await session.endSession();

    return res.status(201).json({
        message:"Initial funds transaction completed successfully",
        transaction
    })

}





module.exports = {
    createTransaction
    ,createInitialFundsTransaction,
    
}