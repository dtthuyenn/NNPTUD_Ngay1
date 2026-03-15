const jwt = require("jsonwebtoken");
const fs = require("fs");

const publicKey = fs.readFileSync("public.key");

module.exports = function (req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Không có token");
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"]
    });

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).send("Token không hợp lệ");

  }

};