var mongoose = require('mongoose');

var PartSchema = mongoose.Schema({
    _id: String,
    description: String,
    cost: String
});

module.exports = mongoose.model("Part", PartSchema);