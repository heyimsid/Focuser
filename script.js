let currentUser = localStorage.getItem('zenith_pro_user') || "";
let tasks = JSON.parse(localStorage.getItem('zenith_pro_data')) || [];
let currentFilter = 'all';
let selectedPrivacy = 'private';

window.onload = () => {
    if (currentUser) {
        authScreen.style.display = 'none';
        app.style.display = 'grid';
        userName.innerText = currentUser;

        startDate.valueAsDate = new Date();
        endDate.valueAsDate = new Date(Date.now() + 86400000);
        renderTasks();
    }
};

function login() {
    const name = userNameInput.value.trim();
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
    btnPriv.classList.toggle('active', v === 'private');
    btnPub.classList.toggle('active', v === 'public');
}

function setFilter(f) {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    currentFilter = f;
    renderTasks();
}

function addTask() {
    if (!taskInput.value) return;

    tasks.unshift({
        id: crypto.randomUUID(),
        creator: currentUser,
        title: taskInput.value,
        start: startDate.value,
        end: endDate.value,
        visibility: selectedPrivacy,
        completedBy: []
    });

    taskInput.value = "";
    save();
}

function markDone(id) {
    const task = tasks.find(t => t.id === id);
    if (!task.completedBy.includes(currentUser)) {
        task.completedBy.push(currentUser);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
        save();
    }
}

function renderTasks() {
    taskList.innerHTML = "";

    const filtered = tasks.filter(t =>
        currentFilter === 'my'
            ? t.creator === currentUser
            : t.visibility === 'public' || t.creator === currentUser
    );

    if (!filtered.length) {
        taskList.innerHTML = `
            <div class="empty-state">
                <h3>No missions deployed</h3>
                <p>Create your first mission to activate the network.</p>
            </div>`;
        return;
    }

    filtered.forEach(task => {
        const done = task.completedBy.includes(currentUser);
        const expired = new Date(task.end) < new Date();
        const status = done ? 'completed' : expired ? 'expired' : 'inprogress';

        const card = document.createElement('div');
        card.className = 'task-card card-glass';

        card.innerHTML = `
            <span class="task-badge badge-${task.visibility === 'public' ? 'pub' : 'priv'}">${task.visibility}</span>
            <h3>${task.title}</h3>
            <p class="creator">Assigned by ${task.creator}</p>

            <span class="status-pill ${status}">
                ${status.replace(/^\w/, c => c.toUpperCase())}
            </span>

            <p class="date">📅 ${task.start} — ${task.end}</p>

            <button class="primary-btn" ${done ? 'disabled' : ''} onclick="markDone('${task.id}')">
                ${done ? '✓ Completed' : 'Mark as Done'}
            </button>

            ${task.completedBy.length && task.visibility === 'public'
                ? `<div class="submitters-list">
                    ${task.completedBy.map(n => `<span class="submitter-tag">${n}</span>`).join('')}
                   </div>`
                : ''}
        `;

        taskList.appendChild(card);
    });
}

function save() {
    localStorage.setItem('zenith_pro_data', JSON.stringify(tasks));
    renderTasks();
}
