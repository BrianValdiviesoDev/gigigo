'use strict'
const express = require('express'); //paquete para controlar las rutas
const router = express.Router(); 

const yvh = require('../controllers/yvh');

//Aquí colocamos las rutas de la API
router.post('/radar', yvh.radar);


module.exports = router;