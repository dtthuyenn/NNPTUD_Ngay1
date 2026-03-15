let userController = require('../controllers/users');
let jwt = require('jsonwebtoken');
const fs = require('fs');

// đọc key
const privateKey = fs.readFileSync('./private.key');
const publicKey = fs.readFileSync('./public.key');

module.exports = {

    // ===== tạo token khi login =====
    generateToken: function(user){

        const payload = {
            id: user._id,
            username: user.username
        };

        const token = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h"
        });

        return token;
    },

    // ===== middleware kiểm tra đăng nhập =====
    CheckLogin: async function (req, res, next) {

        try {

            let token = req.headers.authorization;

            if (!token || !token.startsWith("Bearer")) {
                return res.status(403).send({ message: "ban chua dang nhap" });
            }

            token = token.split(' ')[1];

            // verify bằng public key
            let result = jwt.verify(token, publicKey, {
                algorithms: ["RS256"]
            });

            let getUser = await userController.GetUserById(result.id);

            if (!getUser) {
                return res.status(403).send({ message: "ban chua dang nhap" });
            }

            req.user = getUser;

            next();

        } catch (error) {

            res.status(403).send({ message: "ban chua dang nhap" });

        }

    }

}