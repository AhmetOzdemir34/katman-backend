const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const mainRoute = require('./routes/mainRoute');
const cookieParser = require('cookie-parser');
const activateRoute = require('./routes/activationRoute');

require("dotenv").config();
//middlewares
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials : true
}));

//express body parser
app.use(express.json());
app.use(express.urlencoded({
   extended: true
 }));

//
app.set('views');
app.set('view engine','pug')

//db
mongoose.connect(process.env.MONGODB_ADDRESS,{useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if (err) console.log(err.message);
    else console.log("DB active!");
})

//routes
app.get("/",(req,res)=>{
    return res.json({message:"KATMAN AKTIF!"});
});
app.use("/index",mainRoute);
app.use("/activation",activateRoute);

const port = process.env.PORT ;

app.listen(port, ()=>{
    console.log(port+" is active!");
})
