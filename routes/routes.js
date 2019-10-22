const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

//Routes

router.get('/', routesController.index_GET);

router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;