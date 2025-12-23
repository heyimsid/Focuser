// --- DATABASE & QUOTES ---
const quotes = [
    "Your only limit is your mind.",
    "Small steps lead to big results.",
    "Discipline is choosing between what you want now and what you want most.",
    "Don't stop until you're proud.",
    "Focus on being productive, not busy."
];

let tasks = JSON.parse(localStorage.getItem('zenith_tasks')) || [];

// --- DOM ELEMENTS ---
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');

// --- APP INIT ---
document.addEventListener('DOMContentLoaded', () => {
    dateInput.valueAsDate = new Date();
    document.getElementById('currentDateDisplay').innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    renderTasks();
});

// --- CORE FUNCTIONS ---
function addTask() {
    if (!taskInput.value.trim()) return;

    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        date: dateInput.value,
        completed: false
    };

    tasks.unshift(newTask);
    saveAndRender();
    taskInput.value = "";
    
    // Subtle audio feedback (Optional)
    // new Audio('https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3').play();
}

function completeTask(id) {
    // Confetti effect
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899']
    });

    // Show Popup
    const overlay = document.getElementById('celebrationOverlay');
    const quoteTxt = document.getElementById('quoteText');
    quoteTxt.innerText = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    overlay.style.display = 'flex';

    // Remove task after celebration starts
    setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }, 400);
}

function removeTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function closeCelebration() {
    document.getElementById('celebrationOverlay').style.display = 'none';
}

function saveAndRender() {
    localStorage.setItem('zenith_tasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";
    taskCount.innerText = `${tasks.length} Tasks Remaining`;

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-card';
        li.innerHTML = `
            <div class="check-btn" onclick="completeTask(${task.id})"></div>
            <div class="task-info">
                <div class="task-text">${task.text}</div>
                <div class="task-date">${new Date(task.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}</div>
            </div>
            <div class="cancel-btn" onclick="removeTask(${task.id})">CANCEL</div>
        `;
        taskList.appendChild(li);
    });
}

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') addTask(); });
