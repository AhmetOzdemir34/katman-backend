const mongoose = require('mongoose');

const mailModel = mongoose.Schema({
    from: {type:String, required:true},
    content: {type:String, required:true}
});

module.exports = mongoose.model("mail",mailModel);