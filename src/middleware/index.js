 
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
        req.json({message: "You don't have permission to do that!"});
    });
}; 

middlewareObj.canRead = function(req, res, next) {
    middlewareObj.isLoggedIn(req, res, function(){
        if(req.user.read === true) {
            return next();
        }
        req.json({message: "You don't have permission to do that!"});
    });
}; 

middlewareObj.canWrite = function(req, res, next) {
    middlewareObj.isLoggedInJSON(req, res, function(){
        if(req.user.write === true) {
            return next();
        }
        req.json({message: "You don't have permission to do that!"});
    });
}; 

middlewareObj.isLoggedInJSON = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.send({message: "You need to log in first!"});
};

 module.exports = middlewareObj;