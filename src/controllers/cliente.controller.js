const querystring = require("querystring");

const index = (req, res) => {
    const query = querystring.stringify(req.query);
    res.render('clientes')
}

module.exports = {
 index,
}