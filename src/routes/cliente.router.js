const express = require("express");
const router = express.Router();
const controller = require("../controllers/cliente.controller")

router.get('/clientes', controller.index)

module.exports =router;