// const gatewa = require("../models/gatway.js");
const gatewa = require("../models/scraper.js");

const dashbordconsult = async (req, res, next) => {
  try {
    // Agrupar y sumar los registros por año y categoría
    const groupedData = await gatewa.aggregate([
      {
        $match: {
          fecha_publicacion: { $regex: /^\d{2}\/\d{2}\/\d{4}$/ }, // Filtrar documentos con formato de fecha válido "dd/mm/YYYY"
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: {
                $dateFromString: {
                  dateString: "$fecha_publicacion",
                  format: "%d/%m/%Y",
                },
              },
            },
            category: "$categoria",
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$fecha_publicacion",
                  format: "%d/%m/%Y",
                },
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            category: "$_id.category",
          },
          data: {
            $push: {
              month: "$_id.month",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          name: "$_id.category",
          data: "$data",
        },
      },
      {
        $sort: { year: 1, name: 1 },
      },
    ]);

    // Crear un objeto para almacenar el resultado transformado
    const transformedData = {};

    // Recorrer los datos agrupados y transformarlos en el formato deseado
    groupedData.forEach(({ year, name, data }) => {
      if (!transformedData[year]) {
        transformedData[year] = {
          year,
          data: [],
        };
      }

      // Crear un objeto con los datos de cada categoría para el año actual
      const categoryData = {
        name,
        data: [],
      };

      // Rellenar los datos para cada mes del año actual
      for (let i = 1; i <= 12; i++) {
        const monthData = data.find((d) => d.month === i);

        if (monthData) {
          categoryData.data.push(monthData.count);
        } else {
          categoryData.data.push(0);
        }
      }

      // Agregar los datos de la categoría al objeto del año actual
      transformedData[year].data.push(categoryData);
    });

    // Convertir el objeto a un array y ordenar por año
    const chartData = Object.values(transformedData).sort(
      (a, b) => a.year - b.year
    );

    // Enviar la respuesta como JSON
    res.json(chartData);
    const datos_dash = JSON.stringify(chartData);
    console.log(datos_dash);
  } catch (error) {
    // Manejar los errores
    console.error(error);
    res
      .status(500)
      .json({ message: `Ha ocurrido un error que es: \n\n\n ${error}` });
  }
};

module.exports = {
  dashbordconsult,
};
