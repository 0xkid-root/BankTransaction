const express = require('express');

const transactionRoutes = express.Router();
const {authMiddleware,authSystemUserMiddleware} = require('../middleware/auth.middleware');
const {createTransaction,createInitialFundsTransaction} = require('../controllers/transaction.controller');

 

/**
 * - POST  
 *
 */

transactionRoutes.post('/create-transaction', authMiddleware, createTransaction);


/**
 * - post /api/transaction/system/initial-funds
 * - create initial funds transaction from system useer
 *
 */

transactionRoutes.post('/system/initial-funds', authSystemUserMiddleware, createInitialFundsTransaction);




module.exports = transactionRoutes;