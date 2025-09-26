// server.js
import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = "./db.json";

app.use(cors());
app.use(express.json());

// Helper: read & write db.json
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- Routes like json-server ---
app.get("/tasks", (req, res) => {
  const { user_id } = req.query;
  const db = readDB();
  let tasks = db.tasks;
  if (user_id) tasks = tasks.filter((t) => t.user_id === user_id);
  res.json(tasks); // [] if none
});

app.get("/users", (req, res) => {
  const { user_id } = req.query;
  const db = readDB();
  let users = db.users;
  if (user_id) users = tasks.filter((t) => t.user_id === user_id);
  res.json(users); // [] if none
});

app.post("/tasks", (req, res) => {
  const db = readDB();
  const newTask = { id: Date.now(), ...req.body };
  db.tasks.push(newTask);
  writeDB(db);
  res.status(201).json(newTask);
});


app.get("/users/:id", (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.json([]); // mimic json-server empty
  res.json(user);
});

app.post("/users", (req, res) => {
  const db = readDB();
  const newUser = req.body;
  db.users.push(newUser);
  writeDB(db);
  res.status(201).json(newUser);
});

// PATCH (update part of a task)
app.patch("/tasks/:id", (req, res) => {
  const db = readDB();
  const taskId = req.params.id;

  const taskIndex = db.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  // Update only the fields provided in req.body
  db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...req.body };

  writeDB(db);
  res.json(db.tasks[taskIndex]);
});

// DELETE (remove a task)
app.delete("/tasks/:id", (req, res) => {
  const db = readDB();
  const taskId = req.params.id;

  const taskIndex = db.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = db.tasks.splice(taskIndex, 1)[0];

  writeDB(db);
  res.json(deletedTask);
});


app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
