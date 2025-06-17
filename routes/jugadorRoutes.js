const express = require('express');
const router = express.Router();
const jugadorController = require('../controller/jugadorController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear jugador
router.post('/crearJugador', verificarToken, jugadorController.crearJugador);
// Obtener todos los jugadores
router.get('/obtenerJugadores', verificarToken, jugadorController.obtenerJugadores);
// Obtener jugador por ID
router.get('/obtenerJugador/:id', verificarToken, jugadorController.obtenerJugadorPorId);
// Actualizar jugador
router.put('/actualizarJugador/:id', verificarToken, jugadorController.actualizarJugador);
// Eliminar jugador
router.delete('/eliminarJugador/:id', verificarToken, jugadorController.eliminarJugador);
module.exports = router;