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