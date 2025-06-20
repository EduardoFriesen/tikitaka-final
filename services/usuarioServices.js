const { Usuario, Jugador, Equipo, EquipoTorneo, Torneo } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secretKey';
const JWT_EXPIRES_IN = '2h';
const { Op } = require('sequelize');

const usuarioServices = {
  // Login de usuario
  logUser: async (username, password) => {
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) throw new Error('Usuario o contraseña incorrectos');
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) throw new Error('Usuario o contraseña incorrectos');
    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, admin: !!usuario.admin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return { usuario, token };
  },

  // Registro de usuario
  registerUser: async ({ username, name, lastname, email, birthdate, password, repPassword , admin}) => {
    if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres');
    if (password !== repPassword) throw new Error('Las contraseñas no coinciden');
    const existe = await Usuario.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });
    if (existe) throw new Error('El usuario o email ya están en uso');
    const hashedPassword = await bcrypt.hash(password, 10);
    await Usuario.create({ username, name, lastname, email, birthdate, password: hashedPassword , admin: admin ? true : false });
    return true;
  },

  // Mostrar datos de usuario
  getUserById: async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    console.log('Datos del usuario:', usuario);
    return usuario;

  },

  // Modificar usuario (por el propio usuario)
  modUser: async ({ id, username, password, newPassword }) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) throw new Error('Contraseña actual incorrecta');
    let hashedPassword = usuario.password;
    if (newPassword && newPassword.length >= 8) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }
    usuario.username = username;
    usuario.password = hashedPassword;
    await usuario.save();
    return usuario;
  },

  // Modificar usuario (por admin)
  modUserAdmin: async ({ username, name, lastname, birthdate, email , admin }) => {
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) throw new Error('Usuario no encontrado');
    usuario.name = name;
    usuario.lastname = lastname;
    usuario.birthdate = birthdate;
    usuario.email = email;
    usuario.admin = admin ? true : false; // Convertir a booleano
    await usuario.save();
    return usuario;
  },

  // Eliminar usuario (por admin)
  eliminarUser: async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new Error('Usuario no encontrado');
    await usuario.destroy();
    return true;
  },

  // Listar todos los usuarios (admin)
  getAllUsers: async () => {
    return await Usuario.findAll();
  },

  // Contar usuarios (sin admin)
  countUsers: async () => {
    cantidad = await Usuario.count({ where: { admin: { [Op.not]: true } } });
    return cantidad;
  },

  obtenerTorneosDeUsuario : async (id_usuario) => {
  const usuario = await Usuario.findByPk(id_usuario, {
    include: {
      model: Jugador,
      as: 'Jugadores',
      include: {
        model: Equipo,
        as: 'Equipo',
        include: {
          model: EquipoTorneo,
          as: 'EquipoTorneos',
          include: {
            model: Torneo,
            as: 'Torneo'
          }
        }
      }
    }
  });

  if (!usuario) throw new Error('Usuario no encontrado');

  const torneos = [];

  for (const jugador of usuario.Jugadores) {
    const equipo = jugador.Equipo;
    if (!equipo?.EquipoTorneos) continue;

    for (const equipoTorneo of equipo.EquipoTorneos) {
      const torneo = equipoTorneo.Torneo;
      if (!torneo) continue;

      // Buscamos el campeón del torneo (otro equipo)
      const equipoCampeon = await EquipoTorneo.findOne({
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

      const nombreCampeon = equipoCampeon?.Equipo?.nombre || null;

      // Evitar duplicados
      if (!torneos.find(t => t.id === torneo.id)) {
        torneos.push({
          id: torneo.id,
          nombre: torneo.nombre,
          fecha_inicio: torneo.fecha_inicio,
          fecha_fin: torneo.fecha_fin,
          campeon: nombreCampeon
        });
      }
    }
  }

  return torneos;
},

    obtenerIdTorneo: async (id_usuario) => {
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
                    where: { finalizado: false },
                    attributes: ['id', 'nombre', 'fecha_inicio', 'fecha_fin']
                }
            }
        }
    });

    for (const jugador of jugadores) {
        const equipo = jugador.Equipo;
        if (equipo?.EquiposTorneos?.length) {
            for (const et of equipo.EquiposTorneos) {
                if (et.Torneo) {
                    return et.Torneo;
                }
            }
        }
    }

    return null;
  },
};

module.exports = usuarioServices;