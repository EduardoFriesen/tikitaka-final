const fechaServices = require('../services/fechasServices');

const fechaController = {
    // Crear fecha
    crearFecha: async (req, res) => {
        try {
            const { id_torneo, fecha } = req.body;
            const nuevaFecha = await fechaServices.crearFecha({ id_torneo, fecha });
            res.send({ success: true, nuevaFecha });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener todas las fechas
    obtenerFechas: async (req, res) => {
        try {
            const fechas = await fechaServices.obtenerFechas();
            res.send({ success: true, fechas });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Obtener fecha por ID
    obtenerFechaPorId: async (req, res) => {
        try {
            const id = req.params.id;
            const fecha = await fechaServices.obtenerFechaPorId(id);
            res.send({ success: true, fecha });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Actualizar fecha
    actualizarFecha: async (req, res) => {
        try {
            const id = req.params.id;
            const { id_torneo, fecha } = req.body;
            const updatedFecha = await fechaServices.actualizarFecha(id, { id_torneo, fecha });
            res.send({ success: true, updatedFecha });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    },

    // Eliminar fecha
    eliminarFecha: async (req, res) => {
        try {
            const id = req.params.id;
            const result = await fechaServices.eliminarFecha(id);
            res.send({ success: true, message: result.message });
        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    }
};