var express                 = require('express'),
    User                    = require('../models/user'),
    middleware              = require("../middleware");
var router = express.Router({mergeParams: true});

router.get("/", middleware.isAdmin, function(req, res) {
    res.render("admin/index");
});

router.get("/users", middleware.isAdmin, function(req, res) {
    User.find({}, function(err, users){
        if(err){
            console.log("Problems with getting users for admin/users: " + err);
            return res.redirect("back");
        }
        res.render("admin/users", {users: users});
    });
});

// USER DELETE ROUTE

router.delete("/users/:id", middleware.isAdmin, function(req, res) {
    res.send("You have reached the delete route");
});

module.exports = router;
