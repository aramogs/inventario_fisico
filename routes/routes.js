const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

//Routes

router.get('/', routesController.index_GET);
router.get('/login/:id', routesController.login);
router.post('/mesa_captura', routesController.mesa_captura_POST);

router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;