const express = require("express");
const { PrismaClient } = require("@prisma/client"); // Import PrismaClient
const cors = require("cors"); // Use require for cors
const { swaggerUi, swaggerSpec } = require("./swagger");
const app = express();

const prisma = new PrismaClient(); // Initialize PrismaClient

app.use(express.json()); // Add this line to parse incoming JSON requests

app.use(
  cors({
    origin: ["http://localhost:3000", "https://mar4ik.dev"], // Allows only this origin
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/v1/getAll:
 *   get:
 *     summary: Простой пример GET запроса
 *     responses:
 *       200:
 *         description: Приветствие
 */
app.get("/api/v1/getAll", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /api/v1/create:
 *   post:
 *     summary: Создание нового todo
 *     description: Создает новый элемент todo в базе данных.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               photo:
 *                 type: string
 *               dataCreate:
 *                 type: string
 *                 format: date-time
 *               dataUpdate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Новый элемент todo успешно создан
 *       500:
 *         description: Ошибка при создании todo
 */

app.post("/api/v1/create", async (req, res) => {
  const { id, name, description, photo, dataCreate, dataUpdate } = req.body;
  const newData = {
    id: id,
    name: name,
    description: description,
    photo: photo,
    dataCreate: dataCreate,
    dataUpdate: dataUpdate,
  };
  try {
    const create = await prisma.todo.create({ data: newData });
    res.json(create);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
  console.log("Swagger UI available at http://localhost:3000/api-docs");
});
