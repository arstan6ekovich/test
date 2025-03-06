const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let items = [];

// GET all items
app.get("/items", (req, res) => {
  res.json(items);
});

// POST a new item
app.post("/items", (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PATCH an item
app.patch("/items/:id", (req, res) => {
  const { id } = req.params;
  const index = items.findIndex((item) => item.id == id);
  if (index === -1) return res.status(404).json({ message: "Item not found" });
  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});

// PUT (replace) an item
app.put("/items/:id", (req, res) => {
  const { id } = req.params;
  const index = items.findIndex((item) => item.id == id);
  if (index === -1) return res.status(404).json({ message: "Item not found" });
  items[index] = { id: Number(id), ...req.body };
  res.json(items[index]);
});

// DELETE an item
app.delete("/items/:id", (req, res) => {
  const { id } = req.params;
  items = items.filter((item) => item.id != id);
  res.json({ message: "Item deleted" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
