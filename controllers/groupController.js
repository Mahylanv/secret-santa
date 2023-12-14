const Group = require('../models/groupModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.createGroup = async (req, res) => {
    try {
        const newGroup = new Group({
            name: req.body.name,
            admin: req.user.id 
        });

        const group = await newGroup.save();
        res.status(201).json(group);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur lors de la création du groupe" });
    }
};

exports.inviteToGroup = async (req, res) => {
    // console.log(req.params)
    try {
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.admin.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        const token = jwt.sign({ groupId: group._id }, 'secretKey', { expiresIn: '1h' });
        group.inviteTokens.push({ token, expiresAt: new Date(Date.now() + 3600000) }); //token valide 1h
        await group.save();

        // Envoyer le token par email ici
        res.status(200).json({ message: 'Invitation envoyée', token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// accept the invit
exports.acceptInvitation = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, 'secretKey');

        const group = await Group.findById(decoded.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.inviteTokens.findIndex(inv => inv.token === token) === -1) {
            return res.status(400).json({ message: 'Invitation invalide ou expirée' });
        }

        group.members.push({ user: req.user.id });
        group.inviteTokens = group.inviteTokens.filter(inv => inv.token !== token);
        await group.save();

        res.status(200).json({ message: 'Invitation acceptée' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur serveur" });
    }
};

//refuse the invit
exports.refuseInvitation = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = jwt.verify(token, 'secretKey');

        const group = await Group.findById(decoded.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        // Vérifie si le token est dans la liste des inviteTokens du groupe
        const tokenIndex = group.inviteTokens.findIndex(inv => inv.token === token);
        if (tokenIndex === -1) {
            return res.status(400).json({ message: 'Invitation invalide ou expirée' });
        }

        // Supprime le token d'invitation
        group.inviteTokens.splice(tokenIndex, 1);
        await group.save();

        res.status(200).json({ message: 'Invitation refusée' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erreur serveur" });
    }
};