// const gatewa = require("../models/gatway.js");
const gatewa = require("../models/scraper.js");

const sumacategorias = async (req, res, next) => {
  try {
    const ddatau = await gatewa.find({
      categoria: { $exists: true },
      precio: { $ne: "-" },
    });

    const count = {};

    ddatau.forEach((element) => {
      const categoria = element.categoria;
      if (count[categoria]) {
        count[categoria] += 1;
      } else {
        count[categoria] = 1;
      }
    });
    //DATA CATEGORÍAS
    // console.log(count);
    res.send(count);

    return;
  } catch (error) {
    return res.render("error en consulta: ", { errorMessage: error.message });
  }
};

module.exports = {
  sumacategorias,
};
