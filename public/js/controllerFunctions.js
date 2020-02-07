const funcion = {};



const db = require('../db/conn');
const db_b10 = require('../db/conn_b10');

funcion.material= (callback)=>{
    db.query(`SELECT material, material_description, unidad_medida FROM material`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}


funcion.Material_StUnit= (callback)=>{
    db.query(`SELECT storage_unit FROM material`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Ubicaciones_Conteo_Rack= (ubicacion,callback)=>{
    db.query(`SELECT DISTINCT rack AS racks FROM ubicaciones_conteo WHERE storage_location = '${ubicacion}' ORDER BY rack ASC`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Ubicaciones_Conteo_StorageBin= (rack,callback)=>{
    db.query(`SELECT DISTINCT storage_bin AS bins FROM ubicaciones_conteo WHERE rack = '${rack}' ORDER BY storage_bin ASC`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectSerial= (serial,callback)=>{
    db.query(`SELECT material, stock FROM material WHERE storage_unit = ${serial}`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectCurrentCapturas= (captura_grupo,callback)=>{
    db.query(`SELECT captura_grupo FROM captura WHERE captura_grupo = '${captura_grupo}'`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.InsertCaptura = (serial,material, cantidad, ubicacion, gafete,callback)=>{
    db.query(`
    INSERT INTO captura (serial, material, cantidad, ubicacion, num_empleado, fecha)
    VALUES ('${serial}' , '${material}' , ${cantidad}, '${ubicacion}' , ${gafete} ,NOW())`,
    function (err, result, fields) {
        if (err) {
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.InsertCaptura_Eliminado = (serial,material, cantidad, ubicacion, gafete,callback)=>{
    db.query(`
    INSERT INTO captura_eliminado (serial, material, cantidad, ubicacion, num_empleado, fecha)
    VALUES ('${serial}' , '${material}' , ${cantidad}, '${ubicacion}' , ${gafete} ,NOW())`,
    function (err, result, fields) {
        if (err) {
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Select_CapturaId= (serial,callback)=>{
    db.query(`SELECT * FROM captura WHERE serial = '${serial}'`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.InsertCapturaSerial = (captura_grupo, serial, ubicacion, gafete,callback)=>{
    
    db.query(`
    INSERT INTO captura (captura_grupo, serial, ubicacion, num_empleado, fecha)
    VALUES ('${captura_grupo}','${serial}' ,   '${ubicacion}' , ${gafete} ,NOW())`,
    function (err, result, fields) {
        if (err) {
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.InsertCapturaSerialObsoleto = (captura_grupo, serial, ubicacion, gafete,callback)=>{
    
    db.query(`
    INSERT INTO captura (captura_grupo, serial, ubicacion, num_empleado, fecha, serial_obsoleto)
    VALUES ('${captura_grupo}','${serial}','${ubicacion}' , ${gafete} ,NOW(),1)`,
    function (err, result, fields) {
        if (err) {
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.UpdateSerialObsoleto = (serial, parte, cantidad,callback)=>{
    
    db.query(`UPDATE captura SET material = '${parte}',
     cantidad=${cantidad}
     WHERE serial = '${serial}'`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })


}

funcion.ticketsCapturados= (callback)=>{
    db.query(`SELECT serial FROM captura WHERE captura_grupo IS NULL`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Select_SerialesCapturados= (callback)=>{
    db.query(`SELECT serial FROM captura WHERE captura_grupo IS NOT NULL`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Select_GruposCapturados= (callback)=>{
    db.query(`SELECT captura_grupo FROM captura WHERE captura_grupo IS NOT NULL`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Select_Captura= (callback)=>{
    db.query(`SELECT * FROM captura `,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Select_Captura_Eliminado= (callback)=>{
    db.query(`SELECT * FROM captura_eliminado `,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Select_Material= (callback)=>{
    db.query(`SELECT * FROM material `,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Select_CapturaGrupo= (captura_grupo,callback)=>{
    db.query(`SELECT * FROM captura WHERE captura_grupo = '${captura_grupo}'`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}


funcion.MaxTickets= (callback)=>{
    db.query(`SELECT MIN(CONVERT(ticket_inicial, SIGNED INTEGER)) AS minimo, MAX(CONVERT(ticket_final, SIGNED INTEGER))AS maximo FROM talones`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {
            callback(null, result);
        }
    })
}

funcion.Talones= (callback)=>{
    db.query(`SELECT * FROM talones`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.TalonesEntregados= (callback)=>{
    db.query(`SELECT * FROM talones WHERE status='ENTREGADO'`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Talones_Contados= (callback)=>{
    db.query(`SELECT COUNT(*) AS TalonesContados FROM talones WHERE totales = capturados`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Talones_NoContados= (callback)=>{
    db.query(`SELECT Count(*) AS TalonesNoContados FROM talones WHERE totales != capturados`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.misTicketsCapturados= (gafete,callback)=>{
    db.query(`SELECT * FROM captura WHERE num_empleado= ${gafete} ORDER BY captura_id DESC`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.misTicketsCapturadosC= (gafete,callback)=>{
    db.query(`SELECT * FROM captura WHERE num_empleado= ${gafete} AND material= 'CANCELADO' ORDER BY captura_id DESC`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Talones= (callback)=>{
    db.query(`SELECT * FROM talones`,function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}


funcion.ubicacion = (callback)=>{
    db.query(`SELECT * FROM ubicaciones`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectAuditoria = (callback)=>{
    db.query(`SELECT DISTINCT LEFT(id_ubicacion,2) AS distinct_ubicacion,estado_auditoria  FROM auditoria ORDER BY estado_auditoria ASC`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectAuditoria_Auditado = (callback)=>{
    db.query(`SELECT * FROM auditoria WHERE estado_auditoria = 1`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectAuditoria_NoAuditado = (callback)=>{
    db.query(`SELECT * FROM auditoria WHERE estado_auditoria = 0`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}


funcion.SelectUbicacion_Equals = (ubicacion,callback)=>{
    db.query(`SELECT * FROM captura WHERE LEFT(ubicacion,2) = '${ubicacion}'`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectSerial_Contado = (ubicacion,callback)=>{
    db.query(`SELECT * FROM captura WHERE LEFT(ubicacion,2) = '${ubicacion}' AND serial_auditado = 1`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectSerial_SinContar = (ubicacion,callback)=>{
    db.query(`SELECT * FROM captura WHERE LEFT(ubicacion,2) = '${ubicacion}' AND serial_auditado IS NULL`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Update_Serial_Auditado = (serial_auditado,callback)=>{
    db.query(`UPDATE captura SET serial_auditado = 1 WHERE serial = ${serial_auditado}`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Update_Ubicacion_Auditada = (ubicacion,callback)=>{
    db.query(`UPDATE auditoria SET estado_auditoria = 1 WHERE LEFT(id_ubicacion,2) = '${ubicacion}'`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Update_Ubicacion_Captura = (id_ubicacion, emp_id, estado_auditoria, callback)=>{
    db.query(`
    INSERT INTO auditoria (id_ubicacion, emp_id, estado_auditoria)
    VALUES (LEFT('${id_ubicacion}',2), ${emp_id}, ${estado_auditoria})
     ON DUPLICATE KEY UPDATE 
     estado_auditoria = ${estado_auditoria}
    `,
    function (err, result, fields) {
        if (err) {
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.DeleteTicket= (idTicket,callback)=>{
    db.query(`DELETE FROM captura WHERE serial='${idTicket}'`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.InsertTalon = (inicio,final, empleado, nombre, telefono,callback)=>{
    db.query(`
    INSERT INTO talones (ticket_inicial, ticket_final, num_empleado, nombre_empleado, telefono, totales,capturados,status)
    VALUES ('${inicio}' , '${final}' , ${empleado}, '${nombre}' , '${telefono}', ${(final-inicio)+1},0,"PENDIENTE")`,
    function (err, result, fields) {
        if (err) {
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.DeleteTalon= (idTicket,callback)=>{
    db.query(`DELETE FROM talones WHERE id='${idTicket}'`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.InsertUbicacion = (ubicacion,callback)=>{
    db.query(`
    INSERT INTO ubicaciones (ubicacion)
    VALUES ('${ubicacion}')`,
    function (err, result, fields) {
        if (err) {
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.DeleteUbicacion= (idTicket,callback)=>{
    db.query(`DELETE FROM ubicaciones WHERE id=${idTicket}`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.CountTicketsCapturados= (callback)=>{
    db.query(`SELECT COUNT (serial) AS TCapturados FROM captura WHERE captura_grupo IS NULL`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.CountSerialesCapturados= (callback)=>{
    db.query(`SELECT COUNT (serial) AS SCapturados FROM captura WHERE (captura_grupo IS NOT NULL )
    AND (material IS NOT NULL)`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.CountSerialesTotales= (callback)=>{
    db.query(`SELECT COUNT (material_id) AS STotales FROM material WHERE storage_unit IS NOT NULL`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.CountTicketsTotales= (callback)=>{
    db.query(`SELECT SUM (totales) AS TTotales FROM talones`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.UpdateStatus = (idTicket, newStatus,callback)=>{
    db.query(`UPDATE talones SET status = '${newStatus}' WHERE id = ${idTicket} `, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

funcion.CountTalonesE= (callback)=>{
    db.query(`SELECT *  FROM talones WHERE status="ENTREGADO" `, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.CountTalonesP= (callback)=>{
    db.query(`SELECT * FROM talones WHERE status="PENDIENTE" `, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.IncrementCaptura = (idTalon,callback)=>{
    db.query(`UPDATE talones SET capturados = capturados + 1 WHERE id = ${idTalon}`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.ReducirCaptura = (idTalon,callback)=>{
    db.query(`UPDATE talones SET capturados = capturados - 1 WHERE id = ${idTalon}`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}


//////////////////////////////////////TEMPORAL AUDITORIA VULCANIZADO//////////////////////////////
 
funcion.SelectAllStations_VULC = (callback)=>{
    db_b10.query(`SELECT * FROM station_conf WHERE  LEFT(ubicacion,1) = "P" ORDER BY ubicacion ASC`, function(err,result){
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectEtiquetasVULC = (callback)=>{
    db_b10.query(`SELECT * FROM etiquetas_semi WHERE plataforma = "VULC" AND fecha >= '2019/12/09'`,function(err,result){
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        } 
    })
}

funcion.SelectLinea_Equals = (linea,callback)=>{
    db_b10.query(`SELECT * FROM etiquetas_semi WHERE linea = ${linea} AND fecha >='2019/12/09' ORDER BY id ASC`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}


funcion.SelectSerial_Contado_Vulc = (linea,callback)=>{
    db_b10.query(`SELECT * FROM etiquetas_semi WHERE linea = ${linea} AND no_serie_auditado IS NOT NULL AND fecha >='2019/12/09'`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SelectSerial_SinContar_Vulc = (linea,callback)=>{
    db_b10.query(`SELECT * FROM etiquetas_semi WHERE linea = ${linea} AND no_serie_auditado IS NULL AND fecha >='2019/12/09'`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.Update_Serial_Auditado_VULC = (emp_id,serial_auditado,callback)=>{
    db_b10.query(`UPDATE etiquetas_semi SET no_serie_auditado = ${emp_id} WHERE no_serie = ${serial_auditado}`, function (err, result, fields) {
        if (err) {
          
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

/*
funcion.empleadosInsertCaptura = (cap_id,emp_id, emp_id_jefe,cap_año,cap_mes,cap_dia,cap_captura,callback)=>{
    db.query(`
    INSERT INTO captura (cap_id, emp_id, emp_id_jefe, cap_año, cap_mes, cap_dia, cap_captura)
    VALUES ('${cap_id}' , ${emp_id} , ${emp_id_jefe}, ${cap_año} , ${cap_mes} , ${cap_dia} , '${cap_captura}')
     ON DUPLICATE KEY UPDATE 
        cap_captura = '${cap_captura}'
    `,
    function (err, result, fields) {
        if (err) {
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}
funcion.empleadosActualizarJefeCambiar = (emp_id_jefe,callback)=>{
    db.query(`UPDATE captura SET emp_id_jefe = ${emp_id_jefe} WHERE emp_id = ${emp_id} `, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

funcion.empleadosActualizarJefeBorrar = (emp_id,callback)=>{
    db.query(`UPDATE captura SET emp_id_jefe = 0 WHERE emp_id = ${emp_id} `, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}



funcion.capturaHistorial = (emp_id_jefe,cap_año,cap_mes,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
     `,
    function (err, result, fields) {
        if (err) {
            console.log(err);
            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}

funcion.SearchMotivoFaltas = (callback)=>{
    db.query(`
    SELECT * FROM motivo_faltas
     `,
    function (err, result, fields) {
        if (err) {
            callback(err, null);

        } else {
            callback(null, result);
        }
    })
}

funcion.verificarMotivoFalta = (emp_id_jefe,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE emp_id_jefe = ${emp_id_jefe}
    AND cap_captura = "F"
    AND motivo_falta IS NULL
     `,
    function (err, result, fields) {
        if (err) {

            
            callback(err, null);

        } else {

            callback(null, result);
        }
    })
}



funcion.InsertarMotivoFalta = (motivo_falta, cap_id,callback)=>{
    db.query(`UPDATE captura SET motivo_falta = "${motivo_falta}" WHERE cap_id = ${cap_id} `, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })
}

funcion.SearchCaptura_Faltante = (emp_id_jefe,callback)=>{
    db.query(`
    SELECT * FROM captura 
    WHERE emp_id_jefe = ${emp_id_jefe}
    AND cap_captura = "F"
    AND motivo_falta  IS NULL
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}

funcion.SearchJustificado = (emp_id_jefe, cap_año, cap_mes,cap_dia_inicio, cap_dia_final,callback)=>{
    db.query(`
    SELECT * FROM captura 
    WHERE cap_dia BETWEEN ${cap_dia_inicio} AND ${cap_dia_final}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta <= 4  
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}

funcion.SearchInjustificado = (emp_id_jefe, cap_año, cap_mes,cap_dia_inicio, cap_dia_final,callback)=>{
    db.query(`
    SELECT * FROM captura 
    WHERE cap_dia BETWEEN ${cap_dia_inicio} AND ${cap_dia_final}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta > 4  
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}


funcion.SearchCaptura = (emp_id_jefe, cap_año, cap_mes, cap_dia_inicio, cap_dia_final, callback)=>{
    db.query(`
    SELECT * FROM captura 
    WHERE cap_dia  BETWEEN ${cap_dia_inicio} AND ${cap_dia_final}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta >0
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}


funcion.SearchJustificado_MesInicial = (emp_id_jefe, cap_año, cap_mes,cap_dia_inicio,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    cap_dia >= ${cap_dia_inicio}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta <= 4  
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}
funcion.SearchJustificado_MesFinal = (emp_id_jefe, cap_año, cap_mes, cap_dia_final,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    cap_dia <= ${cap_dia_final}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta <= 4  
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}

funcion.SearchInjustificado_MesInicial = (emp_id_jefe, cap_año, cap_mes,cap_dia_inicio,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    cap_dia >= ${cap_dia_inicio}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta > 4  
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}
funcion.SearchInjustificado_MesFinal = (emp_id_jefe, cap_año, cap_mes, cap_dia_final,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    cap_dia <= ${cap_dia_final}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta > 4  
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}

funcion.SearchCaptura_MesInicial = (emp_id_jefe, cap_año, cap_mes,cap_dia_inicio,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    cap_dia >= ${cap_dia_inicio}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta >0
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}

funcion.SearchCaptura_MesFinal = (emp_id_jefe, cap_año, cap_mes, cap_dia_final,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    cap_dia <= ${cap_dia_final}
    AND emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND cap_mes = ${cap_mes}
    AND motivo_falta >0
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}


funcion.SearchJustificado_Anual = (emp_id_jefe, cap_año,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND motivo_falta <= 4  
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}
funcion.SearchInjustificado_Anual = (emp_id_jefe, cap_año ,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND motivo_falta > 4  
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}

funcion.SearchCaptura_Anual = (emp_id_jefe, cap_año,callback)=>{
    db.query(`
    SELECT * FROM captura WHERE 
    emp_id_jefe = ${emp_id_jefe}
    AND cap_año = ${cap_año}
    AND motivo_falta >0
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}


funcion.SearchCaptura_General = (callback)=>{
    db.query(`
    SELECT * FROM captura 
    `,
        function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })
}


*/

module.exports = funcion;