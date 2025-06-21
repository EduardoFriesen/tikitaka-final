const { Torneo, partidoTorneo, EquipoTorneo, Equipo, Jugador } = require('../models');
const { Op } = require('sequelize');
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

    cargarFinalizados: async () => {
  const torneos = await Torneo.findAll({
    where: { finalizado: true },
    include: {
      model: EquipoTorneo,
      as: 'EquiposTorneos',
      where: { campeon: true },  // 🔥 solo los que son campeones
      required: true,            // ✅ solo torneos con campeón
      include: {
        model: Equipo,
        as: 'Equipo',
        attributes: ['nombre']
      }
    }
  });

  return torneos.map(torneo => ({
    id: torneo.id,
    nombre: torneo.nombre,
    fecha_inicio: torneo.fecha_inicio,
    fecha_fin: torneo.fecha_fin,
    campeon: torneo.EquiposTorneos[0]?.Equipo?.nombre // ya no hace falta `|| null`, porque si no hay, no entra
  }));
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

        // Buscar los equipos del torneo
        const equipos = await EquipoTorneo.findAll({ where: { id_torneo: id } });
        const idsEquipos = equipos.map(e => e.id);

        // Eliminar todos los partidos donde participen esos equipos
        await partidoTorneo.destroy({
            where: {
                [Op.or]: [
                { id_torneo: id },
                { id_equipo_1: { [Op.in]: idsEquipos } },
                { id_equipo_2: { [Op.in]: idsEquipos } }
                ]
            }
        });

  // Eliminar los equipos del torneo
  await EquipoTorneo.destroy({ where: { id_torneo: id } });

  // Eliminar el torneo
  await Torneo.destroy({ where: { id } });

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
    },

    Historial: async (id_usuario) => {
  console.log('id usuario: ' + id_usuario);

  // Buscar todos los torneos finalizados donde el usuario jugó
  const jugadores = await Jugador.findAll({
    where: { id_usuario },
    include: {
      model: Equipo,
      as: 'Equipo',
      include: {
        model: EquipoTorneo,
        as: 'EquiposTorneos',
        include: {
          model: Torneo,
          as: 'Torneo',
          where: { finalizado: true },
          attributes: ['id', 'nombre', 'fecha_inicio', 'fecha_fin']
        }
      }
    }
  });

  const torneosUnicos = new Map();

  for (const jugador of jugadores) {
    const equipo = jugador.Equipo;
    if (!equipo?.EquiposTorneos?.length) continue;

    for (const et of equipo.EquiposTorneos) {
      const torneo = et.Torneo;
      if (!torneo || torneosUnicos.has(torneo.id)) continue;

      // 🔥 Buscamos el campeón del torneo (igual que en `cargarFinalizados`)
      const campeonEntry = await EquipoTorneo.findOne({
        where: {
          id_torneo: torneo.id,
          campeon: true
        },
        include: {
          model: Equipo,
          as: 'Equipo',
          attributes: ['nombre']
        }
      });

      const nombreCampeon = campeonEntry?.Equipo?.nombre || 'Sin definir';

      torneosUnicos.set(torneo.id, {
        id: torneo.id,
        nombre: torneo.nombre,
        fecha_inicio: torneo.fecha_inicio,
        fecha_fin: torneo.fecha_fin,
        campeon: nombreCampeon
      });
    }
  }

  return Array.from(torneosUnicos.values());
}

};
module.exports = torneoServices;