const { CheckLogin, generateToken } = require('../utils/authHandler');
const User = require("../schemas/users");

var express = require("express");
var router = express.Router();

let userController = require('../controllers/users')
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

module.exports = router;