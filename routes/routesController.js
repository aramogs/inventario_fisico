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

controller.error_POST = (req, res) => {

    res.render('error.ejs', {

    });

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
            nombreContador,
        })
    })
}

controller.ubicacion_rack_POST = (req, res) => {
    ubicacion = req.params.id
    gafete = req.body.gafete
    nombreContador = req.body.nombreContador
    funcion.Ubicaciones_Conteo_Rack(ubicacion, (err, racks) => {
        res.render('ubicacion_rack.ejs', {
            gafete,
            nombreContador,
            racks
        })

    })
}

controller.ubicacion_storageBin_POST = (req, res) => {
    rack = req.params.id
    gafete = req.body.gafete
    nombreContador = req.body.nombreContador
    funcion.Ubicaciones_Conteo_StorageBin(rack, (err, bins) => {
        res.render('ubicacion_storageBin.ejs', {
            gafete,
            nombreContador,
            bins
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
                funcion.Material_StUnit((err, storage_units) => {
                    funcion.Select_CapturaGrupo(captura_grupo, (err, capturasPorGrupo) => {
                        res.render('conteo.ejs', {
                            gafete,
                            nombreContador,
                            ubicacion,
                            captura_grupo,
                            captura_actual,
                            serialesCapturados,
                            capturasPorGrupo,
                            storage_units
                        })
                    })
                })
            } else {

                posicion = gruposCapturados.length
                current_captura_grupo = gruposCapturados[posicion - 1].captura_grupo
                split = current_captura_grupo.split("-")
                currentCaptura = parseInt(split[1])

                captura_grupo = `${gafete}-${currentCaptura + 1}`
                captura_actual = ""

                funcion.Material_StUnit((err, storage_units) => {

                    funcion.Select_CapturaGrupo(captura_grupo, (err, capturasPorGrupo) => {
                        res.render('conteo.ejs', {
                            gafete,
                            nombreContador,
                            ubicacion,
                            captura_grupo,
                            captura_actual,
                            serialesCapturados,
                            capturasPorGrupo,
                            storage_units
                        })
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
    captura_grupo = req.body.captura_grupo
    gafete2 = captura_grupo.split("-", 1)
    estado_auditoria = 0
    serialesObsoletos = req.body.serialesObsoletos
    errores="false"



    funcion.Update_Ubicacion_Captura(id_ubicacion, gafete2[0], estado_auditoria, (err, result) => { });

    if (seriales.includes(",")) {

        let serialesArray = seriales.split(',');
        for (let i = 0; i < serialesArray.length; i++) {

            

            funcion.InsertCapturaSerial(captura_grupo, serialesArray[i], ubicacion, gafete2[0], (err, result) => {
                if (err != null) {
                    errores = "true"
                
                }

            })

        }
    } else if(seriales !="") {

        funcion.InsertCapturaSerial(captura_grupo, seriales, ubicacion, gafete2[0], (err, result) => {
            if (err != null) {
                errores = "true"
               
                
            }
        })

    }


    if (serialesObsoletos.includes(",")) {

        let serialesObsoletosArray = serialesObsoletos.split(',');
        for (let i = 0; i < serialesObsoletosArray.length; i++) {
          
          
            
            RabbitPublisher.get_label(serialesObsoletosArray[i], (callback) => {})
            

            funcion.InsertCapturaSerialObsoleto(captura_grupo, serialesObsoletosArray[i], ubicacion, gafete2[0], (err, result) => {
                if (err != null) {
                    errores = "true"
           
                }

            })

        }
    } else if(serialesObsoletos !="") {
        RabbitPublisher.get_label(serialesObsoletos, (callback) => {})
        funcion.InsertCapturaSerialObsoleto(captura_grupo, serialesObsoletos,  ubicacion, gafete2[0], (err, result) => {
            if (err != null) {
                errores = "true"
               
                
            }
        })

    }






    var delay = 500;

    setTimeout(function () {

    if (serialesObsoletos == "") {
        return res.redirect('/login_conteo/ubicacion');
    } else {
       
        res.render('conteo_obsoleto.ejs', {

            gafete,
            nombreContador,
            ubicacion,
            id_ubicacion,
            serialesObsoletos,
            captura_grupo,
            errores
        });
    }
    }, delay);

}



controller.conteoObsoleto_guardar_POST = (req, res) => {

    
    seriales = req.body.inputSeriales
    partes = req.body.inputPartes
    cantidades = req.body.inputCantidades
    gafete = req.body.gafete;
    ubicacion = req.body.ubicacion
    captura_grupo = req.body.captura_grupo
    errores = false
    errorAnterior= req.body.error

    gafete2 = captura_grupo.split("-", 1)

    if (seriales.includes(",")) {

        let serialesArray = seriales.split(',');
        let partesArray = partes.split(',');
        let cantidadesArray = cantidades.split(',');
        for (let i = 0; i < serialesArray.length; i++) {

            funcion.UpdateSerialObsoleto(serialesArray[i], partesArray[i], cantidadesArray[i], (err, result) => {
         
                if (err != null || result.affectedRows==0) {
                    errores = true
                    res.redirect('/error');
                    
                  
                }


            })

        }
    } else if(seriales != "") {

        funcion.UpdateSerialObsoleto(seriales, partes, cantidades, (err, result) => {
            if (err != null || result.affectedRows==0) {
                errores = true
                res.redirect('/error');
            }
        })

    }

    var delay = 500;
    setTimeout(function () {
        if (errores == false && errorAnterior=="false") {
            res.redirect('/login_conteo/ubicacion');
        }else if(errorAnterior=="true" && errores==false){
       
            res.redirect('/error');
        }

    }, delay);



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
                    funcion.SelectEtiquetasVULC((err, etiquetas_semi) => {

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
        funcion.Update_Serial_Auditado_VULC(gafete, seriales[i], (err, result) => {
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



module.exports = controller;