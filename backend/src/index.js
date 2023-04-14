const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT;
const mime = require("mime-types");
const { create } = require("express-handlebars");
const routes = require("./routes/index");
const app = express();
const indexRoutes = require("./routes/index");
const mongoose = require("mongoose");
const gatewa = require("../src/models/gatway");

app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status :user-agent - :response-time ms"));
app.use(bodyParser.json());

app.use("/", routes);
mime.contentType("text/css");
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://54.85.218.28:27017/troiatec", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

//gatewa.create(data, function(err, result) {
// if (err) {
//  console.log(err);
// } else {
//   console.log(result);
//  }
// });
async function databaser() {
  //  const idt = '6412010ce037e07c4baba7de';
  //const Gatewar =  await gatewa.findOne({_id: idt});
  // console.log('RENDER: ' +  JSON.stringify(Gatewar['Categoria:']))
  //const Gateware =  await gatewa.find({_id:{ $exists: true }});
  //console.log('RENDER: ' +  JSON.stringify(Gateware))
  // const Gateware3 =  await gatewa.find({'_id':{ $exists: true }}).lean();
  // console.log('RENDER SOLO CATEGORÍA: ' +  JSON.stringify(Gateware3['Categoria:']))
  //ENVIO DE DATOS GENERALES
}

databaser();

app.get("/ruta", (req, res) => {
  async function consulta() {
    try {
      const resultados = await gatewa.find(
        { "m²:": { $exists: true, $ne: null } },
        "Precio: m²:"
      );

      const obj = resultados;
      obj["m2"] = obj["m²:"]; // Agregar nuevo campo con el nuevo nombre
      delete obj["m²:"]; // Eliminar campo anterior
      const data = JSON.stringify(obj);
      const datos = JSON.parse(data);

      const m2Valores = datos.map((objeto) => objeto["m²:"]);

      console.log(m2Valores); // ["56", "300", "745", "745"]
      datos.forEach((resultado) => {
        if (resultado["Precio:"] === "$58,000.00\n") {
          console.log(resultado["m²:"]);
          res.send(resultado["m²:"]);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  consulta();
  // Lógica para manejar la solicitud GET
});

app.post("/filtracion", (req, res) => {
  const localizacion = req.body.localizacion;
  const habitaciones = req.body.habitaciones; // Obtener los datos enviados en la petición POST
  let busqueda;

  if (habitaciones === "") {
    busqueda = { "Localización:": localizacion };
    // hacer algo con las variables localizacion y habitaciones
  } else {
    busqueda = { "Localización:": localizacion, "Habitaciones:": habitaciones };
  }

  if (localizacion === "") {
    busqueda = { "Precio:": { $exists: true } };
  } else {
    busqueda = { "Localización:": localizacion };
  }
  console.log(busqueda);

  let precios;
  let promedioDolares;
  let promedioQuetzales;
  gatewa
    .find(busqueda)
    .select("Precio: m²:")
    .then((resultados) => {
      const resultadosZona21 = resultados.filter(
        (p) => p["Precio:"]
      );

      // Imprimir resultados filtrados
      console.log('DATA DATA: ' + resultadosZona21);
      const respunse1 = JSON.stringify(resultadosZona21);
      const respuestageneral = JSON.parse(respunse1);
      // AREA PROMEDIO
      // crear nuevos arrays con los valores de "M² de construcción"
      function cleanNumber(str) {
        console.log("Llamado a cleanNumber con str=", str);
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
        quetzalesQ: `Q${quetzalesQ.toFixed(2)}`,
        quetzalesD: `$${quetzalesD.toFixed(2)}`,
        dolarQ: `Q${dolarQ.toFixed(2)}`,
        dolarD: `$${dolarD.toFixed(2)}`,
        total: `$${total.toFixed(2)}`,
        cantidadDolares: cantidadDolares,
        cantidadQuetzales: cantidadQuetzales,
        totalcantidades: totalcantidades,
        areaDolares: `${areaDolares.toFixed(2)} MT2`,
        areadioQuetzales: `${areaQuetzales.toFixed(2)} MT2`,
        totalarea: `${totalarea.toFixed(2)} MT2`,
        notifi: "Solicitud exitosa",
      };
      console.log(response);
      res.json(response); // Responder con los datos procesados en formato JSON
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/datos-mongo", (req, res) => {
  async function database() {
    //  const idt = '6412010ce037e07c4baba7de';
    //const Gatewar =  await gatewa.findOne({_id: idt});
    // console.log('RENDER: ' +  JSON.stringify(Gatewar['Categoria:']))

    //const Gateware =  await gatewa.find({_id:{ $exists: true }});
    //console.log('RENDER: ' +  JSON.stringify(Gateware))
    // const Gateware3 =  await gatewa.find({'_id':{ $exists: true }}).lean();
    // console.log('RENDER SOLO CATEGORÍA: ' +  JSON.stringify(Gateware3['Categoria:']))

    const datos_mongos = await gatewa.find({ _id: { $exists: true } });

    res.send(JSON.stringify(datos_mongos));

    console.log("ESTOS SON!: ", datos_mongos);
  }

  database();
});

// settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  create({
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaulLayout: "main",
    extname: ".hbs",
  }).engine
);
app.set("view engine", ".hbs");
app.use(indexRoutes);
app.get("/datas", (req, res) => {
  const datas = { message: "Erick el crack" };
  res.send(datas);
});

// public route
app.use(express.static(path.join(__dirname, "public")));

app.listen(process.env.PORT || 3000, function () {
  console.log("App corriendo en puerto: " + port);
});
