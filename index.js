require("dotenv").config();

const express = require("express");
const app = express();
const mainRouter = require("./src/routes/main.router");
const clientesRouter = require("./src/routes/cliente.router");
const path = require("path");

app.use(express.static(path.join(__dirname,"public")));
app.use(mainRouter);
app.use(clientesRouter);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "src/views"));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log('http://localhost:${PORT}'));