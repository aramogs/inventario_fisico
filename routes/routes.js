const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

//Routes

router.get('/', routesController.index_GET);
router.get('/login/:id', routesController.login);
router.get('/login_conteo/:id', routesController.login_conteo);
router.post('/mesa_captura', routesController.mesa_captura_POST);
router.post('/guardar_captura', routesController.guardar_captura_POST);
router.post('/ubicacion', routesController.ubicacion_POST);
router.post('/ubicacion/:id', routesController.ubicacion_rack_POST);
router.post('/storageBin/:id', routesController.ubicacion_storageBin_POST);
router.post('/conteo', routesController.conteo_POST);
router.post('/conteo_guardar', routesController.conteo_guardar_POST)
router.post('/conteoObsoleto_guardar', routesController.conteoObsoleto_guardar_POST)
router.post('/delete_ticket', routesController.delete_ticket_POST);
router.post('/cancelar_multiple', routesController.cancelar_multiple_POST)
router.post('/guardar_cancelado', routesController.guardar_cancelado_POST);
router.post('/talones', routesController.talones_POST);
router.post('/acceso', routesController.acceso_POST);
router.post('/guardar_talon', routesController.guardar_talon_POST);
router.post('/delete_talon', routesController.delete_talon_POST);
router.post('/guardar_ubicacion', routesController.guardar_ubicacion_POST);
router.post('/delete_ubicacion', routesController.delete_ubicacion_POST);
router.post('/guardar_acceso', routesController.guardar_acceso_POST);
router.post('/delete_acceso', routesController.delete_acceso_POST);
router.get('/graficas', routesController.graficas_GET);
router.post('/status_talon', routesController.status_talon_POST);
router.post('/auditar', routesController.auditar_POST);
router.post('/auditar_ubicacion', routesController.auditar_ubicacion_POST);
router.post('/serial_auditado', routesController.serial_auditado_POST);
router.post('/terminar_auditoria', routesController.terminar_auditoria_POST);
router.get('/descargar_reporte', routesController.descargar_reporte_POST);
router.get('/error', routesController.error_POST);


//////////////////////////////////////TEMPORAL AUDITORIA VULCANIZADO//////////////////////////////
router.post('/auditar_temp', routesController.auditar_temp_POST);
router.post('/auditar_ubicacion_temp', routesController.auditar_ubicacion_temp_POST);
router.post('/terminar_auditoria_temp', routesController.terminar_auditoria_temp_POST);

router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;