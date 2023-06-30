const { Schema, model } = require("mongoose");

const TaskSchema = Schema(
  {
    'categoria':String,
    'fecha_publicacion':String,
    'localizacion':String,
    'precio':String,
    'precio_m2_construccion':String,
    'm2_construccion': String,
    'habitaciones': String,
    'direccion': String,
    'piso': String,
    'url': String,
    'contacto': String,
    
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const scraper =  model('scrappers_v2', TaskSchema);

module.exports = scraper;

 
 

 

 
 