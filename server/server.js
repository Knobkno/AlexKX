// server/server.js

// 1. Carga las variables del .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// 2. Middlewares esenciales
app.use(express.json());
app.use(cors()); 

// server/server.js (Añadir estas líneas)

// Importar el modelo de Tarea que acabas de crear
const Task = require('./models/Task');

// ----------------------------------------------------
// Rutas de la API (CRUD)
// ----------------------------------------------------

// 1. GET (Leer todas las tareas)
app.get('/api/tasks', async (req, res) => {
  try {
    // Buscar todas las tareas y ordenarlas por fecha de creación (más nuevas primero)
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// 2. POST (Crear una nueva tarea)
app.post('/api/tasks', async (req, res) => {
  try {
    // Crear una tarea con los datos recibidos en el cuerpo (req.body)
    const task = await Task.create(req.body);
    res.status(201).json({ task });
  } catch (error) {
    // Si el 'title' está vacío, mongoose devolverá un error 400
    res.status(400).json({ msg: error.message }); 
  }
});

// 3. PUT (Actualizar/Toggle la tarea - ej: marcar como completada)
app.put('/api/tasks/:id', async (req, res) => {
  const { id: taskID } = req.params;
  try {
    // Encuentra por ID y actualiza
    const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
      new: true, // Devuelve el documento actualizado
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ msg: `No task with id : ${taskID}` });
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// 4. DELETE (Eliminar una tarea)
app.delete('/api/tasks/:id', async (req, res) => {
  const { id: taskID } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: taskID });
    if (!task) {
      return res.status(404).json({ msg: `No task with id : ${taskID}` });
    }
    res.status(200).json({ msg: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// 3. Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conexión exitosa a MongoDB Atlas');
    
    // 4. Iniciar el servidor SOLO si la conexión a la BD es exitosa
    app.listen(port, () => {
      console.log(`🚀 Servidor Node.js escuchando en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    // 5. Muestra el error si falla
    console.error('❌ Error al conectar a MongoDB:', error.message);
  });

// 6. Ruta de prueba (se ve en http://localhost:5000/)
app.get('/', (req, res) => {
  res.send('API de AlexKX funcionando!');
});