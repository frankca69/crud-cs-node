require("dotenv").config();

const express = require("express");
const app = express();

app.get('/', (req, res) => {
    res.send('hola mundo que tal!!!!');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log('http://localhost:${PORT}'));