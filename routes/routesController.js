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
    gafete = req.body.user;
    funcion.material((err, result) => {
        if (err) throw err;
        funcionE.empleadosNombre(gafete, (err, result2) => {
            if (err) throw err;
            funcion.ticketsCapturados((err, result4) => {
                if (err) throw err;
                funcion.MaxTickets((err, result5) => {
                    if (err) throw err;
                    funcion.misTicketsCapturados(gafete, (err, result6) => {
                        if (err) throw err;

                        res.render('mesa_captura.ejs', {
                            gafete: gafete, materiales: result, nombre: result2, tickets: result4, maxmin: result5, misTickets: result6
                        });
                    });
                });
            });
        });
    });

};

controller.guardar_captura_POST = (req, res) => {

    gafete = req.body.gafete;
    ticket = req.body.ticket
    material = req.body.parte
    cantidad = req.body.cantidad
    ubicacion = req.body.ubicacion

    funcion.InsertMesaCaptura(ticket, material, cantidad, ubicacion, gafete, (err, result3) => {
        if (err) throw err;
        funcion.material((err, result) => {
            if (err) throw err;
            funcionE.empleadosNombre(gafete, (err, result2) => {
                if (err) throw err;
                funcion.ticketsCapturados((err, result4) => {
                    if (err) throw err;
                    funcion.MaxTickets((err, result5) => {
                        if (err) throw err;
                        funcion.misTicketsCapturados(gafete, (err, result6) => {
                            if (err) throw err;

                            res.render('mesa_captura.ejs', {
                                gafete: gafete, materiales: result, nombre: result2, tickets: result4, maxmin: result5, misTickets:result6
                            });
                        });
                    });
                });
            });
        });
    });

};




module.exports = controller;