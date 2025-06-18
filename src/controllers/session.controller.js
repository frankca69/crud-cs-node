//Frank
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

    const clienteExistente = await SessionModel.findClienteByDni(dni);

    if (clienteExistente) {
      // Cliente existe por DNI, verificar si tiene user_id
      if (clienteExistente.user_id) {
        return res.send('Este DNI ya está registrado con una cuenta');
      }

      // Crear el nuevo usuario
      const userId = await SessionModel.createUser(username, password);

      // Asociar el user al cliente existente y actualizar datos
      await SessionModel.updateClienteWithUser(clienteExistente.id, userId, {
        nombre, apellido, telefono, email
      });

      return res.redirect('/sessions');
    }

    // Si no existe el cliente, crear usuario y cliente nuevo
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
