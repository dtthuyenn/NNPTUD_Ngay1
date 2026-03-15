const express = require("express")
const router = express.Router()

const User = require("../schemas/user")

// CREATE
router.post("/", async(req,res)=>{
    try{
        const user = new User(req.body)
        const result = await user.save()
        res.json(result)
    }catch(err){
        res.status(400).send(err.message)
    }
})

// ENABLE USER
router.post("/enable", async(req,res)=>{

    const {email,username} = req.body

    const user = await User.findOne({
        email:email,
        username:username
    })

    if(!user){
        return res.status(404).send("User not found")
    }

    user.status = true
    await user.save()

    res.json(user)
})


// DISABLE USER
router.post("/disable", async(req,res)=>{

    const {email,username} = req.body

    const user = await User.findOne({
        email:email,
        username:username
    })

    if(!user){
        return res.status(404).send("User not found")
    }

    user.status = false
    await user.save()

    res.json(user)
})

// GET ALL
router.get("/", async(req,res)=>{
    const users = await User.find({isDeleted:false}).populate("role")
    res.json(users)
})

// GET BY ID
router.get("/:id", async(req,res)=>{
    const user = await User.findById(req.params.id).populate("role")
    res.json(user)
})

// UPDATE
router.put("/:id", async(req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.json(user)
})

// SOFT DELETE
router.delete("/:id", async(req,res)=>{
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {isDeleted:true},
        {new:true}
    )
    res.json(user)
})

module.exports = router