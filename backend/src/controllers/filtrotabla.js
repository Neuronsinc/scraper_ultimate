const gatewa = require("../models/gatway.js");
const formatearMoneda = require("../controllers/FormatMondea");

const datostabla = async (req, res, next) => {
  try {
    const localizacion = req.body.localizacion;
    const habitaciones = req.body.habitaciones; // Obtener los datos enviados en la petición POST
    let busqueda = {};

    if (localizacion) {
      busqueda["Localización:"] = localizacion;
    }

    if (habitaciones) {
      busqueda["Categoria:"] = habitaciones;
    }

    if (!localizacion && !habitaciones) {
      busqueda["Precio:"] = { $exists: true };
    }

    // console.log(busqueda);

    let precios;
    let promedioDolares;
    let promedioQuetzales;
    gatewa
      .find(busqueda)
      .select("Precio: m²:")
      .then((resultados) => {
        const resultadosZona21 = resultados.filter((p) => p["Precio:"]);

        // Imprimir resultados filtrados
        //   console.log("DATA DATA: " + resultadosZona21);
        const respunse1 = JSON.stringify(resultadosZona21);
        const respuestageneral = JSON.parse(respunse1);
        // AREA PROMEDIO
        // crear nuevos arrays con los valores de "M² de construcción"
        function cleanNumber(str) {
          return str?.replace(/[^\d.-]/g, "");
        }

        const construccionDolares = respuestageneral
          .filter((p) => p["Precio:"].includes("$"))
          .filter((p) => p.hasOwnProperty("m²:")) // <--- verifica que la propiedad exista
          .map((p) => parseInt(cleanNumber(p["m²:"])));
        const construccionQuetzales = respuestageneral
          .filter((p) => p["Precio:"].includes("Q"))
          .filter((p) => p.hasOwnProperty("m²:")) // <--- verifica que la propiedad exista
          .map((p) => parseInt(cleanNumber(p["m²:"])));

        // calcular el promedio de "M² de construcción" para precios en dólares
        const areaDolares1 =
          construccionDolares.reduce((total, valor) => total + valor, 0) /
          construccionDolares.length;

        // calcular el promedio de "M² de construcción" para precios en quetzales
        const areaQuetzales1 =
          construccionQuetzales.reduce((total, valor) => total + valor, 0) /
          construccionQuetzales.length;

        const areaDolares = isNaN(areaDolares1) ? 0 : areaDolares1;
        const areaQuetzales = isNaN(areaQuetzales1) ? 0 : areaQuetzales1;
        const totalarea = areaQuetzales + areaDolares;

        // crear un nuevo array con solo el campo Precio
        precios = resultados.map((r) => r["Precio:"]);
        const preciosDolares = precios.filter((p) => p.includes("$"));
        const preciosQuetzales = precios.filter((p) => p.includes("Q"));

        promedioDolares =
          preciosDolares.reduce(
            (acc, p) => acc + parseFloat(p.replace(/\$|,/g, "")),
            0
          ) / preciosDolares.length;
        promedioQuetzales =
          preciosQuetzales.reduce(
            (acc, p) => acc + parseFloat(p.replace(/Q|,/g, "")),
            0
          ) / preciosQuetzales.length;

        const totalDolares = precios.filter((p) => p.includes("$"));
        const totalQuetzales = precios.filter((p) => p.includes("Q"));

        const cantidadDolares = totalDolares.length;
        const cantidadQuetzales = totalQuetzales.length;
        const totalcantidades = cantidadQuetzales + cantidadDolares;
        // conversión de quetzales a dólares
        const quetzalesQ1 = promedioQuetzales;
        const quetzalesQ = isNaN(quetzalesQ1) ? 0 : quetzalesQ1;
        const quetzalesD = quetzalesQ / 7.77;

        // conversión de dólares a quetzales
        const dolarQ1 = promedioDolares;
        const dolarQ = isNaN(dolarQ1) ? 0 : dolarQ1;
        const dolarD = dolarQ * 7.77;
        const total = quetzalesD + dolarD;

        const response = {
          message: "Petición POST exitosa",
          quetzalesQ: `${formatearMoneda(quetzalesQ, "GTQ", "es-GT")}`,
          quetzalesD: `${formatearMoneda(quetzalesD, "USD", "en-US")}`,
          dolarQ: `${formatearMoneda(dolarQ, "GTQ", "es-GT")}`,
          dolarD: `${formatearMoneda(dolarD, "USD", "en-US")} `,
          total: `${formatearMoneda(total, "USD", "en-US")} `,
          cantidadDolares: cantidadDolares,
          cantidadQuetzales: cantidadQuetzales,
          totalcantidades: totalcantidades,
          areaDolares: `${areaDolares.toFixed(2)} MT2`,
          areadioQuetzales: `${areaQuetzales.toFixed(2)} MT2`,
          totalarea: `${totalarea.toFixed(2)} MT2`,
          notifi: "Solicitud exitosa",
        };
        // console.log(response);
        res.json(response); // Responder con los datos procesados en formato JSON
      })
      .catch((error) => {
        console.error(error);
      });

    return;
  } catch (error) {
    return res.render("error en consulta: ", { errorMessage: error.message });
  }
};

// CONSULTA TABLA FILTRO
const tablefiltro = async (req, res, next) => {
  try {
    const categorias = req.body.categorias;

    let pipeline = [];

    // Si se especificaron categorías, agregamos una etapa $match al pipeline
    if (categorias && categorias.length > 0) {
      pipeline.push({ $match: { "Categoria:": { $in: categorias } } });
    }

    // Si no se especificaron categorías, agregamos un $match vacío para consultar todo
    if (!categorias || categorias.length === 0) {
      pipeline.push({ $match: {} });
    }

    // Ejecutamos la consulta utilizando aggregate
    const datosfiltros = await gatewa.aggregate(pipeline);
    const send = {
      date: datosfiltros,
    };
    res.send(send);
    return;
  } catch (error) {
    return res.status(500).json({ errorMessage: error.message });
  }
};

module.exports = {
  datostabla,
  tablefiltro,
};
