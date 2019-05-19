const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    nombre: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true,
     
    }
})

categoriaSchema.methods.toJSON = function(){
    let category = this;
    let categoryObject = category.toObject();
    return categoryObject;
}

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico'});

module.exports= mongoose.model('Categoria', categoriaSchema);

