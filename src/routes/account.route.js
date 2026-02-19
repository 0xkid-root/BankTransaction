const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const { createAccountController } = require("../controllers/account.controller");



const router = express.Router();


/**
 * - POST /api/v1/accounts
 * - create a new account
 *  protected route
 */

router.post('/accounts', authMiddleware, createAccountController)


module.exports = router;