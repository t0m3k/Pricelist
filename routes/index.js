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
    User.register(new User({
        username: req.body.username
    }), 
    req.body.password,
    function(err, user){
        if(err || !user) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Signed in! Welcome, " + user.username);
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