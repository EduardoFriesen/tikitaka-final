const express = require('express');
const router = express.Router();
const equipoTorneoController = require('../controller/equipoTorneoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear equipo en torneo
router.post('/ingresarEquipoTorneo/:id', verificarToken, verificarAdmin, equipoTorneoController.ingresarEquipoTorneo);
// Obtener todos los equipos en un torneo
router.get('/obtenerEquiposTorneo/:id', verificarToken, equipoTorneoController.obtenerEquiposTorneo);
// Obtener equipos por ID de torneo
router.get('/obtenerEquiposPorIdTorneo/:id', verificarToken, equipoTorneoController.obtenerEquiposPorIdTorneo);
// Actualizar equipo en torneo
router.put('/actualizarEquipoTorneo/:id', verificarToken, verificarAdmin, equipoTorneoController.actualizarEquipoTorneo);
// Eliminar equipo de torneo
router.delete('/eliminarEquipoTorneo/:id', verificarToken, verificarAdmin, equipoTorneoController.eliminarEquipoTorneo);
//cantidad de equipos en torneo
router.get('/cantidadEquiposTorneo/:id', verificarToken, equipoTorneoController.obtenerCantidadEquiposTorneo);
module.exports = router;