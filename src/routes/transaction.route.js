const express = require('express');

const transactionRoutes = express.Router();
const {authMiddleware} = require('../middleware/auth.middleware');
const {createTransaction} = require('../controllers/transaction.controller');

 

/**
 * - POST  
 *
 */

transactionRoutes.post('/create-transaction', authMiddleware, createTransaction);






module.exports = transactionRoutes;