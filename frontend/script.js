const API_URL = 'http://localhost:3000/tasks';

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// carregar tarefas
async function loadTasks() {
    const response = await fetch (API_URL);
    const tasks = await response.json();

    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');

        li.innerHTML = `
        <span style = "text-decoration: ${task.completed ? 'line-through' : 'none'}"> 
            ${task.title}
        </span>
        <div>
            <button onclick="toggleTask(${task.id}, ${task.completed})">✔</button>
            <button onclick="deleteTask(${task.id})">❌</button>
        </div>
        `;

        taskList.appendChild(li);
    })
}

// adicionar tarefa
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: taskInput.value
        })
    });

    taskInput.value = '';
    taskInput.focus();
    loadTasks();
});

// deletar tarefa
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });

    loadTasks();
}

// completar tarefa
async function toggleTask(id, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            completed: completed ? 0 : 1
        })
    });

    loadTasks();
}