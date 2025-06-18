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

  // Process DNI
  let processedDni = dni ? String(dni).trim() : '';
  if (processedDni) {
    processedDni = processedDni.replace(/\D/g, '');
  }

  // Process Telefono
  let processedTelefono = telefono ? String(telefono).trim() : '';
  if (processedTelefono) {
    processedTelefono = processedTelefono.replace(/\D/g, '');
  }

  // DNI Validation (Assuming DNI is mandatory)
  if (!processedDni || processedDni.length !== 8) {
    return res.render('gerentes/create', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body
    });
  }

  // Telefono Validation (Optional, but if provided, must be valid)
  if (processedTelefono && processedTelefono.length !== 9) {
    return res.render('gerentes/create', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body
    });
  }

  try {
    const userId = await model.createUser(username, password);
    await model.createGerente({ userId, nombre, apellido, dni: processedDni, telefono: processedTelefono, email });
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

  // Process DNI
  let processedDni = dni ? String(dni).trim() : '';
  if (processedDni) {
    processedDni = processedDni.replace(/\D/g, '');
  }

  // Process Telefono
  let processedTelefono = telefono ? String(telefono).trim() : '';
  if (processedTelefono) {
    processedTelefono = processedTelefono.replace(/\D/g, '');
  }

  // DNI Validation (Assuming DNI is mandatory)
  if (!processedDni || processedDni.length !== 8) {
    const gerente = await model.getById(gerenteId);
    return res.render('gerentes/edit', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body,
      gerente: gerente
    });
  }

  // Telefono Validation (Optional, but if provided, must be valid)
  if (processedTelefono && processedTelefono.length !== 9) {
    const gerente = await model.getById(gerenteId);
    return res.render('gerentes/edit', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body,
      gerente: gerente
    });
  }

  await model.updateGerente(gerenteId, { nombre, apellido, dni: processedDni, telefono: processedTelefono, email });
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
