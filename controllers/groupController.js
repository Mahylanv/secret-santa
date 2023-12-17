const Group = require('../models/groupModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.createGroup = async (req, res) => {
    try {
        // Créez un nouveau groupe
        const newGroup = new Group({
            name: req.body.name,
            admin: req.user.id
        });

        // Ajoutez l'ID du groupe à l'utilisateur admin
        const adminUser = await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { groups: newGroup._id },
            role: 'admin',
        }, { new: true });

        // Enregistrez le groupe
        const group = await newGroup.save();

        res.status(201).json({ group, adminUser });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: "Error creating group", error: error.message });
    }
};


exports.inviteToGroup = async (req, res) => {
    try {
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ message: 'Adresse email invalide' });
        }
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.admin.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "L'adresse email est requise pour envoyer une invitation" });
        }

        // et s'il est déjà membre du groupe ou a déjà reçu une invitation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isAlreadyMember = group.members.some(member => member.user.toString() === user._id.toString());
        const hasPendingInvitation = group.inviteTokens.some(inv => inv.email === email);
        if (isAlreadyMember || hasPendingInvitation) {
            return res.status(400).json({ message: "L'utilisateur est déjà membre du groupe ou a déjà une invitation en attente" });
        }

        const token = jwt.sign({ groupId: group._id, userId: user._id }, 'secretKey', { expiresIn: '24h' });
        group.inviteTokens.push({ email, token, expiresAt: new Date(Date.now() + 8640000) }); // Token valide pour 24h
        await group.save();
        
        // return the token
        res.status(200).json({ message: `Invitation créée avec succès`, token });
    } catch (error) {
        console.log(error);
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
        console.log("Tokens stockés :", group.inviteTokens);
        console.log("Token reçu :", token);
        if (group.inviteTokens.findIndex(inv => inv.token === token) === -1) {
            return res.status(400).json({ message: 'Invitation invalide ou expirée' });
        }

        group.members.push({ user: req.user.id });
        group.inviteTokens = group.inviteTokens.filter(inv => inv.token !== token);
        await group.save();

        res.status(200).json({ message: 'Invitation acceptée' });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ message: "Token invalide ou expiré" });
        } else {
            throw error; 
        }
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
        console.log("Tokens stockés :", group.inviteTokens);
        console.log("Token reçu :", token);

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


exports.updateGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.admin.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        // Mise à jour du groupe avec les nouvelles données
        group.name = req.body.name || group.name;

        await group.save();
        res.status(200).json(group);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.deleteGroup = async (req, res) => {
    console.log(req.params.groupId);
    try {
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Groupe non trouvé' });
        }

        if (group.admin.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        await Group.findByIdAndDelete(groupId);
        res.status(200).json({ message: 'Groupe supprimé' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.deleteGroupe = async (req, res) => {
    try {
        await Group.findByIdAndDelete(req.params._id);
        res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
        res.status(500).json({ message: "Error serveur" });
    }
};

