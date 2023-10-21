console.log('Script.js loaded');
// Function to handle user login
function login() {
    console.log('login function called');
    const loginName = document.getElementById('loginName').value;
    const loginPassword = document.getElementById('loginPassword').value;

    const userData = localStorage.getItem('userData');
    if (userData) {
        const users = JSON.parse(userData);
        const user = users.find(u => u.name === loginName && u.password === loginPassword);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'tasks.html'; // Redirect to Page 2 (To-Do List)
        } else {
            alert('Invalid credentials. Please try again or signup.');
        }
    } else {
        alert('No user data found. Please signup.');
    }
}

//Binary search to find tasks

function Binary_search(priority){
    let low = 0 , high = tasks.length
    while (low<=high) {
        let mid = low+high/2;
        if(tasks[mid]==priority){
            return mid;
        }
        else if(tasks[mid]> priority){
            high = mid-1;
        }
        else if(tasks[mid]< priority){
            low = mid+1;
        }
    }
    return -1;
}

// Function to handle user signup
function signup() {
    console.log('signup function called');
    const signupName = document.getElementById('signupName').value;
    const signupPassword = document.getElementById('signupPassword').value;

    const userData = localStorage.getItem('userData') || '[]';
    const users = JSON.parse(userData);

    if (users.some(u => u.name === signupName)) {
        alert('Username already exists. Please choose another one.');
        return;
    }

    users.push({ name: signupName, password: signupPassword });
    localStorage.setItem('userData', JSON.stringify(users));

    alert('Signup successful! Please log in.');
    clearSignupForm();
}



function clearSignupForm() {
    document.getElementById('signupName').value = '';
    document.getElementById('signupPassword').value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const showCompletedButton = document.getElementById('showCompletedButton');
    const sortByDateButton = document.getElementById('sortByDateButton');
    const sortByPriorityButton = document.getElementById('sortByPriorityButton');
    const sortTimeAddedButton = document.getElementById('sortTimeAddedButton');
    const taskList = document.getElementById('taskList');
    const completedTasksList = document.getElementById('completedTasksList');

    let showCompleted = false; // Flag to track whether completed tasks are shown
    let userTasks = JSON.parse(localStorage.getItem('userTasks')) || [];

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form submission

        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = parseInt(priorityInput.value);

        if (taskText !== '') {
            addTask(taskText, dueDate, priority);
            taskInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = ''; // Reset priority input
        }
    });

    showCompletedButton.addEventListener('click', () => {
        showCompleted = !showCompleted;
        completedTasksList.classList.toggle('d-none', !showCompleted);
        renderTasks(userTasks);
    });

sortByDateButton.addEventListener('click', () => {
        userTasks.sort((a, b) => {
            // Convert due dates to timestamps for comparison
            const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
            const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
            return dateA - dateB;
        });
        renderTasks(userTasks);
    });

deleteLastTaskButton.addEventListener('click', () => {
        if (userTasks.length > 0) {
            userTasks.pop(); // Remove the last task
            localStorage.setItem('userTasks', JSON.stringify(userTasks));
            renderTasks(userTasks);
        }
    });

    sortTimeAddedButton.addEventListener('click', () => {
        userTasks.sort((a, b) => a.time_at_which_task_is_added - b.time_at_which_task_is_added);
        renderTasks(userTasks);
    });

    sortByPriorityButton.addEventListener('click', () => {
        userTasks.sort((a, b) => a.priority - b.priority);
        renderTasks(userTasks);
    });

    function addTask(text, dueDate, priority) {
        const task = {
            text: text,
            completed: false,
            dueDate: dueDate || null,
            priority: priority || 1,
            time_at_which_task_is_added: new Date().getTime(), // Add the timestamp
        };
    
        userTasks.push(task);
        localStorage.setItem('userTasks', JSON.stringify(userTasks));
    
        renderTasks(userTasks);
    }

    function renderTasks(tasks) {
        taskList.innerHTML = '';
        completedTasksList.innerHTML = '';

        const sortButtons = document.getElementById('sortButtons');
        sortButtons.style.display = showCompleted ? 'none' : 'block'; // Toggle visibility

        if (showCompleted) {
            tasks.forEach((task, index) => {
                if (task.completed) {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleString() : '';

                    listItem.innerHTML = `
                        <del>${task.text}</del>
                        <span class="text-muted ml-2">${dueDateStr}</span>
                        <span class="badge bg-info">${task.priority}</span>
                    `;
                    completedTasksList.appendChild(listItem);
                }
            });
        }


        else {
            tasks.forEach((task, index) => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleString() : '';
    
                if (!task.completed) {
                    listItem.innerHTML = `
                        ${task.text}
                        <span class="text-muted ml-2">${dueDateStr}</span>
                        <span class="badge bg-info">${task.priority}</span>
                        <button class="btn btn-success btn-sm float-end" onclick="completeTask(${index})">Complete</button>
                    `;
                    taskList.appendChild(listItem);
                }
            });
        }
        

        
    }

    const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', () => {
    const searchTerm = prompt('Enter search term:');
    
    if (searchTerm !== null) {
        searchTasks(searchTerm);
    }
});

// Function to search for tasks
function searchTasks(searchTerm) {
    const tasksToSearch = userTasks.filter(task => !task.completed);
    const searchResults = tasksToSearch.filter(task => task.text.includes(searchTerm));

    renderTasks(searchResults);
}


    window.completeTask = function(index) {
        userTasks[index].completed = !userTasks[index].completed;
        localStorage.setItem('userTasks', JSON.stringify(userTasks));
        renderTasks(userTasks);
    };

    // Initial rendering of tasks
    renderTasks(userTasks);
});