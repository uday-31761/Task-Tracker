require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const TodoModel = require("./Models/Todo");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-tracker-kur5.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use(express.json());

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// =======================
// GET ALL TASKS
// =======================
app.get("/get", async (req, res) => {
  try {
    const tasks = await TodoModel.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// =======================
// ADD TASK
// =======================
app.post("/add", async (req, res) => {
  try {
    const task = await TodoModel.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json(err);
  }
});

// =======================
// UPDATE TASK
// =======================
app.put("/update/:id", async (req, res) => {
  try {
    const updatedTask = await TodoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json(err);
  }
});

// =======================
// DELETE TASK
// =======================
app.delete("/delete/:id", async (req, res) => {
  try {
    await TodoModel.findByIdAndDelete(req.params.id);
    res.json({
      message: "Task Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// =======================
// SERVER
// =======================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
