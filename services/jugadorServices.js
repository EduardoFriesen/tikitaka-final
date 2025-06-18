const { Usuario, Equipo, Jugador } = require('../models');
const jugadorServices = {
    // Crear jugador
    ficharJugadorPorUsername: async ({ username, id_equipo, camiseta }) => {
        const user = await Usuario.findOne({ where: { username } });
        if (!user) throw new Error('Usuario no encontrado');
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