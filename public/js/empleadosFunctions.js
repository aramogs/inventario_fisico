const funcionE = {};
const dbE = require('../db/connEmpleados');
const db = require('../db/conn');


funcionE.empleadosNombre=(gafete,callback)=>{
    dbE.query(`SELECT emp_nombre FROM del_empleados WHERE emp_id=${gafete}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result[0].emp_nombre);
        }
    })

}

funcionE.empleados=(callback)=>{
    dbE.query(`SELECT * FROM del_empleados `, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result);
        }
    })

}


funcionE.empleadosRevisarAccesso= (sign, acc,callback)=>{

    dbE.query(`SELECT * FROM del_accesos WHERE acc_inventario ${sign}${acc}` , function (err, result, fields) {
        if (err) {
            
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcionE.empleadosDirectorio= (callback)=>{

    dbE.query(`SELECT * FROM del_directorio ORDER BY del_nombre` , function (err, result, fields) {
        if (err) {
            
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcionE.empleadosInsertDirectorio = (del_extension, del_nombre, callback) => {

    dbE.query(`INSERT INTO del_directorio (del_extension, del_nombre)
    VALUES('${del_extension}','${del_nombre}')
    ON DUPLICATE KEY UPDATE del_extension = VALUES(del_extension), del_nombre = VALUES(del_nombre)`, function (err, result, fields) {
            if (err) {
                callback(err, null);

            } else {

                callback(null, result);
            }
        })

}

funcionE.empleadosDeleteDirectorio = (extension, callback) => {

    dbE.query(`DELETE FROM del_directorio WHERE del_extension='${extension}'`, function (err, result, fields) {
            if (err) {
                
                callback(err, null);

            } else {

                callback(null, result);
            }
        })

}

funcionE.EmpleadosAccesos = ( callback) => {

    dbE.query(`SELECT * FROM del_empleados, del_accesos 
    WHERE del_empleados.emp_id=del_accesos.acc_id 
    AND del_accesos.acc_inventario>=1`, function (err, result, fields) {
            if (err) {
                
                callback(err, null);

            } else {

                callback(null, result);
            }
        })

}

funcionE.InsertAcceso = (empleado, acc, callback) => {

    dbE.query(`INSERT INTO del_accesos (acc_id, acc_inventario)
    VALUES('${empleado}',${acc})
    ON DUPLICATE KEY UPDATE acc_inventario = VALUES(acc_inventario)`, function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })

}

funcionE.DeleteAcceso = (gafete, callback) => {

    dbE.query(`UPDATE del_accesos SET acc_inventario = NULL WHERE acc_id ='${gafete}'`, function (err, result, fields) {
            if (err) {
                
                callback(err, null);

            } else {

                callback(null, result);
            }
        })

}


module.exports = funcionE;