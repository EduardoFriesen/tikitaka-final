const express = require('express');
const router = express.Router();
const partidoTorneoController = require('../controller/partidoTorneoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear partido
router.post('/crearPartido', verificarToken, verificarAdmin, partidoTorneoController.crearPartido);
// Obtener partidos por fecha
router.get('/obtenerPartidos/:id_torneo', verificarToken, partidoTorneoController.obtenerPartidos);
// Obtener partidos por equipo
router.get('/obtenerPartidosPorEquipo/:id_equipo', verificarToken, partidoTorneoController.obtenerPartidosPorEquipo);
// Actualizar partido
router.put('/actualizarPartido/:id_torneo', verificarToken, verificarAdmin, partidoTorneoController.actualizarPartido);
// Configurar Fecha
router.put('/confFecha/:id_torneo', verificarToken, verificarAdmin, partidoTorneoController.confFecha);
// Obtener partidos de torneos por jugador
router.get('/obtenerPartidosDeTorneosPorJugador/:id_jugador', verificarToken, partidoTorneoController.obtenerPartidosDeTorneosPorJugador);
// Clasificar 
router.put('/clasificado', verificarToken, verificarAdmin, partidoTorneoController.clasificado)
module.exports = router;