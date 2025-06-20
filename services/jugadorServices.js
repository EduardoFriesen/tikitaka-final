const { Usuario, Equipo, Jugador } = require('../models');
const jugadorServices = {
    // Crear jugador
    ficharJugadorPorUsername: async ({ username, id_equipo, camiseta }) => {
    const user = await Usuario.findOne({ where: { username } });
    if (!user) throw new Error('Usuario no encontrado');

    // Buscar todos los equipos donde jugó
    const jugadoresPrevios = await Jugador.findAll({
        where: { id_usuario: user.id },
        include: {
            model: Equipo,
            as: 'Equipo',
            include: {
                model: EquipoTorneo,
                as: 'EquiposTorneos',
                include: {
                    model: Torneo,
                    as: 'Torneo',
                    where: { finalizado: false },
                    attributes: ['id', 'nombre']
                }
            }
        }
    });

    // Revisar si participa en algún torneo no finalizado
    for (const jugador of jugadoresPrevios) {
        const equipo = jugador.Equipo;
        if (equipo?.EquiposTorneos) {
            for (const et of equipo.EquiposTorneos) {
                if (et.Torneo) {
                    throw new Error(`El jugador ya está en el torneo "${et.Torneo.nombre}" que no ha finalizado.`);
                }
            }
        }
    }

    // Si no está en torneos activos, se crea el jugador
    const nuevoJugador = await Jugador.create({
        id_usuario: user.id,
        id_equipo,
        camiseta
    });

    return nuevoJugador;
},

    obtenerJugadoresPorEquipo: async (id_equipo) => {
        return await Jugador.findAll({
            where: { id_equipo },
            include: [
                { model: Usuario, as: 'Usuario' }
            ]
        });
    },

    // Obtener jugador por ID
    obtenerJugadorPorId: async (id) => {
        const jugador = await Jugador.findByPk(id, {
            include: [{ model: Equipo, as: 'Equipo' }]
        });
        if (!jugador) throw new Error('Jugador no encontrado');
        return jugador;
    },

    // Actualizar jugador
    actualizarJugador: async (id, { id_equipo, camiseta }) => {
        const jugador = await Jugador.findByPk(id);
        if (!jugador) throw new Error('Jugador no encontrado');
        jugador.id_equipo = id_equipo;
        jugador.camiseta = camiseta;
        await jugador.save();
        return jugador;
    },

    // Eliminar jugador
    eliminarJugador: async (id) => {
        const jugador = await Jugador.findByPk(id);
        if (!jugador) throw new Error('Jugador no encontrado');
        await jugador.destroy();
        return { message: 'Jugador eliminado' };
    }
};
module.exports = jugadorServices;