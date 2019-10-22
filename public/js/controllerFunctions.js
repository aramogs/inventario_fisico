const funcion = {};
const express = require('express');


const db = require('../db/conn');


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




module.exports = funcion;