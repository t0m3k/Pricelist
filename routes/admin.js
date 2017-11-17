var express                 = require('express'),
    User                    = require('../models/user'),
    middleware              = require("../middleware");
var router = express.Router({mergeParams: true});

router.get("/", middleware.isAdmin, function(req, res) {
    res.send("You're admin");
});

router.get("/users", middleware.isAdmin, function(req, res) {
    User.find({}, function(err, users){
        res.send(users[0].username);
    })
});

module.exports = router;
