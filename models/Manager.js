const mongoose = require("mongoose");
const managerSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Manager", managerSchema);
