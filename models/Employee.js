const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Employee", employeeSchema);
