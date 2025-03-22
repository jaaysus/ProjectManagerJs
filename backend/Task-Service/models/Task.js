const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    deadline: Date,
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
    comments: [{ user: String, comment: String, date: Date }]
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
