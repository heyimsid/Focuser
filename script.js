let tasks = JSON.parse(localStorage.getItem('zenith_pro_tasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date();
    document.getElementById('startDate').valueAsDate = today;
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    document.getElementById('endDate').valueAsDate = nextWeek;
    renderTasks();
});

function addTask() {
    const input = document.getElementById('taskInput');
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    const privacy = document.getElementById('privacyInput').value;

    if (!input.value) return;

    const newTask = {
        id: Date.now(),
        text: input.value,
        start: start,
        end: end,
        privacy: privacy,
        completed: false
    };

    tasks.unshift(newTask);
    localStorage.setItem('zenith_pro_tasks', JSON.stringify(tasks));
    renderTasks();
    input.value = "";
}

function calculateDays(start, end) {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function renderTasks() {
    const list = document.getElementById('taskList');
    const filter = document.getElementById('viewFilter').value;
    list.innerHTML = "";

    tasks.forEach(task => {
        // Privacy Filter Logic
        if (filter !== 'all' && task.privacy !== filter) return;

        const days = calculateDays(task.start, task.end);
        const li = document.createElement('li');
        li.className = 'task-card';
        li.innerHTML = `
            <div class="check-btn" onclick="completeTask(${task.id})"></div>
            <div class="task-info">
                <span class="badge ${task.privacy === 'public' ? 'badge-public' : 'badge-private'}">
                    ${task.privacy === 'public' ? '🌐 PUBLIC / COLLEGE' : '🔒 PRIVATE'}
                </span>
                <div style="margin-top:8px; font-weight:600;">${task.text}</div>
                <div class="duration-tag">⏱️ PERIOD: ${days} DAYS (${task.start} to ${task.end})</div>
            </div>
            <div style="color:#ef4444; cursor:pointer; font-size:0.8rem;" onclick="deleteTask(${task.id})">CANCEL</div>
        `;
        list.appendChild(li);
    });
}

function completeTask(id) {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    document.getElementById('celebrationOverlay').style.display = 'flex';
    document.getElementById('quoteText').innerText = "Excellent work! This task has been moved to your history.";
    
    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        localStorage.setItem('zenith_pro_tasks', JSON.stringify(tasks));
        renderTasks();
    }, 500);
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('zenith_pro_tasks', JSON.stringify(tasks));
    renderTasks();
}

function closeCelebration() {
    document.getElementById('celebrationOverlay').style.display = 'none';
}
