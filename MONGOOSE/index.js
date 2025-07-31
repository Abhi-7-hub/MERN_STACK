const mongoose = require("mongoose");
const express = require("express");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/NodeJS")
  .then(() => {
    console.log("DB Connection Successful");
    run();
  })
  .catch((error) => {
    console.error("DB connection failed!!!", error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  marks: Number,
  interest: String,
});

const UserModel = mongoose.model("User", userSchema);

app.get("/users", getUserData);
app.post("/users", createUserData);
app.patch("/users/:id", updateUserData);

app.listen(6300, () => {
  console.log("Server is running on port 6300");
});

function run() {
  console.log("Ready to accept requests...");
}

async function getUserData(req, res) {
  let data = await UserModel.find();
  res.status(200).json({ message: "All user data", users: data });
}

async function createUserData(req, res) {
  const newUserData = req.body;
  let result = await UserModel.insertMany(newUserData);
  res.status(201).json({ message: "User Added", user: result });
}

async function updateUserData(req, res) {
  const { id } = req.params;
  const newData = req.body;

  let updatedUser = await UserModel.findByIdAndUpdate(id, newData, { new: true });
  res.status(201).send({ message: "User updated", user: updatedUser });
}
