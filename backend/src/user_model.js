var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
   nombre:String,
   apellido:String,
   edad:String,
    
}, { versionKey: false });

usuarioSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
  }
module.exports = mongoose.model("Users", usuarioSchema);

 


 