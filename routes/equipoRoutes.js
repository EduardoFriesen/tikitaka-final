const express = require('express');
const router = express.Router();
const equipoController = require('../controller/equipoController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');

// Crear equipo
router.post('/crearEquipo', verificarToken, verificarAdmin, equipoController.crearEquipo);
// Obtener todos los equipos
router.get('/obtenerEquipos', verificarToken, equipoController.obtenerEquipos);
// Obtener equipo por ID
router.get('/obtenerEquipo/:id', verificarToken, equipoController.obtenerEquipoPorId);
// Actualizar equipo        
router.put('/actualizarEquipo/:id', verificarToken, verificarAdmin, equipoController.actualizarEquipo);
// Eliminar equipo
router.delete('/eliminarEquipo/:id', verificarToken, verificarAdmin, equipoController.eliminarEquipo);



module.exports = router;