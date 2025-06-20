const { EquipoTorneo, Equipo, Torneo } = require('../models');
const equipoTorneoServices = {
    // Crear equipo en torneo
    ingresarEquipoTorneoNombre: async ({ nombre, id_torneo }) => {
        const equipo = await Equipo.findOne({ where: { nombre } });
        if (!equipo) throw new Error('Equipo no encontrado');
        const nuevoEquipo = await EquipoTorneo.create({
            id_equipo: equipo.id,
            id_torneo
        });
        return nuevoEquipo;
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

    obtenerEquipo: async (id_equipo) => {
        return await EquipoTorneo.findOne({where : {id_equipo},
        include: [
            {model: Equipo, as: 'Equipo'}
        ]});
    },
    campeon: async (id_equipo) => {
        const equipoTorneo = await EquipoTorneo.findByPk(id_equipo);
        if (!equipoTorneo) throw new Error('Equipo en torneo no encontrado');
        equipoTorneo.campeon = true;
        await equipoTorneo.save();
        return equipoTorneo;
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
    },
    // Obtener cantidad de equipos en torneo
    obtenerCantidadEquipos: async (id_torneo) => {
        console.log('ID del torneo:', id_torneo); // Para depuración
        const cantidad = await EquipoTorneo.count({ where: { id_torneo } });
        console.log('Cantidad de equipos en torneo service:', cantidad); // Para depuración
        return cantidad;
    }
};
module.exports = equipoTorneoServices;