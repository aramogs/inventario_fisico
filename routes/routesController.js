const controller = {};
//Conexion a base de datos
const db = require('../public/db/conn');
//Libreria Excel
const Excel = require('exceljs');
const saveAs = require('file-saver')
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
                        Faltantes,
                        Capturados
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
        funcionE.empleadosRevisarAccesso('=', 3, (err, result) => {

            res.render('login.ejs', {
                data: loginId,
                data2: result
            });
        });
    } else if (loginId == 'acceso') {
        funcionE.empleadosRevisarAccesso('=', 3, (err, result) => {

            res.render('login.ejs', {
                data: loginId,
                data2: result
            });
        });
    } else if (loginId == 'auditar') {
        funcionE.empleadosRevisarAccesso('>=', 2, (err, result) => {

            res.render('login.ejs', {
                data: loginId,
                data2: result
            });
        });
    } else if (loginId == 'auditar_temp') {
        funcionE.empleadosRevisarAccesso('>=', 2, (err, result) => {

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
        funcionE.empleadosNombre(gafete, (err, result2) => {
            funcion.ticketsCapturados((err, result4) => {
                funcion.MaxTickets((err, result5) => {
                    funcion.misTicketsCapturados(gafete, (err, result6) => {
                        funcion.ubicacion((err, result7) => {
                            funcion.TalonesEntregados((err, talones) => {

                                res.render('mesa_captura.ejs', {
                                    gafete: gafete,
                                    materiales: result,
                                    nombre: result2,
                                    tickets: result4,
                                    maxmin: result5,
                                    misTickets: result6,
                                    ubicacion: result7,
                                    talones
                                })
                            })
                        })
                    })
                })
            })
        })
    })

}

