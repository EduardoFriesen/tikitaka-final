const express = require('express');
const router = express.Router();
const partidoTorneoController = require('../controllers/partidoTorneoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear partido
router.post('/crearPartido', verificarToken, verificarAdmin, partidoTorneoController.crearPartido);
// Obtener partidos por fecha
router.get('/obtenerPartidosPorFecha/:id_fecha', verificarToken, partidoTorneoController.obtenerPartidosPorFecha);
// Obtener partidos por equipo
router.get('/obtenerPartidosPorEquipo/:id_equipo', verificarToken, partidoTorneoController.obtenerPartidosPorEquipo);
// Actualizar partido
router.put('/actualizarPartido/:id', verificarToken, verificarAdmin, partidoTorneoController.actualizarPartido);
// Obtener partidos de torneos por jugador
router.get('/obtenerPartidosDeTorneosPorJugador/:id_jugador', verificarToken, partidoTorneoController.obtenerPartidosDeTorneosPorJugador);
module.exports = router;