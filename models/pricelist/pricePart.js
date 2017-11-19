var mongoose = require('mongoose');

var PricePartSchema = mongoose.Schema({
    amount: Number,
    price: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Price"
    },
    part: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Part"
    }
});

module.exports = mongoose.model("PricePart", PricePartSchema);