const mongoose = require('mongoose');

const soonMovieModel = mongoose.Schema({
    name: {type:String, required:true},
    photoUrl : {type:String, required:true}
})

module.exports = mongoose.model("soonmovie", soonMovieModel);