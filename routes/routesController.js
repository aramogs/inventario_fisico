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
                data: loginId,
                data2: result
            });
        });
    }
}

controller.login_conteo = (req, res) => {

    loginId = req.params.id

    if (loginId == 'ubicacion') {
        funcionE.empleados((err, result) => {

            res.render('login_conteo.ejs', {
                data: loginId,
                data2: result
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
                        funcion.ubicacion((err, result7) => {
                            if (err) throw err;
                            funcion.Talones((err, talones) => {
                                if (err) throw err;

                            res.render('mesa_captura.ejs', {
                                gafete: gafete,
                                materiales: result,
                                nombre: result2,
                                tickets: result4,
                                maxmin: result5,
                                misTickets: result6,
                                ubicacion: result7,
                                talones
                            });
                        });
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
        funcion.material((err, materiales) => {
            if (err) throw err;
            funcionE.empleadosNombre(gafete, (err, nombre) => {
                if (err) throw err;
                funcion.ticketsCapturados((err, tickets) => {
                    if (err) throw err;
                    funcion.MaxTickets((err, maxmin) => {
                        if (err) throw err;
                        funcion.misTicketsCapturados(gafete, (err, misTickets) => {
                            if (err) throw err;
                            funcion.ubicacion((err, ubicacion) => {
                                if (err) throw err;
                                funcion.Talones((err, talones) => {
                                    if (err) throw err;

                                res.render('mesa_captura.ejs', {
                                    gafete,
                                    materiales,
                                    nombre,
                                    tickets,
                                    maxmin,
                                    misTickets,
                                    ubicacion,
                                    talones
                                });
                            });
                        });
                    });
                });
            });
        });
    });

});
}

controller.delete_ticket_POST = (req, res) => {

    gafete = req.body.idGafete;
    idTicket = req.body.idTicket


    funcion.DeleteTicket(idTicket,(err, result) => {
        if(err) throw err;
            funcion.material((err, materiales) => {
                if (err) throw err;
                funcionE.empleadosNombre(gafete, (err, nombre) => {
                    if (err) throw err;
                    funcion.ticketsCapturados((err, tickets) => {
                        if (err) throw err;
                        funcion.MaxTickets((err, maxmin) => {
                            if (err) throw err;
                            funcion.misTicketsCapturados(gafete, (err, misTickets) => {
                                if (err) throw err;
                                funcion.ubicacion((err, ubicacion) => {
                                    if (err) throw err;
                                    funcion.Talones((err, talones) => {
                                        if (err) throw err;

                                        res.render('mesa_captura.ejs', {
                                            gafete, materiales, nombre, tickets, maxmin, misTickets, ubicacion, talones
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
   

};

controller.ubicacion_POST = (req, res) => {
    gafete = req.body.user;

    funcionE.empleadosNombre(gafete, (err, nombreContador) => {

        res.render('ubicacion.ejs', {
            gafete,
            nombreContador
        })
    })
}

controller.conteo_POST = (req, res) => {
    gafete = req.body.gafete;
    nombreContador = req.body.nombreContador
    ubicacion = req.body.ubicacion
 
        res.render('conteo.ejs', {
            gafete,
            nombreContador,
            ubicacion
        })
  
}

controller.conteo_verificar_POST = (req, res) => {
    gafete = req.body.gafete;
    nombreContador = req.body.nombreContador
    ubicacion = req.body.ubicacion
    serial = req.body.serial


}
module.exports = controller;