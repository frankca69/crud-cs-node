const pool = require("./pg");

const store = async ({ nombre, apellido, dni, telefono, correo }) => {
  const query = `
    INSERT INTO clientes (nombre, apellido, dni, telefono, correo)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [nombre, apellido, dni, telefono, correo];

  try {
    const result = await pool.query(query, values);
    return result.rows[0]; // Devuelve el cliente insertado
  } catch (error) {
    console.error('Error al insertar cliente:', error);
    throw error;
  }
};

const getAll = async () => {
  try {
    const result = await pool.query('SELECT * FROM clientes ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    throw error;
  }
};

const updateCliente = async (id, { nombre, apellido, dni, telefono, correo }) => {
  const query = `
    UPDATE clientes
    SET nombre = $1, apellido = $2, dni = $3, telefono = $4, correo = $5
    WHERE id = $6
  `;
  const values = [nombre, apellido, dni, telefono, correo, id];

  try {
    await pool.query(query, values);
  } catch (error) {
    throw error;
  }
};

const deleteCliente = async (id) => {
  const query = `DELETE FROM clientes WHERE id = $1`;
  const values = [id];

  try {
    await pool.query(query, values);
  } catch (error) {
    throw error;
  }
};



module.exports = {
  store,
  getAll,
  getById,
  updateCliente,
  deleteCliente
};