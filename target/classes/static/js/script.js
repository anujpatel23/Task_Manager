document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('taskUser'));
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }

    // Display username
    const displayUsername = document.getElementById('displayUsername');
    if (displayUsername) {
        displayUsername.innerText = userData.username;
    }

    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const addTaskSection = document.getElementById('addTaskSection');
    
    // Navbar links
    const navAll = document.getElementById('navAll');
    const navSaveTask = document.getElementById('navSaveTask');
    const navUpcoming = document.getElementById('navUpcoming');
    const navPast = document.getElementById('navPast');
    const logoutBtn = document.getElementById('logoutBtn');

    const API_URL = 'http://localhost:8181/api';
    let allTasks = [];

    const getHeaders = () => {
        return {
            'Content-Type': 'application/json',
            'User-ID': userData.id
        };
    };

    // Render tasks based on filter
    const renderTasks = (tasksToDisplay) => {
        if (!taskList) return;
        taskList.innerHTML = '';
        
        if (tasksToDisplay.length === 0) {
            taskList.innerHTML = '<li class="list-group-item text-center">No tasks found</li>';
        } else {
            tasksToDisplay.forEach(task => {
                const li = document.createElement('li');
                li.className = `list-group-item d-flex justify-content-between align-items-center ${task.status === 'Completed' ? 'list-group-item-success' : ''}`;
                li.innerHTML = `
                    <div>
                        <h5 style="${task.status === 'Completed' ? 'text-decoration: line-through;' : ''}">${task.title}</h5>
                        <p class="mb-1">${task.description || ''}</p>
                        <small class="text-muted">Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</small>
                        <span class="badge badge-info ml-2">${task.status || 'Pending'}</span>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-success mr-2" onclick="updateTaskStatus(${task.id}, 'Completed')">Complete</button>
                        <button class="btn btn-sm btn-warning mr-2" onclick="updateTaskStatus(${task.id}, 'Pending')">Pending</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
                    </div>
                `;
                taskList.appendChild(li);
            });
        }
        
        if (taskCount) {
            taskCount.innerText = allTasks.length;
        }
    };

    // Fetch and display tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                headers: getHeaders()
            });
            if (!response.ok) throw new Error('Failed to fetch tasks');
            allTasks = await response.json();
            renderTasks(allTasks);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Add a new task
    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const dueDate = document.getElementById('dueDate').value;

            try {
                const response = await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({ title, description, dueDate, status: 'Pending' })
                });

                if (response.ok) {
                    await fetchTasks();
                    taskForm.reset();
                } else {
                    const errorData = await response.text();
                    alert('Failed to add task: ' + errorData);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Connection error while adding task');
            }
        });
    }

    // Update task status
    window.updateTaskStatus = async (taskId, status) => {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ status: status })
            });
            if (response.ok) {
                await fetchTasks();
            } else {
                alert('Failed to update task');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Delete a task
    window.deleteTask = async (taskId) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (response.ok) {
                await fetchTasks();
            } else {
                alert('Failed to delete task');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('taskUser');
            window.location.href = 'login.html';
        });
    }

    // Navbar Navigation Handlers
    navAll.addEventListener('click', (e) => {
        e.preventDefault();
        addTaskSection.style.display = 'block';
        renderTasks(allTasks);
    });

    navSaveTask.addEventListener('click', (e) => {
        e.preventDefault();
        addTaskSection.style.display = 'block';
        addTaskSection.scrollIntoView({ behavior: 'smooth' });
    });

    navUpcoming.addEventListener('click', (e) => {
        e.preventDefault();
        addTaskSection.style.display = 'none';
        const now = new Date();
        now.setHours(0,0,0,0);
        const upcoming = allTasks.filter(task => {
            if (!task.dueDate) return true;
            const taskDate = new Date(task.dueDate);
            return taskDate >= now;
        });
        renderTasks(upcoming);
    });

    navPast.addEventListener('click', (e) => {
        e.preventDefault();
        addTaskSection.style.display = 'none';
        const now = new Date();
        now.setHours(0,0,0,0);
        const past = allTasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate < now;
        });
        renderTasks(past);
    });

    // Initial fetch of tasks
    fetchTasks();
});
