const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true })
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose.connection;