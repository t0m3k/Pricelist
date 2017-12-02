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

exports.getPart = function(req, res) {
    Part.findOne({_id: req.params.part}, (err, part) => {
        if(err || !part) {
            res.json(null);        
        } else {
            res.json(part);
        }
    });
}

exports.createPart = function(req, res) {
    Part.create(req.body, (err, part) => {
        if(err || !part) {
            var errmessage = err ? err.message : "Error!";
            message(req, res, errmessage, "/");            
        } else {
            res.json(part);
        }
    });
}

exports.updatePart = function(req, res) {
    Part.findByIdAndUpdate(req.params.part, req.body, {new: true})
    .then(function(part){
        res.json(part);
    })
    .catch(function(err){
        var errmessage = err ? err.message : "Error!";
        message(req, res, errmessage, "/"); 
    });
}

exports.createModel = function(req, res) {
    Model.create(req.body, (err, model) => {
        if(err || !model){
            var errmessage = err ? err.message : "Error!";
            message(req, res, errmessage, "/");   
        }
        res.json(model);
    });
};

exports.getModels = function(req, res) {
    Model.find({}).populate({path: "prices", populate: {path: "parts.part"} }).exec((err, models) => {
        if(err || !models){
            res.json(null);
        } else {
            res.json(models);
        }
    }); 
};

exports.getModel = function(req, res) {
    Model.findById(req.params.model).populate({path: "prices", populate: {path: "parts.part"} }).exec((err, model) => {
        if(err || !model){
            res.json(null);
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
        var errmessage = err ? err.message : "Error!";
        message(req, res, errmessage, "/"); 
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
                    var errmessage = err ? err.message : "Error!";
                    message(req, res, errmessage, "/");  
                }
            });
            res.send("Success!");
        }
    });
};

/*
req.body sample:
{ parts:
   [ { _id: 'GH96-09837A',
       amount: '1',
       description: 'SAMSUNG A510F GALAXY A5 2016 USB FLEX',
       cost: '18.24' },
     { _id: 'GH97-14766B',
       amount: '1',
       description: 'SAMSUNG GALAXY S IV MINI / S4 MINI I9195 LCD DISPLAY + TOUCHSCREEN + FRAME WHITE',
       cost: '65.00' } ],
  name: 'Some Part',
  labour: '50',
  min: '50',
  second: '15' }

Price model:
{
    name: String,
    labour: String,
    second: {type:Number, default: 30},
    min: {type:Number, default: 50},
    parts: [
        {
            part:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Part"
            },
            amount: Number
        }
    ]
}

Part model:
{
    _id: String,
    description: String,
    cost: String
})

module.exports = mongoose.model("Price", PriceSchema);
*/

exports.createPrice = function(req, res) {
    Model.findById(req.params.model).populate({path: "prices"}).exec((err, model) => {
        if(err || !model){
            var errmessage = err ? err.message : "Error, empty element was returned!";
            message(req, res, errmessage, "/"); 
        } else {
            var bodyPrice = req.body; // create bodyPrice Price element so it can be modified

            Price.create(bodyPrice, (err, price) => {
                if(err || !price) {
                    var errmessage = err ? err.message : "Error, empty element was returned!";
                    message(req, res, errmessage, "/");  
                } else {
                    model.prices.push(price); // push created price to model and save it, this doesn't have to wait for price to be updated with parts
                    model.save().
                    then(res.json(price));
                }
            });
        }
    }); 
};

exports.getPrice = function(req, res) {
    Price.findById(req.params.price)
    .then(function(price){
        res.json(price);
    })
    .catch(function(err){
        var errmessage = err ? err.message : "Error!";
        message(req, res, errmessage, "/"); 
    });
};

exports.updatePrice = function(req, res) {
    var bodyPrice = req.body; // create bodyPrice Price element so it can be modified
    var parts;

    if(bodyPrice.parts) {
        parts = bodyPrice.parts;    // Move parts to seperate variable so Price.create won't throw an error and we can find and add them later to Price object.
    }

    bodyPrice.parts = [];

    Price.findByIdAndUpdate(bodyPrice._id, bodyPrice, {new: true})
    .then((price) => {
        if(!price) {
            var errmessage = "Error, empty element was returned!";
            message(req, res, errmessage, "/");  
        } else {
            if(parts) { //Check if we have any parts
                var findPartsPromise = []; // create array of promises to which promise for each FOUND PART will be saved
                parts.map(part => {             
                    findPartsPromise.push(Part.findById(part._id));
                });
                Promise.all(findPartsPromise)
                .then((foundParts) => { // when all promises for Part.findById
                    var newPartsPromise = []; // create array of promises to which promise of each NEW PART will be saved
                    foundParts.forEach((foundPart) => {
                        if(foundPart){
                            let amount = parts.find(part => part._id == foundPart._id).amount;
                            price.parts.push({part: foundPart, amount: amount}); // push found part to price.parts array
                            parts = parts.filter(part => part._id != foundPart._id); // remove found part from parts array
                        }
                    });
                    parts.forEach(newPart => {
                        newPartsPromise.push(Part.create(newPart)); // for each part that wasn't found create new part
                    });
                    Promise.all(newPartsPromise)
                    .then((newParts) => { // when all promises for Part.create are finished we will save new parts
                        newParts.forEach((newPart) => {
                            if(newPart){
                                let amount = parts.find(part => part._id == newPart._id).amount;
                                price.parts.push({part: newPart, amount: amount});
                            }
                        })
                        price.save()
                        .then(() => {
                            res.json(price);
                        })
                        .catch(err => {
                            var errmessage = err ? err.message : "Error, empty element was returned!";
                            message(req, res, errmessage, "/"); 
                        }); 
                    })       
                })
                .catch(err => console.log(err));
            } else {
                res.json(price);
            } 
        }
    })
    .catch(err => {
        var errmessage = err.message;
        message(req, res, errmessage, "/"); 
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
                console.log(req.params.price);
                Price.findByIdAndRemove(req.params.price, function(err){
                    if(err){
                        var errmessage = err ? err.message : "Error!";
                        message(req, res, errmessage, "/"); 
                    }
                    else {
                        model.save();
                        message(req, res, `Price ${ req.params.price } has been removed from model ${ req.params.model }`, "/");
                    }
                });
            } else {
                message(req, res, `Couldn't find price ${ req.params.price } in model ${ req.params.model }`, "/");
            }
        }
    });
};

module.exports = exports;
