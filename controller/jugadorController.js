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
    }
};
module.exports = jugadorController;