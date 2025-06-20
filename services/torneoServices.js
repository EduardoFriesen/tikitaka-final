const { Torneo, partidoTorneo, EquipoTorneo, Equipo } = require('../models');
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
  console.log('idUser Services:' + id_usuario);
  const [torneos] = await sequelize.query(`
    SELECT DISTINCT t.id, t.nombre, t.fecha_inicio, t.fecha_fin
    FROM torneos t
    JOIN equipos_torneos et ON t.id = et.id_torneo
    JOIN equipos e ON e.id = et.id_equipo
    JOIN jugadores j ON j.id_equipo = e.id
    WHERE j.id_usuario = :idUsuario AND t.finalizado = true
  `, {
    replacements: { idUsuario: id_usuario },
    type: sequelize.QueryTypes.SELECT
  });

  return torneos;
},
};
module.exports = torneoServices;