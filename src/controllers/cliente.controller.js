const clientes = [
    {id: 1, nombre:"cliente 1"},
    {id: 2, nombre:"cliente 2"},
    {id: 3, nombre:"cliente 3"}
];

const create = (req, res) => {
    res.render('clientes/create');
};

const store = (req,res) => {
    const {nombre} = req.body;

    const cliente ={
        id:Date.now(),
        nombre,
    };

    clientes.push(cliente)

    res.redirect("/clientes")
}
 
const index = (req, res) => {
    res.render('clientes/index', {clientes});
};

const show = (req, res) => {
    const {id} = req.params;
    const cliente = clientes.find((cliente) => cliente.id == id);


    if (!cliente){
        return res.status(404).send("no hay")
    }

    res.render('clientes/show', {cliente});
};

const edit = (req, res) => {
    const {id} = req.params;
    const cliente = clientes.find((cliente) => cliente.id == id);


    if (!cliente){
        return res.status(404).send("no hay")
    }

    res.render("clientes/edit", {cliente})
};

const update = (req, res) => {
    const {id} = req.params;
    const {nombre} = req.body;

    const cliente = clientes.find((cliente) => cliente.id == id);


    if (!cliente){
        return res.status(404).send("no hay")
    }

    cliente.nombre = nombre;

    res.redirect("/clientes")
};

const destroy = (req, res) => {
    const {id} = req.params;
    const index = clientes.findIndex((cliente) => cliente.id == id);

    if (index == -1){
        return res.status(404).send("no hay")
    }

    clientes.splice(index, 1)

    res.redirect("/clientes")
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