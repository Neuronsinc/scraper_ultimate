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

app.post('/filtracion', (req, res) => {
  const data = req.body.dator; // Obtener los datos enviados en la petición POST
  // Aquí puedes procesar los datos como lo necesites
  console.log('esto se recibio: ', data)
  const response = {
    message: 'Petición POST exitosa',
    data: data
  };
  res.json(response); // Responder con los datos procesados en formato JSON
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

    console.log('ESTOS SON!: ', datos_mongos);
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
