function verificarAdmin(req, res, next) {
  if (req.user && req.user.admin) {
    next();
  } else {
    return res.status(403).send({ success: false, message: 'Solo el admin puede realizar esta acción' });
  }
}

module.exports = verificarAdmin;