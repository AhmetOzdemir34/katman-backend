const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    username: {type:String, required:true},
    mail: {type:String, required:true},
    password: {type:String, required:true},
    point: {type:Number, default:0},
    activation: {type:String, required:true},
    isActive:{type:Boolean, default:false},
    isAdmin: {type:Boolean, default:false}
});

module.exports = mongoose.model("user", userModel);