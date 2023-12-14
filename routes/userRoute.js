const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');


router
    .route("/register")
        .post(userController.userRegister);


router
    .route("/login")
        .post(userController.loginRegister);

router
    .route("/:_id")
        .all(jwtMiddleware.verifyToken) // for verify the token for all this routes
        .patch(userController.updateRegisterPatch)
        .put(userController.updateRegisterPut)
        .delete(userController.deleteRegister);

module.exports = router;