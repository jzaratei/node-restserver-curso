const express = require('express');
const _ = require('underscore');


const { verificaToken, verificaAdnin_Role } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');



//=====================================
//Buscar productos
//=====================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre : regex})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Producto.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        })



})

//=====================================
//Obtener productos
//=====================================
app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Producto.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        })

})

//=====================================
//Obtener un producto por ID
//=====================================

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id, 'nombre estado descripcion precioUni', { estado: true })
        .populate('usuario')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    oki: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto,
            });
        })


})

app.post('/producto', [verificaToken, verificaAdnin_Role], (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precio,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoBD,
        })

    })

})

//=====================================
//Actualiza un producto
//=====================================

app.put('/producto/:id', [verificaToken, verificaAdnin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precio']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        })

})


//=====================================
//Eliminar un producto
//=====================================

app.delete('/producto/:id', [verificaToken, verificaAdnin_Role], (req, res) => {


    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            });
        };

        res.json({
            ok: true,
            categoria: productoBorrado,
            message: 'Producto borrada'
        });
    });


})


module.exports = app;
