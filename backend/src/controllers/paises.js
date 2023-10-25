const paises = require("../models/paises.js");

const obtenerTodos = async (req, res, next) => {

    try {

        const data = await paises.find({}, {"_id": false});

        res.status(200).send(data);

        return;

    } catch (error) {
        return res.status(500).send(`Error ${error.message}`);
    }

}

module.exports = {
    obtenerTodos
  };