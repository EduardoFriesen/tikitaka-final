const { Equipo } = require('../models');
const equipoServices = {
  crearEquipo: async ({ nombre }) => {
    const equipo = await Equipo.create({ nombre });
    return equipo;
  },

  obtenerEquipos: async () => {
    return await Equipo.findAll();
  },

  obtenerEquipoPorId: async (id) => {
    const equipo = await Equipo.findByPk(id);
    if (!equipo) throw new Error('Equipo no encontrado');
    return equipo;
  },

  actualizarEquipo: async (id, { nombre }) => {
    const equipo = await Equipo.findByPk(id);
    if (!equipo) throw new Error('Equipo no encontrado');
    equipo.nombre = nombre;
    await equipo.save();
    return equipo;
  },

  eliminarEquipo: async (id) => {
    const equipo = await Equipo.findByPk(id);
    if (!equipo) throw new Error('Equipo no encontrado');
    await equipo.destroy();
    return { message: 'Equipo eliminado' };
  }
};
module.exports = equipoServices;