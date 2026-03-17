const { CheckLogin, generateToken } = require('../utils/authHandler');
const User = require("../schemas/users");

var express = require("express");
var router = express.Router();

let userController = require('../controllers/users')
<<<<<<< HEAD
let { RegisterValidator, validatedResult, ChangePasswordValidator } = require('../utils/validator')
let { CheckLogin } = require('../utils/authHandler')
let crypto = require('crypto')
let { sendMail } = require('../utils/sendMail')
//login
router.post('/login', async function (req, res, next) {
    let { username, password } = req.body;
    let result = await userController.QueryLogin(username, password);
    if (!result) {
        res.status(404).send("thong tin dang nhap khong dung")
    } else {
        res.cookie("TOKEN_NNPTUD_C3", result, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false
        })
        res.send(result)
    }
})
router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b6231b3de61addb401ea26'
    )
    res.send(newUser)
})
router.get('/me', CheckLogin, function (req, res, next) {
    res.send(req.user)
})
router.post('/changepassword', CheckLogin, ChangePasswordValidator, validatedResult, async function (req, res, next) {
    let { oldpassword, newpassword } = req.body;
    let user = req.user;
    let result = await userController.ChangePassword(user, oldpassword, newpassword);
    if (!result) {
        res.status(404).send("thong tin dang nhap khong dung")
    } else {
        res.send("doi thanh cong")
    }

})
router.post('/logout', CheckLogin, async function (req, res, next) {
    res.cookie("TOKEN_NNPTUD_C3", null, {
        maxAge: 0
    })
    res.send("logout")
})
router.post("/forgotpassword", async function (req, res, next) {
    let { email } = req.body;
    let user = await userController.GetUserByEmail(email);
    if (user) {
        user.forgotPasswordToken = crypto.randomBytes(32).toString('hex');
        user.forgotPasswordTokenExp = Date.now() + 1000 * 60 * 10;
        await user.save();
        let url = "http://localhost:3000/api/v1//auth/resetpassword/" + user.forgotPasswordToken;
        await sendMail(user.email, url);
    }
    res.send("kiem tra mail")
})
router.post('/resetpassword/:token', async function (req, res, next) {
    let { password } = req.body;
    let user = await userController.GetUserByToken(req.params.token);
    if (user) {
        user.password = password;
        user.forgotPasswordToken = null;
        user.forgotPasswordTokenExp = null;
        await user.save()
    }
    res.send("thanh cong")
})

//forgotpassword
//permission
=======
let { RegisterValidator, validatedResult } = require('../utils/validator')

const bcrypt = require("bcrypt");


// ================= CHANGE PASSWORD =================

const changePassword = async (req, res) => {
  try {

    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send("Thiếu mật khẩu");
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res
        .status(400)
        .send("Password phải có ít nhất 8 ký tự gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
    }

    const user = await User.findById(userId);

    // FIX lỗi null
    if (!user) {
      return res.status(404).send("Không tìm thấy user");
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    if (!checkPassword) {
      return res.status(400).send("oldPassword không đúng");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await user.save();

    res.send("Đổi mật khẩu thành công");

  } catch (error) {
    res.status(500).send(error.message);
  }
};
// ================= ROUTER =================

// đổi mật khẩu (phải login)
router.post("/change-password", CheckLogin, changePassword);


// login
router.post('/login', async function (req, res) {

  let { username, password } = req.body;

  let result = await userController.QueryLogin(username, password);

  if (!result) {
    return res.status(404).send("Thông tin đăng nhập không đúng");
  }

  const token = generateToken(result);

  res.send({
    user: result,
    token: token
  });

});


// register
router.post('/register', RegisterValidator, validatedResult, async function (req, res) {

  let { username, password, email } = req.body;

  let newUser = await userController.CreateAnUser(
    username,
    password,
    email,
    '69b6231b3de61addb401ea26'
  );

  res.send(newUser);

});


// lấy thông tin user hiện tại
router.get('/me', CheckLogin, function (req, res) {
  res.send(req.user);
});

>>>>>>> 849174e35d3dc4192a8386d4e7f9341f46ea1200
module.exports = router;