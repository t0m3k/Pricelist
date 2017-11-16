var express                 = require('express'),
    middleware              = require("../middleware");
var router = express.Router({mergeParams: true});

router.get("/", middleware.isLoggedIn, function(req, res) {
    res.render("pricelist");
});

router.get("/get", middleware.isLoggedInJSON, function(req, res) {
    res.send(req.user);
});

module.exports = router;
