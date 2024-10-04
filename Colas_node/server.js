// server.js
const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const redis = require('redis');

const app = express();
const PORT = 3000;

// Middleware para parsear el cuerpo de las peticiones
app.use(bodyParser.json());

// Conexión a Redis
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Error de Redis:', err);
});

// Inicializar contador en Redis
redisClient.connect().then(() => {
    console.log('Conectado a Redis');
    redisClient.set('queue_length', 0); // Solo si la conexión es exitosa
}).catch(err => {
    console.error('Error al conectar a Redis:', err);
});

// Ruta para procesar solicitudes
app.post('/process', (req, res) => {
    const requestData = req.body;

    // Conectarse a RabbitMQ y enviar la solicitud a la cola
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            return res.status(500).json({ error: 'Error de conexión a RabbitMQ' });
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                return res.status(500).json({ error: 'Error al crear canal RabbitMQ' });
            }

            const queue = 'requestQueue';
            channel.assertQueue(queue, {
                durable: true
            });

            // Enviar el mensaje a la cola
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(requestData)), {
                persistent: true
            });

            // Incrementar el contador de la cola en Redis
            redisClient.incr('queue_length', (err) => {
                if (err) {
                    console.error('Error al incrementar la longitud de la cola:', err);
                }
            });

            console.log("Solicitud enviada a la cola:", requestData);
            res.status(200).json({ message: 'Solicitud procesada correctamente.' });

            // Cerrar la conexión después de enviar el mensaje
            setTimeout(() => {
                connection.close();
            }, 500);
        });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
