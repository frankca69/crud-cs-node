const SessionModel = require('../models/Session');

const index = (req, res) => {
  res.render('sessions/index');
};

const registerc = (req, res) => {
  res.render('sessions/registerc');
};

const storec = async (req, res) => {
  try {
    const { username, password, nombre, apellido, dni, telefono, email } = req.body;

    const existingUser = await SessionModel.findUserByUsername(username);
    if (existingUser) return res.send('Nombre de usuario ya existe');

    const dniExists = await SessionModel.isDniTaken(dni);
    if (dniExists) return res.send('DNI ya registrado');

    const userId = await SessionModel.createUser(username, password);
    await SessionModel.createCliente(userId, nombre, apellido, dni, telefono, email);

    res.redirect('/sessions');
  } catch (err) {
    console.error(err);
    res.send('Error al registrar. Intenta más tarde.');
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await SessionModel.validateUserCredentials(username, password);
    if (!user) {
      return res.send('Credenciales inválidas');
    }

    // Guardar datos mínimos en sesión
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    console.log('Usuario en sesión:', req.session.user);
    return res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.send('Error al iniciar sesión');
  }
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.send('Error al cerrar sesión');
    }
    res.redirect('/sessions');
  });
};


module.exports = {
  index,
  registerc,
  storec,
  login,
  logout,
};
