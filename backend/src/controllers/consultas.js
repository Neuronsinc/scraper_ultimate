// const gatewa = require("../models/gatway.js");
const gatewa = require("../models/scraper.js");

const sumacategorias = async (req, res, next) => {

  
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  try {

    const Finicial = formatDate(req.query.inicio);
    const Ffinal = formatDate(req.query.fin);

    const ddatau = await gatewa.find({
      categoria: { $exists: true },
      precio: { $ne: "-" }, $and: [
        {
          $expr: {
            $gte: [
              { $dateFromString: { dateString: {
                $concat: [
                  { $substrCP: ["$fecha_publicacion", 6, 4] },  // Año
                  "-",
                  { $substrCP: ["$fecha_publicacion", 3, 2] },  // Mes
                  "-",
                  { $substrCP: ["$fecha_publicacion", 0, 2] }   // Día
                ]
              }, format: "%Y-%m-%d" }},
              new Date(Finicial)
            ]
          }
        },
        {
          $expr: {
            $lte: [
              { $dateFromString: { dateString: {
                $concat: [
                  { $substrCP: ["$fecha_publicacion", 6, 4] },  // Año
                  "-",
                  { $substrCP: ["$fecha_publicacion", 3, 2] },  // Mes
                  "-",
                  { $substrCP: ["$fecha_publicacion", 0, 2] }   // Día
                ]
              }, format: "%Y-%m-%d" }},
              new Date(Ffinal)
            ]
          }
        }
      ]
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
