const express = require('express');
const router = express.Router();
const turnoController = require('../controller/turnoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');

// Fichar a un usuario en un partido
router.post('/fichar', verificarToken, turnoController.fichar);

// Salir de un partido
router.post('/salir', verificarToken, turnoController.salir);

// Obtener los turnos de un usuario
router.get('/usuario/:id_jugador', verificarToken, turnoController.turnosPorUsuario);

// Obtener los turnos de un partido
router.get('/partido/:id_partido', verificarToken, turnoController.turnosPorPartido);

// Eliminar todos los turnos de un partido (solo admin)
router.delete('/eliminarPorPartido/:id_partido', verificarToken, verificarAdmin, turnoController.eliminarTurnosPorPartido);

module.exports = router;