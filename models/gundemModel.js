const mongoose = require('mongoose');

const flashModel = mongoose.Schema({
    header: {type:String, required:true},
    content: {type:String, required:true},
    post1: {type:String, required:true},
    post2: {type:String, required:true},
    post3: {type:String, required:true},
});

module.exports = mongoose.model("flash",flashModel);