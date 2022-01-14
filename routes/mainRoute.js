const express = require('express');
const router = express.Router();
const mainCtrl = require('../controllers/mainCtrl');

router.route("/").get(mainCtrl.mainCtrl);
router.route("/register").post(mainCtrl.register);
router.route("/login").post(mainCtrl.login);
router.route("/logout").get(mainCtrl.logout);
router.route("/loggedin").get(mainCtrl.loggedIn);
router.route("/addmovie").post(mainCtrl.addMovie);
router.route("/addmail").post(mainCtrl.addMail);
router.route("/addapp").post(mainCtrl.addApplication);
router.route("/addflash").post(mainCtrl.addFlash); //gundem ekle
router.route("/getflash").get(mainCtrl.getFlash); //gundem ekle
router.route("/getcat").post(mainCtrl.getCat);
router.route("/getsearch").post(mainCtrl.getSearch);
router.route("/addcomment").post(mainCtrl.addComment);
router.route("/sortedusers").get(mainCtrl.sortedUsers);
router.route("/topten").get(mainCtrl.topten);
router.route("/getviews").get(mainCtrl.getViews);
router.route("/onecikart").post(mainCtrl.oneCikart);
router.route("/delmovie").post(mainCtrl.delMovie);
router.route("/sorteddatemovie").get(mainCtrl.sortedDateMovie);

router.route("/sortedsoonmovie").get(mainCtrl.sortedSoonMovie);
router.route("/addsoonmovie").post(mainCtrl.addSoonMovie);


module.exports = router
