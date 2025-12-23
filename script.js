let currentUser = localStorage.getItem('zenith_pro_user') || "";
let tasks = JSON.parse(localStorage.getItem('zenith_pro_data')) || [];
let currentFilter = 'all';
let selectedPrivacy = 'private';

// Boot Logic
window.onload = () => {
    if (currentUser) {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('app').style.display = 'grid';
        document.getElementById('userName').innerText = currentUser;
        document.getElementById('startDate').valueAsDate = new Date();
        document.getElementById('endDate').valueAsDate = new Date(Date.now() + 86400000);
        renderTasks();
    }
};

function login() {
    const val = document.getElementById('userNameInput').value.trim();
    if (val.length < 2) return;
    localStorage.setItem('zenith_pro_user', val);
    location.reload();
}

function logout() {
    localStorage.removeItem('zenith_pro_user');
    location.reload();
}

function setPrivacy(val) {
    selectedPrivacy = val;
    document.getElementById('btnPriv').classList.toggle('active', val === 'private');
    document.getElementById('btnPub').classList.toggle('active', val === 'public');
}

function addTask() {
    const name = document.getElementById('taskInput').value;
    if (!name) return;

    const newTask = {
        id: "T-" + Math.random().toString(36).substr(2, 9),
        creator: currentUser,
        title: name,
        start: document.getElementById('startDate').value,
        end: document.getElementById('endDate').value,
        visibility: selectedPrivacy,
        completedBy: []
    };

    tasks.unshift(newTask);
    save();
    document.getElementById('taskInput').value = "";
}

function markDone(id) {
    const task = tasks.find(t => t.id === id);
    if (!task.completedBy.includes(currentUser)) {
        task.completedBy.push(currentUser);
        confetti({ particleCount: 150, spread: 60, origin: { y: 0.7 }, colors: ['#6366f1'] });
        save();
    }
}

function setFilter(f) {
    currentFilter = f;
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    const filtered = tasks.filter(t => {
        if (currentFilter === 'my') return t.creator === currentUser;
        return t.visibility === 'public' || t.creator === currentUser;
    });

    filtered.forEach(task => {
        const isDone = task.completedBy.includes(currentUser);
        const card = document.createElement('div');
        card.className = 'task-card';
        
        card.innerHTML = `
            <div class="task-badge badge-${task.visibility === 'public' ? 'pub' : 'priv'}">${task.visibility}</div>
            <h3 style="font-size: 1.1rem; font-weight: 700;">${task.title}</h3>
            <p style="font-size: 0.75rem; color: var(--muted);">Assigned by ${task.creator}</p>
            <div style="font-size: 0.8rem; font-weight: 600; margin: 10px 0;">
                📅 ${task.start} — ${task.end}
            </div>
            
            <button class="primary-btn" style="width:100%; margin-top: auto; filter: grayscale(${isDone?1:0});" onclick="markDone('${task.id}')">
                ${isDone ? '✓ Completed' : 'Mark as Done'}
            </button>

            ${task.visibility === 'public' && task.completedBy.length > 0 ? `
                <div class="submitters-list">
                    ${task.completedBy.map(name => `<span class="submitter-tag">${name}</span>`).join('')}
                </div>
                <p style="font-size: 9px; color: var(--muted); margin-top: 5px;">Has submitted work</p>
            ` : ''}
        `;
        list.appendChild(card);
    });
}

function save() {
    localStorage.setItem('zenith_pro_data', JSON.stringify(tasks));
    renderTasks();
}
