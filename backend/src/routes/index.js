const express = require("express");
const router = express.Router();
const path = require("path");
const {
  renderGatewas,
  createGatewa,
  deleteGatewa,
  renderGatewaEdit,
  editGatewa,
  GatewaToggleDone,
  crear,
} = require("../controllers/gatway.controller");
const { sumacategorias, fechaPublicacionMax } = require("../controllers/consultas");
const { datostabla, tablefiltro } = require("../controllers/filtrotabla");
const { dashbordconsult } = require("../controllers/dashbordConsulta");
const { categorias } = require("../controllers/consultainputs");
const { preciosfiltro } = require("../controllers/filtroprecio");
const { rangoprecio } = require("../controllers/rangoprecios");
const { UsersData } = require("../controllers/usuario");
const { obtenerTodos } = require("../controllers/paises");
//const { filtrotabla } = require("../controllers/filtrotabla");

//Daga entrega

router.get("/suma-categorias", sumacategorias);
router.get("/fecha-max", fechaPublicacionMax);
router.post("/filtracion", datostabla);
router.get("/consulta-dashbord", dashbordconsult);
router.post("/table-filtro", tablefiltro);
router.get("/categorias", categorias);
router.get("/precios-filtro", preciosfiltro);
router.post("/rango-precios", rangoprecio);
router.get("/paises", obtenerTodos);

// Usuarios
 router.get("/usarios", UsersData);


// Render all tasks
router.get("/", renderGatewas);
router.get("/crear", crear);


router.post("/tasks/add", createGatewa);
//router.post("/tasks/add", createGatewa);

router.get("/tasks/:id/toggleDone", GatewaToggleDone);

router.get("/tasks/:id/edit", renderGatewaEdit);

router.post("/tasks/:id/editing", editGatewa);

router.get("/tasks/:id/delete", deleteGatewa);

router.get("/js-code", function (req, res) {
  res.sendFile(path.join(__dirname + "../../public/js/scripts.js"));
});
router.get("/js-editar", function (req, res) {
  res.sendFile(path.join(__dirname + "../../public/js/editar.js"));
});
router.get("/estilos", function (req, res) {
  res.sendFile(path.join(__dirname + "../../public/css/main.css"));
});

router.get("/images-emoji/blank.gif", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/js/lib/img/blank.gif"));
});
router.get("/images-emoji/emoji_spritesheet_0.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/js/lib/img/emoji_spritesheet_0.png")
  );
});
router.get("/images-emoji/emoji_spritesheet_1.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/js/lib/img/emoji_spritesheet_1.png")
  );
});
router.get("/images-emoji/emoji_spritesheet_2.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/js/lib/img/emoji_spritesheet_2.png")
  );
});
router.get("/images-emoji/emoji_spritesheet_3.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/js/lib/img/emoji_spritesheet_3.png")
  );
});
router.get("/images-emoji/emoji_spritesheet_4.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/js/lib/img/emoji_spritesheet_4.png")
  );
});
router.get("/images-emoji/IconsetSmiles_1x.png", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../public/js/lib/img/IconsetSmiles_1x.png")
  );
});
router.get("/images-emoji/IconsetSmiles.png", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/js/lib/img/IconsetSmiles.png"));
});
router.get("/images-emoji/IconsetW_1x.png", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/js/lib/img/IconsetW_1x.png"));
});
router.get("/images-emoji/IconsetW.png", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/js/lib/img/IconsetW.png"));
});

module.exports = router;
