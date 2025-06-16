const turnoServices = require('../services/turnoServices');

const turnoController = {
  // Fichar a un usuario en un partido
  fichar: async (req, res) => {
    try {
      const { id_partido } = req.body;
      const id_jugador = req.user.id;
      await turnoServices.fichar({ id_partido, id_jugador });
      res.send({ success: true, message: 'Fichaje exitoso' });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Salir de un partido
  salir: async (req, res) => {
    try {
      const { id_partido } = req.body;
      const id_jugador = req.user.id;
      await turnoServices.salir({ id_partido, id_jugador });
      res.send({ success: true, message: 'Has salido del partido exitosamente' });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Eliminar todos los turnos de un partido (solo admin)
  eliminarTurnosPorPartido: async (req, res) => {
    try {
      const { id_partido } = req.params;
      await turnoServices.eliminarTurnosPorPartido(id_partido);
      res.send({ success: true, message: 'Turnos eliminados exitosamente' });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Obtener los turnos de un usuario
  turnosPorUsuario: async (req, res) => {
    try {
      const { id_jugador } = req.params;
      const turnos = await turnoServices.turnosPorUsuario(id_jugador);
      res.send({ success: true, turnos });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  },

  // Obtener los turnos de un partido
  turnosPorPartido: async (req, res) => {
    try {
      const { id_partido } = req.params;
      const turnos = await turnoServices.turnosPorPartido(id_partido);
      res.send({ success: true, turnos });
    } catch (error) {
      res.status(400).send({ success: false, message: error.message });
    }
  }
};

module.exports = turnoController;