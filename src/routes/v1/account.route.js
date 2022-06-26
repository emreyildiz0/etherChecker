const express = require('express');
const authController = require('../../controllers/account.controller');
const router = express.Router();

router.post('/balance', authController.balance);

module.exports = router;
