//Conexion a base de datos
const db = require('../public/db/conn');
const controller = {};

//Require Funciones
const funcion = require('../public/js/controllerFunctions');
const funcionE = require('../public/js/empleadosFunctions');
//Conexion RabbitMQ
const RabbitPublisher = require('../public/js/RabbitMQ_Publisher');

// Index GET
controller.index_GET = (req, res) => {
    funcion.CountTicketsCapturados((err, TicketsCapturados) => {
        funcion.CountTicketsTotales((err, TicketsTotales) => {
            funcion.CountSerialesCapturados((err, SerialesCapturados) => {
                funcion.CountSerialesTotales((err, SerialesTotales) => {
                    Faltantes = (SerialesTotales[0].STotales + TicketsTotales[0].TTotales) - (SerialesCapturados[0].SCapturados + TicketsCapturados[0].TCapturados)
                    Capturados = SerialesCapturados[0].SCapturados + TicketsCapturados[0].TCapturados

                    res.render('index.ejs', {
                        Faltantes, Capturados
                    });
                });
            });
        });
    });

};

controller.login = (req, res) => {

    loginId = req.params.id
    if (loginId == 'mesa_captura') {
        funcionE.empleadosRevisarAccesso('>=', 1, (err, result) => {

            res.render('login.ejs', {
                data: loginId,
                data2: result
            });
        });
    } else if (loginId == 'talones') {
        funcionE.empleadosRevisarAccesso('=', 2, (err, result) => {

            res.render('login.ejs', {
                data: loginId,
                data2: result
            });
        });
    } else if (loginId == 'acceso') {
        funcionE.empleadosRevisarAccesso('=', 2, (err, result) => {

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

    funcion.Select_GruposCapturados((err, gruposCapturados) => {
        funcion.Select_SerialesCapturados((err, serialesCapturados) => {


            if (gruposCapturados == "") {
                captura_grupo = `${gafete}-${+1}`
                captura_actual = ""
                funcion.Select_CapturaGrupo(captura_grupo, (err, capturasPorGrupo) => {
                    res.render('conteo.ejs', {
                        gafete,
                        nombreContador,
                        ubicacion,
                        captura_grupo,
                        captura_actual,
                        serialesCapturados,
                        capturasPorGrupo
                    })
                })
            } else {

                posicion = gruposCapturados.length
                current_captura_grupo = gruposCapturados[posicion - 1].captura_grupo
                split = current_captura_grupo.split("-")
                currentCaptura = parseInt(split[1])

                captura_grupo = `${gafete}-${currentCaptura + 1}`
                captura_actual = ""
                funcion.Select_CapturaGrupo(captura_grupo, (err, capturasPorGrupo) => {
                    res.render('conteo.ejs', {
                        gafete,
                        nombreContador,
                        ubicacion,
                        captura_grupo,
                        captura_actual,
                        serialesCapturados,
                        capturasPorGrupo
                    })
                })
            }
        })
    })



}

controller.conteo_guardar_POST = (req, res) => {
    gafete = req.body.gafete;
    nombreContador = req.body.nombreContador
    ubicacion = req.body.ubicacion
    serial = req.body.serial
    serial = serial.slice(1)
    captura_grupo = req.body.captura_grupo

    funcion.SelectCurrentCapturas(captura_grupo, (err, Countcaptura_actual) => {

        captura_actual = Countcaptura_actual.length + 1

        funcion.SelectSerial(serial, (err, infoNumeroParte) => {

            if (infoNumeroParte.length == "") {
                material = "NULL"
                cantidad = null

                RabbitPublisher.get_label(serial, (callback) => {
                })



                funcion.InsertCapturaSerial(captura_grupo, serial, material, cantidad, ubicacion, gafete, (err, result) => {
                    funcion.Select_SerialesCapturados((err, serialesCapturados) => {
                        funcion.Select_CapturaGrupo(captura_grupo, (err, capturasPorGrupo) => {


                            res.render('conteo.ejs', {
                                gafete,
                                nombreContador,
                                ubicacion,
                                captura_grupo,
                                captura_actual,
                                serialesCapturados,
                                capturasPorGrupo

                            })
                        })
                    })
                })
            } else {
                material = infoNumeroParte[0].material
                cantidad = infoNumeroParte[0].stock


                funcion.InsertCapturaSerial(captura_grupo, serial, material, cantidad, ubicacion, gafete, (err, result) => {
                    funcion.Select_SerialesCapturados((err, serialesCapturados) => {
                        funcion.Select_CapturaGrupo(captura_grupo, (err, capturasPorGrupo) => {

                            res.render('conteo.ejs', {
                                gafete,
                                nombreContador,
                                ubicacion,
                                captura_grupo,
                                captura_actual,
                                serialesCapturados,
                                capturasPorGrupo
                            })
                        })
                    })
                })
            }

        })

    })
}


controller.cancelar_multiple_POST = (req, res) => {

    gafete = req.body.Mgafete;
    idTicket = req.body.idTicket


    funcion.ticketsCapturados((err, tickets) => {
        if (err) throw err;
        funcionE.empleadosNombre(gafete, (err, nombre) => {
            funcion.misTicketsCapturadosC(gafete, (err, misTickets) => {
                if (err) throw err;
                res.render('cancelar_multiple.ejs', {
                    gafete,
                    nombre,
                    tickets,
                    misTickets
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

        funcion.InsertCaptura(i, "CANCELADO", 0, "N/A", gafete, (err, result3) => {
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

controller.talones_POST = (req, res) => {

    gafete = req.body.user;
    idTicket = req.body.idTicket


    funcionE.empleadosNombre(gafete, (err, nombre) => {
        funcion.Talones((err, talones) => {
            funcionE.empleados((err, empleados) => {
                if (err) throw err;
                res.render('talones.ejs', {
                    gafete,
                    nombre,
                    talones,
                    empleados
                });
            });
        });
    });


};

controller.acceso_POST = (req, res) => {

    gafete = req.body.user;


    funcion.ubicacion((err, ubicaciones) => {
        funcionE.empleadosNombre(gafete, (err, nombre) => {
            funcionE.EmpleadosAccesos((err, accesos) => {
                funcionE.empleados((err, empleados) => {
                    if (err) throw err;
                    res.render('accesos.ejs', {
                        gafete,
                        nombre,
                        accesos,
                        empleados,
                        ubicaciones
                    });
                });
            });
        });
    });


};

controller.guardar_talon_POST = (req, res) => {

    gafete = req.body.gafete;
    idTicket = req.body.idTicket
    inicio = req.body.ticketInicial
    final = req.body.ticketFinal
    empleado = req.body.empleado
    nombreE = req.body.nombre
    telefono = req.body.telefono


    funcion.InsertTalon(inicio, final, empleado, nombreE, telefono, (err, result) => {
        if (err) throw err;
        funcionE.empleadosNombre(gafete, (err, nombre) => {
            funcion.Talones((err, talones) => {
                funcionE.empleados((err, empleados) => {
                    if (err) throw err;
                    res.render('talones.ejs', {
                        gafete,
                        nombre,
                        talones,
                        empleados
                    });
                });
            });
        });
    });


};

controller.delete_talon_POST = (req, res) => {

    gafete = req.body.gafete;
    idTicket = req.body.idTicket

    funcion.DeleteTalon(idTicket, (err, result) => {
        funcionE.empleadosNombre(gafete, (err, nombre) => {
            funcion.Talones((err, talones) => {
                funcionE.empleados((err, empleados) => {
                    if (err) throw err;
                    res.render('talones.ejs', {
                        gafete,
                        nombre,
                        talones,
                        empleados
                    });
                });
            });
        });
    });


};

controller.status_talon_POST = (req, res) => {

    gafete = req.body.gafete;
    idTicket = req.body.idTicket
    statusTalon = req.body.statusTalon
    let newStatus
    if (statusTalon == "PENDIENTE") {
        newStatus = "ENTREGADO"
    } else {
        newStatus = "PENDIENTE"
    }

    funcion.UpdateStatus(idTicket, newStatus, (err, result) => {
        funcionE.empleadosNombre(gafete, (err, nombre) => {
            funcion.Talones((err, talones) => {
                funcionE.empleados((err, empleados) => {
                    if (err) throw err;
                    res.render('talones.ejs', {
                        gafete,
                        nombre,
                        talones,
                        empleados
                    });
                });
            });
        });
    });


};

controller.guardar_ubicacion_POST = (req, res) => {

    gafete = req.body.user;
    ubicacion = req.body.ubicacion;

    funcionE.EmpleadosAccesos((err, accesos) => {
        funcion.InsertUbicacion(ubicacion, (err, result) => {
            funcion.ubicacion((err, ubicaciones) => {
                funcionE.empleadosNombre(gafete, (err, nombre) => {
                    funcion.Talones((err, talones) => {
                        funcionE.empleados((err, empleados) => {
                            if (err) throw err;
                            res.render('accesos.ejs', {
                                gafete,
                                nombre,
                                talones,
                                empleados,
                                ubicaciones,
                                accesos
                            });
                        });
                    });
                });
            });
        });
    });


};

controller.delete_ubicacion_POST = (req, res) => {

    gafete = req.body.user;
    ubicacion = req.body.idTicket;

    funcionE.EmpleadosAccesos((err, accesos) => {
        funcion.DeleteUbicacion(ubicacion, (err, result) => {
            funcion.ubicacion((err, ubicaciones) => {
                funcionE.empleadosNombre(gafete, (err, nombre) => {
                    funcion.Talones((err, talones) => {
                        funcionE.empleados((err, empleados) => {
                            if (err) throw err;
                            res.render('accesos.ejs', {
                                gafete,
                                nombre,
                                talones,
                                empleados,
                                ubicaciones,
                                accesos
                            });
                        });
                    });
                });
            });
        });
    });

};


controller.guardar_acceso_POST = (req, res) => {

    gafete = req.body.user;
    ubicacion = req.body.ubicacion;
    empleado = req.body.empleado
    acceso = req.body.acceso

    if (acceso == "CAPTURISTA") {
        acc = 1
    } else if (acceso == "ADMINISTRADOR") {
        acc = 2
    }

    funcionE.InsertAcceso(empleado, acc, (err, result) => {
        funcion.ubicacion((err, ubicaciones) => {
            funcionE.empleadosNombre(gafete, (err, nombre) => {
                funcion.Talones((err, talones) => {
                    funcionE.empleados((err, empleados) => {
                        funcionE.EmpleadosAccesos((err, accesos) => {

                            res.render('accesos.ejs', {
                                gafete,
                                nombre,
                                talones,
                                empleados,
                                ubicaciones,
                                accesos
                            });
                        });
                    });
                });
            });
        });
    });



};


controller.delete_acceso_POST = (req, res) => {

    gafete = req.body.user;
    empleado = req.body.idGafete

    funcionE.DeleteAcceso(empleado, (err, result) => {
        if (err) throw err;
        funcion.ubicacion((err, ubicaciones) => {
            funcionE.empleadosNombre(gafete, (err, nombre) => {
                funcion.Talones((err, talones) => {
                    funcionE.empleados((err, empleados) => {
                        funcionE.EmpleadosAccesos((err, accesos) => {

                            res.render('accesos.ejs', {
                                gafete,
                                nombre,
                                talones,
                                empleados,
                                ubicaciones,
                                accesos
                            });
                        });
                    });
                });
            });
        });
    });



};

controller.graficas_GET = (req, res) => {
    funcion.CountTicketsCapturados((err, TicketsCapturados) => {
        funcion.CountTicketsTotales((err, TicketsTotales) => {
            funcion.CountSerialesCapturados((err, SerialesCapturados) => {
                funcion.CountSerialesTotales((err, SerialesTotales) => {
                    funcion.CountTalonesE((err, TalonesE) => {
                        funcion.CountTalonesP((err, TalonesP) => {
                            SerialesFaltantes = SerialesTotales[0].STotales - SerialesCapturados[0].SCapturados
                            TicketsFaltantes = TicketsTotales[0].TTotales - TicketsCapturados[0].TCapturados

                            res.render('graficas.ejs', {
                                TicketsCapturados, SerialesCapturados, SerialesFaltantes, TicketsFaltantes, TalonesE, TalonesP
                            });
                        });
                    });
                });
            });
        });
    });

};
module.exports = controller;