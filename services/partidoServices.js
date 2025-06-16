const { Partido, Turno, Usuario } = require('../models'); // Ajusta según tu index.js de modelos
const { Op } = require('sequelize');

const partidoServices = {
  crearPartido: async ({ owner, jugadores, fecha, hora, cancha }) => {
    const partido = await Partido.create({ owner, jugadores, fecha, hora, cancha });
    // El owner se agrega automáticamente al turno
    await Turno.create({ id_partido: partido.id, id_jugador: owner, cancha });
    return partido;
  },

  crearPartidoAdmin: async ({ username, jugadores, fecha, hora, cancha }) => {
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) throw new Error('Usuario no encontrado');
    return await partidoServices.crearPartido({ owner: usuario.id, jugadores, fecha, hora, cancha });
  },

  partidosAjenos: async (userId) => {
    // Partidos donde el usuario NO es owner y NO está fichado, y la fecha es futura
    console.log('userId recibido:', userId);
    const partidos = await Partido.findAll({
      where: {
        owner: { [Op.ne]: userId },
        fecha: { [Op.gte]: new Date() }
      },
      include: [{
        model: Turno,
        where: { id_jugador: userId },
        required: false
      }]
    });
    // Filtra los partidos donde el usuario NO está fichado
    return partidos.filter(p => p.Turnos.length === 0);
  },

  partidosPropios: async (userId) => {
    // Partidos donde el usuario está fichado y la fecha es futura
    return await Partido.findAll({
      include: [{
        model: Turno,
        where: { id_jugador: userId }
      }],
      where: { fecha: { [Op.gte]: new Date() } }
    });
  },

  partidosAdmin: async () => {
    // Todos los partidos futuros
    return await Partido.findAll({
      where: { fecha: { [Op.gte]: new Date() } }
    });
  },

  getOwnerUsername: async (id_partido) => {
  const partido = await Partido.findByPk(id_partido, {
    include: [{ model: Usuario, as: 'Usuario', attributes: ['username'] }]
  });
  if (!partido || !partido.Usuario) throw new Error('Owner no encontrado');
  return partido.Usuario.username;
},

  eliminarPartido: async (id_partido, userId, isAdmin) => {
    const partido = await Partido.findByPk(id_partido);
    if (!partido) throw new Error('Partido no encontrado');
    if (partido.owner !== userId && !isAdmin) throw new Error('No tienes permiso para eliminar este partido');
    await Turno.destroy({ where: { id_partido } });
    await partido.destroy();
    return true;
  },

  modificarPartido: async ({ id_partido, fecha, hora, jugadores }) => {
    const partido = await Partido.findByPk(id_partido);
    if (!partido) throw new Error('Partido no encontrado');
    partido.fecha = fecha;
    partido.hora = hora;
    partido.jugadores = jugadores;
    await partido.save();
    return partido;
  },

  confirmarPartido: async ({ id_partido, cancha }) => {
    const partido = await Partido.findByPk(id_partido);
    if (!partido) throw new Error('Partido no encontrado');
    partido.cancha = cancha;
    await partido.save();
    return partido;
  },

  cantPartidos: async () => {
    // Contar partidos activos (futuros)
    const cantidad = await Partido.count({
      where: { fecha: { [Op.gte]: new Date() } }
    });
    console.log('Cantidad de partidos activos:', cantidad);
    return cantidad;
  }
};

module.exports = partidoServices;