 
 var middlewareObj = {};

 middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first!");
    res.redirect("/login");
}; 

middlewareObj.isAdmin = function(req, res, next) {
    middlewareObj.isLoggedIn(req, res, function(){
        if(req.user.isAdmin === true) {
            return next();
        }
        req.flash("error", "You don't have permission to do that!");
        res.redirect("/");
    });
}; 

middlewareObj.isLoggedInJSON = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.send("Not logged in");
};

 module.exports = middlewareObj;