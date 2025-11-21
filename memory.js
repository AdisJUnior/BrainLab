let round = 1;
let maxRounds = 6;
let gridSize = 4;
let correctCells = [];
let clicked = [];
let timeLeft = 12;
let timerInterval;

function toggleCustomMode() {
    let custom = document.getElementById("customMode").checked;
    let diff = document.getElementById("difficulty");

    diff.disabled = !custom;

    resetGame();
}

function autoDifficulty() {
    let level = parseInt(localStorage.getItem("playerLevel") || "1");

    if (level <= 10) return 4;
    if (level <= 20) return 5;
    if (level <= 30) return 6;
    return 7;
}

function startGame() {
    round = 1;
    nextRound();
}

function nextRound() {
    clicked = [];
    correctCells = [];

    let custom = document.getElementById("customMode").checked;

    if (custom) {
        gridSize = parseInt(document.getElementById("difficulty").value);
    } else {
        gridSize = autoDifficulty();
    }

    let grid = document.getElementById("grid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    let total = gridSize * gridSize;

    for (let i = 0; i < total; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.onclick = () => clickCell(i);
        grid.appendChild(cell);
    }

    let revealAmount = Math.min(3 + round, Math.floor(total / 3));

    while (correctCells.length < revealAmount) {
        let r = Math.floor(Math.random() * total);
        if (!correctCells.includes(r)) correctCells.push(r);
    }

    correctCells.forEach(i => {
        grid.children[i].classList.add("show");
    });

    setTimeout(() => {
        correctCells.forEach(i => {
            grid.children[i].classList.remove("show");
        });
    }, 1200);

    document.getElementById("roundInfo").textContent = `Kolo ${round}/${maxRounds}`;

    startTimer();
}

function startTimer() {
    timeLeft = 12;
    updateTimer();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver(false);
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById("timer").textContent = "Čas: " + timeLeft;
}

function showMessage(text, cls) {
    let msg = document.getElementById("message");
    msg.textContent = text;
    msg.className = cls;

    setTimeout(() => {
        msg.textContent = "";
        msg.className = "";
    }, 900);
}

function clickCell(i) {
    if (clicked.includes(i)) return;

    clicked.push(i);
    let cell = document.getElementById("grid").children[i];

    if (correctCells.includes(i)) {
        cell.classList.add("correct");

        if (clicked.filter(x => correctCells.includes(x)).length === correctCells.length) {
            clearInterval(timerInterval);
            round++;

            if (round > maxRounds) {
                gameOver(true);
                return;
            }

            showMessage("✔ Další kolo!", "correct-msg");

            setTimeout(() => nextRound(), 800);
        }
    } else {
        cell.classList.add("wrong");
        clearInterval(timerInterval);
        gameOver(false);
    }
}

function gameOver(win) {
    if (win) {
        showMessage("🔥 Dokončeno!", "correct-msg");
        saveScore("memory", 1);
    } else {
        showMessage("✘ Konec!", "wrong-msg");
        saveScore("memory", 0);
    }

    setTimeout(() => {
        document.getElementById("grid").innerHTML = "";
        document.getElementById("roundInfo").textContent = "";
        document.getElementById("timer").textContent = "Čas: --";
    }, 800);
}

function resetGame() {
    document.getElementById("grid").innerHTML = "";
    document.getElementById("roundInfo").textContent = "";
    document.getElementById("timer").textContent = "Čas: --";
}

function saveScore(game, score) {
    let stats = JSON.parse(localStorage.getItem("stats"));
    stats[game].push(score);
    localStorage.setItem("stats", JSON.stringify(stats));
}
