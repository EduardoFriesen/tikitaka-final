const { Usuario, Equipo, Jugador, EquipoTorneo, Torneo } = require('../models');
const jugadorServices = {
    // Crear jugador
    ficharJugadorPorUsername: async ({ username, id_equipo, camiseta }) => {
    console.log('services: ' + username, camiseta, id_equipo);

    const user = await Usuario.findOne({ where: { username } });

    if (!user) throw new Error('Usuario no encontrado');
    console.log(' se encontro el usuario' + user.id + user.username);
    // Verificar si ya fue fichado en algún torneo activo
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
    console.log('antes jugadores previos');
    
    
    if (jugadoresPrevios.length > 0) {
        throw new Error('El jugador ya está inscrito en un torneo activo');
    }
    console.log('paso jugadores previos');
    // Verificar si ya está fichado en el mismo equipo (aunque no esté en torneo activo)
    console.log('ficahado o no');
    const yaFichadoEnEseEquipo = await Jugador.findOne({
        where: {
            id_usuario: user.id,
            id_equipo
        }
    });
    if (yaFichadoEnEseEquipo) {
        throw new Error('El jugador ya está fichado en este equipo');
    }


    // Crear jugador
    console.log('Paso previo a crear el jugador');
    const nuevoJugador = await Jugador.create({
        id_usuario: user.id,
        id_equipo,
        camiseta
    });
    console.log('Jugador creado exitosamente:', nuevoJugador);
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