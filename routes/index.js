var passport                = require('passport'),
    User                    = require('../models/user'),
    express                 = require('express');
var router = express.Router();

router.get("/", function(req, res) {
    res.render("home");
});

// login route
router.get("/login", function(req, res) {
    res.render("login");
});

// handling login
router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }),
    function(req, res) {
    
});

// user sign up form
router.get("/register", function(req, res) {
    res.render("register");
});

// handling user sign up
router.post("/register", function(req, res) {
    console.log(req.body.nickname);
    
    User.register(new User({
        username: req.body.username,
        nickname: req.body.nickname,
        emailConf: false,
        read: false,
        write: false,
        isAdmin: false
    }), 
    req.body.password,
    function(err, user){
        if(err || !user) {
            console.log(err);
            console.log(user.nickname);
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            console.log("We are in else!!");
            console.log(req);
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Signed in! Welcome, " + user.nickname);
                res.redirect("/");
            });
        }
    }       
);
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/");
});

module.exports = router;