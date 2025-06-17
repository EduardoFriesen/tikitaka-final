const { EquipoTorneo, Equipo, Torneo } = require('../models');
const equipoTorneoServices = {
    // Crear equipo en torneo
    crearEquipoTorneo: async ({ id_equipo, id_torneo }) => {
        const equipoTorneo = await EquipoTorneo.create({ id_equipo, id_torneo });
        return equipoTorneo;
    },

    // Obtener todos los equipos en un torneo
    obtenerEquiposTorneo: async (id_torneo) => {
        return await EquipoTorneo.findAll({
            where: { id_torneo },
            include: [
                { model: Equipo, as: 'Equipo' },
                { model: Torneo, as: 'Torneo' }
            ]
        });
    },

    // Obtener equipos por ID de torneo
    obtenerEquiposPorIdTorneo: async (id_torneo) => {
        const equipos = await EquipoTorneo.findAll({
            where: { id_torneo },
            include: [{ model: Equipo, as: 'Equipo' }]
        });
        if (!equipos.length) throw new Error('No se encontraron equipos para este torneo');
        return equipos;
    },

    // Actualizar equipo en torneo
    actualizarEquipoTorneo: async (id, { id_equipo, id_torneo }) => {
        const equipoTorneo = await EquipoTorneo.findByPk(id);
        if (!equipoTorneo) throw new Error('Equipo en torneo no encontrado');
        equipoTorneo.id_equipo = id_equipo;
        equipoTorneo.id_torneo = id_torneo;
        await equipoTorneo.save();
        return equipoTorneo;
    },

    // Eliminar equipo de torneo
    eliminarEquipoTorneo: async (id) => {
        const equipoTorneo = await EquipoTorneo.findByPk(id);
        if (!equipoTorneo) throw new Error('Equipo en torneo no encontrado');
        await equipoTorneo.destroy();
        return { message: 'Equipo eliminado del torneo' };
    }
};
module.exports = equipoTorneoServices;