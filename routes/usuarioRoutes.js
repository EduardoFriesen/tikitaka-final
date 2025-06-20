const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuarioController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/adminMiddleware');
// Login
router.post('/login', usuarioController.login);
// Registro
router.post('/register', usuarioController.register);

// Mostrar datos del usuario logueado
router.get('/mostrarUser', verificarToken, usuarioController.getUserById);

// Modificar usuario (por el propio usuario)
router.post('/modUser', verificarToken, usuarioController.modUser);

// Modificar usuario (por admin)
router.post('/modificarUserAdmin', verificarToken, verificarAdmin, usuarioController.modUserAdmin);

// Eliminar usuario (por admin)
router.post('/eliminarUser', verificarToken, verificarAdmin, usuarioController.eliminarUser);

// Listar todos los usuarios (solo admin)
router.get('/cargarUsers', verificarToken, verificarAdmin, usuarioController.getAllUsers);

// Contar usuarios (solo admin)
router.get('/cantUsuarios', verificarToken, verificarAdmin, usuarioController.countUsers);

//torneos Finalizados del usuario
router.get('/cargarTorneos/:id', verificarToken, usuarioController.obtenerTorneosDeUsuario);

router.get('/obtenerId/:id', verificarToken, usuarioController.obtenerIdTorneo);


// Logout (opcional, solo para frontend)
router.post('/logout', usuarioController.logout);

module.exports = router;