controller.guardar_captura_POST = (req, res) => {

    gafete = req.body.gafete;
    ticket = req.body.ticket
    material = req.body.parte
    cantidad = req.body.cantidad
    ubicacion = req.body.ubicacion
    idTalon = req.body.idTalon

    funcion.InsertCaptura(ticket, material, cantidad, ubicacion, gafete, (err, result3) => {
        funcion.IncrementCaptura(idTalon, (err, resu) => {
            funcion.material((err, materiales) => {
                funcionE.empleadosNombre(gafete, (err, nombre) => {
                    funcion.ticketsCapturados((err, tickets) => {
                        funcion.MaxTickets((err, maxmin) => {
                            funcion.misTicketsCapturados(gafete, (err, misTickets) => {
                                funcion.ubicacion((err, ubicacion) => {
                                    funcion.TalonesEntregados((err, talones) => {


                                        res.render('mesa_captura.ejs', {
                                            gafete,
                                            materiales,
                                            nombre,
                                            tickets,
                                            maxmin,
                                            misTickets,
                                            ubicacion,
                                            talones
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}

controller.delete_ticket_POST = (req, res) => {

    gafete = req.body.idGafete;
    idTicket = req.body.idTicket

    funcion.Select_CapturaId(parseInt(idTicket), (err, infoCaptura) => {
        material = infoCaptura[0].material
        cantidad = infoCaptura[0].cantidad
        ubicacion = infoCaptura[0].ubicacion
        let idTalon //Declarando sin valor, el valor se asigna en el for
        funcion.TalonesEntregados((err, talones) => {
            for (let i = 0; i < talones.length; i++) {
                if (idTicket >= parseInt(talones[i].ticket_inicial) && idTicket <= parseInt(talones[i].ticket_final)) {
                    idTalon = talones[i].id
                    break;
                }
            }

            funcion.ReducirCaptura(idTalon, (err, result) => {
                funcion.InsertCaptura_Eliminado(idTicket, material, cantidad, ubicacion, parseInt(gafete), (err, result) => {
                    funcion.DeleteTicket(idTicket, (err, result) => {
                        funcion.material((err, materiales) => {
                            funcionE.empleadosNombre(gafete, (err, nombre) => {
                                funcion.ticketsCapturados((err, tickets) => {
                                    funcion.MaxTickets((err, maxmin) => {
                                        funcion.misTicketsCapturados(gafete, (err, misTickets) => {
                                            funcion.ubicacion((err, ubicacion) => {
                                                funcion.TalonesEntregados((err, talones) => {


                                                    res.render('mesa_captura.ejs', {
                                                        gafete,
                                                        materiales,
                                                        nombre,
                                                        tickets,
                                                        maxmin,
                                                        misTickets,
                                                        ubicacion,
                                                        talones
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })


}

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
    seriales = req.body.seriales
    gafete = req.body.gafete;
    nombreContador = req.body.nombreContador
    ubicacion = req.body.ubicacion
    id_ubicacion = req.body.ubicacion
    // serial = req.body.serial
    // serial = serial.slice(1)
    captura_grupo = req.body.captura_grupo

    gafete2 = captura_grupo.split("-",1)
    
    
    
    estado_auditoria = 0


    for (let i = 0; i < seriales.length; i++) {



        funcion.Update_Ubicacion_Captura(id_ubicacion, gafete2[0], estado_auditoria, (err, result) => {

            funcion.SelectCurrentCapturas(captura_grupo, (err, Countcaptura_actual) => {
                captura_actual = Countcaptura_actual.length + 1
                funcion.SelectSerial(seriales[i], (err, infoNumeroParte) => {
                    if (infoNumeroParte.length == "") {
                        material = "NULL"
                        cantidad = null
                        console.log(seriales[i]);
                        console.log(type(seriales[i]));
                        
                        
                        RabbitPublisher.get_label(seriales[i], (callback) => {})

                        funcion.InsertCapturaSerial(captura_grupo, seriales[i], material, cantidad, ubicacion, gafete2[0], (err, result) => {
                            funcion.Select_SerialesCapturados((err, serialesCapturados) => {
                                funcion.Select_CapturaGrupo(captura_grupo, (err, capturasPorGrupo) => {


                                    // res.render('conteo.ejs', {
                                    //     gafete,
                                    //     nombreContador,
                                    //     ubicacion,
                                    //     captura_grupo,
                                    //     captura_actual,
                                    //     serialesCapturados,
                                    //     capturasPorGrupo

                                    // })
                                })
                            })
                        })
                    } else {
                        material = infoNumeroParte[0].material
                        cantidad = infoNumeroParte[0].stock


                        funcion.InsertCapturaSerial(captura_grupo, seriales[i], material, cantidad, ubicacion, gafete2[0], (err, result) => {
                            funcion.Select_SerialesCapturados((err, serialesCapturados) => {
                                funcion.Select_CapturaGrupo(captura_grupo, (err, capturasPorGrupo) => {

                                    // res.render('conteo.ejs', {
                                    //     gafete,
                                    //     nombreContador,
                                    //     ubicacion,
                                    //     captura_grupo,
                                    //     captura_actual,
                                    //     serialesCapturados,
                                    //     capturasPorGrupo
                                    // })
                                })
                            })
                        })
                    }

                })

            })
        })
    }
}


controller.cancelar_multiple_POST = (req, res) => {

    gafete = req.body.Mgafete;
    idTicket = req.body.idTicket


    funcion.ticketsCapturados((err, tickets) => {
        if (err) throw err;
        funcionE.empleadosNombre(gafete, (err, nombre) => {
            funcion.misTicketsCapturadosC(gafete, (err, misTickets) => {
                if (err) throw err;
                funcion.TalonesEntregados((err, talones) => {
                    if (err) throw err;

                    res.render('cancelar_multiple.ejs', {
                        gafete,
                        nombre,
                        tickets,
                        misTickets,
                        talones
                    });
                });
            });
        });
    });


};


controller.guardar_cancelado_POST = (req, res) => {

    gafete = req.body.gafete;
    ticketI = parseInt(req.body.ticketInicial)
    ticketF = parseInt(req.body.ticketFinal)
    idTalon = req.body.idTalonF

    for (let i = ticketI; i <= ticketF; i++) {

        funcion.InsertCaptura(i, "CANCELADO", 0, "N/A", gafete, (err, result3) => {
            if (err) throw err;
            funcion.IncrementCaptura(idTalon, (err, resul) => {
                if (err) throw err;
            });
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
                funcion.CountTalonesP((err, TalonesP) => {
                    res.render('talones.ejs', {
                        gafete,
                        nombre,
                        talones,
                        empleados,
                        TalonesP
                    });
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
                    funcion.Select_Captura((err, captura) => {
                        funcion.Select_Material((err, material) => {
                            if (err) throw err;
                            res.render('accesos.ejs', {
                                gafete,
                                nombre,
                                accesos,
                                empleados,
                                ubicaciones,
                                captura,
                                material
                            })
                        })
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
                    funcion.CountTalonesP((err, TalonesP) => {
                        res.render('talones.ejs', {
                            gafete,
                            nombre,
                            talones,
                            empleados,
                            TalonesP
                        });
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
                    funcion.CountTalonesP((err, TalonesP) => {
                        res.render('talones.ejs', {
                            gafete,
                            nombre,
                            talones,
                            empleados,
                            TalonesP
                        });
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
                    funcion.CountTalonesP((err, TalonesP) => {
                        res.render('talones.ejs', {
                            gafete,
                            nombre,
                            talones,
                            empleados,
                            TalonesP
                        });
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
                            funcion.Select_Captura((err, captura) => {
                                funcion.Select_Material((err, material) => {
                                    res.render('accesos.ejs', {
                                        gafete,
                                        nombre,
                                        talones,
                                        empleados,
                                        ubicaciones,
                                        accesos,
                                        captura,
                                        material
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
                            funcion.Select_Captura((err, captura) => {
                                funcion.Select_Material((err, material) => {
                                    res.render('accesos.ejs', {
                                        gafete,
                                        nombre,
                                        talones,
                                        empleados,
                                        ubicaciones,
                                        accesos,
                                        captura,
                                        material
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


controller.guardar_acceso_POST = (req, res) => {

    gafete = req.body.user;
    ubicacion = req.body.ubicacion;
    empleado = req.body.empleado
    acceso = req.body.acceso

    if (acceso == "CAPTURISTA") {
        acc = 1
    } else if (acceso == "AUDITOR") {
        acc = 2
    } else if (acceso == "ADMINISTRADOR") {
        acc = 3
    }

    funcionE.InsertAcceso(empleado, acc, (err, result) => {
        funcion.ubicacion((err, ubicaciones) => {
            funcionE.empleadosNombre(gafete, (err, nombre) => {
                funcion.Talones((err, talones) => {
                    funcionE.empleados((err, empleados) => {
                        funcionE.EmpleadosAccesos((err, accesos) => {
                            funcion.Select_Captura((err, captura) => {
                                funcion.Select_Material((err, material) => {

                                    res.render('accesos.ejs', {
                                        gafete,
                                        nombre,
                                        talones,
                                        empleados,
                                        ubicaciones,
                                        accesos,
                                        captura,
                                        material
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
                            funcion.Select_Captura((err, captura) => {
                                funcion.Select_Material((err, material) => {
                                    res.render('accesos.ejs', {
                                        gafete,
                                        nombre,
                                        talones,
                                        empleados,
                                        ubicaciones,
                                        accesos,
                                        captura,
                                        material
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

controller.graficas_GET = (req, res) => {
    funcion.CountTicketsCapturados((err, TicketsCapturados) => {
        funcion.CountTicketsTotales((err, TicketsTotales) => {
            funcion.CountSerialesCapturados((err, SerialesCapturados) => {
                funcion.CountSerialesTotales((err, SerialesTotales) => {
                    funcion.CountTalonesE((err, TalonesE) => {
                        funcion.CountTalonesP((err, TalonesP) => {
                            funcion.Talones_Contados((err, TalonesContados) => {
                                funcion.Talones_NoContados((err, TalonesNoContados) => {
                                    SerialesFaltantes = SerialesTotales[0].STotales - SerialesCapturados[0].SCapturados
                                    TicketsFaltantes = TicketsTotales[0].TTotales - TicketsCapturados[0].TCapturados
                                    TalonesContados = TalonesContados[0].TalonesContados
                                    TalonesNoContados = TalonesNoContados[0].TalonesNoContados



                                    res.render('graficas.ejs', {
                                        TicketsCapturados,
                                        SerialesCapturados,
                                        SerialesFaltantes,
                                        TicketsFaltantes,
                                        TalonesE,
                                        TalonesP,
                                        SerialesTotales,
                                        TicketsTotales,
                                        TalonesContados,
                                        TalonesNoContados
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })

}

controller.auditar_POST = (req, res) => {

    gafete = req.body.user;

    funcionE.empleadosNombre(gafete, (err, nombreContador) => {
        funcion.SelectAuditoria((err, ubicaciones) => {

            funcion.SelectAuditoria_Auditado((err, auditado) => {
                funcion.SelectAuditoria_NoAuditado((err, noAuditado) => {
                    auditado = auditado.length
                    noAuditado = noAuditado.length
                    res.render('auditar.ejs', {
                        gafete,
                        nombreContador,
                        ubicaciones,
                        auditado,
                        noAuditado
                    })
                })
            })
        })
    })
}


controller.auditar_ubicacion_POST = (req, res) => {
    gafete = req.body.gafete;
    ubicacion = req.body.ubicacion

    funcionE.empleadosNombre(gafete, (err, nombreContador) => {

        funcion.SelectUbicacion_Equals(ubicacion, (err, capturas) => {
            funcion.SelectSerial_Contado(ubicacion, (err, contados) => {
                funcion.SelectSerial_SinContar(ubicacion, (err, sin_contar) => {
                    contados = contados.length
                    sin_contar = sin_contar.length

                    res.render('auditar_ubicacion.ejs', {
                        gafete,
                        nombreContador,
                        capturas,
                        ubicacion,
                        contados,
                        sin_contar
                    })
                })
            })
        })
    })
}

controller.serial_auditado_POST = (req, res) => {
    gafete = req.body.gafete;
    ubicacion = req.body.ubicacion
    serial_auditado = req.body.serial
    serial_auditado = serial_auditado.substring(1)

    funcion.Update_Serial_Auditado(serial_auditado, (err, result) => {


        funcionE.empleadosNombre(gafete, (err, nombreContador) => {

            funcion.SelectUbicacion_Equals(ubicacion, (err, capturas) => {
                funcion.SelectSerial_Contado(ubicacion, (err, contados) => {
                    funcion.SelectSerial_SinContar(ubicacion, (err, sin_contar) => {
                        contados = contados.length
                        sin_contar = sin_contar.length

                        res.render('auditar_ubicacion.ejs', {
                            gafete,
                            nombreContador,
                            capturas,
                            ubicacion,
                            contados,
                            sin_contar
                        })
                    })
                })
            })
        })
    })
}

controller.terminar_auditoria_POST = (req, res) => {

    ubicacion = req.body.ubicacion
    gafete = req.body.gafete
    seriales = req.body.seriales


    for (let i = 0; i < seriales.length; i++) {
        funcion.Update_Serial_Auditado(seriales[i], (err, result) => {

        })
    }

    funcionE.empleadosNombre(gafete, (err, nombre) => {
        funcion.Update_Ubicacion_Auditada(ubicacion, (err, result) => {

            res.render('auditoria_terminada.ejs', {
                ubicacion,
                gafete,
                nombre

            })
        })
    })
}

//////////////////////////////////////TEMPORAL AUDITORIA VULCANIZADO//////////////////////////////

controller.auditar_temp_POST = (req, res) => {
    gafete = req.body.user;


    funcionE.empleadosNombre(gafete, (err, nombreContador) => {
        funcion.SelectAllStations_VULC((err, ubicaciones) => {
            funcion.SelectAuditoria_Auditado((err, auditado) => {
                funcion.SelectAuditoria_NoAuditado((err, noAuditado) => {
                    funcion.SelectEtiquetasVULC((err,etiquetas_semi)=>{
                           
                    auditado = auditado.length
                    noAuditado = noAuditado.length
                    res.render('auditar_temp.ejs', {
                        gafete,
                        nombreContador,
                        ubicaciones,
                        auditado,
                        noAuditado,
                        etiquetas_semi
                    })
                    })
                })
            })
        })
    })

}

controller.auditar_ubicacion_temp_POST = (req, res) => {
    gafete = req.body.gafete;
    ubicacion = req.body.ubicacion
    linea = parseInt(req.body.linea)


    funcion.SelectLinea_Equals(linea, (err, capturas) => {
        funcion.SelectSerial_Contado_Vulc(linea, (err, contados) => {
            funcion.SelectSerial_SinContar_Vulc(linea, (err, sin_contar) => {
         

                contados = contados.length
                sin_contar = sin_contar.length

                res.render('auditar_ubicacion_temp.ejs', {
                    gafete,
                    capturas,
                    ubicacion,
                    linea,
                    contados,
                    sin_contar
                })
            })
        })
    })
}

controller.terminar_auditoria_temp_POST = (req, res) => {

    linea = req.body.linea
    gafete = req.body.gafete
    seriales = req.body.seriales


    for (let i = 0; i < seriales.length; i++) {
        funcion.Update_Serial_Auditado_VULC(gafete,seriales[i], (err, result) => {   
            console.log(err);
            console.log(result);
            
                     
        })
    }

}

//////////////////////////////////////TEMPORAL AUDITORIA VULCANIZADO//////////////////////////////

controller.descargar_reporte_POST = (req, res) => {

    funcion.Select_Captura((err, captura) => {
        funcion.Select_Material((err, material) => {
            funcion.Select_Captura_Eliminado((err, captura_eliminado) => {

                // create workbook & add worksheet
                let workbook = new Excel.Workbook();
                let worksheet = workbook.addWorksheet('CAPTURA');
                let worksheet2 = workbook.addWorksheet('FOTO');
                let worksheet3 = workbook.addWorksheet('Captura_Eliminados')

                let rows = []
                let rows0 = []
                let row = []
                for (let i = 0; i < captura.length; i++) {

                    rows.push("row" + [i])
                    let existe = false
                    let storage_location
                    let unidad_medida = ''
                    let material_description = ''

                    for (let y = 0; y < material.length; y++) {
                        if (captura[i].material == material[y].material) {
                            storage_location = material[y].storage_location
                            existe = true
                            break
                        }
                    }
                    if (existe == true) {
                        storage_location
                    } else {
                        storage_location = 0
                    }

                    for (let y = 0; y < material.length; y++) {
                        if (captura[i].material == material[y].material) {
                            material_description = material[y].material_description

                            existe = true
                            break
                        }
                    }
                    if (existe == true) {
                        material_description
                    } else {
                        material_description = 'N/A'
                    }

                    for (let y = 0; y < material.length; y++) {
                        if (captura[i].material == material[y].material) {
                            unidad_medida = material[y].unidad_medida

                            existe = true
                            break
                        }
                    }

                    if (existe == true) {
                        unidad_medida
                    } else {
                        unidad_medida = 'N/A'
                    }

                    row = [
                        parseInt(captura[i].serial),
                        captura[i].material,
                        captura[i].cantidad,
                        captura[i].ubicacion,
                        storage_location,
                        material_description,
                        unidad_medida,
                        captura[i].num_empleado
                    ]
                    rows0.push(row)
                }

                worksheet.addTable({
                    name: 'Tabla_Captura',
                    ref: 'A1',
                    sort: true,
                    style: {
                        theme: 'TableStyleMedium2',
                        showRowStripes: true,
                    },
                    columns: [{
                            name: 'TICKET',
                            filterButton: true,
                            key: 'ticket'
                        },
                        {
                            name: 'NUMERO_DE_PARTE',
                            filterButton: true
                        },
                        {
                            name: 'CANTIDAD',
                            filterButton: true
                        },
                        {
                            name: 'AREA',
                            filterButton: true
                        },
                        {
                            name: 'SAPLOC',
                            filterButton: true
                        },
                        {
                            name: 'DESCRIPCION',
                            filterButton: true
                        },
                        {
                            name: 'UOM',
                            filterButton: true
                        },
                        {
                            name: 'CAPTURISTA',
                            filterButton: true
                        },
                    ],
                    rows: rows0,
                });


                let row2 = []
                let rows2 = []
                for (let i = 0; i < material.length; i++) {
                    row2 = [
                        material[i].material,
                        material[i].material_description,
                        parseInt(material[i].storage_location),
                        material[i].unidad_medida,
                        material[i].stock,
                        material[i].storage_unit
                    ]
                    rows2.push(row2)
                }



                worksheet2.addTable({
                    name: 'Foto',
                    ref: 'A1',
                    style: {
                        theme: 'TableStyleMedium2',
                        showRowStripes: true,
                    },
                    columns: [{
                            name: 'MATERIAL',
                            filterButton: true
                        },
                        {
                            name: 'MATERIAL_DESCRIPTION',
                            filterButton: true
                        },
                        {
                            name: 'STORAGE_LOCATION',
                            filterButton: true
                        },
                        {
                            name: 'BASE_UNIT_OF_MEASURE',
                            filterButton: true
                        },
                        {
                            name: 'STOCK',
                            filterButton: true
                        },
                        {
                            name: 'STORAGE_UNIT',
                            filterButton: true
                        },
                    ],
                    rows: rows2,
                });


                let row3 = []
                let rows3 = []
                for (let i = 0; i < captura_eliminado.length; i++) {
                    row3 = [
                        parseInt(captura_eliminado[i].serial),
                        captura_eliminado[i].material,
                        captura_eliminado[i].cantidad,
                        captura_eliminado[i].ubicacion,
                        captura_eliminado[i].num_empleado,
                        captura_eliminado[i].fecha
                    ]
                    rows3.push(row3)
                }
                worksheet3.addTable({
                    name: 'CAPTURA_ELIMINADO',
                    ref: 'A1',
                    style: {
                        theme: 'TableStyleMedium2',
                        showRowStripes: true,
                    },
                    columns: [{
                            name: 'IDTICKET/SERIAL',
                            filterButton: true
                        },
                        {
                            name: 'MATERIAL',
                            filterButton: true
                        },
                        {
                            name: 'CANTIDAD',
                            filterButton: true
                        },
                        {
                            name: 'UBICACION',
                            filterButton: true
                        },
                        {
                            name: 'EMPLEADO',
                            filterButton: true
                        },
                        {
                            name: 'FECHA',
                            filterButton: true
                        },
                    ],
                    rows: rows3,
                });

                //Configuracion de primer hoja columnas
                let nameColA = worksheet.getColumn('A');
                let nameColB = worksheet.getColumn('B');
                let nameColC = worksheet.getColumn('C');
                let nameColD = worksheet.getColumn('D');
                let nameColE = worksheet.getColumn('E');
                let nameColF = worksheet.getColumn('F');
                let nameColG = worksheet.getColumn('G');
                let nameColH = worksheet.getColumn('H');
                nameColA.numFmt = '0'
                nameColA.width = 10
                nameColB.width = 21
                nameColC.width = 12
                nameColD.width = 8.5
                nameColE.width = 9.5
                nameColF.width = 14.5
                nameColG.width = 7.5
                nameColH.width = 14

                //Configuracion de segunda hoja columnas
                let nameCol2A = worksheet2.getColumn('A');
                let nameCol2B = worksheet2.getColumn('B');
                let nameCol2C = worksheet2.getColumn('C');
                let nameCol2D = worksheet2.getColumn('D');
                let nameCol2E = worksheet2.getColumn('E');
                let nameCol2F = worksheet2.getColumn('F');
                nameCol2A.width = 14
                nameCol2B.width = 46
                nameCol2C.width = 22
                nameCol2D.width = 8
                nameCol2E.width = 9
                nameCol2F.width = 17

                //Configuracion de tercera hoja columnas
                let nameCol3A = worksheet3.getColumn('A');
                let nameCol3B = worksheet3.getColumn('B');
                let nameCol3C = worksheet3.getColumn('C');
                let nameCol3D = worksheet3.getColumn('D');
                let nameCol3E = worksheet3.getColumn('E');
                let nameCol3F = worksheet3.getColumn('F');
                nameCol3A.numFmt = '0'
                nameCol3A.width = 17.5
                nameCol3B.width = 13
                nameCol3C.width = 12
                nameCol3D.width = 13
                nameCol3E.width = 12.5
                nameCol3F.width = 11

                //Current Date
                let currentDate = new Date()
                day = currentDate.getDate()
                month = currentDate.getMonth() + 1,
                    year = currentDate.getFullYear()
                date = day + "_" + month + "_" + year;
                date = `${day}_${month}_${year}`

                res.attachment(`Inventario_Fisico_${date}.xlsx`)
                workbook.xlsx.write(res).then(function () {
                    res.end()
                });
            })
        });
    })
}


controller.insertar_masivo = (req, res) => {
    seriales_bodega = [{"serial":1718224637},
    {"serial":1711400907},
    {"serial":1700921435},
    {"serial":531456177},
    {"serial":531299239},
    {"serial":530907136},
    {"serial":171936159},
    {"serial":171936158},
    {"serial":171934895},
    {"serial":171934876},
    {"serial":171934709},
    {"serial":171934708},
    {"serial":171934707},
    {"serial":171934704},
    {"serial":171934702},
    {"serial":171934683},
    {"serial":171934680},
    {"serial":171934665},
    {"serial":171934647},
    {"serial":171934590},
    {"serial":171934583},
    {"serial":171934148},
    {"serial":171934147},
    {"serial":171934146},
    {"serial":171934145},
    {"serial":171934144},
    {"serial":171934143},
    {"serial":171934142},
    {"serial":171934140},
    {"serial":171934135},
    {"serial":171934132},
    {"serial":171934131},
    {"serial":171934130},
    {"serial":171934087},
    {"serial":171933984},
    {"serial":171933983},
    {"serial":171933982},
    {"serial":171933981},
    {"serial":171933978},
    {"serial":171933977},
    {"serial":171933975},
    {"serial":171933972},
    {"serial":171933969},
    {"serial":171933968},
    {"serial":171933626},
    {"serial":171933500},
    {"serial":171933483},
    {"serial":171933482},
    {"serial":171933481},
    {"serial":171933479},
    {"serial":171933469},
    {"serial":171933459},
    {"serial":171933458},
    {"serial":171933445},
    {"serial":171933444},
    {"serial":171933442},
    {"serial":171933441},
    {"serial":171933427},
    {"serial":171933406},
    {"serial":171933327},
    {"serial":171933310},
    {"serial":171933289},
    {"serial":171933178},
    {"serial":171933169},
    {"serial":171933165},
    {"serial":171933162},
    {"serial":171933122},
    {"serial":171933120},
    {"serial":171933116},
    {"serial":171933100},
    {"serial":171933083},
    {"serial":171933006},
    {"serial":171933005},
    {"serial":171932990},
    {"serial":171932988},
    {"serial":171932972},
    {"serial":171932970},
    {"serial":171932966},
    {"serial":171932527},
    {"serial":171932515},
    {"serial":171932514},
    {"serial":171932513},
    {"serial":171932512},
    {"serial":171932511},
    {"serial":171932509},
    {"serial":171932508},
    {"serial":171932480},
    {"serial":171932234},
    {"serial":171932230},
    {"serial":171930617},
    {"serial":171930504},
    {"serial":171930490},
    {"serial":171930483},
    {"serial":171930473},
    {"serial":171930446},
    {"serial":171930413},
    {"serial":171930412},
    {"serial":171930411},
    {"serial":171930409},
    {"serial":171930379},
    {"serial":171930378},
    {"serial":171930376},
    {"serial":171930370},
    {"serial":171930369},
    {"serial":171930368},
    {"serial":171930367},
    {"serial":171930366},
    {"serial":171930288},
    {"serial":171930275},
    {"serial":171930229},
    {"serial":171930213},
    {"serial":171930209},
    {"serial":171930208},
    {"serial":171930207},
    {"serial":171930206},
    {"serial":171930182},
    {"serial":171930163},
    {"serial":171930162},
    {"serial":171930104},
    {"serial":171929716},
    {"serial":171929698},
    {"serial":171929529},
    {"serial":171929487},
    {"serial":171929486},
    {"serial":171929485},
    {"serial":171929376},
    {"serial":171929375},
    {"serial":171929374},
    {"serial":171929366},
    {"serial":171929365},
    {"serial":171929363},
    {"serial":171929361},
    {"serial":171929358},
    {"serial":171929280},
    {"serial":171929279},
    {"serial":171929278},
    {"serial":171929274},
    {"serial":171929273},
    {"serial":171929268},
    {"serial":171929266},
    {"serial":171929166},
    {"serial":171929165},
    {"serial":171929164},
    {"serial":171929163},
    {"serial":171929162},
    {"serial":171929161},
    {"serial":171929160},
    {"serial":171929159},
    {"serial":171929158},
    {"serial":171929156},
    {"serial":171929155},
    {"serial":171928863},
    {"serial":171928862},
    {"serial":171928861},
    {"serial":171928860},
    {"serial":171928859},
    {"serial":171928858},
    {"serial":171928857},
    {"serial":171928855},
    {"serial":171928668},
    {"serial":171928667},
    {"serial":171928648},
    {"serial":171928647},
    {"serial":171928646},
    {"serial":171928645},
    {"serial":171928644},
    {"serial":171928630},
    {"serial":171928629},
    {"serial":171928628},
    {"serial":171928627},
    {"serial":171928626},
    {"serial":171928625},
    {"serial":171928624},
    {"serial":171928590},
    {"serial":171928518},
    {"serial":171928517},
    {"serial":171928516},
    {"serial":171928515},
    {"serial":171928514},
    {"serial":171928513},
    {"serial":171928512},
    {"serial":171928511},
    {"serial":171928510},
    {"serial":171928509},
    {"serial":171928508},
    {"serial":171928507},
    {"serial":171928506},
    {"serial":171928505},
    {"serial":171928416},
    {"serial":171928412},
    {"serial":171928410},
    {"serial":171928408},
    {"serial":171928406},
    {"serial":171928404},
    {"serial":171928402},
    {"serial":171928400},
    {"serial":171928398},
    {"serial":171928396},
    {"serial":171928394},
    {"serial":171928392},
    {"serial":171928381},
    {"serial":171928366},
    {"serial":171928364},
    {"serial":171928362},
    {"serial":171928360},
    {"serial":171928359},
    {"serial":171928358},
    {"serial":171928356},
    {"serial":171928354},
    {"serial":171928352},
    {"serial":171928351},
    {"serial":171928350},
    {"serial":171928344},
    {"serial":171928343},
    {"serial":171928342},
    {"serial":171928340},
    {"serial":171928339},
    {"serial":171928337},
    {"serial":171928335},
    {"serial":171928333},
    {"serial":171928332},
    {"serial":171928324},
    {"serial":171928309},
    {"serial":171928300},
    {"serial":171928295},
    {"serial":171928294},
    {"serial":171928284},
    {"serial":171928282},
    {"serial":171928277},
    {"serial":171928276},
    {"serial":171928274},
    {"serial":171928271},
    {"serial":171928266},
    {"serial":171928265},
    {"serial":171928261},
    {"serial":171928259},
    {"serial":171928256},
    {"serial":171928254},
    {"serial":171928253},
    {"serial":171928251},
    {"serial":171928250},
    {"serial":171928249},
    {"serial":171928247},
    {"serial":171928236},
    {"serial":171928235},
    {"serial":171928234},
    {"serial":171928232},
    {"serial":171928231},
    {"serial":171928230},
    {"serial":171928229},
    {"serial":171928228},
    {"serial":171928227},
    {"serial":171928226},
    {"serial":171928224},
    {"serial":171928223},
    {"serial":171928222},
    {"serial":171928221},
    {"serial":171928216},
    {"serial":171928215},
    {"serial":171928214},
    {"serial":171928207},
    {"serial":171928206},
    {"serial":171928204},
    {"serial":171928198},
    {"serial":171928197},
    {"serial":171928192},
    {"serial":171928191},
    {"serial":171928190},
    {"serial":171928180},
    {"serial":171927909},
    {"serial":171927907},
    {"serial":171927904},
    {"serial":171927903},
    {"serial":171927902},
    {"serial":171927900},
    {"serial":171927899},
    {"serial":171927898},
    {"serial":171927897},
    {"serial":171927896},
    {"serial":171927895},
    {"serial":171927894},
    {"serial":171927893},
    {"serial":171927892},
    {"serial":171927891},
    {"serial":171927890},
    {"serial":171927889},
    {"serial":171927888},
    {"serial":171927878},
    {"serial":171927876},
    {"serial":171927867},
    {"serial":171927865},
    {"serial":171927864},
    {"serial":171927863},
    {"serial":171927858},
    {"serial":171927857},
    {"serial":171927856},
    {"serial":171927855},
    {"serial":171927854},
    {"serial":171927853},
    {"serial":171927852},
    {"serial":171927851},
    {"serial":171927850},
    {"serial":171927849},
    {"serial":171927848},
    {"serial":171927847},
    {"serial":171927846},
    {"serial":171927845},
    {"serial":171927844},
    {"serial":171927843},
    {"serial":171927842},
    {"serial":171927841},
    {"serial":171927840},
    {"serial":171927798},
    {"serial":171927797},
    {"serial":171927796},
    {"serial":171927795},
    {"serial":171927794},
    {"serial":171927793},
    {"serial":171927789},
    {"serial":171927702},
    {"serial":171927701},
    {"serial":171927700},
    {"serial":171927688},
    {"serial":171927685},
    {"serial":171927684},
    {"serial":171927683},
    {"serial":171927682},
    {"serial":171927681},
    {"serial":171927680},
    {"serial":171927679},
    {"serial":171927678},
    {"serial":171927677},
    {"serial":171927674},
    {"serial":171927643},
    {"serial":171927638},
    {"serial":171927637},
    {"serial":171927636},
    {"serial":171927635},
    {"serial":171927634},
    {"serial":171927633},
    {"serial":171927628},
    {"serial":171927627},
    {"serial":171927626},
    {"serial":171927625},
    {"serial":171927624},
    {"serial":171927623},
    {"serial":171927622},
    {"serial":171927621},
    {"serial":171927620},
    {"serial":171927619},
    {"serial":171927607},
    {"serial":171927606},
    {"serial":171927605},
    {"serial":171927604},
    {"serial":171927599},
    {"serial":171927598},
    {"serial":171927597},
    {"serial":171927596},
    {"serial":171927595},
    {"serial":171927587},
    {"serial":171927585},
    {"serial":171927584},
    {"serial":171927583},
    {"serial":171927580},
    {"serial":171927549},
    {"serial":171926840},
    {"serial":171926726},
    {"serial":171926724},
    {"serial":171926722},
    {"serial":171926720},
    {"serial":171926719},
    {"serial":171926718},
    {"serial":171926278},
    {"serial":171926275},
    {"serial":171926269},
    {"serial":171926268},
    {"serial":171926173},
    {"serial":171926172},
    {"serial":171925804},
    {"serial":171924751},
    {"serial":171922587},
    {"serial":171922586},
    {"serial":171922585},
    {"serial":171922584},
    {"serial":171922583},
    {"serial":171922582},
    {"serial":171922581},
    {"serial":171922431},
    {"serial":171922429},
    {"serial":171922392},
    {"serial":171922012},
    {"serial":171921999},
    {"serial":171919410},
    {"serial":171916671},
    {"serial":171915710},
    {"serial":171914677},
    {"serial":171914618},
    {"serial":171914555},
    {"serial":171914554},
    {"serial":171914553},
    {"serial":171914552},
    {"serial":171914551},
    {"serial":171914549},
    {"serial":171914548},
    {"serial":171914547},
    {"serial":171914545},
    {"serial":171914544},
    {"serial":171914542},
    {"serial":171913413},
    {"serial":171912987},
    {"serial":171912918},
    {"serial":171912917},
    {"serial":171911378},
    {"serial":171911064},
    {"serial":171911063},
    {"serial":171910769},
    {"serial":171910758},
    {"serial":171910547},
    {"serial":171910523},
    {"serial":171910405},
    {"serial":171910381},
    {"serial":171910312},
    {"serial":171910012},
    {"serial":171909901},
    {"serial":171909900},
    {"serial":171909858},
    {"serial":171904917},
    {"serial":171904916},
    {"serial":171904713},
    {"serial":171904712},
    {"serial":171903993},
    {"serial":171903737},
    {"serial":171903517},
    {"serial":171903516},
    {"serial":171903515},
    {"serial":171903291},
    {"serial":171903194},
    {"serial":171903193},
    {"serial":171903175},
    {"serial":171903009},
    {"serial":171903008},
    {"serial":171902814},
    {"serial":171901482},
    {"serial":171901139},
    {"serial":171901073},
    {"serial":171900022},
    {"serial":171900002},
    {"serial":171899847},
    {"serial":171899715},
    {"serial":171899707},
    {"serial":171899704},
    {"serial":171899502},
    {"serial":171899477},
    {"serial":171898765},
    {"serial":171898680},
    {"serial":171898660},
    {"serial":171898656},
    {"serial":171898642},
    {"serial":171898619},
    {"serial":171898613},
    {"serial":171898524},
    {"serial":171898398},
    {"serial":171897758},
    {"serial":171897756},
    {"serial":171897751},
    {"serial":171889850},
    {"serial":171889844},
    {"serial":171889842},
    {"serial":171889839},
    {"serial":171889837},
    {"serial":171889836},
    {"serial":171889835},
    {"serial":171889153},
    {"serial":171889146},
    {"serial":171889145},
    {"serial":171889144},
    {"serial":171889143},
    {"serial":171889142},
    {"serial":171889141},
    {"serial":171889138},
    {"serial":171888717},
    {"serial":171888140},
    {"serial":171887788},
    {"serial":171887784},
    {"serial":171886074},
    {"serial":171886067},
    {"serial":171885984},
    {"serial":171885843},
    {"serial":171885842},
    {"serial":171885727},
    {"serial":171885726},
    {"serial":171885724},
    {"serial":171885457},
    {"serial":171885420},
    {"serial":171885384},
    {"serial":171885364},
    {"serial":171885335},
    {"serial":171885333},
    {"serial":171885187},
    {"serial":171885183},
    {"serial":171885182},
    {"serial":171885181},
    {"serial":171885180},
    {"serial":171885178},
    {"serial":171885175},
    {"serial":171884783},
    {"serial":171884782},
    {"serial":171884770},
    {"serial":171884768},
    {"serial":171884767},
    {"serial":171884766},
    {"serial":171884757},
    {"serial":171884754},
    {"serial":171884715},
    {"serial":171884713},
    {"serial":171884701},
    {"serial":171884692},
    {"serial":171876124},
    {"serial":171874657},
    {"serial":171874656},
    {"serial":171874655},
    {"serial":171874641},
    {"serial":171874640},
    {"serial":171874639},
    {"serial":171874586},
    {"serial":171874542},
    {"serial":171874541},
    {"serial":171874540},
    {"serial":171874508},
    {"serial":171874507},
    {"serial":171874506},
    {"serial":171874505},
    {"serial":171874504},
    {"serial":171874503},
    {"serial":171874502},
    {"serial":171874501},
    {"serial":171874500},
    {"serial":171874499},
    {"serial":171874498},
    {"serial":171874491},
    {"serial":171874490},
    {"serial":171874489},
    {"serial":171874488},
    {"serial":171874487},
    {"serial":171874486},
    {"serial":171874485},
    {"serial":171874418},
    {"serial":171874061},
    {"serial":171874060},
    {"serial":171874059},
    {"serial":171874058},
    {"serial":171874057},
    {"serial":171874056},
    {"serial":171874052},
    {"serial":171872447},
    {"serial":171871846},
    {"serial":171871842},
    {"serial":171871324},
    {"serial":171870869},
    {"serial":171870190},
    {"serial":171870189},
    {"serial":171870177},
    {"serial":171869378},
    {"serial":171869272},
    {"serial":171869135},
    {"serial":171862790},
    {"serial":171861911},
    {"serial":171860318},
    {"serial":171860317},
    {"serial":171860316},
    {"serial":171860315},
    {"serial":171860314},
    {"serial":171860313},
    {"serial":171860312},
    {"serial":171860233},
    {"serial":171860230},
    {"serial":171860228},
    {"serial":171860225},
    {"serial":171860221},
    {"serial":171860218},
    {"serial":171860216},
    {"serial":171860214},
    {"serial":171860213},
    {"serial":171860211},
    {"serial":171860210},
    {"serial":171860208},
    {"serial":171860207},
    {"serial":171860205},
    {"serial":171860204},
    {"serial":171858945},
    {"serial":171858899},
    {"serial":171858792},
    {"serial":171858791},
    {"serial":171858790},
    {"serial":171858772},
    {"serial":171858745},
    {"serial":171858728},
    {"serial":171858727},
    {"serial":171858726},
    {"serial":171858725},
    {"serial":171858724},
    {"serial":171858204},
    {"serial":171858202},
    {"serial":171858200},
    {"serial":171858128},
    {"serial":171857938},
    {"serial":171857903},
    {"serial":171857597},
    {"serial":171857596},
    {"serial":171857595},
    {"serial":171857593},
    {"serial":171857592},
    {"serial":171857591},
    {"serial":171857590},
    {"serial":171857489},
    {"serial":171857476},
    {"serial":171857474},
    {"serial":171857473},
    {"serial":171857471},
    {"serial":171850113},
    {"serial":171849896},
    {"serial":171849604},
    {"serial":171849601},
    {"serial":171849576},
    {"serial":171849575},
    {"serial":171849052},
    {"serial":171849042},
    {"serial":171849040},
    {"serial":171849039},
    {"serial":171849037},
    {"serial":171849028},
    {"serial":171849027},
    {"serial":171849026},
    {"serial":171849025},
    {"serial":171849022},
    {"serial":171848809},
    {"serial":171848808},
    {"serial":171848807},
    {"serial":171848806},
    {"serial":171848805},
    {"serial":171848804},
    {"serial":171847475},
    {"serial":171846373},
    {"serial":171845644},
    {"serial":171844574},
    {"serial":171844422},
    {"serial":171844411},
    {"serial":171843271},
    {"serial":171837915},
    {"serial":171837055},
    {"serial":171837054},
    {"serial":171837053},
    {"serial":171837052},
    {"serial":171837050},
    {"serial":171837049},
    {"serial":171836937},
    {"serial":171836936},
    {"serial":171836935},
    {"serial":171836933},
    {"serial":171836929},
    {"serial":171836928},
    {"serial":171836606},
    {"serial":171836604},
    {"serial":171836602},
    {"serial":171836601},
    {"serial":171836600},
    {"serial":171836599},
    {"serial":171834241},
    {"serial":171834098},
    {"serial":171834092},
    {"serial":171832314},
    {"serial":171831770},
    {"serial":171831628},
    {"serial":171831627},
    {"serial":171831451},
    {"serial":171831402},
    {"serial":171830794},
    {"serial":171830790},
    {"serial":171830787},
    {"serial":171830641},
    {"serial":171830640},
    {"serial":171830633},
    {"serial":171830630},
    {"serial":171830622},
    {"serial":171830249},
    {"serial":171823720},
    {"serial":171823719},
    {"serial":171823718},
    {"serial":171823716},
    {"serial":171823715},
    {"serial":171823714},
    {"serial":171823708},
    {"serial":171822369},
    {"serial":171819380},
    {"serial":171818949},
    {"serial":171818948},
    {"serial":171818945},
    {"serial":171818928},
    {"serial":171810337},
    {"serial":171809666},
    {"serial":171807964},
    {"serial":171807659},
    {"serial":171807606},
    {"serial":171807155},
    {"serial":171802881},
    {"serial":171802220},
    {"serial":171801571},
    {"serial":171801322},
    {"serial":171800929},
    {"serial":171800758},
    {"serial":171800402},
    {"serial":171800220},
    {"serial":171800150},
    {"serial":171800148},
    {"serial":171800139},
    {"serial":171794777},
    {"serial":171794775},
    {"serial":171794773},
    {"serial":171794772},
    {"serial":171794771},
    {"serial":171794770},
    {"serial":171794769},
    {"serial":171794764},
    {"serial":171794762},
    {"serial":171794761},
    {"serial":171794760},
    {"serial":171794759},
    {"serial":171794758},
    {"serial":171794757},
    {"serial":171794756},
    {"serial":171794752},
    {"serial":171794750},
    {"serial":171794749},
    {"serial":171794748},
    {"serial":171794747},
    {"serial":171794746},
    {"serial":171794745},
    {"serial":171794744},
    {"serial":171794743},
    {"serial":171794742},
    {"serial":171794741},
    {"serial":171794740},
    {"serial":171794739},
    {"serial":171794737},
    {"serial":171794735},
    {"serial":171794733},
    {"serial":171794732},
    {"serial":171793621},
    {"serial":171793178},
    {"serial":171793168},
    {"serial":171793035},
    {"serial":171791324},
    {"serial":171790421},
    {"serial":171787875},
    {"serial":171787860},
    {"serial":171786670},
    {"serial":171786655},
    {"serial":171786645},
    {"serial":171786641},
    {"serial":171781010},
    {"serial":171780966},
    {"serial":171780818},
    {"serial":171780722},
    {"serial":171780666},
    {"serial":171780663},
    {"serial":171780645},
    {"serial":171780518},
    {"serial":171780465},
    {"serial":171780083},
    {"serial":171779865},
    {"serial":171779704},
    {"serial":171778583},
    {"serial":171778581},
    {"serial":171778579},
    {"serial":171778577},
    {"serial":171778575},
    {"serial":171776882},
    {"serial":171776865},
    {"serial":171774587},
    {"serial":171774586},
    {"serial":171774122},
    {"serial":171774121},
    {"serial":171773965},
    {"serial":171773545},
    {"serial":171773541},
    {"serial":171773348},
    {"serial":171773163},
    {"serial":171762179},
    {"serial":171762178},
    {"serial":171759987},
    {"serial":171756269},
    {"serial":171753486},
    {"serial":171753485},
    {"serial":171753295},
    {"serial":171749101},
    {"serial":171747750},
    {"serial":171747710},
    {"serial":171747675},
    {"serial":171747672},
    {"serial":171747569},
    {"serial":171747558},
    {"serial":171747550},
    {"serial":171747222},
    {"serial":171747166},
    {"serial":171747165},
    {"serial":171747164},
    {"serial":171747163},
    {"serial":171747162},
    {"serial":171747161},
    {"serial":171747160},
    {"serial":171747159},
    {"serial":171747158},
    {"serial":171747157},
    {"serial":171731445},
    {"serial":171725721},
    {"serial":171723894},
    {"serial":171721494},
    {"serial":171721492},
    {"serial":171708963},
    {"serial":171708962},
    {"serial":171708961},
    {"serial":171708960},
    {"serial":171707195},
    {"serial":171707085},
    {"serial":171706428},
    {"serial":171706411},
    {"serial":171706396},
    {"serial":171702756},
    {"serial":171700549},
    {"serial":171699543},
    {"serial":171696192},
    {"serial":171696124},
    {"serial":171696120},
    {"serial":171696035},
    {"serial":171696028},
    {"serial":171695338},
    {"serial":171695298},
    {"serial":171695291},
    {"serial":171695290},
    {"serial":171695289},
    {"serial":171695242},
    {"serial":171672800},
    {"serial":171671076},
    {"serial":171671067},
    {"serial":171670087},
    {"serial":171670075},
    {"serial":171662545},
    {"serial":171660548},
    {"serial":171656191},
    {"serial":171656172},
    {"serial":171649234},
    {"serial":171648038},
    {"serial":171642961},
    {"serial":171642849},
    {"serial":171642848},
    {"serial":171642847},
    {"serial":171642846},
    {"serial":171642845},
    {"serial":171642844},
    {"serial":171642839},
    {"serial":171630046},
    {"serial":171623385},
    {"serial":171622150},
    {"serial":171616433},
    {"serial":171616413},
    {"serial":171616411},
    {"serial":171616410},
    {"serial":171606516},
    {"serial":171606515},
    {"serial":171606513},
    {"serial":171606512},
    {"serial":171603177},
    {"serial":171603146},
    {"serial":171586820},
    {"serial":171579800},
    {"serial":171579457},
    {"serial":171575852},
    {"serial":171575851},
    {"serial":171575271},
    {"serial":171572905},
    {"serial":171569155},
    {"serial":171561965},
    {"serial":171561245},
    {"serial":171560719},
    {"serial":171560324},
    {"serial":171547671},
    {"serial":171535864},
    {"serial":171532518},
    {"serial":171528404},
    {"serial":171526991},
    {"serial":171525942},
    {"serial":171525941},
    {"serial":171520859},
    {"serial":171509249},
    {"serial":171502653},
    {"serial":171502446},
    {"serial":171500547},
    {"serial":171492560},
    {"serial":171492559},
    {"serial":171492558},
    {"serial":171492557},
    {"serial":171492556},
    {"serial":171492555},
    {"serial":171492554},
    {"serial":171492553},
    {"serial":171492552},
    {"serial":171492158},
    {"serial":171489936},
    {"serial":171489932},
    {"serial":171489925},
    {"serial":171479104},
    {"serial":171479103},
    {"serial":171479102},
    {"serial":171477366},
    {"serial":171477365},
    {"serial":171477361},
    {"serial":171470989},
    {"serial":171469504},
    {"serial":171467907},
    {"serial":171466629},
    {"serial":171466525},
    {"serial":171465686},
    {"serial":171465685},
    {"serial":171460907},
    {"serial":171458339},
    {"serial":171458336},
    {"serial":171458335},
    {"serial":171458333},
    {"serial":171458331},
    {"serial":171458326},
    {"serial":171458323},
    {"serial":171455956},
    {"serial":171455837},
    {"serial":171453280},
    {"serial":171445638},
    {"serial":171444776},
    {"serial":171443413},
    {"serial":171442725},
    {"serial":171442715},
    {"serial":171442714},
    {"serial":171442197},
    {"serial":171442182},
    {"serial":171403108},
    {"serial":171403026},
    {"serial":171403025},
    {"serial":171401490},
    {"serial":171401489},
    {"serial":171401487},
    {"serial":171401332},
    {"serial":171394134},
    {"serial":171389803},
    {"serial":171389801},
    {"serial":171378944},
    {"serial":171369271},
    {"serial":171369270},
    {"serial":171369269},
    {"serial":171365997},
    {"serial":171364803},
    {"serial":171364426},
    {"serial":171364425},
    {"serial":171364424},
    {"serial":171364423},
    {"serial":171364422},
    {"serial":171364421},
    {"serial":171353315},
    {"serial":171353312},
    {"serial":171353310},
    {"serial":171348224},
    {"serial":171347582},
    {"serial":171347575},
    {"serial":171347570},
    {"serial":171340761},
    {"serial":171337841},
    {"serial":171335165},
    {"serial":171335093},
    {"serial":171327824},
    {"serial":171327054},
    {"serial":171327053},
    {"serial":171327052},
    {"serial":171327051},
    {"serial":171327048},
    {"serial":171323991},
    {"serial":171314161},
    {"serial":171314158},
    {"serial":171314156},
    {"serial":171311923},
    {"serial":171311212},
    {"serial":171309557},
    {"serial":171309442},
    {"serial":171309353},
    {"serial":171309338},
    {"serial":171309250},
    {"serial":171309248},
    {"serial":171309247},
    {"serial":171309246},
    {"serial":171309245},
    {"serial":171309029},
    {"serial":171308700},
    {"serial":171308698},
    {"serial":171308697},
    {"serial":171301540},
    {"serial":171298122},
    {"serial":171298121},
    {"serial":171297071},
    {"serial":171297052},
    {"serial":171279604},
    {"serial":171279498},
    {"serial":171279492},
    {"serial":171279486},
    {"serial":171279359},
    {"serial":171265877},
    {"serial":171265410},
    {"serial":171265409},
    {"serial":171256756},
    {"serial":171255994},
    {"serial":171255976},
    {"serial":171246488},
    {"serial":171241366},
    {"serial":171241300},
    {"serial":171241079},
    {"serial":171199581},
    {"serial":171186637},
    {"serial":171186408},
    {"serial":171186406},
    {"serial":171186405},
    {"serial":171186404},
    {"serial":171184701},
    {"serial":171145456},
    {"serial":171143404},
    {"serial":171134431},
    {"serial":171134429},
    {"serial":171134427},
    {"serial":171134425},
    {"serial":171131950},
    {"serial":171129222},
    {"serial":171128415},
    {"serial":171128063},
    {"serial":171126783},
    {"serial":171126005},
    {"serial":171126003},
    {"serial":171126002},
    {"serial":171126001},
    {"serial":171125998},
    {"serial":171125995},
    {"serial":171116353},
    {"serial":171114664},
    {"serial":171110108},
    {"serial":171105863},
    {"serial":171104842},
    {"serial":171104840},
    {"serial":171081440},
    {"serial":171079931},
    {"serial":171079844},
    {"serial":171076711},
    {"serial":171076703},
    {"serial":171069759},
    {"serial":171068507},
    {"serial":171068506},
    {"serial":171068505},
    {"serial":171068504},
    {"serial":171068503},
    {"serial":171068502},
    {"serial":171068501},
    {"serial":171068500},
    {"serial":171068499},
    {"serial":171068498},
    {"serial":171068496},
    {"serial":171068495},
    {"serial":171068494},
    {"serial":171068493},
    {"serial":171068492},
    {"serial":171068491},
    {"serial":171068490},
    {"serial":171068489},
    {"serial":171063250},
    {"serial":171063084},
    {"serial":171057359},
    {"serial":171042119},
    {"serial":171037177},
    {"serial":171029606},
    {"serial":171028522},
    {"serial":171028520},
    {"serial":171026250},
    {"serial":171017121},
    {"serial":171016173},
    {"serial":171016171},
    {"serial":171016169},
    {"serial":171016167},
    {"serial":171015814},
    {"serial":171015810},
    {"serial":171014601},
    {"serial":171014333},
    {"serial":171014331},
    {"serial":171001700},
    {"serial":170997258},
    {"serial":170997256},
    {"serial":170997199},
    {"serial":170988839},
    {"serial":170984243},
    {"serial":170984241},
    {"serial":170984163},
    {"serial":170979990},
    {"serial":170973029},
    {"serial":170973021},
    {"serial":170973017},
    {"serial":170972955},
    {"serial":170972951},
    {"serial":170972949},
    {"serial":170972939},
    {"serial":170965026},
    {"serial":170964305},
    {"serial":170963957},
    {"serial":170963955},
    {"serial":170962722},
    {"serial":170962721},
    {"serial":170962720},
    {"serial":170962719},
    {"serial":170962718},
    {"serial":170962717},
    {"serial":170962716},
    {"serial":170961546},
    {"serial":170960906},
    {"serial":170960904},
    {"serial":170960143},
    {"serial":170952478},
    {"serial":170952391},
    {"serial":170952389},
    {"serial":170952387},
    {"serial":170952386},
    {"serial":170952361},
    {"serial":170952360},
    {"serial":170952356},
    {"serial":170952354},
    {"serial":170952352},
    {"serial":170950846},
    {"serial":170950844},
    {"serial":170950842},
    {"serial":170950840},
    {"serial":170949825},
    {"serial":170946838},
    {"serial":170941741},
    {"serial":170940152},
    {"serial":170939098},
    {"serial":170939096},
    {"serial":170937154},
    {"serial":170935746},
    {"serial":170935718},
    {"serial":170935711},
    {"serial":170935709},
    {"serial":170935707},
    {"serial":170934657},
    {"serial":170934656},
    {"serial":170934655},
    {"serial":170934654},
    {"serial":170930721},
    {"serial":170925455},
    {"serial":170925454},
    {"serial":170924958},
    {"serial":170923190},
    {"serial":170923156},
    {"serial":170923150},
    {"serial":170923148},
    {"serial":170923142},
    {"serial":170923111},
    {"serial":170920720},
    {"serial":170920718},
    {"serial":170920714},
    {"serial":170920708},
    {"serial":170920706},
    {"serial":170920700},
    {"serial":170920698},
    {"serial":170920696},
    {"serial":170920601},
    {"serial":170920587},
    {"serial":170914524},
    {"serial":170913879},
    {"serial":170913877},
    {"serial":170913875},
    {"serial":170913873},
    {"serial":170913871},
    {"serial":170913870},
    {"serial":170913869},
    {"serial":170913867},
    {"serial":170913866},
    {"serial":170913865},
    {"serial":170913863},
    {"serial":170913862},
    {"serial":170913861},
    {"serial":170913860},
    {"serial":170913859},
    {"serial":170913858},
    {"serial":170913857},
    {"serial":170913856},
    {"serial":170913855},
    {"serial":170913217},
    {"serial":170913215},
    {"serial":170913213},
    {"serial":170913211},
    {"serial":170913209},
    {"serial":170913207},
    {"serial":170913205},
    {"serial":170913204},
    {"serial":170913203},
    {"serial":170907410},
    {"serial":170907409},
    {"serial":170907407},
    {"serial":170907406},
    {"serial":170907405},
    {"serial":170907404},
    {"serial":170907403},
    {"serial":170907402},
    {"serial":170907401},
    {"serial":170907154},
    {"serial":170907150},
    {"serial":170907032},
    {"serial":170900290},
    {"serial":170899385},
    {"serial":170899377},
    {"serial":170899375},
    {"serial":170899201},
    {"serial":170895281},
    {"serial":170887444},
    {"serial":170885668},
    {"serial":170885667},
    {"serial":170885665},
    {"serial":170885664},
    {"serial":170885662},
    {"serial":170885660},
    {"serial":170885656},
    {"serial":170885616},
    {"serial":170885614},
    {"serial":170884405},
    {"serial":170884301},
    {"serial":170882588},
    {"serial":170882586},
    {"serial":170882584},
    {"serial":170882582},
    {"serial":170882580},
    {"serial":170882578},
    {"serial":170878471},
    {"serial":170878469},
    {"serial":170878463},
    {"serial":170878461},
    {"serial":170878456},
    {"serial":170876031},
    {"serial":170876029},
    {"serial":170876027},
    {"serial":170876021},
    {"serial":170876016},
    {"serial":170873105},
    {"serial":170873103},
    {"serial":170873099},
    {"serial":170871959},
    {"serial":170871527},
    {"serial":170869283},
    {"serial":170868673},
    {"serial":170867545},
    {"serial":170865676},
    {"serial":170862684},
    {"serial":170861712},
    {"serial":170861710},
    {"serial":170861709},
    {"serial":170861708},
    {"serial":170861191},
    {"serial":170861124},
    {"serial":170860415},
    {"serial":170860413},
    {"serial":170856742},
    {"serial":170856709},
    {"serial":170851735},
    {"serial":170849716},
    {"serial":170849498},
    {"serial":170849496},
    {"serial":170849494},
    {"serial":170849490},
    {"serial":170849488},
    {"serial":170847253},
    {"serial":170845552},
    {"serial":170845549},
    {"serial":170845528},
    {"serial":170841926},
    {"serial":170841921},
    {"serial":170841712},
    {"serial":170839796},
    {"serial":170839794},
    {"serial":170839793},
    {"serial":170839792},
    {"serial":170837827},
    {"serial":170837825},
    {"serial":170837823},
    {"serial":170837821},
    {"serial":170837819},
    {"serial":170837817},
    {"serial":170837815},
    {"serial":170837813},
    {"serial":170837811},
    {"serial":170837809},
    {"serial":170836306},
    {"serial":170836304},
    {"serial":170836302},
    {"serial":170835817},
    {"serial":170835816},
    {"serial":170835815},
    {"serial":170835813},
    {"serial":170830652},
    {"serial":170830651},
    {"serial":170830649},
    {"serial":170830646},
    {"serial":170827621},
    {"serial":170827045},
    {"serial":170826540},
    {"serial":170826538},
    {"serial":170826526},
    {"serial":170826033},
    {"serial":170826031},
    {"serial":170826030},
    {"serial":170826029},
    {"serial":170822395},
    {"serial":170821760},
    {"serial":170819453},
    {"serial":170819450},
    {"serial":170819448},
    {"serial":170819316},
    {"serial":170819314},
    {"serial":170816252},
    {"serial":170816250},
    {"serial":170816244},
    {"serial":170816242},
    {"serial":170816241},
    {"serial":170814996},
    {"serial":170814464},
    {"serial":170814216},
    {"serial":170814215},
    {"serial":170814212},
    {"serial":170814204},
    {"serial":170813947},
    {"serial":170813855},
    {"serial":170813845},
    {"serial":170813528},
    {"serial":170813524},
    {"serial":170813523},
    {"serial":170813522},
    {"serial":170813520},
    {"serial":170813519},
    {"serial":170813497},
    {"serial":170813495},
    {"serial":170813493},
    {"serial":170813491},
    {"serial":170808424},
    {"serial":170808397},
    {"serial":170806950},
    {"serial":170806930},
    {"serial":170806928},
    {"serial":170806841},
    {"serial":170806840},
    {"serial":170806839},
    {"serial":170806838},
    {"serial":170806837},
    {"serial":170806836},
    {"serial":170806835},
    {"serial":170806031},
    {"serial":170805163},
    {"serial":170805161},
    {"serial":170805159},
    {"serial":170805157},
    {"serial":170805155},
    {"serial":170805153},
    {"serial":170805152},
    {"serial":170805151},
    {"serial":170805150},
    {"serial":170805149},
    {"serial":170805148},
    {"serial":170805147},
    {"serial":170805115},
    {"serial":170800848},
    {"serial":170797525},
    {"serial":170797523},
    {"serial":170797309},
    {"serial":170797307},
    {"serial":170796162},
    {"serial":170795795},
    {"serial":170794881},
    {"serial":170794877},
    {"serial":170794869},
    {"serial":170791738},
    {"serial":170790073},
    {"serial":170789452},
    {"serial":170789450},
    {"serial":170789449},
    {"serial":170789447},
    {"serial":170789439},
    {"serial":170789054},
    {"serial":170789052},
    {"serial":170788797},
    {"serial":170788794},
    {"serial":170788105},
    {"serial":170788104},
    {"serial":170788103},
    {"serial":170788102},
    {"serial":170783950},
    {"serial":170772933},
    {"serial":170772931},
    {"serial":170772927},
    {"serial":170772923},
    {"serial":170772904},
    {"serial":170767355},
    {"serial":170767353},
    {"serial":170767351},
    {"serial":170758659},
    {"serial":170758654},
    {"serial":170749061},
    {"serial":170748570},
    {"serial":170748568},
    {"serial":170748567},
    {"serial":170748566},
    {"serial":170747147},
    {"serial":170747145},
    {"serial":170747143},
    {"serial":170747128},
    {"serial":170746575},
    {"serial":170746573},
    {"serial":170729515},
    {"serial":170729154},
    {"serial":170722766},
    {"serial":170722765},
    {"serial":170722764},
    {"serial":170722763},
    {"serial":170721409},
    {"serial":170721408},
    {"serial":170721406},
    {"serial":170721405},
    {"serial":170721404},
    {"serial":170710127},
    {"serial":170710125},
    {"serial":170710122},
    {"serial":170708442},
    {"serial":170708440},
    {"serial":170708438},
    {"serial":170708436},
    {"serial":170708405},
    {"serial":170708404},
    {"serial":170708403},
    {"serial":170708402},
    {"serial":170708401},
    {"serial":170708398},
    {"serial":170708220},
    {"serial":170704210},
    {"serial":170704088},
    {"serial":170701643},
    {"serial":170701638},
    {"serial":170700811},
    {"serial":170700809},
    {"serial":170700618},
    {"serial":170700388},
    {"serial":170698723},
    {"serial":170698719},
    {"serial":170698509},
    {"serial":170698503},
    {"serial":170698501},
    {"serial":170690720},
    {"serial":170689889},
    {"serial":170689885},
    {"serial":170689339},
    {"serial":170688475},
    {"serial":170681800},
    {"serial":170681799},
    {"serial":170680409},
    {"serial":170680407},
    {"serial":170680394},
    {"serial":170680392},
    {"serial":170680278},
    {"serial":170680276},
    {"serial":170680274},
    {"serial":170680264},
    {"serial":170680262},
    {"serial":170680122},
    {"serial":170680120},
    {"serial":170680118},
    {"serial":170680117},
    {"serial":170680116},
    {"serial":170678615},
    {"serial":170678614},
    {"serial":170678613},
    {"serial":170678612},
    {"serial":170678611},
    {"serial":170678610},
    {"serial":170678609},
    {"serial":170678608},
    {"serial":170678607},
    {"serial":170678606},
    {"serial":170677647},
    {"serial":170671237},
    {"serial":170669451},
    {"serial":170669450},
    {"serial":170669445},
    {"serial":170669444},
    {"serial":170669443},
    {"serial":170669441},
    {"serial":170669440},
    {"serial":170669439},
    {"serial":170664706},
    {"serial":170664320},
    {"serial":170664257},
    {"serial":170662499},
    {"serial":170661200},
    {"serial":170658657},
    {"serial":170658655},
    {"serial":170650143},
    {"serial":170647611},
    {"serial":170639752},
    {"serial":170639750},
    {"serial":170639748},
    {"serial":170639746},
    {"serial":170639744},
    {"serial":170639742},
    {"serial":170639740},
    {"serial":170639739},
    {"serial":170639738},
    {"serial":170639737},
    {"serial":170639736},
    {"serial":170639735},
    {"serial":170639734},
    {"serial":170639733},
    {"serial":170639732},
    {"serial":170633918},
    {"serial":170614982},
    {"serial":170614981},
    {"serial":170614980},
    {"serial":170614979},
    {"serial":170614978},
    {"serial":170614977},
    {"serial":170581918},
    {"serial":170581916},
    {"serial":170581915},
    {"serial":170581914},
    {"serial":170581913},
    {"serial":170565718},
    {"serial":170535047},
    {"serial":170484290},
    {"serial":170457923},
    {"serial":170447669},
    {"serial":170437027},
    {"serial":170436704},
    {"serial":170436702},
    {"serial":170436700},
    {"serial":170436698},
    {"serial":170436680},
    {"serial":170436678},
    {"serial":170436676},
    {"serial":170436674},
    {"serial":170345220},
    {"serial":170343522},
    {"serial":170319393},
    {"serial":170269801},
    {"serial":170269799},
    {"serial":170269797},
    {"serial":170269795},
    {"serial":170269793},
    {"serial":170269791},
    {"serial":170269789},
    {"serial":170269787},
    {"serial":170269786},
    {"serial":170269785},
    {"serial":170269784},
    {"serial":170269783},
    {"serial":170269782},
    {"serial":170269781},
    {"serial":170269780},
    {"serial":170269779},
    {"serial":170269778},
    {"serial":170269777},
    {"serial":170269776},
    {"serial":170269775},
    {"serial":170269774},
    {"serial":170269773},
    {"serial":170269772},
    {"serial":170269771},
    {"serial":170269770},
    {"serial":170269769},
    {"serial":170269768},
    {"serial":170269767},
    {"serial":170269766},
    {"serial":170269765},
    {"serial":170266295},
    {"serial":170246486},
    {"serial":170236461},
    {"serial":170232834},
    {"serial":170232833},
    {"serial":170232831},
    {"serial":170231998},
    {"serial":170219648},
    {"serial":170219626},
    {"serial":170219624},
    {"serial":170218484},
    {"serial":170218482},
    {"serial":170218476},
    {"serial":170184767},
    {"serial":170137195},
    {"serial":170137193},
    {"serial":170127503},
    {"serial":170120084},
    {"serial":170120082},
    {"serial":170120080},
    {"serial":170120076},
    {"serial":170114319},
    {"serial":170058389},
    {"serial":170058388},
    {"serial":170058387},
    {"serial":170058385},
    {"serial":170058383},
    {"serial":170058382},
    {"serial":170058380},
    {"serial":169929495},
    {"serial":169929493},
    {"serial":169852593},
    {"serial":169852591},
    {"serial":169851335},
    {"serial":169851333},
    {"serial":169851327},
    {"serial":169851325},
    {"serial":169851323},
    {"serial":169851322},
    {"serial":169851320},
    {"serial":169851319},
    {"serial":169851318},
    {"serial":169851317},
    {"serial":169851316},
    {"serial":169851312},
    {"serial":169699578},
    {"serial":169626034},
    {"serial":169471946},
    {"serial":169404582},
    {"serial":169369574},
    {"serial":169228395},
    {"serial":169228393},
    {"serial":169228391},
    {"serial":169186465},
    {"serial":169186319},
    {"serial":169147185},
    {"serial":169146629},
    {"serial":168919668},
    {"serial":168891369},
    {"serial":168398275},
    {"serial":168200870},
    {"serial":168109757},
    {"serial":167945710},
    {"serial":167945708},
    {"serial":167945707},
    {"serial":167898171},
    {"serial":165410687},
    {"serial":165410686},
    {"serial":165410274},
    {"serial":165410273},
    {"serial":165410272},
    {"serial":165410222},
    {"serial":165410220},
    {"serial":165410218},
    {"serial":165410217},
    {"serial":165410216},
    {"serial":165410215},
    {"serial":165410214},
    {"serial":165410213},
    {"serial":165410212},
    {"serial":165410211},
    {"serial":165410210},
    {"serial":165410209},
    {"serial":165410208},
    {"serial":165409649},
    {"serial":165409647},
    {"serial":165409646},
    {"serial":165409645},
    {"serial":165409644},
    {"serial":165409642},
    {"serial":165409641},
    {"serial":165409640},
    {"serial":165409638},
    {"serial":165409637},
    {"serial":165409636},
    {"serial":165409635},
    {"serial":165409633},
    {"serial":165409632},
    {"serial":165409631},
    {"serial":165409630},
    {"serial":165409629},
    {"serial":165409628},
    {"serial":165409627},
    {"serial":165409626},
    {"serial":164985326},
    {"serial":164981507},
    {"serial":164981505},
    {"serial":164981504},
    {"serial":164981503}]

    for (let i = 0; i < seriales_bodega.length; i++) {
        
        RabbitPublisher.get_label(JSON.stringify(seriales_bodega[i].serial), (callback) => {})
    }
}

module.exports = controller;