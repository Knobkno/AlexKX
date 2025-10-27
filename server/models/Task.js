// server/models/Task.js
const mongoose = require('mongoose');

// Definición del esquema (el molde de datos para una tarea)
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título de la tarea es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder los 100 caracteres'],
  },
  description: {
    type: String,
    trim: true,
    default: 'Tarea gestionada en MongoDB Atlas.', // Valor por defecto para las tareas ya existentes
    maxlength: [200, 'La descripción no puede exceder los 200 caracteres'],
  },
  completed: {
    type: Boolean,
    default: false, // Por defecto, una nueva tarea NO está completada
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// La línea de abajo es la que exporta el módulo para que 'server.js' pueda usarlo (require)
module.exports = mongoose.model('Task', TaskSchema);