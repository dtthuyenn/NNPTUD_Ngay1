const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const multer = require("multer");

// cấu hình upload file
const upload = multer({ dest: "uploads/" });
router.get("/:userID", async (req, res) => {
  const currentUser = req.user.id;
  const userID = req.params.userID;

  const messages = await Message.find({
    $or: [
      { from: currentUser, to: userID },
      { from: userID, to: currentUser }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});
router.post("/:userID", upload.single("file"), async (req, res) => {
  const currentUser = req.user.id;
  const userID = req.params.userID;

  let messageContent;

  if (req.file) {
    messageContent = {
      type: "file",
      text: req.file.path
    };
  } else {
    messageContent = {
      type: "text",
      text: req.body.text
    };
  }

  const message = new Message({
    from: currentUser,
    to: userID,
    messageContent
  });

  await message.save();

  res.json(message);
});
router.get("/", async (req, res) => {
  const currentUser = req.user.id;

  const result = await Message.aggregate([
    {
      $match: {
        $or: [
          { from: currentUser },
          { to: currentUser }
        ]
      }
    },
    {
      $addFields: {
        otherUser: {
          $cond: [
            { $eq: ["$from", currentUser] },
            "$to",
            "$from"
          ]
        }
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$otherUser",
        lastMessage: { $first: "$$ROOT" }
      }
    }
  ]);

  res.json(result);
});
module.exports = router;