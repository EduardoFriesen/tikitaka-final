const express = require('express');
const router = express.Router();
const jugadorController = require('../controller/jugadorController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Crear jugador
router.post('/fichar/:id', verificarToken, jugadorController.ficharJugador);
// Obtener todos los jugadores
router.get('/equipo/:id', verificarToken, jugadorController.obtenerJugadoresPorEquipo);
// Obtener jugador por ID
router.get('/obtenerJugador/:id', verificarToken, jugadorController.obtenerJugadorPorId);
// Actualizar jugador
router.put('/actualizarJugador/:id', verificarToken, jugadorController.actualizarJugador);
// Eliminar jugador
router.delete('/eliminarJugador/:id', verificarToken, jugadorController.eliminarJugador);

router.get('/obtenerEquipoUsuario', verificarToken, jugadorController.obtenerEquipoUsuario);
module.exports = router;