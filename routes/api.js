var express                 = require('express'),
    middleware              = require("../middleware"),
    axios                   = require("axios");
var router = express.Router({mergeParams: true});

router.get("/", function(req, res) {
    var priv = {};
    priv.description = "Your privileges";
    priv.read = req.user ? req.user.read : false;
    priv.write = req.user ? req.user.write : false;
    res.send(priv);
});

router.get("/pricelist", function(req, res) {
    var url = 'http://tracz.me/samsung/pricelist/data/get_pricelist/';
    var priv;
    axios.get(url)
    .then(data => {
        objectsData = {};
        data.data.forEach(repair => {
            var saveTo = repair.model;
            delete repair.model;
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

module.exports = router;
