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
    let preciom2;
    let promedioDolares;
    let promedioQuetzales;
    let promedioDolaresm2;
    let promedioQuetzalesm2;
    gatewa
      .find(busqueda)
      .select({ "Precio:": 1, "m²:": 1, "Precio/M² de terreno:": 1 })
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
        preciom2 = resultados.map((r) => r["Precio/M² de terreno:"]);

        const preciosDolaresm2 = preciom2.filter(
          (p) => p && p.includes && p.includes("$")
        );
        const preciosQuetzalesm2 = preciom2.filter(
          (p) => p && p.includes && p.includes("Q")
        );

        const cleanedPricesDolaresm2 = preciosDolaresm2.map((p) =>
          p.replace(/[^\d.,]/g, "")
        );
        const cleanedPricesQuetzalesm2 = preciosQuetzalesm2.map((p) =>
          p.replace(/[^\d.,]/g, "")
        );

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

        promedioDolaresm2 =
          cleanedPricesDolaresm2.reduce(
            (acc, p) => acc + parseFloat(p.replace(/\$|,/g, "")),
            0
          ) / preciosDolares.length;
        promedioQuetzalesm2 =
          cleanedPricesQuetzalesm2.reduce(
            (acc, p) => acc + parseFloat(p.replace(/Q|,/g, "")),
            0
          ) / preciosQuetzales.length;

        const totalDolares = precios.filter((p) => p.includes("$"));
        const totalQuetzales = precios.filter((p) => p.includes("Q"));

        const cantidadDolares = totalDolares.length;
        const cantidadQuetzales = totalQuetzales.length;
        const totalcantidades = cantidadQuetzales + cantidadDolares;
        // METRO 2 CANTIDADES
        const totalDolaresm2 = precios.filter((p) => p.includes("$"));
        const totalQuetzalesm2 = precios.filter((p) => p.includes("Q"));

        const cantidadDolaresm2 = totalDolaresm2.length;
        const cantidadQuetzalesm2 = totalQuetzalesm2.length;
        const totalcantidadesm2 = cantidadQuetzalesm2 + cantidadDolaresm2;
        // conversión de quetzales a dólares
        const quetzalesQ1 = promedioQuetzales;
        const quetzalesQ = isNaN(quetzalesQ1) ? 0 : quetzalesQ1;
        const quetzalesD = quetzalesQ / 7.77;

        // conversión de dólares a quetzales
        const dolarQ1 = promedioDolares;
        const dolarQ = isNaN(dolarQ1) ? 0 : dolarQ1;
        const dolarD = dolarQ * 7.77;
        const total = quetzalesD + dolarD;
        // conversión de quetzales a dólares MT2
        const quetzalesQ1m2 = promedioQuetzalesm2;
        const quetzalesQm2 = isNaN(quetzalesQ1m2) ? 0 : quetzalesQ1m2;
        const quetzalesDm2 = quetzalesQm2 / 7.77;

        // conversión de dólares a quetzales
        const dolarQ1m2 = promedioDolaresm2;
        const dolarQm2 = isNaN(dolarQ1m2) ? 0 : dolarQ1m2;
        const dolarDm2 = dolarQm2 * 7.77;
        const totalm2 = quetzalesDm2 + dolarDm2;

        const response = {
          message: "Petición POST exitosa",
          quetzalesQ: `${formatearMoneda(quetzalesQ, "GTQ", "es-GT")}`,
          quetzalesD: `${formatearMoneda(quetzalesD, "USD", "en-US")}`,
          dolarQ: `${formatearMoneda(dolarQ, "GTQ", "es-GT")}`,
          dolarD: `${formatearMoneda(dolarD, "USD", "en-US")} `,
          total: `${formatearMoneda(total, "USD", "en-US")} `,
          quetzalesQm2: `${formatearMoneda(quetzalesQm2, "GTQ", "es-GT")}`,
          quetzalesDm2: `${formatearMoneda(quetzalesDm2, "USD", "en-US")}`,
          dolarQm2: `${formatearMoneda(dolarQm2, "GTQ", "es-GT")}`,
          dolarDm2: `${formatearMoneda(dolarDm2, "USD", "en-US")} `,
          totalm2: `${formatearMoneda(totalm2, "USD", "en-US")} `,
          cantidadDolares: cantidadDolares,
          cantidadQuetzales: cantidadQuetzales,
          totalcantidades: totalcantidades,
          cantidadDolaresm2: cantidadDolaresm2,
          cantidadQuetzalesm2: cantidadQuetzalesm2,
          totalcantidadesm2: totalcantidadesm2,
          areaDolares: `${areaDolares.toFixed(2)} MT2`,
          areadioQuetzales: `${areaQuetzales.toFixed(2)} MT2`,
          totalarea: `${totalarea.toFixed(2)} MT2`,
          notifi: "Solicitud exitosa",
        };
        // console.log(response);
        res.json(response); // Responder con los datos procesados en formato JSON
        console.log("Respuesta precio m2: " + resultados);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });

    return;
  } catch (error) {
    return console.log(error);
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
    res.send(`Error ${error.message}`);
    return;
  }
};

module.exports = {
  datostabla,
  tablefiltro,
};
