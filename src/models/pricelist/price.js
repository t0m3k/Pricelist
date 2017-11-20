var mongoose = require('mongoose');

var PriceSchema = mongoose.Schema({
    name: String,
    labour: String,
    second: {type:Number, default: 30},
    min: {type:Number, default: 50},
    parts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PricePart"
        }
    ]
});

module.exports = mongoose.model("Price", PriceSchema);