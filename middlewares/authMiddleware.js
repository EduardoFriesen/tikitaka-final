const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secretKey';
const JWT_EXPIRES_IN = '2h';

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera 'Bearer <token>'
  if (!token) return res.status(401).send({ success: false, message: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ success: false, message: 'Token inválido o expirado' });
    req.user = user; // user.id y user.username disponibles
    console.log('Authorization header:', req.headers['authorization']);
    next();
  });
}

module.exports = verificarToken;