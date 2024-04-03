
const User = require('../modelo/usuarios');

const jwt = require('../../service/jwt');
const bcrypt = require('bcrypt');


const register = (req, res) => {

    let params = req.body;

    if (!params.name || !params.email || !params.password) {
        return res.status(400).json({
            status: "error",
            message: "falta completar algunos datos"
        })
    }

    //verificar si existe el usuario
    User.find({
        $or: [
            { email: params.email.toLowerCase() }
        ]
    }).exec(async (error, users) => {

        if (error) {
            return res.status(500).json({
                status: "error",
                message: "Error en la consulta"
            })
        }
        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "error",
                message: "el usuario ya existe"
            })
        }

        // let pwd = await bcrypt.hash(params.password, 10);
        // params.password = pwd;

        let userToSave = new User(params)

        userToSave.save((error, userStored) => {
            if (error || !userStored) {
                return res.status(500).send({
                    status: "error",
                    messague: "error al guardar el usuario"
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Se ha registrado el usuario",
                userStored
            })
        })
    })
}

const login = (req, res) => {

    const params = req.body;

    if (!params.email || !params.password) {
        return res.status(500).send({
            status: "error",
            messague: "faltan completar algunos datos"
        });
    }

    User.findOne({ email: params.email })
        // .select({"password":0})
        .exec((error, user) => {
            if (error || !user) {
                return res.status(404).send({
                    status: "error",
                    messague: "no existe el usuario"
                });
            }

            // let pwd = bcrypt.compareSync(params.password, user.password);
            if (params.password != user.password) {
                return res.status(404).send({
                    status: "error",
                    messague: "no te has identificado corractamente"
                });
            }

            const token = jwt.createTokens(user)

            return res.status(200).json({
                status: "success",
                message: "Accion de login",
                user: {
                    id: user._id,
                    name: user.name
                },
                token
            })

        })
}

const profile =  (req, res) => {

    const id = req.params.id;

    User.findById(id)
        // .select({ password: 0 })
        .exec(async (error, userProfile) => {

            if (error || !userProfile) {
                return res.status(404).send({
                    status: "error",
                    messague: "el usuario no existe, o hay un error"
                });
            }

            return res.status(200).send({
                status: "success",
                user: userProfile
            });

        });

}

const listar = (req, res) =>{
    User.find()
        .sort({name: 1})
        .exec((error, usuario) => {
            if (error || !usuario || usuario.length <= 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "no se ha encontrado ningun articulo"
                })
            }

            res.status(200).json({
                status: "success",
                usuario
            })
        })
}

const editar = (req, res) => {

    let id = req.params.id;

    let parametros = req.body;



    User.findOneAndUpdate({ _id: id }, parametros, { new: true }, (error, userActualizado) => {

        if (error || !userActualizado) {
            console.log("sa")
            return res.status(500).json({
                status: "error",
                mensaje: "error al actualizar el articulo"
            });
        }

        return res.status(200).json({
            status: "success",
            user: userActualizado
        })
    })
}

module.exports = {
    register,
    login,
    profile,
    listar,
    editar
}