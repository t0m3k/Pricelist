var mongoose = require('mongoose');

var PartSchema = mongoose.Schema({
    part: String,
    description: String,
    cost: mongoose.Schema.Types.Decimal
});

module.exports = mongoose.model("Price", PartSchema);