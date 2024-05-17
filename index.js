const { conexion } = require("./BD/conexion");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload")

// inicializar app
console.log("app de node arrancada");

// conectar a la base de datos
conexion();

// crear servidor node
const app = express();
const puerto = process.env.PORT || 3000;

const corsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token', 'Authorization'],
	credentials: true,
	origin: '*',
	preflightContinue: false,
};

// configurar cors
app.use(cors(corsOptions));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));

// convertir body a objeto js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const rutas_usuarios = require('./rutas/usuarios');
app.use("/api/user", rutas_usuarios);

// Manejar solicitudes OPTIONS
app.options("/api/user/login", cors(corsOptions));

// crear servidor y escuchar peticiones
app.listen(puerto, ()=>{
    console.log("servidor corriendo en el puerto "+puerto);
});
