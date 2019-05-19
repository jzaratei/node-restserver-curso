// ===================
// Puerto
//====================

process.env.PORT = process.env.PORT ||  3000;


// ===================
// Entorno
//====================
process.env.NODE_ENV = process.env.NODE_ENV ||  'dev';


// ===================
// Vencimiento del token
//====================
//60 segundos
//60 minutos
//60 horas
//30 dias

process.env.CADUCIDAD_TOKEN = '48h';


// ===================
// seed de autenticacion
//====================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


// ===================
// Base de datos
//====================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
    
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ===================
// Google cient Id
//====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '543582637838-vih0r951i3io534e6phdstqdhpv8cgi2.apps.googleusercontent.com';