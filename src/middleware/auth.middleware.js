
function requireLogin(req, res, next) {
  
  if (req.path.startsWith('/sesion')) return next();

  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect('/sesion');
}

module.exports = requireLogin;
