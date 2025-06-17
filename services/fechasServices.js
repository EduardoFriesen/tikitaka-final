const { Fecha, Torneo } = require('../models');
const fechaServices = {
    // Crear fecha
    crearFecha: async ({ id_torneo, fecha }) => {
        const torneo = await Torneo.findByPk(id_torneo);
        if (!torneo) throw new Error('Torneo no encontrado');
        const nuevaFecha = await Fecha.create({ id_torneo, fecha });
        return nuevaFecha;
    },

    // Obtener todas las fechas
    obtenerFechas: async () => {
        return await Fecha.findAll();
    },

    // Obtener fecha por ID
    obtenerFechaPorId: async (id) => {
        const fecha = await Fecha.findByPk(id);
        if (!fecha) throw new Error('Fecha no encontrada');
        return fecha;
    },

    // Actualizar fecha
    actualizarFecha: async (id, { id_torneo, fecha }) => {
        const fechaExistente = await Fecha.findByPk(id);
        if (!fechaExistente) throw new Error('Fecha no encontrada');
        if (id_torneo) {
            const torneo = await Torneo.findByPk(id_torneo);
            if (!torneo) throw new Error('Torneo no encontrado');
            fechaExistente.id_torneo = id_torneo;
        }
        if (fecha) {
            fechaExistente.fecha = fecha;
        }
        await fechaExistente.save();
        return fechaExistente;
    },

    // Eliminar fecha
    eliminarFecha: async (id) => {
        const fecha = await Fecha.findByPk(id);
        if (!fecha) throw new Error('Fecha no encontrada');
        await fecha.destroy();
        return { message: 'Fecha eliminada' };
    }
};