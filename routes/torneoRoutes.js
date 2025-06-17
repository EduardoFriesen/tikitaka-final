const express = require('express');
const router = express.Router();
const jugadorController = require('../controller/torneoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear torneo
router.post('/crearTorneo', verificarToken, verificarAdmin, jugadorController.crearTorneo);
// Obtener todos los torneos
router.get('/obtenerTorneos', verificarToken, jugadorController.obtenerTorneos);
// Obtener torneo por ID
router.get('/obtenerTorneo/:id', verificarToken, jugadorController.obtenerTorneoPorId);
// Actualizar torneo
router.put('/actualizarTorneo/:id', verificarToken, verificarAdmin, jugadorController.actualizarTorneo);
// Eliminar torneo
router.delete('/eliminarTorneo/:id', verificarToken, verificarAdmin, jugadorController.eliminarTorneo);
module.exports = router;