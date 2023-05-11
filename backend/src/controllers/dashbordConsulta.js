const gatewa = require("../models/gatway.js");

const dashbordconsult = async (req, res, next) => {
  try {
    // Realizar la consulta a la base de datos
    const data = await gatewa.aggregate([
        {
          $group: {
            _id: {
              year: { $year: { $dateFromString: { dateString: "$Publicado:", format: "%d/%m/%Y" } } },
              category: "$Categoria:",
            },
            count: { $sum: 1 },
          },
        },
        {
          // Reformatear el resultado para que se ajuste al formato deseado
          $group: {
            _id: "$_id.year",
            data: {
              $push: {
                name: "$_id.category",
                data: "$count",
              },
            },
          },
        },
        {
          // Ordenar los resultados por año
          $sort: { _id: 1 },
        },
      ]);
      
      // Reformatear el resultado para que coincida con el formato deseado
      const chartData = data.map(({ _id: year, data }) => ({
        year,
        data,
      }));
    

    // Enviar la respuesta como JSON
    res.json(chartData);
  } catch (error) {
    // Manejar los errores
    console.error(error);
    res.status(500).json({ message: "Ha ocurrido un error" });
  }
};
module.exports = {
  dashbordconsult,
};
