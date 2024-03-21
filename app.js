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
  const newitem = await new Cashier({
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
  // console.log(req);
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
  try {
    const newitem = await new Item({
      code,
      price,
      qty,
    }).save();
    return res.status(200).json({
      message: "Added Successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "oops! the server ran into some issue" });
  }
});

app.post("/inventory", async (req, res) => {
  console.log(req.body);
  const { items } = req.body;
  items.forEach(async (it) => {
    await Item.findOneAndUpdate(
      { _id: it._id },
      {
        $set: { qty: it.qty },
      }
    );
    await Item.findOneAndUpdate(
      { _id: it._id },
      {
        $set: { price: it.price },
      }
    );
  });
  res.status(200).json({ msg: "ok" });
});
app.post("/employeechange", async (req, res) => {
  // console.log(req.body);
  try {
    const items = req.body;
    console.log(items);
    items.forEach(async (it) => {
      await Item.findOneAndUpdate(
        { _id: it._id },
        { $set: { qty: it.qty } }, // Decrease the quantity by the specified value
        { returnOriginal: false }
      );
    });
    return res.status(200).json({ message: "done" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
app.post("/bill", async (req, res) => {
  // console.log(req.body);
  try {
    const items = req.body;
    items.forEach(async (it) => {
      await Item.findOneAndUpdate(
        { code: it.code },
        { $inc: { qty: -it.qty } }, // Decrease the quantity by the specified value
        { returnOriginal: false }
      );
    });
    return res.status(200).json({ message: "done" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

app.get("/getinventory", async (req, res) => {
  try {
    const items = await Item.find();
    return res.status(200).json({ items: items });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});
