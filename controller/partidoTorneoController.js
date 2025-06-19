const partidoTorneoServices = require('../services/partidoTorneoServices');
const partidoTorneoController = {

    // Crear partido
    crearPartido: async (req, res) => {
        try {
            const { id_fecha, equipo_local, equipo_visitante} = req.body;
            const partido = await partidoTorneoServices.crearPartido({ id_fecha, equipo_local, equipo_visitante});
            res.send({ success: true, partido });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener partidos por fecha
    obtenerPartidosPorFecha: async (req, res) => {
        try {
            const id_fecha = req.params.id_fecha;
            const partidos = await partidoTorneoServices.obtenerPartidosPorFecha(id_fecha);
            res.send({ success: true, partidos });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener partidos por equipo
    obtenerPartidosPorEquipo: async (req, res) => {
        try {
            const id_equipo = req.params.id_equipo;
            const partidos = await partidoTorneoServices.obtenerPartidosPorEquipo(id_equipo);
            res.send({ success: true, partidos });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Actualizar partido
    actualizarPartido: async (req, res) => {
        try {
            const id = req.params.id;
            const { goles_local, goles_visitante } = req.body;
            const partido = await partidoTorneoServices.actualizarPartido(id, { goles_local, goles_visitante });
            res.send({ success: true, partido });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener partidos de torneos por jugador
    obtenerPartidosDeTorneosPorJugador: async (req, res) => {
        try {
            const id_jugador = req.params.id_jugador;
            const partidos = await partidoTorneoServices.obtenerPartidosDeTorneosPorJugador(id_jugador);
            res.send({ success: true, partidos });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    }
};
module.exports = partidoTorneoController;