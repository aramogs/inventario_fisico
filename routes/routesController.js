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
                            funcion.TalonesEntregados((err, talones) => {
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
    idTalon = req.body.idTalon

    funcion.InsertCaptura(ticket, material, cantidad, ubicacion, gafete, (err, result3) => {
        if (err) throw err;
        funcion.IncrementCaptura(idTalon, (err, resu) => {
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
                                    funcion.TalonesEntregados((err, talones) => {
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
    id_ubicacion = (req.body.ubicacion).slice(0, 2)
    serial = req.body.serial
    serial = serial.slice(1)
    captura_grupo = req.body.captura_grupo
    estado_auditoria = 0

    funcion.Update_Ubicacion_Captura(id_ubicacion, gafete, estado_auditoria, (err, result) => {

        funcion.SelectCurrentCapturas(captura_grupo, (err, Countcaptura_actual) => {
            captura_actual = Countcaptura_actual.length + 1
            funcion.SelectSerial(serial, (err, infoNumeroParte) => {
                if (infoNumeroParte.length == "") {
                    material = "NULL"
                    cantidad = null

                    RabbitPublisher.get_label(serial, (callback) => {})

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
                funcion.Talones((err, talones) => {
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

    for (var i = ticketI; i <= ticketF; i++) {

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
    nombre = req.body.nombreContador

    funcion.Update_Ubicacion_Auditada(ubicacion, (err, result) => {

        res.render('auditoria_terminada.ejs', {
            ubicacion,
            gafete,
            nombre
        })
    })
}

controller.descargar_reporte_POST = (req, res) => {

    funcion.Select_Captura((err, captura) => {
        funcion.Select_Material((err, material) => {


            //     res.download('file');
            //     var header = "TICKET" + "\t" + "NUMERO DE PARTE" + "\t" + "CANTIDAD" + "\t" + "AREA" + "\t" + "SAPLOC" + "\t" + "DESCRIPCION" + "\t" + "UOM" + "\t" + "CAPTURISTA" + "\n";

            //     let rows = []
            //     let row = []
            //     let test 
            //     for (let i = 1; i < captura.length; i++) {

            //         rows.push("row"+[i])


            //         let existe = false
            //         let storage_location
            //         let unidad_medida = ''
            //         let material_description = ''

            //         for (let y = 0; y < material.length; y++) {
            //             if (captura[i].material == material[y].material) {
            //                 storage_location = material[y].storage_location
            //                 existe = true
            //                 break
            //             }
            //         }
            //         if (existe == true) {
            //             storage_location
            //         } else {
            //             storage_location = 'N/A'
            //         }

            //         for (let y = 0; y < material.length; y++) {
            //             if (captura[i].material == material[y].material) {
            //                 material_description = material[y].material_description

            //                 existe = true
            //                 break
            //             }
            //         }
            //         if (existe == true) {
            //             material_description
            //         } else {
            //             material_description = 'N/A'
            //         }

            //         for (let y = 0; y < material.length; y++) {
            //             if (captura[i].material == material[y].material) {
            //                 unidad_medida = material[y].unidad_medida

            //                 existe = true
            //                 break
            //             }
            //         }
            //         if (existe == true) {
            //             unidad_medida
            //         } else {
            //             unidad_medida = 'N/A'
            //         }

            //             row[i]  = [
            //             captura[i].serial,
            //             captura[i].material,
            //             captura[i].cantidad,
            //             captura[i].ubicacion,
            //             storage_location,
            //             material_description,
            //             unidad_medida,
            //             captura[i].num_empleado
            //         ].join('\t')


            //     }
            //     for (let i = 1; i < rows.length; i++) {
            //         test =  test  + row[i] + "\n"
            //     }
            //     test = header + test

            //     return res.send(test);

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////EXCELJS/////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
            // create workbook & add worksheet
            var workbook = new Excel.Workbook();
            var worksheet = workbook.addWorksheet('CAPTURA');

            // add column headers
            worksheet.columns = [
                {   header: 'TICKET',
                    key: 'serial'
                },
                {
                    header: 'NUMERO DE PARTE',
                    key: 'material'
                },
                {
                    header: 'CANTIDAD',
                    key: 'cantidad'
                },
                {
                    header: 'AREA',
                    key: 'ubicacion'
                },
                {
                    header: 'SAPLOC',
                    key: 'storage_location'
                },
                {
                    header: 'DESCRIPCION',
                    key: 'material_description'
                },
                {
                    header: 'UOM',
                    key: 'unidad_medida'
                },
                {
                    header: 'CAPTURISTA',
                    key: 'num_empleado'
                }
            ];

            // // add row using keys
            // worksheet.addRow({
            //     album: "Taylor Swift",
            //     year: 2006
            // });

            // // add rows the dumb way
            // worksheet.addRow(["Fearless", 2008]);

            // // add an array of rows
            // var rows = [
            //     ["Speak Now", 2010],
            //     {
            //         album: "Red",
            //         year: 2012
            //     }
            // ];

                let rows = []
                let row =[]
                for (let i = 1; i < captura.length; i++) {

                    rows.push("row"+[i])
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
                        captura[i].serial,
                        captura[i].material,
                        captura[i].cantidad,
                        captura[i].ubicacion,
                        storage_location,
                        material_description,
                        unidad_medida,
                        captura[i].num_empleado
                    ]
                    worksheet.addRow(row);
                }

                

            

            // // edit cells directly
            // worksheet.getCell('A6').value = "1989";
            // worksheet.getCell('B6').value = 2014;

            // // save workbook to disk
            // workbook.xlsx.writeFile('taylor_swift.xlsx').then(function() {
            //   console.log("saved");
            // });

            res.attachment("INVENTARIO.xlsx")
            workbook.xlsx.write(res).then(function () {
                res.end()
            });


        })
    });

}
module.exports = controller;