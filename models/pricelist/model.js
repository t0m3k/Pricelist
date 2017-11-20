var mongoose = require('mongoose');

var ModelSchema = mongoose.Schema({
    model: String,
    name: String,
    repairs: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Price"
    }]
});

module.exports = mongoose.model("Model", ModelSchema);