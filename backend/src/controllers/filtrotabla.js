/// const gatewa = require("../models/gatway.js");
const gatewa = require("../models/scraper.js");
const formatearMoneda = require("../controllers/FormatMondea");

const datostabla = async (req, res, next) => {

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
    const localizacion = req.body.localizacion;
    const habitaciones = req.body.habitaciones; // Obtener los datos enviados en la petición POST

    const Finicial = formatDate(req.body.inicio);
    const Ffinal = formatDate(req.body.fin);

    let busqueda = {fecha_publicacion: { $ne: "-"  }, $and: [
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
    ]};

    if (localizacion) {
      busqueda.localizacion = localizacion;
    }

    if (habitaciones) {
      busqueda.categoria = habitaciones;
    }

    if (
      !localizacion &&
      (!habitaciones ||
        (Array.isArray(habitaciones) && habitaciones.length === 0))
    ) {
      busqueda.precio = { $exists: true };
    }

    console.log(habitaciones);
    //console.log(busqueda);
    
    let precios;
    let preciom2;
    let promedioDolares;
    let promedioQuetzales;
    let promedioDolaresm2;
    let promedioQuetzalesm2;
    gatewa
      .find(busqueda)
      .select({ precio: 1, m2: 1, m2_construccion: 1, precio_m2_terreno: 1 })
      .then((resultados) => {
        //console.log(resultados)
        const resultadosZona21 = resultados.filter((p) => p["precio"]);

        // Imprimir resultados filtrados
        //   console.log("DATA DATA: " + resultadosZona21);
        const respunse1 = JSON.stringify(resultadosZona21);
        const respuestageneral = JSON.parse(respunse1);
        // AREA PROMEDIO
        // crear nuevos arrays con los valores de "M² de construcción"
        function cleanNumber(str) {
          return str?.replace(/[^\d.-]/g, "");
        }
        // Filtrar los datos que tienen precios en dólares
        const construccionDolares_1 = respuestageneral.filter((data) =>
          data.precio.includes("$")
        );
        // Filtrar los datos que tienen precios en quetzales
        const construccionQuetzales_1 = respuestageneral.filter((data) =>
          data.precio.includes("Q")
        );

        // Reemplazar los guiones en los datos de dólares
        const construccionDolaresCleaned_1 = construccionDolares_1.map(
          (data) => {
            if (data.m2_construccion === "-") {
              return { ...data, m2_construccion: "0" };
            }
            return data;
          }
        );

        // Reemplazar los guiones en los datos de quetzales y agregar dos decimales
        const construccionQuetzalesCleaned_1 = construccionQuetzales_1.map(
          (data) => {
            if (data.m2_construccion === "-") {
              return { ...data, m2_construccion: "0" };
            }
            return {
              ...data,
              m2_construccion: parseFloat(data.m2_construccion).toFixed(2),
            };
          }
        );
        const construccionQuetzalesCleaned_1_1 = JSON.stringify(
          construccionQuetzalesCleaned_1
        );

        // Calcular el promedio de "m2_construccion" en dólares
        const sumDolares_1 = construccionDolaresCleaned_1.reduce(
          (acc, data) => acc + parseFloat(data.m2_construccion),
          0
        );
        const countDolares_1 = construccionDolaresCleaned_1.length;
        const promedioDolares_1 = sumDolares_1 / countDolares_1;

        // Calcular el promedio de "m2_construccion" en quetzales
        const construccionQuetzalesArray = JSON.parse(
          construccionQuetzalesCleaned_1_1
        );

        const sumQuetzales_1 = construccionQuetzalesArray.reduce(
          (acc, data) => {
            const value = parseFloat(data.m2_construccion || 0);
            return isNaN(value) ? acc : acc + value;
          },
          0
        );
        const countQuetzales_1 = construccionQuetzalesCleaned_1.length;
        const promedioQuetzales_1 = sumQuetzales_1 / countQuetzales_1;

        const suma_total_area = (promedioDolares_1 + promedioQuetzales_1) / 2;

        console.log("Suma en dólares: " + sumDolares_1);
        console.log("Promedio en dólares: " + promedioDolares_1);
        console.log("Suma en quetzales: " + sumQuetzales_1);
        console.log("Promedio en quetzales: " + promedioQuetzales_1);

        const areaDolares_1 = isNaN(promedioDolares_1) ? 0 : promedioDolares_1;
        const areaQuetzales_1 = isNaN(promedioQuetzales_1)
          ? 0
          : promedioQuetzales_1;
        const totalarea_1 = areaQuetzales_1 + areaDolares_1;

        const construccionDolares = respuestageneral
          .filter((p) => p["precio"].includes("$"))
          .filter((p) => p.hasOwnProperty("m2")) // <--- verifica que la propiedad exista
          .map((p) => parseInt(cleanNumber(p["m2"])));
        const construccionQuetzales = respuestageneral
          .filter((p) => p["precio"].includes("Q"))
          .filter((p) => p.hasOwnProperty("m2")) // <--- verifica que la propiedad exista
          .map((p) => parseInt(cleanNumber(p["m2"])));

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
        precios = resultados.map((r) => r["precio"]);
        const preciosDolares = precios.filter((p) => p.includes("$"));
        const preciosQuetzales = precios.filter((p) => p.includes("Q"));
        preciom2 = resultados.map((r) => r["precio"]);

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
        const totalcantidades = (cantidadQuetzales + cantidadDolares);
        // METRO 2 CANTIDADES
        const totalDolaresm2 = precios.filter((p) => p.includes("$"));
        const totalQuetzalesm2 = precios.filter((p) => p.includes("Q"));

        const cantidadDolaresm2 = totalDolaresm2.length;
        const cantidadQuetzalesm2 = totalQuetzalesm2.length;
        const totalcantidadesm2 = (cantidadQuetzalesm2 + cantidadDolaresm2) / 2;
        // conversión de quetzales a dólares
        const tipoCambio = 7.8; // Tipo de cambio actualizado

        const quetzalesQ1 = promedioQuetzales.toFixed(2);
        const quetzalesQ = isNaN(quetzalesQ1) ? 0 : quetzalesQ1;
        const quetzalesD = quetzalesQ / tipoCambio;

        console.log("TOTAL DÓLARES:" + quetzalesD.toFixed(2));
        console.log("TOTAL QUETZALES:" + quetzalesQ1);

        // conversión de dólares a quetzales
        const dolarD1 = promedioDolares;
        const dolarD = isNaN(dolarD1) ? 0 : dolarD1;
        const dolarQ = dolarD * 7.80;
        const total = (quetzalesD + dolarD) / 2;
        // conversión de quetzales a dólares MT2
        const quetzalesQ1m2 = quetzalesQ / areaQuetzales_1;
        const quetzalesQm2 = isNaN(quetzalesQ1m2) ? 0 : quetzalesQ1m2;
        const quetzalesDm2 = (quetzalesQm2 / 7.80);

        // conversión de dólares a quetzales
        const dolarQ1m2 = dolarQ / areaDolares_1;
        const dolarQm2 = isNaN(dolarQ1m2) ? 0 : dolarQ1m2;
        const dolarDm2 = (dolarQm2 / 7.8);
        const totalm2 = quetzalesDm2 + dolarDm2;

        const response = {
          message: "Petición POST exitosa",
          quetzalesQ: `${formatearMoneda(quetzalesQ, "GTQ", "es-GT")}`,
          quetzalesD: `${formatearMoneda(quetzalesD, "USD", "en-US")}`,
          dolarQ: `${formatearMoneda(dolarQ, "GTQ", "es-GT")}`,
          dolarD: `${formatearMoneda(dolarD, "USD", "en-US")} `,
          total: `${formatearMoneda(total, "USD", "en-US")}`,
          quetzalesQm2: `${formatearMoneda(quetzalesQm2, "GTQ", "es-GT")}`,
          quetzalesDm2: `${formatearMoneda(quetzalesDm2, "USD", "en-US")}`,
          dolarQm2: `${formatearMoneda(dolarQm2, "GTQ", "es-GT")} `, // EN LA SECCIÓN DEL DOLAR, ESTO ES EL PRECIO POR M2 EN Q
          dolarDm2: `${formatearMoneda(dolarDm2, "USD", "en-US")} `, // EN LA SECCIÓN DEL DOLAR, ESTO ES EL PRECIO POR M2 EN $
          totalm2: `${formatearMoneda(totalm2, "USD", "en-US")} `,
          cantidadDolares: cantidadDolares,
          cantidadQuetzales: cantidadQuetzales,
          totalcantidades: totalcantidades, // TOTAL DE UNIDADES OFERTADAS EN PROMEDIO
          cantidadDolaresm2: cantidadDolaresm2,
          cantidadQuetzalesm2: cantidadQuetzalesm2,
          totalcantidadesm2: totalcantidadesm2,
          areaDolares: `${areaDolares_1.toFixed(2)} MT2`,
          areadioQuetzales: `${areaQuetzales_1.toFixed(2)} MT2`,
          totalarea: `${suma_total_area.toFixed(2)} MT2`,
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
