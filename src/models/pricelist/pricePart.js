var mongoose = require('mongoose');

var PricePartSchema = mongoose.Schema({
    amount: Number,
    part: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part"
    }
});

module.exports = mongoose.model("PricePart", PricePartSchema);