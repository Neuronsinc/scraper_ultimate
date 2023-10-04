const Usuario = require("../models/usuario");

const UsersData = async (req, res, next) => {
  try {
    const data_users = await Usuario.find({
      displayName: { $exists: true },
    });

    // Formatear los datos
    const formattedData = data_users.map((user) => ({
      id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
      password: user.password,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      country: user.country,
      address: user.address,
      state: user.state,
      city: user.city,
      zipCode: user.zipCode,
      about: user.about,
      role: user.role,
      isPublic: user.isPublic,
    }));

    console.log(formattedData);

    res.send(formattedData);

    return;
  } catch (error) {
    return res.render("error en consulta: ", { errorMessage: error.message });
  }
};

module.exports = {
  UsersData,
};
