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

    const semanaMax = await gatewa.findOne({}, {semana: 1, _id: 0}).sort({ '_id': -1 }).limit(1)

    const ddatau = await gatewa.find({
      categoria: { $exists: true },
      precio: { $ne: "-" }, semana: { $eq: semanaMax['_doc']['semana'] }, $and: [
        {
          $expr: {
            $gte: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $substrCP: ["$fecha_publicacion", 6, 4] },  // Año
                      "-",
                      { $substrCP: ["$fecha_publicacion", 3, 2] },  // Mes
                      "-",
                      { $substrCP: ["$fecha_publicacion", 0, 2] }   // Día
                    ]
                  }, format: "%Y-%m-%d"
                }
              },
              new Date(Finicial)
            ]
          }
        },
        {
          $expr: {
            $lte: [
              {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $substrCP: ["$fecha_publicacion", 6, 4] },  // Año
                      "-",
                      { $substrCP: ["$fecha_publicacion", 3, 2] },  // Mes
                      "-",
                      { $substrCP: ["$fecha_publicacion", 0, 2] }   // Día
                    ]
                  }, format: "%Y-%m-%d"
                }
              },
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

const fechaPublicacionMax = async (req, res, next) => {
  try {
    const data = await gatewa.aggregate([
      {
        $match: {
          fecha_publicacion: { $regex: /^\d{2}\/\d{2}\/\d{4}$/  } // Exclude documents with "-"
        }
      },
      {
        $project: {
          fecha_publicacion: {
            $dateFromString: { dateString: "$fecha_publicacion", format: "%d/%m/%Y" }
          }
        }
      },
      {
        $group: {
          _id: null,
          fecha_publicacion: { $max: "$fecha_publicacion" }
        }
      },
      {
        $project: {
          _id: 0,
          fecha_publicacion: 1
        }
      }
    ])

    res.send(data);

  } catch (error) {
    return res.send(`Error ${error.message}`);
  }
}

module.exports = {
  sumacategorias,
  fechaPublicacionMax
};
