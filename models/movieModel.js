const mongoose = require('mongoose');

const commentModel = mongoose.Schema({
    from: {type:String, required:true},
    content: {type:String, required:true}
})

const movieModel = mongoose.Schema({
    name: {type:String, required:true},
    desc: {type:String, required:true},
    director: {type:String, required:true},
    photoUrl: {type:String, required:true},
    year: {type:Number, required:true},
    imdb: {type:String, required:true},
    actors: {type:String, required:true},
    nation: {type:String, required:true},
    category: {type:String, required:true},
    views: {type:Number, required:true, default:0},
    date: {type:Date, default: Date.now()},
    comments: [commentModel]
})

module.exports = mongoose.model("movie",movieModel);