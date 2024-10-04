
        const form = document.getElementById('taskForm');
        const taskInput = document.getElementById('taskInput');
        const taskList = document.getElementById('taskList');
        const processButton = document.getElementById('processTasks');

        // Manejar la adición de tareas
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const task = taskInput.value.trim();
            if (task) {
                fetch('/add-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ task })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const li = document.createElement('li');
                        li.textContent = task;
                        taskList.appendChild(li);
                        taskInput.value = '';

                        // Mostrar el botón de procesar si hay tareas
                        if (taskList.children.length > 0) {
                            processButton.style.display = 'block';
                        }
                    }
                });
            }
        });

        // Manejar el procesamiento de tareas
        processButton.addEventListener('click', function() {
            fetch('/process-tasks')
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    taskList.innerHTML = ''; // Limpiar la lista
                    processButton.style.display = 'none'; // Ocultar botón
                });
        });
