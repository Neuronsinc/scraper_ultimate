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
const moment = require('moment');
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
 

app.get("/datos-mongo", (req, res) => {
   
    //  const idt = '6412010ce037e07c4baba7de';
    //const Gatewar =  await gatewa.findOne({_id: idt});
    // console.log('RENDER: ' +  JSON.stringify(Gatewar['Categoria:']))

    //const Gateware =  await gatewa.find({_id:{ $exists: true }});
    //console.log('RENDER: ' +  JSON.stringify(Gateware))
    // const Gateware3 =  await gatewa.find({'_id':{ $exists: true }}).lean();
    // console.log('RENDER SOLO CATEGORÍA: ' +  JSON.stringify(Gateware3['Categoria:']))
  
    async function database() {
      const datos_mongos = await gatewa.find({ _id: { $exists: true } })
        .sort({ fecha: -1 }) // Ordena por fecha de forma descendente (-1)
        .limit(5000); // Limita a 100 resultados
    
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
