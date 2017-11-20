var express                 = require('express'),
    bodyParser              = require('body-parser'),
    passport                = require('passport'),
    LocalStrategy           = require('passport-local'),
    mongoose                = require('mongoose'),
    flash                   = require('connect-flash'),
    methodOverride          = require('method-override'),
    LOCALCONF               = require('./local_conf.js');


// MODELS
var User                    = require('./src/models/user');

// ROUTES INIT
var indexRoutes             = require("./src/routes/index"),
    pricelistRoutes         = require("./src/routes/pricelist"),
    apiRoutes               = require("./src/routes/api"),
    adminRoutes             = require("./src/routes/admin");


var app = express();

app.set('views', __dirname + '/src/views');

mongoose.Promise = global.Promise;

// ENV VARIABLES

const PORT = process.env.PORT || LOCALCONF.PORT;
const HOST = process.env.HOST || LOCALCONF.HOST;
const MONGODB = process.env.MONGODB || LOCALCONF.MONGODB;

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

// CUSTOME SETTINGS

app.use(methodOverride("_method"));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.errorMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");
    next();
 });

mongoose.connect(MONGODB, {
    useMongoClient: true
  });



// ROUTES USE

app.use(indexRoutes);
app.use("/admin", adminRoutes);
app.use("/api", apiRoutes);
app.use("/pricelist", pricelistRoutes);

// CATCH ALL
app.get("*", function(req, res){
    res.render("partials/404");
});

app.listen(PORT, HOST, function(){
    console.log('Server is running!');
});
