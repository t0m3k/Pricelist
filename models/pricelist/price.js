var mongoose = require('mongoose');

var PriceSchema = mongoose.Schema({
    price: String,
    labour: mongoose.Schema.Types.Decimal,
    second: Number,
    min: Number,
    parts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PricePart"
        }
    ]
});

module.exports = mongoose.model("Price", PriceSchema);