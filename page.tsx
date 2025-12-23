<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zenith Focus | Premium Task Suite</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
</head>
<body>

    <div class="background-blobs"></div>

    <div class="workspace">
        <header>
            <div class="logo">ZENITH<span>FOCUS</span></div>
            <div class="premium-badge">PRO MEMBER</div>
        </header>

        <main class="glass-container">
            <div class="input-grid">
                <input type="text" id="taskInput" placeholder="What is your focus for today?">
                <input type="date" id="dateInput">
                <button class="btn-add" id="addBtn">ADD TASK</button>
            </div>

            <div class="stats-bar">
                <span id="taskCount">0 Tasks Remaining</span>
                <div class="divider"></div>
                <span id="currentDateDisplay"></span>
            </div>

            <ul class="task-list" id="taskList">
                </ul>
        </main>
    </div>

    <div id="celebrationOverlay" class="overlay">
        <div class="celebration-card">
            <div class="icon-wrap">🏆</div>
            <h2>MOMENT ACHIEVED!</h2>
            <p id="quoteText">"Your only limit is your mind."</p>
            <button class="btn-continue" onclick="closeCelebration()">Keep Moving Forward</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
