var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: String,
    labour: String,
    other: String
});

module.exports = mongoose.model("User", UserSchema);