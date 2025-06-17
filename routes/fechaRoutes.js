const express = require('express');
const router = express.Router();
const fechaController = require('../controller/fechaController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear fecha
router.post('/crearFecha', verificarToken, verificarAdmin, fechaController.crearFecha);
// Obtener todas las fechas
router.get('/obtenerFechas', verificarToken, fechaController.obtenerFechas);
// Obtener fecha por ID
router.get('/obtenerFecha/:id', verificarToken, fechaController.obtenerFechaPorId);
// Actualizar fecha
router.put('/actualizarFecha/:id', verificarToken, verificarAdmin, fechaController.actualizarFecha);
// Eliminar fecha
router.delete('/eliminarFecha/:id', verificarToken, verificarAdmin, fechaController.eliminarFecha);
module.exports = router;