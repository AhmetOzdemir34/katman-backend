const express = require('express');
const userModel = require('../models/userModel');
const router = express.Router();

router.route("/:key")
.get(async(req,res)=>{
    try{
        const key = req.params.key;
        const checkedUser = await userModel.findOne({activation:key});
        if(!checkedUser){
            res.render("notFound");
        }else{
            checkedUser.isActive=true;
            await checkedUser.save();
            
            res.render("activationPage",{key:key, username: checkedUser.username});
        }
    }catch(err){
        res.status(404).json({message:err.message});
    }
})


module.exports = router