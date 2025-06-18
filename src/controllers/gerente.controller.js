//Frank
const model = require('../models/Gerente');

const index = async (req, res) => {
  const estado = req.query.estado || 'activo';
  const gerentes = await model.getAll(estado);
  res.render('gerentes/index', { gerentes, estado });
};

const create = async (req, res) => {
  res.render('gerentes/create', { error: null });
};

const store = async (req, res) => {
  const { username, password, nombre, apellido, dni, telefono, email } = req.body;

  const trimmedDni = dni ? dni.trim() : '';
  const trimmedTelefono = telefono ? telefono.trim() : '';

  // Server-side validation
  if (trimmedDni && !/^\d{8}$/.test(trimmedDni)) {
    return res.render('gerentes/create', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body
    });
  }
  if (trimmedTelefono && !/^\d{9}$/.test(trimmedTelefono)) {
    return res.render('gerentes/create', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body
    });
  }

  try {
    const userId = await model.createUser(username, password);
    await model.createGerente({ userId, nombre, apellido, dni: trimmedDni, telefono: trimmedTelefono, email }); // Use trimmed versions
    res.redirect('/gerentes');
  } catch (error) {
    console.error("Error al crear gerente:", error);
    res.status(500).render('gerentes/create', { error: 'Error al registrar gerente', formData: req.body });
  }
};

const show = async (req, res) => {
  const gerente = await model.getById(req.params.id);
  if (!gerente) return res.status(404).send("No encontrado");
  res.render('gerentes/show', { gerente });
};

const edit = async (req, res) => {
  const gerente = await model.getById(req.params.id);
  if (!gerente) return res.status(404).send("No encontrado");
  res.render('gerentes/edit', { gerente });
};

const update = async (req, res) => {
  const { nombre, apellido, dni, telefono, email } = req.body;
  const gerenteId = req.params.id;

  const trimmedDni = dni ? dni.trim() : '';
  const trimmedTelefono = telefono ? telefono.trim() : '';

  // Server-side validation
  if (trimmedDni && !/^\d{8}$/.test(trimmedDni)) {
    const gerente = await model.getById(gerenteId);
    return res.render('gerentes/edit', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body,
      gerente: gerente
    });
  }
  if (trimmedTelefono && !/^\d{9}$/.test(trimmedTelefono)) {
    const gerente = await model.getById(gerenteId);
    return res.render('gerentes/edit', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body,
      gerente: gerente
    });
  }

  await model.updateGerente(gerenteId, { nombre, apellido, dni: trimmedDni, telefono: trimmedTelefono, email }); // Use trimmed versions
  res.redirect('/gerentes');
};

const changeEstado = async (req, res) => {
  await model.changeEstado(req.params.id, req.body.estado);
  res.redirect('/gerentes');
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
