const express = require('express');
const { OperationController } = require('../controllers/operationController');
const router = express.Router();

router.post('/pay', OperationController.pay);
router.post('/deposit', OperationController.deposit);
router.post('/transfer', OperationController.transfer);

module.exports = router;