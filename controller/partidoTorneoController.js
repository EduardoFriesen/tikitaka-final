const partidoTorneoServices = require('../services/partidoTorneoServices');
const partidoTorneoController = {

    // Crear partido
    crearPartido: async (req, res) => {
        try {
            const { id_torneo ,fecha, equipo_local, equipo_visitante, nroFecha} = req.body;
            const partido = await partidoTorneoServices.crearPartido({ id_torneo, fecha, equipo_local, equipo_visitante, nroFecha});
            res.send({ success: true, partido });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener partidos por fecha
    obtenerPartidos: async (req, res) => {
        try {
            const id_torneo = req.params.id_torneo;
            const partidos = await partidoTorneoServices.obtenerPartidos(id_torneo);
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
            const id_torneo = req.params.id_torneo;
            const { goles_1, goles_2, nroFecha } = req.body;
            console.log('controller dice :'+goles_1, goles_2, id_torneo);
            const partido = await partidoTorneoServices.actualizarPartido(id_torneo, { goles_1, goles_2, nroFecha});
            res.send({ success: true, partido });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },
    clasificado: async (req, res) => {
        try {
            const { id_torneo, id_equipo_1, id_equipo_2, nroFecha: nroFecha} = req.body;
            const partido = await partidoTorneoServices.clasificado({id_torneo, id_equipo_1, id_equipo_2, nroFecha: nroFecha});
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
    },

    confFecha: async (req, res) => {
        try {
            const id_torneo = req.params.id_torneo;
            const { fecha, nroFecha } = req.body;
            console.log('controller:' + id_torneo, fecha, nroFecha);
            const partido = await partidoTorneoServices.confFecha(id_torneo, { fecha, nroFecha});
            res.send({ success: true, partido });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },
};
module.exports = partidoTorneoController;