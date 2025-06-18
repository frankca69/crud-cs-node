//Frank
const model = require("../models/Cliente")

const create = (req, res) => {
    res.render('clientes/create');
};

const store = async (req, res) => {
  const { nombre, apellido, dni, telefono, correo } = req.body; // 'correo' instead of 'email'

  // Server-side validation for DNI and Telefono format
  if (dni && !/^\d{8}$/.test(dni)) {
    return res.render('clientes/create', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body
    });
  }
  // Assuming 'telefono' can be optional or empty. If not, the condition telefono.trim() !== '' might need adjustment.
  if (telefono && telefono.trim() !== '' && !/^\d{9}$/.test(telefono)) {
    return res.render('clientes/create', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body
    });
  }

  try {
    const dniExiste = await model.existsDNI(dni);

    if (dniExiste) {
      return res.render("clientes/create", {
        error: "El DNI ya está registrado.",
        formData: req.body // Pass formData here too
      });
    }

    await model.store({ nombre, apellido, dni, telefono, correo }); // Use 'correo'
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
  const { nombre, apellido, dni, telefono, correo } = req.body; // 'correo' instead of 'email'

  // Server-side validation for DNI and Telefono format
  if (dni && !/^\d{8}$/.test(dni)) {
    const cliente = await model.getById(id);
    return res.render('clientes/edit', {
      error: 'El DNI debe tener 8 dígitos numéricos.',
      formData: req.body,
      cliente: cliente
    });
  }
  if (telefono && telefono.trim() !== '' && !/^\d{9}$/.test(telefono)) {
    const cliente = await model.getById(id);
    return res.render('clientes/edit', {
      error: 'El Teléfono debe tener 9 dígitos numéricos.',
      formData: req.body,
      cliente: cliente
    });
  }

  try {
    // Consider DNI uniqueness check here as well if DNI can be changed
    // For now, proceeding with update as per original structure after format validation
    await model.updateCliente(id, { nombre, apellido, dni, telefono, correo }); // Use 'correo'
    res.redirect("/clientes");
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    const cliente = await model.getById(id); // Fetch for re-rendering
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