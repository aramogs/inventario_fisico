//Conexion a base de datos
const db = require('../public/db/conn');
const controller = {};

//Require Funciones
const funcion = require('../public/js/controllerFunctions');


// Index GET
controller.index_GET = (req, res) => {
    res.render('index.ejs');

};


module.exports = controller;