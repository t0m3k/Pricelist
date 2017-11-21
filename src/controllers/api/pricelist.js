var express                 = require('express'),
    Model                   = require('../models/pricelist/model'),
    Part                    = require('../models/pricelist/part'),
    middleware              = require("../middleware"),
    Price                   = require('../models/pricelist/Price');
var router = express.Router({mergeParams: true});

router.get("/", function(req, res) {
    var priv = {};
    priv.description = "Your privileges";
    priv.isAdmin = req.user ? req.user.isAdmin : false;
    priv.read = req.user ? req.user.read : false;
    priv.write = req.user ? req.user.write : false;
    res.send(priv);
});

router.get("/pricelist", middleware.canRead, function(req, res) {
    Model.find({}).populate({path: "prices", populate: {path: "parts.part"} }).exec((err, model) => {
        if(err || !model){
            console.log(err);
        } else {
            res.json(model);
        }
    });
});

router.delete("/pricelist/:id", middleware.canWrite, function(req, res) {
    Model.findById(req.params.id).populate({path: "prices"}).exec((err, model) => {
        if(err || !model){
            console.log(err);
        } else {
            console.log("removing model");
            model.prices.forEach(price => {
                Price.findByIdAndRemove(price._id);
            });
            Model.findByIdAndRemove(req.params.id, err => {
                if(err) {
                    console.log(err);
                }
            });
            res.send("Success!");
        }
    });
});

router.delete("/pricelist/:model/:price", middleware.canWrite, function(req, res) {
    Model.findById(req.params.model).populate({path: "prices"}).exec((err, model) => {
        if(err || !model){
            console.log(err);
        } else {
            if(!model.prices.every(price => {
                return price._id != req.params.price;
            })){
                model.prices = model.prices.filter(price => {
                    return price._id != req.params.price;
                });
                model.save();
                Price.findByIdAndRemove(req.params.price);
                res.send("Success!");
            }
        }
    });
});

module.exports = router;
