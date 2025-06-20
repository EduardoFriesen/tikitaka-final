const usuarioServices = require('../services/usuarioServices');

const usuarioController = {
  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await usuarioServices.logUser(username, password);
      res.send({
        success: true,
        message: 'Login exitoso',
        username: result.usuario.username,
        token: result.token,
        admin: !!result.usuario.admin
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message || 'Usuario o contraseña incorrectos'
      });
    }
  },

  // Registro
  register: async (req, res) => {
    try {
      await usuarioServices.registerUser(req.body);
      res.send({ success: true, message: 'Registro exitoso' });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  // Mostrar datos del usuario logueado
  getUserById: async (req, res) => {
    try {
      const userId = req.user.id;
      const usuario = await usuarioServices.getUserById(userId);
      res.send({ success: true, usuario });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  // Modificar usuario (por el propio usuario)
  modUser: async (req, res) => {
    try {
      const id = req.user.id;
      const { username, password, newPassword } = req.body;
      const usuario = await usuarioServices.modUser({ id, username, password, newPassword });
      res.send({ success: true, usuario });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  // Modificar usuario (por admin)
  modUserAdmin: async (req, res) => {
    try {
      const { username, name, lastname, birthdate, email, admin} = req.body;
      const usuario = await usuarioServices.modUserAdmin({ username, name, lastname, birthdate, email, admin });
      res.send({ success: true, usuario });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  // Eliminar usuario (por admin)
  eliminarUser: async (req, res) => {
    try {
      const { id } = req.body;
      await usuarioServices.eliminarUser(id);
      res.send({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  // Listar todos los usuarios (solo admin)
  getAllUsers: async (req, res) => {
    try {
      const usuarios = await usuarioServices.getAllUsers();
      res.send({ success: true, usuarios });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  // Contar usuarios (solo admin)
  countUsers: async (req, res) => {
    try {
      const cantidad = await usuarioServices.countUsers();
      res.send({ success: true, cantidad });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  obtenerTorneosDeUsuario: async (req, res) => {
    try {
      const id_usuario = req.params.id;
      const torneos = await usuarioServices.obtenerTorneosDeUsuario(id_usuario);
      res.send({success: true, torneos});
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },
  obtenerIdTorneo: async (req, res) => {
    try {
      const id_usuario = req.params.id;
      const torneo = await usuarioServices.obtenerTorneosDeUsuario(id_usuario);
      res.send({success: true, torneo});
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  },

  // Logout (opcional, solo para frontend)
  logout: (req, res) => {
    res.send({ success: true, message: 'Logout exitoso' });
  }
};

module.exports = usuarioController;