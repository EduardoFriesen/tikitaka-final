const { usuario, equipo } = require('../models');
const jugadorServices = {
    // Crear jugador
    crearJugador: async ({ id_usuario, id_equipo, camiseta }) => {
        const nuevoJugador = await usuario.create({ id_usuario, id_equipo, camiseta });
        return nuevoJugador;
    },

    // Obtener todos los jugadores
    obtenerJugadores: async () => {
        return await usuario.findAll({
            include: [{ model: equipo, as: 'equipo' }]
        });
    },

    // Obtener jugador por ID
    obtenerJugadorPorId: async (id) => {
        const jugador = await usuario.findByPk(id, {
            include: [{ model: equipo, as: 'equipo' }]
        });
        if (!jugador) throw new Error('Jugador no encontrado');
        return jugador;
    },

    // Actualizar jugador
    actualizarJugador: async (id, { id_equipo, camiseta }) => {
        const jugador = await usuario.findByPk(id);
        if (!jugador) throw new Error('Jugador no encontrado');
        jugador.id_equipo = id_equipo;
        jugador.camiseta = camiseta;
        await jugador.save();
        return jugador;
    },

    // Eliminar jugador
    eliminarJugador: async (id) => {
        const jugador = await usuario.findByPk(id);
        if (!jugador) throw new Error('Jugador no encontrado');
        await jugador.destroy();
        return { message: 'Jugador eliminado' };
    }
};