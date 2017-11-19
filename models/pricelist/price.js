var mongoose = require('mongoose');

var PriceSchema = mongoose.Schema({
    part: String,
    labour: mongoose.Schema.Types.Decimal,
    second: mongoose.Schema.Types.Decimal,
    min: mongoose.Schema.Types.Decimal,
    parts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PricePart"
        }
    ]
});

module.exports = mongoose.model("Price", PriceSchema);