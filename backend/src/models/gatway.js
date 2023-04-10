const { Schema, model } = require("mongoose");

const TaskSchema = Schema(
  {
    'Categoria:':String,
    'Publicado:':String,
    'Localización:':String,
    'Precio:':String,
    'Precio/M² de terreno:':String,
    'Tamaño del Lote m²:':String,
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const gatewa =  model('scrapers', TaskSchema);

module.exports = gatewa;