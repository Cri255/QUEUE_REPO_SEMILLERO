const amqp = require('amqplib/callback_api');
const redis = require('redis');

// Conexión a Redis
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
    console.error('Error de Redis:', err);
});

// Conectarse a Redis
redisClient.connect().then(() => {
    console.log('Conectado a Redis');

    // Conectarse a RabbitMQ y procesar las peticiones de la cola
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            const queue = 'requestQueue';

            channel.assertQueue(queue, {
                durable: true
            });

            console.log(`Esperando mensajes en la cola: ${queue}`);

            channel.consume(queue, (msg) => {
                const requestData = JSON.parse(msg.content.toString());
                console.log("Procesando petición:", requestData);

                // Simula procesamiento de la solicitud
                setTimeout(() => {
                    console.log("Petición procesada.");

                    // Disminuir el contador de la cola en Redis
                    redisClient.decr('queue_length', (err, newLength) => {
                        if (err) {
                            console.error('Error al decrementar la longitud de la cola:', err);
                        } else {
                            console.log(`Longitud de la cola actualizada: ${newLength}`);
                        }z
                    });

                    channel.ack(msg);  // Confirma que el mensaje fue procesado
                }, 2000);  // Simula un tiempo de procesamiento de 2 segundos
            }, {
                noAck: false  // No permite que el mensaje sea eliminado de la cola hasta que se confirme con 'ack'
            });
        });
    });
}).catch(err => {
    console.error('Error al conectar a Redis:', err);
});
