const { Torneo } = require('../models');
const torneoServices = {
    
    // Crear torneo
    crearTorneo: async ({ nombre, fecha_inicio, fecha_fin }) => {
        const torneo = await Torneo.create({ nombre, fecha_inicio, fecha_fin });
        return torneo;
    },

    // Obtener todos los torneos
    obtenerTorneos: async () => {
        return await Torneo.findAll({where: { finalizado: false }});
    },

    // Obtener torneo por ID
    obtenerTorneoPorId: async (id) => {
        const torneo = await Torneo.findByPk(id);
        if (!torneo) throw new Error('Torneo no encontrado');
        return torneo;
    },

    // Actualizar torneo
    actualizarTorneo: async (id, { nombre, fecha_inicio, fecha_fin }) => {
        const torneo = await Torneo.findByPk(id);
        if (!torneo) throw new Error('Torneo no encontrado');
        torneo.nombre = nombre;
        torneo.fecha_inicio = fecha_inicio;
        torneo.fecha_fin = fecha_fin;
        await torneo.save();
        return torneo;
    },

    // Eliminar torneo
    eliminarTorneo: async (id) => {
        const torneo = await Torneo.findByPk(id);
        if (!torneo) throw new Error('Torneo no encontrado');
        await torneo.destroy();
        return { message: 'Torneo eliminado' };
    },

    confirmarTorneo: async (id) => {
        const torneo = await Torneo.findByPk(id);
        if (!torneo) throw new Error('Torneo no encontrado');
        torneo.confirmado = true;
        await torneo.save();
        return torneo;
    },

    finalizarTorneo: async (id) => {
        const torneo = await Torneo.findByPk(id);
        if (!torneo) throw new Error('Torneo no encontrado');
        torneo.finalizado = true;
        await torneo.save();
        return torneo;
    }
};
module.exports = torneoServices;