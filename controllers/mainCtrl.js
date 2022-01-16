const User = require('../models/userModel');
const validator = require("email-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const sha256 = require('sha256');
const movieModel = require('../models/movieModel');
const mailModel = require('../models/mailmodel');
const appModel = require('../models/appModel');
const gundemModel = require('../models/gundemModel');
const userModel = require('../models/userModel');
const soonMovieModel = require('../models/soonMovieModel');

require('dotenv').config();

const mainCtrl = async (req,res) => {

} 

const register = async (req, res) => {
    try{
    const {username,mail,password,confirmPassword} = req.body; // catch all variables
    //validates
    if (password !== confirmPassword) {
        return res.status(200).json({
            message: "Parolanız uyuşmuyor!"
        });
    }
    if (!(password.length > 6 && password.length < 18)) {
        return res.status(200).json({
            message: "Parolanız 6-18 hane arasında olmalıdır!"
        });
    }
    if (!(validator.validate(mail))) {
        return res.status(200).json({
            message: "Mail adresinizi kontrol ediniz!"
        });
    }
    const existingUser = await User.findOne({
    mail: mail
    });
    
    if (existingUser) {
    return res.status(200).json({
        message: "Böyle bir kullanıcı mevcut!",
    });
    // *********
    }
    else{
        //kriptola
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt); 
        
        //olustur & kaydet
        const newUser = new User({
            username: username,
            mail: mail,
            password: passwordHash,
            isActive:false,
            activation: String(sha256(username+mail)).substring(0,7),
            isAdmin:false,
            point:0
        });
        const savedUser = await newUser.save();
        
        //cliente gondermek icin onaylı token olustur
        const token = jwt.sign({username: savedUser._id}, process.env.JWT_SECRET);

        //tokeni cookie olarak gonder
        //mail gonder

        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
            user: process.env.KATMAN_ADDRESS,
            pass: process.env.KATMAN_PASSWORD
            },
            tls:{
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: 'katmannamtak@hotmail.com', // sender address
            to: `${mail}`, // list of receivers
            subject: "Katman!", // Subject line
            html: `
                <h4>Katman hesabınız artık aktif!</h4>
                <p>Hesabınızı doğrulamak için lütfen bağlantıya <a href="https://katman-backend.herokuapp.com/activation/${savedUser.activation}" target="_blank">tıklayınız</a></p>
                </br>
                <b>Iletişim Adresi</b></br>
                Yer : <i>Suleyman Demirel Universitesi</i></br>
                E-Posta Adresi : <i>katmannamtak@hotmail.com</i></br>
                Destek : <a href="https://www.instagram.com/ahmetozdemir34_/" target="_blank"><i>Instagram Katman Tech</i></a>
            `, // plain text body
        });
        return res
        .cookie("token", token,{
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        .status(200)
        .json({message:"Kayıt Başarılı!"});
        }
    }

    catch(err){
        return res.status(200).json({message:err.message});
    }
}

const login = async (req,res) => {
    
    try{
        const {mail, password} = req.body;

        if(!(validator.validate(mail))){
            return res.status(404).json({message:"Mail adresinizi kontrol ediniz!"});
        }
        const existingUser = await User.findOne({mail});
        if(!existingUser){
            return res.status(404).json({message:"Bilgilerinizi kontrol ediniz!"});
        }
        existingUser.point = existingUser.point+1;
        await existingUser.save(); 
        const result = await bcrypt.compare(password, existingUser.password);
        if(!result){
            return res.status(404).json({message:"Bilgilerinizi kontrol ediniz!"});
        }

        const token = jwt.sign({username: existingUser._id,},process.env.JWT_SECRET);
  
        // send the token in a HTTP-only cookie
        return res.cookie("token", token, {
            httpOnly: true,
            secure: true, //bunu yazınca auth.js'te res.cookies degerleri alinamiyor
            sameSite: "none",
        })
        .json({message:"Giriş Başarılı"}); // user: existingUser
    }catch(err){
        return res.status(404).json({message:err.message});

    }
    
}
const logout = async (req,res) => {
    return res.cookie("token","x", {
        httpOnly: true,
        //expires: new Date(0)
    }).json({message:"Çıkış Yapıldı."}).status(200);
}
const loggedIn = async (req,res) =>{
    try {
        const token = req.cookies.token;
        if (!token) return res.json({access: false});
    
        const user = jwt.verify(token, process.env.JWT_SECRET);

        const sendUser = await User.findById(user.username);

        //user.user kullanıcı id si tutuyor mongodan kullanıcı nesnesini al ve alttaki user ile yolla
        return res.json({access: true, user: sendUser});
      } catch (err) {
        return res.json({access: false});
      }
}

