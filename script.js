let currentUser = localStorage.getItem('zenith_user') || "";
let tasks = JSON.parse(localStorage.getItem('zenith_pro_tasks')) || [];
let currentFilter = 'all';

// Initialize App
window.onload = () => {
    if (currentUser) {
        showApp();
    }
};

function login() {
    const name = document.getElementById('userNameInput').value;
    if (!name) return alert("Please enter your name");
    currentUser = name;
    localStorage.setItem('zenith_user', name);
    showApp();
}

function logout() {
    localStorage.removeItem('zenith_user');
    location.reload();
}

function showApp() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('displayUserName').innerText = `Hello, ${currentUser}`;
    document.getElementById('startDate').valueAsDate = new Date();
    renderTasks();
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`f-${filter}`).classList.add('active');
    renderTasks();
}

function addTask() {
    const text = document.getElementById('taskInput').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const privacy = document.getElementById('privacyInput').value;

    if (!text) return;

    const newTask = {
        id: Date.now(),
        creator: currentUser,
        text: text,
        start: start,
        end: end,
        privacy: privacy
    };

    tasks.unshift(newTask);
    localStorage.setItem('zenith_pro_tasks', JSON.stringify(tasks));
    document.getElementById('taskInput').value = "";
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    tasks.filter(t => currentFilter === 'all' || t.privacy === currentFilter).forEach(task => {
        const diff = Math.ceil((new Date(task.end) - new Date(task.start)) / (1000 * 60 * 60 * 24));
        
        const li = document.createElement('li');
        li.className = 'task-card';
        li.innerHTML = `
            <div class="check-btn" onclick="completeTask(${task.id})"></div>
            <div style="flex:1">
                <span class="creator-tag">BY: ${task.creator.toUpperCase()}</span>
                <div style="font-weight:700; font-size:1rem; margin-bottom:4px;">${task.text}</div>
                <div class="days-left">⏱️ ${diff} Day Period</div>
                <div style="font-size:0.65rem; color:var(--text-muted)">${task.start} to ${task.end}</div>
            </div>
            <button class="logout-btn" style="color:#ef4444; border:none; background:none; font-size:0.7rem;" onclick="deleteTask(${task.id})">CANCEL</button>
        `;
        list.appendChild(li);
    });
}

function completeTask(id) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('zenith_pro_tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('zenith_pro_tasks', JSON.stringify(tasks));
    renderTasks();
}
