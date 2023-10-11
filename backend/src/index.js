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
const moment = require("moment");
const indexRoutes = require("./routes/index");
const mongoose = require("mongoose");
const gatewa = require("../src/models/gatway");
const scraper = require("../src/models/scraper");
const multer = require("multer"); // Middleware para manejar la subida de archivos

app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status :user-agent - :response-time ms"));
app.use(bodyParser.json());

app.use("/", routes);
mime.contentType("text/css");
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://admin:DANIELxp1.*d@34.202.18.5:27017/troiatec", {
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
// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: "public/images", // Ruta donde se guardarán las imágenes
  filename: (req, file, callback) => {
    // Genera un nombre único para el archivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const filename = uniqueSuffix + extension;
    req.filepath = filename; // Guardamos el nombre del archivo en req para su posterior uso
    callback(null, filename);
  },
});

const upload = multer({ dest: 'uploads/' });

// Ruta para manejar la subida de archivos
app.post("/api/upload-avatar", upload.single("avatar"), (req, res) => {
  try {
    // Ahora, puedes usar req.filepath para generar la URL de la imagen
    console.log(req.file.path);
    const imageUrl = "/images/" + req.filepath;
    res.json({ avatarUrl: imageUrl });
  } catch (error) {
    res.status(500).send("Error interno del servidor");

    console.log(error);
  }
  // La imagen se ha subido y guardado en la carpeta pública
});
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

      //console.log(m2Valores); // ["56", "300", "745", "745"]
      datos.forEach((resultado) => {
        if (resultado["Precio:"] === "$58,000.00\n") {
          //console.log(resultado["m²:"]);
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

app.get("/datos-mongo", (req, res) => {
  //  const idt = '6412010ce037e07c4baba7de';
  //const Gatewar =  await gatewa.findOne({_id: idt});
  // console.log('RENDER: ' +  JSON.stringify(Gatewar['Categoria:']))

  //const Gateware =  await gatewa.find({_id:{ $exists: true }});
  //console.log('RENDER: ' +  JSON.stringify(Gateware))
  // const Gateware3 =  await gatewa.find({'_id':{ $exists: true }}).lean();
  // console.log('RENDER SOLO CATEGORÍA: ' +  JSON.stringify(Gateware3['Categoria:']))

  async function database() {
    const datos_mongos = await gatewa
      .find({ _id: { $exists: true } })
      .sort({ fecha: -1 }) // Ordena por fecha de forma descendente (-1)
      .limit(5000); // Limita a 100 resultados

    res.send(JSON.stringify(datos_mongos));
    //("ESTOS SON!: ", datos_mongos);
  }

  database();
});

app.get("/datos-mongo-new", (req, res) => {
  //  const idt = '6412010ce037e07c4baba7de';
  //const Gatewar =  await gatewa.findOne({_id: idt});
  // console.log('RENDER: ' +  JSON.stringify(Gatewar['Categoria:']))

  //const Gateware =  await gatewa.find({_id:{ $exists: true }});
  //console.log('RENDER: ' +  JSON.stringify(Gateware))
  // const Gateware3 =  await gatewa.find({'_id':{ $exists: true }}).lean();
  // console.log('RENDER SOLO CATEGORÍA: ' +  JSON.stringify(Gateware3['Categoria:']))

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

  async function database() {
    try {
      const Finicial = formatDate(req.query.inicio);
      const Ffinal = formatDate(req.query.fin);

      //console.log("Mis fechas =>", new Date(Finicial), new Date(Ffinal));

      const semanaMax = await scraper.findOne({}, {semana: 1, _id: 0}).sort({ '_id': -1 }).limit(1)

      const datos_mongos = await scraper
        .find({ _id: { $exists: true }, precio: { $ne: "-" }, semana: { $eq: semanaMax['_doc']['semana'] },$and: [
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
        ] })
        .sort({ fecha: -1 }); // Ordena por fecha de forma descendente (-1)

      res.send(JSON.stringify(datos_mongos));
      //("ESTOS SON!: ", datos_mongos);
    } catch (error) {
      res.send(`Error ${error.message}`);
    }
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
