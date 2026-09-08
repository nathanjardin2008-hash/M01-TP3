const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour parser les corps de requêtes au format JSON
app.use(express.json());

// Stockage en mémoire (tableau)
let tasks = [];
let nextId = 1;

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Le titre est obligatoire.' });
  }

  const newTask = {
    id: nextId++,
    title: title,
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, completed } = req.body;

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Tâche non trouvée.' });
  }

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Tâche non trouvée.' });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.json({ message: 'Tâche supprimée avec succès.', task: deletedTask[0] });
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});