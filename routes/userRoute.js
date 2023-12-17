const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');


router
    .route("/register") // créer un compte
        .post(userController.userRegister);


router
    .route("/login") // se connecter
        .post(userController.loginRegister);

router
    .route("/:_id")
        .all(jwtMiddleware.verifyToken) //verifier le token sur toutes les routes suivantes
        .patch(userController.updateRegisterPatch)
        .put(userController.updateRegisterPut)
        .delete(userController.deleteRegister);

module.exports = router;