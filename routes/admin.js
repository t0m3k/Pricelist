var express                 = require('express'),
middleware                  = require("../middleware");
var router = express.Router({mergeParams: true});

router.get("/", middleware.isAdmin, function(req, res) {
    res.show("You're admin");
});

module.exports = router;
