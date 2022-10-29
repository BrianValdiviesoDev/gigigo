'use strict'
const Chalk = require('chalk'); //Paquete para darle color a la consola
const app = require('./app');
const api_port = 8888;
const url_proyecto = 'localhost'; //Configuramos la url del proyecto para mostrarla en la consola

//Mostramos un mensaje inicial con la descripción y el autor
console.log("===================");    
console.log(Chalk.bgGreen("  API para módulos YVH  "));
console.log(Chalk.green("By Brian Valdivieso"));
console.log("===================");  

//Inicializamos la app de express
app.listen(api_port, function(){
    //Mostramos un mensaje en la consola para indicar que el servidor está funcionando
    console.log("Servidor API Rest escuchando en http://"+url_proyecto+":" + api_port);
});