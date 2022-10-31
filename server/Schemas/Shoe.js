const {Schema, model} = require("mongoose");

const ShoeSchema = new Schema({
    imgSource: {
        type: String,
        required: [true, "Please provide an image source"],
    },
    brand: {
        type: String,
        required: [true, "Please provide a brand"],
    },
    model: {
        type: String,
        required: [true, "Please provide a model"],
        unique: [true, "Model already exists"]
    },
    gender: {
        type: String,
        required: [true, "Please provide the gender"],
    },
    color: {
        type: String,
    },
    madeIn: {
        type: String,
    }
});

module.exports = model("Shoe", ShoeSchema);