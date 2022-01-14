const mongoose = require('mongoose');

const appModel = mongoose.Schema({
    from: {type:String, required:true},
    content: {type:String, required:true}
});

module.exports = mongoose.model("application",appModel);