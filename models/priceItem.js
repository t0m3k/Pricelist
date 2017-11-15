var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: String,
    labour: String,
    name: String
});

module.exports = mongoose.model("User", UserSchema);