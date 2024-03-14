const mongoose = require("mongoose");
const itemSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Item", itemSchema);
