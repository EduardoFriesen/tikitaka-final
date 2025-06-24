const jugadorServices = require('../services/jugadorServices');

const jugadorController = {
    // Crear jugador
    ficharJugador: async (req, res) => {
        try {
            const id_equipo = req.params.id;
            const { username, camiseta } = req.body;
            console.log('controller: '+ username, camiseta);
            const jugador = await jugadorServices.ficharJugadorPorUsername({ username, id_equipo, camiseta });
            res.send({ success: true, jugador });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    obtenerJugadoresPorEquipo: async (req, res) => {
        try {
            const id_equipo = req.params.id;
            const jugadores = await jugadorServices.obtenerJugadoresPorEquipo(id_equipo);
            res.send({ success: true, jugadores });
         } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener jugador por ID
    obtenerJugadorPorId: async (req, res) => {
        try {
            const id = req.params.id;
            const jugador = await jugadorServices.obtenerJugadorPorId(id);
            res.send({ success: true, jugador });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Actualizar jugador
    actualizarJugador: async (req, res) => {
        try {
            const id = req.params.id;
            const { id_equipo, camiseta } = req.body;
            const jugador = await jugadorServices.actualizarJugador(id, { id_equipo, camiseta });
            res.send({ success: true, jugador });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Eliminar jugador
    eliminarJugador: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await jugadorServices.eliminarJugador(id);
            res.send({ success: true, message: result.message });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },
    obtenerEquipoUsuario: async (req, res) => {
     try {
    const idUsuario = req.user.id; // o req.params.id, según cómo lo llames
    console.log('controller idUsuario: '+idUsuario);
    const idEquipo = await jugadorServices.obtenerEquipoUsuario(idUsuario);

    if (!idEquipo) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró equipo en torneo activo para este usuario'
      });
    }

    return res.json({ success: true, id_equipo: idEquipo });
  } catch (error) {
    console.error('Error en obtenerEquipoUsuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}
};
module.exports = jugadorController;