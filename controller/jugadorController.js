const jugadorServices = require('../services/jugadorServices');

const jugadorController = {
    // Crear jugador
    crearJugador: async (req, res) => {
        try {
            const { id_usuario, id_equipo, camiseta } = req.body;
            const jugador = await jugadorServices.crearJugador({ id_usuario, id_equipo, camiseta });
            res.send({ success: true, jugador });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener todos los jugadores
    obtenerJugadores: async (req, res) => {
        try {
            const jugadores = await jugadorServices.obtenerJugadores();
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