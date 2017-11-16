 
 var middlewareObj = {};

 middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}; 

middlewareObj.isLoggedInJSON = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.send("Not logged in");
};

 module.exports = middlewareObj;