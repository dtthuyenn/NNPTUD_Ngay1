const express = require("express")
const router = express.Router()
const Product = require("../schemas/products")

// CREATE
router.post("/", async (req,res)=>{
    try{
        const product = new Product(req.body)
        await product.save()
        res.send(product)
    }catch(err){
        res.status(400).send(err.message)
    }
})

// GET ALL
router.get("/", async (req,res)=>{
    const products = await Product.find({isDeleted:false})
    res.send(products)
})

// GET BY ID
router.get("/:id", async (req,res)=>{
    const product = await Product.findById(req.params.id)
    res.send(product)
})

// UPDATE
router.put("/:id", async (req,res)=>{
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.send(product)
})

// SOFT DELETE
router.delete("/:id", async (req,res)=>{
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {isDeleted:true},
        {new:true}
    )
    res.send(product)
})

module.exports = router