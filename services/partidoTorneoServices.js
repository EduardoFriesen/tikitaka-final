const { EquipoTorneo, Jugador, Equipo, Torneo, partidoTorneo, sequelize } = require('../models');
const { Op } = require('sequelize');

const partidoTorneoServices = {
    // Crear partido
    crearPartido: async ({ id_torneo, fecha, equipo_local, equipo_visitante, nroFecha }) => {
    // Buscar equipos por nombre
    const equipo1 = await Equipo.findOne({ where: { nombre: equipo_local } });
    if (!equipo1) throw new Error('Equipo local no encontrado');

    const equipo2 = await Equipo.findOne({ where: { nombre: equipo_visitante } });
    if (!equipo2) throw new Error('Equipo visitante no encontrado');

    // Validar que no sea el mismo equipo
    if (equipo1.id === equipo2.id) {
        throw new Error('Un equipo no puede jugar contra sí mismo');
    }

    // Buscar equipos inscritos en el torneo (EquipoTorneo)
    const equipoTorneo1 = await EquipoTorneo.findOne({ where: { id_equipo: equipo1.id, id_torneo } });
    if (!equipoTorneo1) throw new Error('Equipo local no participa en este torneo');

    const equipoTorneo2 = await EquipoTorneo.findOne({ where: { id_equipo: equipo2.id, id_torneo } });
    if (!equipoTorneo2) throw new Error('Equipo visitante no participa en este torneo');

    // Verificar si alguno de los equipos ya está en algún partido del torneo
    const conflicto = await partidoTorneo.findOne({
        where: {
            id_torneo,
            [Op.or]: [
                { id_equipo_1: equipoTorneo1.id },
                { id_equipo_2: equipoTorneo1.id },
                { id_equipo_1: equipoTorneo2.id },
                { id_equipo_2: equipoTorneo2.id },
            ]
        }
    });

    if (conflicto) {
        let equiposEnConflicto = [];

        if ([conflicto.id_equipo_1, conflicto.id_equipo_2].includes(equipoTorneo1.id)) {
            equiposEnConflicto.push(equipo_local);
        }
        if ([conflicto.id_equipo_1, conflicto.id_equipo_2].includes(equipoTorneo2.id)) {
            equiposEnConflicto.push(equipo_visitante);
        }

        throw new Error(`El equipo ${equiposEnConflicto.join(' y ')} ya está inscrito en el torneo`);
    }

    // Crear el partido
    const partido = await partidoTorneo.create({
        id_torneo,
        fecha,
        id_equipo_1: equipoTorneo1.id,
        id_equipo_2: equipoTorneo2.id,
        nroFecha,
    });

    return partido;
},

    clasificado: async({id_torneo, id_equipo_1, id_equipo_2, nroFecha}) => {
    try {
        const partido = await partidoTorneo.findOne({
            where: {
            id_torneo,
            nroFecha
        }
        });
        if (partido) {
            // Si ya existe → actualizar
            await partido.update({
                id_equipo_1,
                id_equipo_2
            });
        return partido;
        } else {
        // Si no existe → crear
            const partido = await partidoTorneo.create({
            id_torneo,
            nroFecha,
            id_equipo_1,
            id_equipo_2,
          });
          return partido;
        }
    } catch (error) {
        console.error('Error en upsert de partido:', error);
        throw error;
    }
},

    // Obtener partidos por fecha
   obtenerPartidos: async (id_torneo) => {
    return await partidoTorneo.findAll({
        where: { id_torneo },
        include: [
            { model: Torneo, as: 'Torneo' },
            { model: EquipoTorneo, as: 'Equipo_1' },
            { model: EquipoTorneo, as: 'Equipo_2' },
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
    actualizarPartido: async (id_torneo, { goles_1, goles_2, nroFecha}) => {
        console.log('service dice :'+goles_1, goles_2, id_torneo);
        const partido = await partidoTorneo.findOne({where : {id_torneo, nroFecha}});
        if (!partido) throw new Error('Partido no encontrado');
        partido.goles_1 = goles_1;
        partido.goles_2 = goles_2;
        await partido.save();
        return partido;
    },
    //configuro la Fecha
    confFecha: async (id_torneo, { fecha, nroFecha}) => {
        console.log('services:' + id_torneo, fecha, nroFecha);
        const partido = await partidoTorneo.findOne({where : {id_torneo, nroFecha}});
        if (!partido) throw new Error('Partido no encontrado');
        partido.fecha = fecha;
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
            ]
        });
    }

};
module.exports = partidoTorneoServices;