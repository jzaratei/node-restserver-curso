require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
//Configuracion global de rutas
app.use( require('./routes/index'));

//habilitar la carpeta public
app.use( express.static(path.resolve(__dirname , '../public')));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true},
                (err, resp) => {

        if (err) throw err;
        console.log('Base de datos ONLINE');
        }
);

app.listen(process.env.PORT, () => {
    console.log('Escuchando en puerto: ', process.env.PORT);
})