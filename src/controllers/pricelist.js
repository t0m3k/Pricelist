var Model                   = require('../models/pricelist/model'),
    Part                    = require('../models/pricelist/part'),
    message                 = require('../middleware').message,
    Price                   = require('../models/pricelist/Price');


exports.getPricelist = function(req, res) {
    Model.find({}).populate({path: "prices", populate: {path: "parts.part"} }).exec((err, model) => {
        if(err || !model){
            console.log(err);
        } else {
            res.json(model);
        }
    })
}

exports.getParts = function(req, res) {
    Part.find({}, (err, parts) => {
        if(err || !parts) {
            console.log(err);
        }
        res.json(parts);
    });
}

exports.createModel = function(req, res) {
    Model.create(req.body, (err, model) => {
        if(err || !model){
            message(req, res, err.message, "/");
        }
        res.json(model);
    });
};

exports.getModel = function(req, res) {
    Model.findById(req.params.model).populate({path: "prices"}).exec((err, model) => {
        if(err || !model){
            message(req, res, err.message, "/");
        } else {
            res.json(model);
        }
    }); 
};

exports.updateModel = function(req, res) {
    Model.findByIdAndUpdate(req.params.model, req.body, {new: true})
    .then(function(model){
        res.json(model);
    })
    .catch(function(err){
        message(req, res, err.message); 
    });
}

exports.deleteModel = function(req, res) {
    Model.findById(req.params.model).populate({path: "prices"}).exec((err, model) => {
        if(err || !model){
            console.log(err);
        } else {
            model.prices.forEach(price => {
                Price.findByIdAndRemove(price._id);
            });
            Model.findByIdAndRemove(req.params.model , err => {
                if(err) {
                    console.log(err);
                }
            });
            res.send("Success!");
        }
    });
};

exports.getPrice = function(req, res) {
    Price.findById(req.params.price)
    .then(function(price){
        res.json(price);
    })
    .catch(function(err){
        message(req, res, err.message, "/"); 
    });
};

exports.updatePrice = function(req, res) {
    Price.findById(req.params.price)
    .then(function(price){
        res.json(req.body);
    })
    .catch(function(err){
        message(req, res, err.message, "/"); 
    });
};

exports.deletePrice = function(req, res) {
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
};

module.exports = exports;
