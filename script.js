let currentUser = localStorage.getItem('zenith_user') || "";
// Simulating a Global Database using LocalStorage for demo purposes
let globalTasks = JSON.parse(localStorage.getItem('zenith_network_data')) || [];
let currentFilter = 'all';

function login() {
    const name = document.getElementById('userNameInput').value;
    if (!name || name.length < 2) return alert("Identify yourself correctly.");
    currentUser = name;
    localStorage.setItem('zenith_user', name);
    location.reload();
}

function logout() {
    localStorage.removeItem('zenith_user');
    location.reload();
}

if (currentUser) {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('displayUserName').innerText = currentUser;
    document.getElementById('startDate').valueAsDate = new Date();
    renderTasks();
}

function addTask() {
    const text = document.getElementById('taskInput').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const privacy = document.querySelector('input[name="privacy"]:checked').value;

    if (!text) return;

    const newTask = {
        id: Date.now(),
        creator: currentUser,
        text: text,
        start: start,
        end: end,
        privacy: privacy,
        completedBy: [] // Track everyone who marks it done
    };

    globalTasks.unshift(newTask);
    saveData();
}

function markDone(id) {
    const task = globalTasks.find(t => t.id === id);
    if (!task.completedBy.includes(currentUser)) {
        task.completedBy.push(currentUser);
        confetti({ particleCount: 150, spread: 70 });
        saveData();
    }
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${filter === 'my' ? 'my' : 'all'}`).classList.add('active');
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    globalTasks.filter(t => {
        if (currentFilter === 'my') return t.creator === currentUser;
        return t.privacy === 'public' || t.creator === currentUser;
    }).forEach(task => {
        const isDone = task.completedBy.includes(currentUser);
        
        const card = document.createElement('div');
        card.className = `task-card ${task.privacy} ${isDone ? 'done' : ''}`;
        
        card.innerHTML = `
            <div class="card-head">
                <span class="badge">${task.privacy.toUpperCase()}</span>
                <span class="user-id">Owner: ${task.creator}</span>
            </div>
            <h2 style="margin: 15px 0 10px 0; font-size: 1.1rem;">${task.text}</h2>
            <div style="font-size: 12px; color: var(--muted); margin-bottom: 15px;">
                📅 Period: ${task.start} to ${task.end}
            </div>
            
            <button class="primary-btn" style="width:100%; opacity: ${isDone ? 0.5 : 1}" 
                    onclick="markDone(${task.id})">
                ${isDone ? '✓ COMPLETED' : 'MARK AS DONE'}
            </button>

            ${task.privacy === 'public' && task.completedBy.length > 0 ? `
                <div class="completion-summary">
                    👥 SUBMITTED BY: ${task.completedBy.join(', ')}
                </div>
            ` : ''}
        `;
        list.appendChild(card);
    });
}

function saveData() {
    localStorage.setItem('zenith_network_data', JSON.stringify(globalTasks));
    renderTasks();
}
