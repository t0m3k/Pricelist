var express                 = require('express'),
    middleware              = require("../middleware");
var router = express.Router({mergeParams: true});

router.get("/", middleware.isLoggedIn, function(req, res) {
    res.render("pricelist");
});

module.exports = router;
