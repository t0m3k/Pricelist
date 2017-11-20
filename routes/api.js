var express                 = require('express'),
    Model                   = require('../models/pricelist/model'),
    Part                    = require('../models/pricelist/part'),
    Price                   = require('../models/pricelist/Price'),
    PricePart               = require('../models/pricelist/PricePart'),
    User                    = require('../models/user'),
    middleware              = require("../middleware"),
    axios                   = require("axios");
var router = express.Router({mergeParams: true});

router.get("/", function(req, res) {
    var priv = {};
    priv.description = "Your privileges";
    priv.isAdmin = req.user ? req.user.isAdmin : false;
    priv.read = req.user ? req.user.read : false;
    priv.write = req.user ? req.user.write : false;
    res.send(priv);
});

router.get("/pricelist", function(req, res) {
    var url = 'http://tracz.me/samsung/pricelist/data/get_pricelist/';
    var priv;
    axios.get(url)
    .then(ax => {
        var objectsData = {};
        ax.data.forEach(repair => {
            repair.price = repair.part;
            var saveTo = repair.model;
            delete repair.part;
            delete repair.model;
            delete repair.id;
            if(!(saveTo in objectsData)){
                objectsData[saveTo] = [];
            }
            objectsData[saveTo].push(repair);
        });
        res.send(objectsData);    
    })
    .catch(function(err){
        console.log("Error: " + err);
    });
});

// all users

router.get("/users", middleware.isAdmin, function(req, res) {
    User.find({}, function(err, users){
        if(err){
            console.log("Problems with getting users for admin/users: " + err);
            return res.redirect("back");
        }
        res.json(users);
    });
});

// show user
router.get("/users/:id", middleware.isAdmin, function(req, res) {
    User.findById(req.params.id, function(err, user){
        if(err || !user){
            console.log("Problems with getting user for api/users/id: " + err);
            return res.json({messgae: "Couldn't find the user!"});
        }
        res.json(user);
    });
});

// user edit route
router.put("/users/:id", middleware.isAdmin, function(req, res) {
    User.findById(req.params.id, function(err, user){
        if(err || !user){
            console.log("Problems with getting user for api/user: " + err);
            return res.redirect("/admin/users");
        }
        var newU = req.body.user;
        if("isAdmin" in newU) {
            user.isAdmin = newU.isAdmin;
        }
        if("emailConf" in newU) {
            user.emailConf = newU.emailConf;
        }
        if("read" in newU) {
            user.read = newU.read;
        }
        if("write" in newU) {
            user.write = newU.write;
        }
        User.findByIdAndUpdate(user._id, user, err =>{
            if(err){
                console.log(err);
                return res.json({message: "Couldn't save the user!"})
            }
            res.json(user);
        });
    });
});

// USER DELETE ROUTE

router.delete("/users/:id", middleware.isAdmin, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("Problems with getting user for admin/user: " + err);
            return res.redirect("/admin/users");
        }
        req.flash("success", "User removed!");
        res.redirect("/admin/users");
    });
});

router.get("*", function(req, res){
    res.send({});
});

module.exports = router;
