const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/v1/getAll", async (req, res) => {
  const items = await prisma.todo.findMany();
  res.json(items);
});

app.post("/api/v1/create", async (req, res) => {
  const { name, description, photo } = req.body;
  const newItem = await prisma.todo.create({
    data: { name, description, photo },
  });
  res.status(201).json(newItem);
});

app.patch("/api/v1/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedItem = await prisma.todo.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(updatedItem);
  } catch {
    res.status(404).json({ message: "Item not found" });
  }
});

app.put("/api/v1/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedItem = await prisma.todo.update({
      where: { id: Number(id) },
      data: req.body,
    });
    res.json(updatedItem);
  } catch {
    res.status(404).json({ message: "Item not found" });
  }
});

app.delete("/api/v1/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.todo.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Item deleted" });
  } catch {
    res.status(404).json({ message: "Item not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
