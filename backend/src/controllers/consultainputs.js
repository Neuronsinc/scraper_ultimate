const gatewa = require("../models/gatway.js");

const categorias = async (req, res, next) => {
  try {
    const ddatau = await gatewa.find({ "Categoria:": { $exists: true } });

    const uniqueCategories = [];
    
    ddatau.forEach((element) => {
      const categoria = element["Categoria:"];
      if (!uniqueCategories.includes(categoria)) {
        uniqueCategories.push(categoria);
      }
    });
    
    // Listado de categorías únicas
    console.log(uniqueCategories);
    res.send(uniqueCategories);

    return;
  } catch (error) {
    return res.render("error en consulta: ", { errorMessage: error.message });
  }
};

module.exports = {
	categorias,
  }