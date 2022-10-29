'use strict'

const express = require('express'); //paquete para controlar las rutas
const bodyParser = require('body-parser'); //paquete para convertir los datos de las peticiones a JSON
const app = express();

//Importamos las rutas de la API
const yvh = require('./routes/yvh');

//Configuración de body-parser 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //Aquí convertimos todo el HTML que nos llegue a la API a json

//configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadimos las rutas importadas al módulo express
app.use(yvh);

module.exports = app;