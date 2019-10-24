//Conexion a base de datos
const db = require('../public/db/conn');
const controller = {};

//Require Funciones
const funcion = require('../public/js/controllerFunctions');
const funcionE = require('../public/js/empleadosFunctions');


// Index GET
controller.index_GET = (req, res) => {
    res.render('index.ejs');

};

controller.login = (req, res) => {

    loginId = req.params.id
    if (loginId == 'mesa_captura') {
        funcionE.empleadosRevisarAccess1((err, result) => {

            res.render('login.ejs', {
                data: loginId, data2: result
            });
        });
    } else if (loginId == 'conteo') {
        funcionE.empleadosRevisarAccess1((err, result) => {

            res.render('login.ejs', {
                data: loginId, data2: result
            });
        });
    }
}

controller.mesa_captura_POST = (req, res) => {
    gafete= req.body.user;
    res.render('mesa_captura.ejs', {
    gafete:gafete
    });
};




module.exports = controller;