<<<<<<< HEAD
var express = require("express");
var router = express.Router();

let roleModel = require("../schemas/roles");


router.get("/", async function (req, res, next) {
    let roles = await roleModel.find({ isDeleted: false });
    res.send(roles);
});


router.get("/:id", async function (req, res, next) {
    try {
        let result = await roleModel.find({ _id: req.params.id, isDeleted: false });
        if (result.length > 0) {
            res.send(result);
        }
        else {
            res.status(404).send({ message: "id not found" });
        }
    } catch (error) {
        res.status(404).send({ message: "id not found" });
    }
});


router.post("/", async function (req, res, next) {
    try {
        let newItem = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newItem.save();
        res.send(newItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.put("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await roleModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).send({ message: "id not found" });
        }
        res.send(updatedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

router.delete("/:id", async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await roleModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        if (!updatedItem) {
            return res.status(404).send({ message: "id not found" });
        }
        res.send(updatedItem);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

module.exports = router;

const express = require("express")
const router = express.Router()

const Role = require("../schemas/role")
const User = require("../schemas/user")   // thêm dòng này

// CREATE
router.post("/", async(req,res)=>{
    try{
        const role = new Role(req.body)
        const result = await role.save()
        res.json(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

// GET ALL
router.get("/", async(req,res)=>{
    const roles = await Role.find({isDeleted:false})
    res.json(roles)
})

// GET BY ID
router.get("/:id", async(req,res)=>{
    const role = await Role.findById(req.params.id)
    res.json(role)
})

// GET USERS BY ROLE  ⭐⭐⭐ THÊM API NÀY
router.get("/:id/users", async(req,res)=>{
    try{

        const users = await User.find({
            role: req.params.id,
            isDeleted:false
        }).populate("role")

        res.json(users)

    }catch(err){
        res.status(500).send(err.message)
    }
})

// UPDATE
router.put("/:id", async(req,res)=>{
    const role = await Role.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.json(role)
})

// SOFT DELETE
router.delete("/:id", async(req,res)=>{
    const role = await Role.findByIdAndUpdate(
        req.params.id,
        {isDeleted:true},
        {new:true}
    )
    res.json(role)
})

module.exports = router
>>>>>>> main
