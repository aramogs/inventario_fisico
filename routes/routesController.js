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

    funcion.InsertCaptura(ticket, material, cantidad, ubicacion, gafete, (err, result3) => {
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


    funcion.DeleteTicket(idTicket, (err, result) => {
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

    funcion.SelectSerialesCapturados((err, serialesCapturados) => {

        if (serialesCapturados == "") {
            captura_grupo = `${gafete}-${+1}`

            res.render('conteo.ejs', {
                gafete,
                nombreContador,
                ubicacion,
                captura_grupo

            })
        } else {

            posicion = serialesCapturados.length
            current_captura_grupo = serialesCapturados[posicion - 1].captura_grupo
            split = current_captura_grupo.split("-")
            // gafete = split[0]
            currentCaptura = parseInt(split[1])

            captura_grupo = `${gafete}-${currentCaptura + 1}`

            res.render('conteo.ejs', {
                gafete,
                nombreContador,
                ubicacion,
                captura_grupo

            })

        }
    })



}

controller.conteo_guardar_POST = (req, res) => {
    gafete = req.body.gafete;
    nombreContador = req.body.nombreContador
    ubicacion = req.body.ubicacion
    serial = req.body.serial
    serial = serial.slice(1)


    captura_grupo = req.body.captura_grupo

    funcion.SelectSerial(serial, (err, infoNumeroParte) => {
        material = infoNumeroParte[0].material
        cantidad = infoNumeroParte[0].stock


        funcion.InsertCapturaSerial(captura_grupo, serial, material, cantidad, ubicacion, gafete, (err, result) => {

            res.render('conteo.ejs', {
                gafete,
                nombreContador,
                ubicacion,
                captura_grupo

            })


        })


    })
}


controller.cancelar_multiple_POST = (req, res) => {

    gafete = req.body.Mgafete;
    idTicket = req.body.idTicket


    funcion.ticketsCapturados((err, tickets) => {
        if (err) throw err;
        funcionE.empleadosNombre(gafete, (err, nombre) => {
            funcion.misTicketsCapturados(gafete, (err, misTickets) => {
                if (err) throw err;
                if (err) throw err;
                res.render('cancelar_multiple.ejs', {
                    gafete, nombre, tickets, misTickets
                });
            });
        });
    });


};


controller.guardar_cancelado_POST = (req, res) => {

    gafete = req.body.gafete;
    ticketI = parseInt(req.body.ticketInicial)
    ticketF = parseInt(req.body.ticketFinal)

    for (var i = ticketI; i <= ticketF; i++) {

        funcion.InsertCaptura(i, "CANCELADO", 0, "N/A", gafete, (err, result) => {
            if (err) throw err;
        });

    }

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


}

module.exports = controller;