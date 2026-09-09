const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour parser les corps de requêtes au format JSON
app.use(express.json());

// Stockage en mémoire (tableau)
let tasks = [];
let nextId = 1;

// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
  // Convertir l'ID reçu en nombre entier
  const id = parseInt(req.params.id, 10);

  // Rechercher la tâche dans le tableau
  const task = tasks.find(t => t.id === id);

  // Si non trouvée -> Erreur 404
  if (!task) {
    return res.status(404).json({ error: "Tâche non trouvée" });
  }

  // Si trouvée -> Renvoi de la tâche
  return res.json(task);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};

  if (!title) {
    return res.status(400).json({ error: "Le titre est obligatoire." });
  }

  const newTask = {
    id: nextId++,
    title: title,
    completed: false
  };

  tasks.push(newTask);
  return res.status(201).json(newTask);
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