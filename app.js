var express                 = require('express'),
    bodyParser              = require('body-parser'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    mongoose                = require('mongoose'),
    flash                   = require('connect-flash'),
    LOCALCONF               = require('local_conf'),
    middleware              = require("./middleware");


// MODELS
var User                    = require('./models/user');

// ROUTES INIT
var indexRoutes             = require("./routes/index"),
    pricelistRoutes         = require("./routes/pricelist");


var app = express();

mongoose.Promise = global.Promise;

// FLASH MESSAGES
app.use(flash());

// passport configuration
app.use(require("express-session")({
    secret: "nTc$FqjBmC2RfuGhy8YEITDd*dYMxYP9K!15^^@@KxG48QWPXJShx",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(bodyParser.urlencoded({extended: true}));

// EXPOSE FILES IN 'public' TO USERS
app.use(express.static(__dirname +"/public"));

// USE ejs AS VIEW ENGINE
app.set("view engine", "ejs");

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.errorMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");
    next();
 });

mongoose.connect('mongodb://localhost/aurora', {
    useMongoClient: true
  });



// ROUTES USE

app.use(indexRoutes);
app.use("/pricelist", pricelistRoutes);

// CATCH ALL
app.get("*", function(req, res){
    res.render("partials/404")
});

app.listen(LOCALCONF.PORT, LOCALCONF.IP, function(){
    console.log('Server is running!');
});