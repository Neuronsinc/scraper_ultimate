const gatewa = require("../models/gatway.js");

 const renderGatewas = async (req, res) => {
  try {
    const Gatewa = await gatewa.find().lean();
    res.render("index", {
      Gatewa,
    });
  } catch (error) {
    console.log({ error });
    return res.render("error", { errorMessage: error.message });
    
  }
};

 const createGatewa = async (req, res, next) => {
  try {
    const Gatewa = new gatewa(req.body);
    const save_wa = await Gatewa.save();
    console.log(save_wa);
	  res.send('agregado')
    res.redirect("/");
    return
  } catch (error) {
    return res.render("error", { errorMessage: error.message });
  }
};

 const GatewaToggleDone = async (req, res, next) => {
  let { id } = req.params;
  const Gatewa = await gatewa.findById(id);
  Gatewa.done = !Gatewa.done;
  await Gatewa.save();
  res.redirect("/");
  
};

 const renderGatewaEdit = async (req, res, next) => {
  const Gatewa = await gatewa.findById(req.params.id).lean();
    res.render("edit", {
      Gatewa,
    });
};
const crear = async (req, res, next) => {
  const Gatewa = await gatewa.findById(req.params.id).lean();
    res.render("agregar", {
      Gatewa,
    });
};

 const editGatewa = async (req, res, next) => {
 
  const { id } = req.params;
  await gatewa.updateOne({ _id: id }, req.body);
  res.redirect("/");
  next

};

 const deleteGatewa = async (req, res, next) => {
  let { id } = req.params;
  await gatewa.findOneAndDelete({ _id: id });
  res.redirect("/");
};

module.exports = {
	renderGatewas,
	createGatewa,
	deleteGatewa,
	renderGatewaEdit,
	editGatewa,
	GatewaToggleDone,
  crear
  }