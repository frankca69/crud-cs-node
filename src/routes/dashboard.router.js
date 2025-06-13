const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');

router.get('/', controller.redirectByRole);
router.get('/cliente', controller.cliente);
router.get('/chofer', controller.chofer);
router.get('/gerente', controller.gerente);
router.get('/admin', controller.admin);

module.exports = router;
