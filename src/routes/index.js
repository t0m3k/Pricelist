var passport                = require('passport'),
    User                    = require('../models/user'),
    express                 = require('express');
var router = express.Router();

router.get("/", function(req, res) {
    res.render("index/home");
});

// login route
router.get("/login", function(req, res) {
    res.render("index/login");
});

// handling login
router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }));

// user sign up form
router.get("/register", function(req, res) {
    if(req.user){
        req.flash("error", "You are logged in!");
        return res.redirect("/");
    }
    res.render("index/register");
});

// handling user sign up
router.post("/register", function(req, res) {    
    if(req.user){
        req.flash("error", "You are logged in!");
        return res.redirect("/");
    } else {
        var admin;
        User.find({})
        .then(users =>{
            if(users.some(user => user.isAdmin)){ // if some of the users are admin
                admin = false; // new user will not be admin
            } else {
                admin = true; // else new user will be admin
            }
            if(req.body.username && req.body.nickname && req.body.password){
                User.register(new User({
                    username: req.body.username,
                    nickname: req.body.nickname,
                    emailConf: false,
                    read: false,
                    write: false,
                    isAdmin: admin // admin part
                    }),
                    req.body.password,
                    function(err, user){
                        if(err || !user) {
                            req.flash("error", err.message);
                            res.redirect("/register");
                        } else {
                            passport.authenticate("local")(req, res, function(){
                                req.flash("success", "Signed in! Welcome, " + user.nickname);
                                res.redirect("/");
                            });
                        }
                    }
                );
            }
            else {
                req.flash("error", "Missing field!");
                res.redirect("/register");
            }

        });
    }
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/");
});

module.exports = router;
