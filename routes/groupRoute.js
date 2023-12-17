const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const jwtMiddleware = require('../middleware/jwtMiddleware'); // Middleware pour authentifier les utilisateurs

// Créer un nouveau groupe
router
    .route("/create")
        .post(jwtMiddleware.verifyToken,groupController.createGroup);


// Inviter un user dans un groupe
router.post("/invite/:groupId",jwtMiddleware.verifyToken,groupController.inviteToGroup);

// Accepter une invitation 
router.post('/accept', jwtMiddleware.verifyToken, groupController.acceptInvitation);

//Refuser une invitation
router.post('/refuse', jwtMiddleware.verifyToken, groupController.refuseInvitation);

// changer le nom du groupe
router.put('/update/:groupId',  jwtMiddleware.verifyToken, groupController.updateGroup);

// supprimer le grouper
router.delete('/delete/:groupId',  jwtMiddleware.verifyToken, groupController.deleteGroup);

//faire un tirage au sort 
router.get("/:groupId/draw", jwtMiddleware.verifyToken, groupController.shuffle);

// voir son tirage
router.get("/:groupId/my-draw/:_id", jwtMiddleware.verifyToken, groupController.mydraw);


module.exports = router;
