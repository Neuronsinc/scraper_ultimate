const { Schema, model } = require("mongoose");

const TaskSchema = Schema(
  {
    'Nombre':String,
    'Simbolo':String,
    'Base':String,
    'id':Number,
  }
);

const paises =  model('Paises', TaskSchema, "Paises");

module.exports = paises;

 
 

 

 
 