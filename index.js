require("dotenv").config();

const express = require("express");
const app = express();
const layouts = require('express-ejs-layouts');
const mainRouter = require("./src/routes/main.router");
const clientesRouter = require("./src/routes/cliente.router");
const path = require("path");


app.use(express.static(path.join(__dirname,"public")));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "src/views"));
app.use(layouts);
app.set('layout', 'layouts/layout');
app.use(mainRouter);
app.use(clientesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});