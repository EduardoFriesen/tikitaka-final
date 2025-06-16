const express = require('express');
const router = express.Router();
const partidoController = require('../controller/partidoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');

// Crear partido (usuario común)
router.post('/crear', verificarToken, partidoController.crearPartido);

// Crear partido (admin)
router.post('/crearAdmin', verificarToken, verificarAdmin, partidoController.crearPartidoAdmin);

// Obtener partidos ajenos (no soy owner ni fichado)
router.get('/ajenos', verificarToken, partidoController.partidosAjenos);

// Obtener partidos propios (donde estoy fichado)
router.get('/propios', verificarToken, partidoController.partidosPropios);

// Obtener todos los partidos futuros (solo admin)
router.get('/partidos', verificarToken, verificarAdmin, partidoController.partidosAdmin);

// Obtener username del owner de un partido
router.get('/owner/:id', partidoController.getOwnerUsername);

// Modificar partido
router.post('/modificar', verificarToken, partidoController.modificarPartido);

// Eliminar partido (owner o admin)
router.post('/eliminar', verificarToken, partidoController.eliminarPartido);

// Confirmar partido (asignar cancha, solo admin)
router.post('/confirmar', verificarToken, verificarAdmin, partidoController.confirmarPartido);

//Cantidad de Partidos Activos (solo admin)
router.get('/cantPartidos', verificarToken, verificarAdmin, partidoController.cantPartidos);

module.exports = router;