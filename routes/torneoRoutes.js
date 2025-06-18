const express = require('express');
const router = express.Router();
const torneoController = require('../controller/torneoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear torneo
router.post('/crearTorneo', verificarToken, verificarAdmin, torneoController.crearTorneo);
// Obtener todos los torneos
router.get('/obtenerTorneos', verificarToken, torneoController.obtenerTorneos);
// Obtener torneo por ID
router.get('/obtenerTorneo/:id', verificarToken, torneoController.obtenerTorneoPorId);
// Actualizar torneo
router.put('/actualizarTorneo/:id', verificarToken, verificarAdmin, torneoController.actualizarTorneo);
// Eliminar torneo
router.delete('/eliminarTorneo/:id', verificarToken, verificarAdmin, torneoController.eliminarTorneo);
// Confirmar torneo
router.put('/confirmarTorneo/:id', verificarToken, verificarAdmin, torneoController.confirmarTorneo);
// Finalizar torneo
router.put('/finalizarTorneo/:id', verificarToken, verificarAdmin, torneoController.finalizarTorneo);

module.exports = router;