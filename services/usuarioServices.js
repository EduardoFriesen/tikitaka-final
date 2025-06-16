const { Usuario } = require('../models');
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
  }
};

module.exports = usuarioServices;