// app.js
const express = require('express');
const bodyParser = require('body-parser');
const Queue = require('./queue');

// Crear una nueva cola de tareas
const taskQueue = new Queue();
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Ruta para agregar una tarea
app.post('/add-task', (req, res) => {
    const task = req.body.task;
    taskQueue.enqueue(task);
    res.json({ success: true, message: 'Tarea agregada' });
    const respuesta = JSON.stringify(req.body)
    console.log("respuesta", respuesta)
});

// Ruta para procesar todas las tareas
app.get('/process-tasks', (req, res) => {
    if (taskQueue.isEmpty()) {
        return res.json({ success: false, message: 'No hay tareas en la cola' });
    }

    let processedTasks = '';
    while (!taskQueue.isEmpty()) {
        const task = taskQueue.dequeue();
        processedTasks += `Procesando ${task}\n`;
    }

    res.json({ success: true, message: `Tareas procesadas:\n${processedTasks}` });
});

// Servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
