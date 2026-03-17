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
<<<<<<< HEAD
            let token;
            if (req.cookies.TOKEN_NNPTUD_C3) {
                token = req.cookies.TOKEN_NNPTUD_C3
            } else {
                token = req.headers.authorization;
                if (!token || !token.startsWith("Bearer")) {
                    res.status(403).send({ message: "ban chua dang nhap" })
                    return;
                }
                token = token.split(' ')[1]
            }
            let result = jwt.verify(token, 'secret');
            if (result.exp * 1000 < Date.now()) {
                res.status(403).send({ message: "ban chua dang nhap" })
                return;
=======

            let token = req.headers.authorization;

            if (!token || !token.startsWith("Bearer")) {
                return res.status(403).send({ message: "ban chua dang nhap" });
>>>>>>> 849174e35d3dc4192a8386d4e7f9341f46ea1200
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

    },
    checkRole: function (...requiredRoles) {
        return function (req, res, next) {
            let roleOfUser = req.user.role.name;
            if (requiredRoles.includes(roleOfUser)) {
                next();
            } else {
                res.status(403).send("ban khong co quyen")
            }
        }
    }

}