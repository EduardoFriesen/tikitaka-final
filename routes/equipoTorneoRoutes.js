const express = require('express');
const router = express.Router();
const equipoTorneoController = require('../controller/equipoTorneoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear equipo en torneo
router.post('/crearEquipoTorneo', verificarToken, verificarAdmin, equipoTorneoController.crearEquipoTorneo);
// Obtener todos los equipos en un torneo
router.get('/obtenerEquiposTorneo/:id_torneo', verificarToken, equipoTorneoController.obtenerEquiposTorneo);
// Obtener equipos por ID de torneo
router.get('/obtenerEquiposPorIdTorneo/:id_torneo', verificarToken, equipoTorneoController.obtenerEquiposPorIdTorneo);
// Actualizar equipo en torneo
router.put('/actualizarEquipoTorneo/:id', verificarToken, verificarAdmin, equipoTorneoController.actualizarEquipoTorneo);
// Eliminar equipo de torneo
router.delete('/eliminarEquipoTorneo/:id', verificarToken, verificarAdmin, equipoTorneoController.eliminarEquipoTorneo);
module.exports = router;