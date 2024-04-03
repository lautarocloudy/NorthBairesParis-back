const express = require('express');
const router = express.Router();
const userController = require('../usuario/controladores/usuarios');
const middlewares = require('../middlewares/auth')


router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile/:id", middlewares.auth,  userController.profile);
router.get("/usuario", middlewares.auth, userController.listar);
router.put("/editar-usuario/:id", middlewares.auth, userController.editar);


module.exports = router;