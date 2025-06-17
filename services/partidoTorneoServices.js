const { Fecha, EquipoTorneo, Jugador, Equipo, Torneo } = require('../models');
const partidoTorneoServices = {
    // Crear partido
    crearPartido: async ({ id_fecha, id_equipo_local, id_equipo_visitante, goles_local, goles_visitante }) => {
        const partido = await Fecha.create({
            id_fecha,
            id_equipo_1,
            id_equipo_2,
            goles_1,
            goles_2
        });
        return partido;
    },

    // Obtener partidos por fecha
    obtenerPartidosPorFecha: async (id_fecha) => {
        return await Fecha.findAll({
            where: { id_fecha },
            include: [
                { model: EquipoTorneo, as: 'Equipo_1' },
                { model: EquipoTorneo, as: 'Equipo_2' }
            ]
        });
    },
    obtenerPartidosPorEquipo: async (id_equipo) => {
        return await partido.findAll({
            where: {
                [Op.or]: [
                    { id_equipo_1: id_equipo },
                    { id_equipo_2: id_equipo }
                ]
            },
            include: [
                { model: EquipoTorneo, as: 'Equipo_1' },
                { model: EquipoTorneo, as: 'Equipo_2' }
            ]
        });
    },
    // Actualizar partido
    actualizarPartido: async (id, { goles_1, goles_2 }) => {
        const partido = await Fecha.findByPk(id);
        if (!partido) throw new Error('Partido no encontrado');
        partido.goles_1 = goles_1;
        partido.goles_2 = goles_2;
        await partido.save();
        return partido;
    },

    obtenerPartidosDeTorneosPorJugador: async (id_jugador) => {
        // 1. Buscar el jugador y su equipo
        const jugador = await Jugador.findByPk(id_jugador);
        if (!jugador) return [];

        // 2. Buscar los EquipoTorneo donde participa el equipo del jugador
        const equiposTorneo = await EquipoTorneo.findAll({
            where: { id_equipo: jugador.id_equipo }
        });
        const idsEquipoTorneo = equiposTorneo.map(et => et.id);

        // 3. Buscar los partidos donde el equipo participó como local o visitante
        const partidos = await partidoTorneo.findAll({
            where: {
                [Op.or]: [
                    { id_equipo_1: idsEquipoTorneo },
                    { id_equipo_2: idsEquipoTorneo }
                ]
            },
            include: [
                { model: EquipoTorneo, as: 'Equipo_1' },
                { model: EquipoTorneo, as: 'Equipo_2' },
                { 
                    model: Fecha, 
                    as: 'Fecha',
                    include: [
                        { model: Torneo, as: 'Torneo' }
                    ]
                }
            ]
        });
    }

};
module.exports = partidoTorneoServices;