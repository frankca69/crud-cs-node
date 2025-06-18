//Frank
const model = require("../models/Cliente")

const create = (req, res) => {
    res.render('clientes/create');
};

const store = async (req, res) => {
  const { nombre, apellido, dni, telefono, correo } = req.body;

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
  // Check if original dni was provided and if cleaned version has 8 digits
  if (!processedDni || processedDni.length !== 8) {
    return res.render('clientes/create', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body
    });
  }

  // Telefono Validation (Optional, but if provided, must be valid)
  if (processedTelefono && processedTelefono.length !== 9) {
    return res.render('clientes/create', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body
    });
  }

  try {
    const dniExiste = await model.existsDNI(processedDni); // Use processedDni

    if (dniExiste) {
      return res.render("clientes/create", {
        error: "El DNI ya está registrado.",
        formData: req.body
      });
    }

    await model.store({ nombre, apellido, dni: processedDni, telefono: processedTelefono, correo });
    res.redirect("/clientes");
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    res.status(500).render("clientes/create", { error: "Error al guardar cliente", formData: req.body });
  }
};

 
const index = async (req, res) => {
    try {
        const clientes = await model.getAll();
        res.render("clientes/index", { clientes });
    } catch (error) {
        res.status(500).send("Error al cargar clientes");
    }
};

const show = async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await model.getById(id);
        if (!cliente) return res.status(404).send("Cliente no encontrado");
        res.render("clientes/show", { cliente });
    } catch (error) {
        res.status(500).send("Error al cargar cliente");
    }
};


const edit = async (req, res) => {
  const { id } = req.params;

  try {
    const cliente = await model.getById(id);
    if (!cliente) {
      return res.status(404).send("Cliente no encontrado");
    }

    res.render("clientes/edit", { cliente });
  } catch (error) {
    console.error("Error al cargar cliente:", error);
    res.status(500).send("Error al cargar cliente");
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni, telefono, correo } = req.body;

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
    const cliente = await model.getById(id); // Fetch for re-rendering
    return res.render('clientes/edit', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body,
      cliente: cliente
    });
  }

  // Telefono Validation (Optional, but if provided, must be valid)
  if (processedTelefono && processedTelefono.length !== 9) {
    const cliente = await model.getById(id); // Fetch for re-rendering
    return res.render('clientes/edit', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body,
      cliente: cliente
    });
  }

  try {
    // Potentially check DNI uniqueness again if it can be changed and needs to be unique
    // For now, focusing on format validation as per previous structure.
    await model.updateCliente(id, { nombre, apellido, dni: processedDni, telefono: processedTelefono, correo });
    res.redirect("/clientes");
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    const cliente = await model.getById(id);
    res.status(500).render("clientes/edit", { error: "Error al actualizar cliente", formData: req.body, cliente: cliente });
  }
};

const destroy = async (req, res) => {
  const { id } = req.params;

  try {
    await model.softDelete(id); // 👈 ahora llama al softDelete
    res.redirect("/clientes");
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).send("Error al eliminar cliente");
  }
};

module.exports = {
 index,
 show,
 create,
 store,
 edit,
 update,
 destroy,
};