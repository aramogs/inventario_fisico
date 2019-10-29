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
router.post('/conteo', routesController.conteo_POST);
router.post('/conteo_guardar', routesController.conteo_guardar_POST)
router.post('/delete_ticket', routesController.delete_ticket_POST);
router.post('/cancelar_multiple', routesController.cancelar_multiple_POST)

router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;