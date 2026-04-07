const connect = require('../database/db');

// GET
exports.getTasks = async (req, res) => {
  const db = await connect();
  const tasks = await db.all('SELECT * FROM tasks');
  res.json(tasks);
};

// POST
exports.createTask = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Título é obrigatório' });
  }

  const db = await connect();

  const result = await db.run(
    'INSERT INTO tasks (title) VALUES (?)',
    [title]
  );

  res.status(201).json({
    id: result.lastID,
    title,
    completed: 0
  });
};

// PUT
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const db = await connect();

  await db.run(
    `UPDATE tasks 
     SET title = COALESCE(?, title),
         completed = COALESCE(?, completed)
     WHERE id = ?`,
    [title, completed, id]
  );

  res.json({ message: 'Tarefa atualizada' });
};

// DELETE
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  const db = await connect();

  await db.run('DELETE FROM tasks WHERE id = ?', [id]);

  res.status(204).send();
};