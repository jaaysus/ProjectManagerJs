const Task = require('../models/Task');

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo");
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
