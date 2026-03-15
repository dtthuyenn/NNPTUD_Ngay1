const { generateKeyPairSync } = require("crypto");
const fs = require("fs");
const path = require("path");

// tạo RSA key 2048 bit
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem"
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem"
  }
});

// đường dẫn lưu key
const privatePath = path.join(__dirname, "private.key");
const publicPath = path.join(__dirname, "public.key");

// ghi file
fs.writeFileSync(privatePath, privateKey);
fs.writeFileSync(publicPath, publicKey);

console.log("✅ RSA 2048 keys generated successfully!");
console.log("Private key:", privatePath);
console.log("Public key:", publicPath);
function generateToken(user) {

  const payload = {
    id: user._id,
    username: user.username
  };

  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "1h"
  });

}