require("dotenv").config();

const express = require("express");
const app = express();
const layouts = require('express-ejs-layouts');
const path = require("path");
const methodOverride = require("method-override")
const pool = require(path.join (__dirname,"src/models/pg.js"))

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "src/views"));
app.use(layouts);
app.set('layout', 'layouts/layout');
app.use(require("./src/routes/main.router"));
app.use("/clientes", require("./src/routes/cliente.router"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conectado a PostgreSQL. Hora actual:', res.rows[0].now);
  }
});