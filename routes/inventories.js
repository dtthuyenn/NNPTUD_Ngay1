var express = require("express");
var router = express.Router();
let inventoryModel = require("../schemas/inventory");


// ✅ Get all (join product)
router.get("/", async (req, res) => {
  try {
    let data = await inventoryModel.find().populate("product");
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// ✅ Get by ID (join product)
router.get("/:id", async (req, res) => {
  try {
    let data = await inventoryModel
      .findById(req.params.id)
      .populate("product");
    res.send(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


router.post("/add-stock", async (req, res) => {
  try {
    let { product, quantity } = req.body;

    let inventory = await inventoryModel.findOne({ product });

    if (!inventory) {
      return res.status(404).send("Inventory not found");
    }

    inventory.stock += quantity;

    await inventory.save();

    res.send(inventory);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/remove-stock", async (req, res) => {
  try {
    let { product, quantity } = req.body;

    let inventory = await inventoryModel.findOne({ product });

    if (!inventory) {
      return res.status(404).send("Inventory not found");
    }

    if (quantity <= 0) {
      return res.status(400).send("Quantity must be > 0");
    }

    if (inventory.stock < quantity) {
      return res.status(400).send("Not enough stock");
    }

    inventory.stock -= quantity;

    await inventory.save();

    res.send(inventory);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// ✅ Reservation
router.post("/reservation", async (req, res) => {
  try {
    let { product, quantity } = req.body;

    let inventory = await inventoryModel.findOne({ product });

    if (inventory.stock < quantity) {
      return res.status(400).send("Not enough stock");
    }

    inventory.stock -= quantity;
    inventory.reserved += quantity;

    await inventory.save();

    res.send(inventory);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// ✅ Sold
router.post("/sold", async (req, res) => {
  try {
    let { product, quantity } = req.body;

    let inventory = await inventoryModel.findOne({ product });

    if (inventory.reserved < quantity) {
      return res.status(400).send("Not enough reserved");
    }

    inventory.reserved -= quantity;
    inventory.soldCount += quantity;

    await inventory.save();

    res.send(inventory);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;