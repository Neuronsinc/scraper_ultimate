const gatewa = require("../models/gatway.js");

const sumacategorias = async (req, res, next) => {
  try {
    const ddatau = await gatewa.find({ "Categoria:": { $exists: true } });

    const count = {};

    ddatau.forEach((element) => {
      const categoria = element["Categoria:"];
      if (count[categoria]) {
        count[categoria] += 1;
      } else {
        count[categoria] = 1;
      }
    });
    //DATA CATEGORÍAS
    console.log(count);
    res.send(count);

    return;
  } catch (error) {
    return res.render("error en consulta: ", { errorMessage: error.message });
  }
};
module.exports = {
	sumacategorias,
  }