const addMovie = async (req,res) => {
    try{
        const {name, desc, director, photoUrl, year, imdb, actors, nation, category} = req.body;
        const newMovie = new movieModel({
            name, desc, director, photoUrl, year, imdb: String(imdb), actors, nation, category 
        });
        await newMovie.save();
        res.json({message:"Kayıt Başarılı"});
    }catch(err){
        res.json({message:err.message});
    }
}
const addMail = async (req,res) => {
    const {from, content} = req.body;
    const newMail = new mailModel({from, content});
    await newMail.save();
    res.json({message:"Mail Gönderildi."});
}
const addApplication = async (req,res) => {
    const {from, content} = req.body;
    const newApp = new appModel({from, content});
    await newApp.save();
    res.json({message:"Başvuru Gönderildi."});
}
const addFlash = async (req,res) => {
    const {header, content, post1, post2, post3} = req.body;
    const newflash = new gundemModel({
        header, content, post1, post2, post3
    });
    await newflash.save();
    res.json();
}

const getFlash = async (req,res) => {
    const checkedFlash = await gundemModel.findOne({_id:"61e2223d4dd9e8445192adb2"});

    res.json(checkedFlash);
}
const getCat = async (req,res) => {
    const arr = await movieModel.find({category:req.body.category});
    res.json(arr);
}
const getSearch = async (req,res) => {
    const {search} = req.body;
    const arr = await movieModel.find({});
    
    const arr2 = arr.filter((a)=>{
        return a.name.indexOf(search)>-1;
    })
    res.json({arr:arr2})
}
const addComment = async (req,res) => {
    const {from, content, movieid} = req.body;
    const checkedMovie = await movieModel.findOne({_id:movieid});
    if(!checkedMovie){
        return res.json({message:"Böyle bir film bulunamadı!"});
    }
    checkedMovie.comments.push({
        from,content
    }) 
    await checkedMovie.save();
    return res.json({message:"Yorum eklendi!"});
}
const sortedUsers = async (req,res) => {
    const allUsers = await userModel.find({});
    
    const sorted = allUsers.sort((a, b) => (a.point > b.point) ? -1 : 1);
    while(sorted.length>5){
        sorted.pop();
    }
    return res.json(sorted);
}
const topten = async (req,res) => {
    const allMovie = await movieModel.find({});

    const sorted = allMovie.sort((a, b) => (parseFloat(a.imdb) > parseFloat(b.imdb)) ? -1 : 1);
    while(sorted.length>10){
        sorted.pop();
    }
    return res.json(sorted);
}
const getViews = async (req,res) => {
    const allMovie = await movieModel.find({});

    const sorted = allMovie.sort((a, b) => (a.views > b.views) ? -1 : 1);
    while(sorted.length>5){
        sorted.pop();
    }
    return res.json(sorted);
}
const oneCikart = async (req,res) => {
    const {movie} = req.body;
    const checkedMovie = await movieModel.findOne({_id:movie._id});
    //artir
    checkedMovie.views++;
    await checkedMovie.save();

    return res.json({message:"XXX"}); 
}
const delMovie = async (req,res) => {
    const {id} = req.body;
    const checkedMovie = await movieModel.findOne({_id:id});
    if(!checkedMovie){
        return res.json({message:"Film Bulunamadı!"});
    }
    await movieModel.deleteOne({_id:id});

    return res.json({message:"Silme İşlemi Gerçekleşti!"});
}

const sortedDateMovie = async (req,res) => {
    const allMovie = await movieModel.find({});

    const sorted = allMovie.sort((a, b) => (a.date > b.date) ? 1 : -1);
    while(sorted.length>5){
        sorted.pop();
    }
    return res.json(sorted);
}
const sortedSoonMovie = async (req,res) => {
    const allMovie = await soonMovieModel.find({});
    const sorted = allMovie.sort((a, b) => (a.date > b.date) ? 1 : -1);
    while(sorted.length>5){
        sorted.pop();
    }
    return res.json(sorted);
}
const addSoonMovie = async (req,res) => {
    try{
        const {name, photoUrl} = req.body;
        const newSoonMovie = new soonMovieModel({
            name, photoUrl
        });
        await newSoonMovie.save();
        res.json({message:"Kayıt Başarılı!"});
    }catch(err){
        res.json({message:err.message});
    }
}
module.exports = {
    delMovie, getViews, oneCikart, topten, addComment, sortedUsers, getFlash, mainCtrl, register, getSearch,
    loggedIn, logout, addMovie, addMail, addFlash, addApplication, getCat, login, sortedDateMovie, sortedSoonMovie, addSoonMovie
}
