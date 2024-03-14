const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Manager = require("./models/Manager");
const bcrypt = require("bcrypt");
const Cashier = require("./models/Cashier");
const Employee = require("./models/Employee");
const Item = require("./models/Item");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() =>
    console.log("database connected successfully", process.env.DATABASE_URL)
  )
  .catch((err) => console.log("error connecting to db", err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}...`);
});
app.post("/create", async (req, res) => {
  let { email, password } = req.body;
  const cryptedPassword = await bcrypt.hash(password, 12);
  const newitem = await new Employee({
    email,
    password: cryptedPassword,
  }).save();
  res.json(newitem);
});
app.post("/managerlogin", async (req, res) => {
  const { email, password } = req.body;
  const user = await Manager.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "no manager with that email",
    });
  }
  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    return res.status(400).json({
      message: "Invalid credentials.Please try again.",
    });
  } else {
    return res.status(200).json({
      message: "Login successful",
    });
  }
});
app.post("/cashierlogin", async (req, res) => {
  const { email, password } = req.body;
  const user = await Cashier.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "no cashier with that email",
    });
  }
  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    return res.status(400).json({
      message: "Invalid credentials.Please try again.",
    });
  } else {
    return res.status(200).json({
      message: "Login successful",
    });
  }
});
app.post("/employeelogin", async (req, res) => {
  const { email, password } = req.body;
  const user = await Employee.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "no employee with that email",
    });
  }
  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    return res.status(400).json({
      message: "Invalid credentials.Please try again.",
    });
  } else {
    return res.status(200).json({
      message: "Login successful",
    });
  }
});
app.post("/additem", async (req, res) => {
  let { code, price, qty } = req.body;
  const newitem = await new Item({
    code,
    price,
    qty,
  }).save();
  res.json(newitem);
});
