//Frank
const model = require("../models/Cliente")

const create = (req, res) => {
    res.render('clientes/create');
};

const store = async (req, res) => {
  const { nombre, apellido, dni, telefono, correo } = req.body;

  try {
    const dniExiste = await model.existsDNI(dni);

    if (dniExiste) {
      return res.render("clientes/create", {
        error: "El DNI ya está registrado.",
      });
    }

    await model.store({ nombre, apellido, dni, telefono, correo });
    res.redirect("/clientes");
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    res.status(500).send("Error al guardar cliente");
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

  try {
    await model.updateCliente(id, { nombre, apellido, dni, telefono, correo });
    res.redirect("/clientes");
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).send("Error al actualizar cliente");
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