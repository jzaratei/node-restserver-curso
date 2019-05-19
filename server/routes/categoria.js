const express = require('express');
const _ = require('underscore');

let {verificaToken, verificaAdnin_Role} = require ('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');



//=====================================
//Mostrar todas las categorias
//=====================================


app.get('/categoria', verificaToken,  (req, res) => {
    

    Categoria.find({estado:true})
              .sort('nombre')
              .populate('usuario', 'nombre email')
              .exec( (err, categorias) =>{
                    if (err){
                        return res.status(400).json({
                            ok: false,
                            err
                        })
                    } 
                    Categoria.countDocuments({estado:true}, (err, conteo)=>{
                            res.json({
                                ok: true,
                                categorias, 
                                cuantos: conteo
                            });
                    });
        })
    
})

//=====================================
//Mostrar una categoria por ID
//=====================================

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, 'nombre estado', {estado: true})
    .exec( (err, categoria) =>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        } 
        res.json({
            ok: true,
            categoria,
        });
    })


})


//=====================================
//Crear nueva categoria
//=====================================

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    
    categoria.save( (err, categoriaDB) => {
      
      if (err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      
      if (!categoriaDB){
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
          ok: true,
          categoria: categoriaDB,
      });
      
    });
})

    
//=====================================
//Actualizar categoria
//=====================================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','estado']) ;

    Categoria.findByIdAndUpdate(id, body, {new:true, runValidators:true})
    .exec( (err, categoriaDB) =>{
        if (err){
            return res.status(400).json({
                ok: false,
                err
            })
        } 
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

})

//=====================================
//Eliminar una categoria
//=====================================

app.delete('/categoria/:id', [verificaToken, verificaAdnin_Role], (req, res) => {


    let id= req.params.id;
    Categoria.findByIdAndUpdate(id, {estado:false}, (err, categoriaBorrada)=>{
      if (err){
        return res.status(400).json({
          ok: false,
          err
        });
      };
      
      if (!categoriaBorrada){
        return res.status(400).json({
            ok: false,
            err: {
              message: 'Categoria no encontrada'
            }
        });
      };
      
      res.json({
        ok: true,
        categoria: categoriaBorrada,
        message: 'Categoria borrada'
      });
    });


})



module.exports = app;