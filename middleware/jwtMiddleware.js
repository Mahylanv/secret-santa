const jwt = require('jsonwebtoken');
require('dotenv').config();


// verify the user token
exports.verifyToken = async(req, res, next) => {

    try {
        const token = req.headers['authorization'];
        if (token !== undefined) {
            const playload = await new Promise((resolve, reject) => {

                jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(decoded);
                    }
                });
            });

            req.user = playload;
            next();
        }
        else {
            res.status(403).json({ message: "Accès interdit: token manquant" });
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Accès interdit: token invalid" });
    }
}
