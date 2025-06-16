const partidoServices = require('../services/partidoServices');

const partidoController = {
  // Crear partido (usuario común)
  crearPartido: async (req, res) => {
    try {
      const { jugadores, fecha, hora, cancha } = req.body;
      console.log(req.hora);
      const owner = req.user.id;
      const partido = await partidoServices.crearPartido({ owner, jugadores, fecha, hora, cancha });
      res.send({ success: true, partido });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Crear partido (admin)
  crearPartidoAdmin: async (req, res) => {
    try {
      const { username, jugadores, fecha, hora, cancha } = req.body;
      const partido = await partidoServices.crearPartidoAdmin({ username, jugadores, fecha, hora, cancha });
      res.send({ success: true, partido });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Obtener partidos ajenos (no soy owner ni fichado)
  partidosAjenos: async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('req.user:', req.user);
      const partidos = await partidoServices.partidosAjenos(userId);
      res.send({ success: true, partidos });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Obtener partidos propios (donde estoy fichado)
  partidosPropios: async (req, res) => {
    try {
      const userId = req.user.id;
      const partidos = await partidoServices.partidosPropios(userId);
      res.send({ success: true, partidos });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Obtener todos los partidos futuros (solo admin)
  partidosAdmin: async (req, res) => {
    try {
      const partidos = await partidoServices.partidosAdmin();
      res.send({ success: true, partidos });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Obtener username del owner de un partido
  getOwnerUsername: async (req, res) => {
    try {
      const { id } = req.params;
      const username = await partidoServices.getOwnerUsername(id);
      res.send({ success: true, username });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Modificar partido
  modificarPartido: async (req, res) => {
    try {
      const { id_partido, fecha, hora, jugadores } = req.body;
      const partido = await partidoServices.modificarPartido({ id_partido, fecha, hora, jugadores });
      res.send({ success: true, partido });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Eliminar partido (owner o admin)
  eliminarPartido: async (req, res) => {
    try {
      const { id_partido } = req.body;
      const userId = req.user.id;
      const isAdmin = req.user.admin;
      await partidoServices.eliminarPartido(id_partido, userId, isAdmin);
      res.send({ success: true, message: 'Partido eliminado exitosamente' });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Confirmar partido (asignar cancha, solo admin)
  confirmarPartido: async (req, res) => {
    try {
      const { id_partido, cancha } = req.body;
      const partido = await partidoServices.confirmarPartido({ id_partido, cancha });
      res.send({ success: true, partido });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  cantPartidos: async (req, res) => {
    try {
      const cantidad = await partidoServices.cantPartidos();
      res.send({ success: true, cantidad });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
};

module.exports = partidoController;