//Frank
const model = require('../models/Admin');

const index = async (req, res) => {
  const estado = req.query.estado || 'activo';
  const admins = await model.getAll(estado);
  res.render('admins/index', { admins, estado });
};

const create = async (req, res) => {
  res.render('admins/create', { error: null });
};

const store = async (req, res) => {
  const { username, password, nombre, apellido, dni, telefono, email } = req.body;

  const trimmedDni = dni ? dni.trim() : '';
  const trimmedTelefono = telefono ? telefono.trim() : '';

  // Server-side validation
  if (trimmedDni && !/^\d{8}$/.test(trimmedDni)) {
    return res.render('admins/create', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body
    });
  }
  if (trimmedTelefono && !/^\d{9}$/.test(trimmedTelefono)) {
    return res.render('admins/create', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body
    });
  }

  try {
    const userId = await model.createUser(username, password);
    await model.createAdmin({ userId, nombre, apellido, dni: trimmedDni, telefono: trimmedTelefono, email }); // Use trimmed versions
    res.redirect('/admins');
  } catch (error) {
    console.error("Error al crear admin:", error);
    res.status(500).render('admins/create', { error: 'Error al registrar administrador', formData: req.body });
  }
};

const show = async (req, res) => {
  const admin = await model.getById(req.params.id);
  if (!admin) return res.status(404).send("No encontrado");
  res.render('admins/show', { admin });
};

const edit = async (req, res) => {
  const admin = await model.getById(req.params.id);
  if (!admin) return res.status(404).send("No encontrado");
  res.render('admins/edit', { admin });
};

const update = async (req, res) => {
  const { nombre, apellido, dni, telefono, email } = req.body;
  const adminId = req.params.id;

  const trimmedDni = dni ? dni.trim() : '';
  const trimmedTelefono = telefono ? telefono.trim() : '';

  // Server-side validation
  if (trimmedDni && !/^\d{8}$/.test(trimmedDni)) {
    const admin = await model.getById(adminId); // Fetch admin data for re-rendering
    return res.render('admins/edit', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body,
      admin: admin
    });
  }
  if (trimmedTelefono && !/^\d{9}$/.test(trimmedTelefono)) {
    const admin = await model.getById(adminId); // Fetch admin data for re-rendering
    return res.render('admins/edit', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body,
      admin: admin
    });
  }

  await model.updateAdmin(adminId, { nombre, apellido, dni: trimmedDni, telefono: trimmedTelefono, email }); // Use trimmed versions
  res.redirect('/admins');
};

const changeEstado = async (req, res) => {
  await model.changeEstado(req.params.id, req.body.estado);
  res.redirect('/admins');
};

module.exports = {
  index,
  create,
  store,
  show,
  edit,
  update,
  changeEstado,
};
