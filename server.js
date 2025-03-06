const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "API for managing todos",
    },
  },
  apis: ["./server.js"], // путь к файлу с документацией
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/v1/getAll:
 *   get:
 *     summary: Get all todo items
 *     responses:
 *       200:
 *         description: A list of todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   photo:
 *                     type: string
 */
app.get("/api/v1/getAll", async (req, res) => {
  const items = await prisma.todo.findMany();
  res.json(items);
});

/**
 * @swagger
 * /api/v1/create:
 *   post:
 *     summary: Create a new todo item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created todo item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 photo:
 *                   type: string
 */
app.post("/api/v1/create", async (req, res) => {
  const { name, description, photo } = req.body;
  const newItem = await prisma.todo.create({
    data: { name, description, photo },
  });
  res.status(201).json(newItem);
});

/**
 * @swagger
 * /api/v1/update/{id}:
 *   patch:
 *     summary: Update an existing todo item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The todo ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated todo item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 photo:
 *                   type: string
 *       404:
 *         description: Item not found
 */
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

/**
 * @swagger
 * /api/v1/update/{id}:
 *   put:
 *     summary: Replace an existing todo item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The todo ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               photo:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated todo item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 photo:
 *                   type: string
 *       404:
 *         description: Item not found
 */
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

/**
 * @swagger
 * /api/v1/delete/{id}:
 *   delete:
 *     summary: Delete a todo item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The todo ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The todo item was deleted
 *       404:
 *         description: Item not found
 */
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
