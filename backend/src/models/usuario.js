const mongoose = require('mongoose');

// Define el esquema del usuario
const usuarioSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true, // El campo displayName es obligatorio
  },
  email: {
    type: String,
    required: true, // El campo email es obligatorio
    unique: true,   // Debe ser único
  },
  password: {
    type: String,
    required: true, // El campo password es obligatorio
  },
  photoURL: String,
  phoneNumber: String,
  country: String,
  address: String,
  state: String,
  city: String,
  zipCode: String,
  about: String,
  role: {
    type: String,
    enum: ['admin', 'user'], // Asegura que el campo role solo puede ser 'admin' o 'user'
  },
  isPublic: Boolean,
});

// Crea el modelo Usuario usando el esquema definido
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario; // Exporta el modelo para poder usarlo en otros archivos
