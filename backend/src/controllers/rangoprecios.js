const rangoprecio = async (req, res, next) => {
  try {
     const dato = req.body
    res.send(dato);

    return;
  } catch (error) {
    return res.render("error en consulta: ", { errorMessage: error.message });
  }
};

module.exports = {
	rangoprecio,
  }