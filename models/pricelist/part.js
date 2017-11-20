var mongoose = require('mongoose');

var PartSchema = mongoose.Schema({
    part: String,
    description: String,
    cost: String
});

module.exports = mongoose.model("Part", PartSchema);