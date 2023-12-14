const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const jwtMiddleware = require('../middleware/jwtMiddleware'); // Middleware pour authentifier les utilisateurs

// Créer un nouveau groupe
router
    .route("/create")
        .post(jwtMiddleware.verifyToken,groupController.createGroup);

// router.post('/create', jwtMiddleware, groupController.createGroup);

// // Inviter un utilisateur à rejoindre un groupe
router.post("/invite/:groupId",jwtMiddleware.verifyToken,groupController.inviteToGroup);
// router
//     .route("/invite/:groupeId")
//         .post(jwtMiddleware.verifyToken,groupController.inviteToGroup);
// router.post('/invite/:groupId', jwtMiddleware, groupController.inviteToGroup);

// Accepter une invitation à rejoindre un groupe
router.post('/accept', jwtMiddleware.verifyToken, groupController.acceptInvitation);

router.post('/refuse', jwtMiddleware.verifyToken, groupController.refuseInvitation);
module.exports = router;
