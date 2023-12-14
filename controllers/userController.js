const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const saltRounds = 10;
require('dotenv').config();
const JWT_KEY='azertyuiop';
const validator = require('validator');


// security paswword
exports.hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
};

// user register
exports.userRegister = async (req, res) => {
    try {
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ message: 'Adresse e-mail invalide' });
        }

        let newUser = new User(req.body);
        newUser.password = await this.hashPassword(newUser.password);
        const user = await newUser.save();
        res.status(201).json(`{ message: User créé : ${user.email} }`);
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Requête invalide" });
    }
};

// user login
exports.loginRegister = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(500).json({ message: 'User non trouvé' });
            return;
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (passwordMatch) {
            const userData = {
                id: user._id,
                email: user.email,
                role: user.role,
            };

            const token = await jwt.sign(userData, JWT_KEY, { expiresIn: '10h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: "Email ou pw incorrect" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Impossible de générer le token" });
    }
};


// user update account
exports.updateRegisterPatch = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        const user = await User.findByIdAndUpdate(req.params._id, req.body, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User non trouvé' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.updateRegisterPut = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        const user = await User.findByIdAndUpdate(req.params._id, req.body, { new: true, overwrite: true });
        if (!user) {
            res.status(404).json({ message: 'User non trouvé' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// user delete account
exports.deleteRegister = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params._id);
        res.status(200);
        res.json({message: 'User supprimée'});
    } catch (error) {
        res.status(500);
        console.log(error);
        res.json({ message: "Erreur serveur" })
    }
}
    