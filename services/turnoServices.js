const { Turno, Partido, Usuario } = require('../models');

const turnoServices = {
  // Fichar a un usuario en un partido
  fichar: async ({ id_partido, id_jugador }) => {
    // Verifica si el usuario ya está fichado
    const yaFichado = await Turno.findOne({ where: { id_partido, id_jugador } });
    if (yaFichado) throw new Error('Ya estás fichado en este partido');

    // Verifica si hay cupo
    const partido = await Partido.findByPk(id_partido);
    if (!partido) throw new Error('Partido no encontrado');
    if (partido.jugadores <= 0) throw new Error('No hay cupos disponibles');

    // Resta un cupo y crea el turno
    partido.jugadores -= 1;
    await partido.save();
    await Turno.create({ id_partido, id_jugador, cancha: partido.cancha });
    return true;
  },

  // Salir de un partido
  salir: async ({ id_partido, id_jugador }) => {
    const turno = await Turno.findOne({ where: { id_partido, id_jugador } });
    if (!turno) throw new Error('No estás fichado en este partido');

    // Suma un cupo y elimina el turno
    const partido = await Partido.findByPk(id_partido);
    if (!partido) throw new Error('Partido no encontrado');
    partido.jugadores += 1;
    await partido.save();
    await turno.destroy();
    return true;
  },

  // Eliminar todos los turnos de un partido (por ejemplo, al eliminar el partido)
  eliminarTurnosPorPartido: async (id_partido) => {
    await Turno.destroy({ where: { id_partido } });
    return true;
  },

  // Consultar los turnos de un usuario
  turnosPorUsuario: async (id_jugador) => {
    return await Turno.findAll({
      where: { id_jugador },
      include: [{ model: Partido }]
    });
  },

  // Consultar los turnos de un partido
  turnosPorPartido: async (id_partido) => {
    return await Turno.findAll({
      where: { id_partido },
      include: [{ model: Usuario }]
    });
  }
};

module.exports = turnoServices;