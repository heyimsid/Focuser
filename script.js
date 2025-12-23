let currentUser = localStorage.getItem('zenith_pro_user') || "";
let tasks = JSON.parse(localStorage.getItem('zenith_pro_data')) || [];
let currentFilter = 'all';
let selectedPrivacy = 'private';

window.onload = () => {
    if (currentUser) {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('app').style.display = 'grid';
        document.getElementById('userName').innerText = currentUser;
        document.getElementById('avatarIcon').innerText = currentUser.split(' ').map(n => n[0]).join('').toUpperCase();

        document.getElementById('startDate').valueAsDate = new Date();
        document.getElementById('endDate').valueAsDate = new Date(Date.now() + 86400000);
        renderTasks();
    }
};

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function login() {
    const name = document.getElementById('userNameInput').value.trim();
    if (name.length < 2) return;
    localStorage.setItem('zenith_pro_user', name);
    location.reload();
}

function logout() {
    localStorage.removeItem('zenith_pro_user');
    location.reload();
}

function setPrivacy(v) {
    selectedPrivacy = v;
    document.getElementById('btnPriv').classList.toggle('active', v === 'private');
    document.getElementById('btnPub').classList.toggle('active', v === 'public');
}

function setFilter(f, btn) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = f;
    renderTasks();
    if (window.innerWidth <= 1024) toggleSidebar();
}

function addTask() {
    const input = document.getElementById('taskInput');
    if (!input.value) return;

    tasks.unshift({
        id: crypto.randomUUID(),
        creator: currentUser,
        title: input.value,
        start: document.getElementById('startDate').value,
        end: document.getElementById('endDate').value,
        visibility: selectedPrivacy,
        completedBy: []
    });

    input.value = "";
    save();
}

function markDone(id) {
    const task = tasks.find(t => t.id === id);
    if (!task.completedBy.includes(currentUser)) {
        task.completedBy.push(currentUser);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#6366f1', '#ffffff']
        });
        save();
    }
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    const filtered = tasks.filter(t =>
        currentFilter === 'my'
            ? t.creator === currentUser
            : t.visibility === 'public' || t.creator === currentUser
    );

    if (!filtered.length) {
        list.innerHTML = `<div class="empty-state"><h3>No active missions found.</h3><p>Your workspace is currently clear.</p></div>`;
        return;
    }

    filtered.forEach(task => {
        const done = task.completedBy.includes(currentUser);
        const expired = new Date(task.end) < new Date() && !done;
        const status = done ? 'completed' : expired ? 'expired' : 'inprogress';

        const card = document.createElement('div');
        card.className = 'task-card card-glass';

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center">
                <span class="status-pill ${status}">${status.toUpperCase()}</span>
                <small style="color:var(--muted); font-weight:700">${task.visibility.toUpperCase()}</small>
            </div>
            <h3>${task.title}</h3>
            <p style="font-size:0.85rem; color:var(--muted)">Assigned by <b>${task.creator}</b></p>
            
            <div style="margin: 10px 0; padding: 12px; background:rgba(0,0,0,0.2); border-radius:12px; font-size:0.8rem">
                📅 <b>${task.start}</b> <span style="color:var(--accent)">→</span> <b>${task.end}</b>
            </div>

            <button class="primary-btn" ${done ? 'disabled' : ''} onclick="markDone('${task.id}')" 
                style="${done ? 'background:var(--success); cursor:default; transform:none' : ''}">
                ${done ? '✓ Task Completed' : 'Finalize Mission'}
            </button>

            ${task.completedBy.length && task.visibility === 'public' ? `
                <div class="submitters-list" style="margin-top:10px; display:flex; flex-wrap:wrap; gap:5px">
                    ${task.completedBy.map(n => `<span style="font-size:10px; background:rgba(99,102,241,0.2); color:var(--accent); padding:4px 8px; border-radius:6px; font-weight:700">${n}</span>`).join('')}
                </div>
            ` : ''}
        `;
        list.appendChild(card);
    });
}

function save() {
    localStorage.setItem('zenith_pro_data', JSON.stringify(tasks));
    renderTasks();
}
