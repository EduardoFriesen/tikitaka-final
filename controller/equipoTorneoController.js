const equipoTorneoServices = require('../services/equipoTorneoServices');
const equipoTorneoController = {
    // Crear equipo en torneo
    crearEquipoTorneo: async (req, res) => {
        try {
            const { id_equipo, id_torneo } = req.body;
            const nuevoEquipoTorneo = await equipoTorneoServices.crearEquipoTorneo({ id_equipo, id_torneo });
            res.send({ success: true, nuevoEquipoTorneo });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener todos los equipos en un torneo
    obtenerEquiposTorneo: async (req, res) => {
        try {
            const id_torneo = req.params.id_torneo;
            const equipos = await equipoTorneoServices.obtenerEquiposTorneo(id_torneo);
            res.send({ success: true, equipos });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener equipos por ID de torneo
    obtenerEquiposPorIdTorneo: async (req, res) => {
        try {
            const id_torneo = req.params.id_torneo;
            const equipos = await equipoTorneoServices.obtenerEquiposPorIdTorneo(id_torneo);
            res.send({ success: true, equipos });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Actualizar equipo en torneo
    actualizarEquipoTorneo: async (req, res) => {
        try {
            const id = req.params.id;
            const { id_equipo, id_torneo } = req.body;
            const updatedEquipoTorneo = await equipoTorneoServices.actualizarEquipoTorneo(id, { id_equipo, id_torneo });
            res.send({ success: true, updatedEquipoTorneo });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Eliminar equipo de torneo
    eliminarEquipoTorneo: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await equipoTorneoServices.eliminarEquipoTorneo(id);
            res.send({ success: true, message: result.message });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    }
};

module.exports = equipoTorneoController;