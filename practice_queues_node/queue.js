// queue.js
class Queue {
    constructor() {
      this.items = [];
    }
  
    // Añadir un elemento al final de la cola
    enqueue(item) {
      this.items.push(item);
    }
  
    // Eliminar el primer elemento de la cola
    dequeue() {
      if (this.isEmpty()) {
        console.log('La cola está vacía');
        return null;
      }
      return this.items.shift();
    }
  
    // Verificar si la cola está vacía
    isEmpty() {
      return this.items.length === 0;
    }
  
    // Obtener el tamaño de la cola
    size() {
      return this.items.length;
    }
  
    // Mostrar el primer elemento de la cola
    front() {
      if (this.isEmpty()) {
        console.log('La cola está vacía');
        return null;
      }
      return this.items[0];
    }
  }
  
  module.exports = Queue;
  