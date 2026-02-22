const express = require('express');
const {authMiddleware} = require('../middleware/auth.middleware');
const { createAccountController,getUserAccountsController,getAccountBalanceController } = require("../controllers/account.controller");



const router = express.Router();


/**
 * - POST /api/v1/accounts
 * - create a new account
 *  protected route
 */

router.post('/accounts', authMiddleware, createAccountController);



/**
 * get /api/accounts
 * - get all accounts of the logged-in user
 * - protected route
 */

router.get("/", authMiddleware, getUserAccountsController);

/**
 * GET api/accounts/balance.:accountId
 * - get the balance of the account
 * - protected route    
 */
router.get("/balance/:accountId", authMiddleware, getAccountBalanceController)


module.exports = router;