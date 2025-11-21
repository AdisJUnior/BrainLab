let currentMode = "";
let correctIndexes = [];
let clicked = [];
let timerInterval;

// extra pro tracking mód
let trackingActive = false;
let trackingPos = null;

// -------------- UI HELPERS -----------------

function showMessage(text, cls) {
    const msg = document.getElementById("message");
    msg.textContent = text;
    msg.className = cls;

    setTimeout(() => {
        msg.textContent = "";
        msg.className = "";
    }, 900);
}

function setMode(text) {
    document.getElementById("modeDisplay").textContent = text;
}

// -------------- MAIN START ------------------------

function startHardMode() {
    nextMiniGame();
}

function nextMiniGame() {
    clicked = [];
    correctIndexes = [];
    trackingActive = false;
    trackingPos = null;

    clearInterval(timerInterval);
    document.getElementById("timer").textContent = "";

    const modes = ["change", "double", "reaction", "tracking"];
    currentMode = modes[Math.floor(Math.random() * modes.length)];

    if (currentMode === "change") startChangeMode();
    if (currentMode === "double") startDoubleMode();
    if (currentMode === "reaction") startReactionMode();
    if (currentMode === "tracking") startTrackingMode();
}

// -------------- MODE 1: COLOR CHANGE ------------------------

function startChangeMode() {
    setMode("Najdi políčko, které ZMĚNILO barvu!");

    setupGrid(25, 5);

    let changeIndex = Math.floor(Math.random() * 25);
    correctIndexes = [changeIndex];

    let cell = getCell(changeIndex);

    // krátký flash
    cell.style.background = "blue";
    setTimeout(() => cell.style.background = "#222", 300);
}

function clickChangeMode(i) {
    if (correctIndexes.includes(i)) {
        saveScore("attention", 1);
        showMessage("✔ Správně!", "correct-msg");
    } else {
        saveScore("attention", 0);
        showMessage("✘ Špatně!", "wrong-msg");
    }

    setTimeout(nextMiniGame, 900);
}

// -------------- MODE 2: DOUBLE TARGET ------------------------

function startDoubleMode() {
    setMode("Najdi DVĚ správná políčka!");

    setupGrid(36, 6);

    let idx1 = Math.floor(Math.random() * 36);
    let idx2;
    do { idx2 = Math.floor(Math.random() * 36); } while (idx2 === idx1);

    correctIndexes = [idx1, idx2];

    getCell(idx1).classList.add("subtle");
    getCell(idx2).classList.add("subtle");
}

function clickDouble(i) {
    if (clicked.includes(i)) return;
    clicked.push(i);

    if (correctIndexes.includes(i)) {
        if (clicked.filter(x => correctIndexes.includes(x)).length === 2) {
            saveScore("attention", 1);
            showMessage("✔ Hotovo!", "correct-msg");
            setTimeout(nextMiniGame, 900);
        }
    } else {
        saveScore("attention", 0);
        showMessage("✘ Špatně!", "wrong-msg");
        setTimeout(nextMiniGame, 900);
    }
}

// -------------- MODE 3: REACTION TIME ------------------------

function startReactionMode() {
    setMode("Reakční test – čekej...");

    const field = document.getElementById("field");
    field.innerHTML = "";
    field.style.gridTemplateColumns = "1fr";

    let btn = document.createElement("div");
    btn.classList.add("cell");
    btn.style.width = "200px";
    btn.style.height = "200px";
    btn.style.margin = "auto";
    field.appendChild(btn);

    let start = 0;

    setTimeout(() => {
        setMode("KLIKNI TEĎ!");
        start = performance.now();

        btn.onclick = () => {
            let end = performance.now();
            let reaction = Math.floor(end - start);

            saveScore("attention", reaction);
            showMessage(`✔ ${reaction} ms`, "correct-msg");

            setTimeout(nextMiniGame, 1200);
        };
    }, Math.random() * 2000 + 800);
}

// -------------- MODE 4: TRACKING (BEZ VIDITELNÉ POZICE) ------------------------

function startTrackingMode() {
    setMode("Sleduj pohybující se bod!");

    setupGrid(25, 5);

    trackingActive = false;
    trackingPos = null;

    let pos = Math.floor(Math.random() * 25);
    getCell(pos).classList.add("target");

    let moves = 10;

    let interval = setInterval(() => {
        // zrušíme aktuální pozici
        getCell(pos).classList.remove("target");

        // nová náhodná pozice
        pos = Math.floor(Math.random() * 25);
        getCell(pos).classList.add("target");

        moves--;

        if (moves <= 0) {
            clearInterval(interval);

            // poslední pozici odstraníme → hráč ji NEVIDÍ
            getCell(pos).classList.remove("target");

            trackingPos = pos;
            trackingActive = true;

            setMode("Klikni, kde skončil (už to nevidíš)!");
        }
    }, 400);
}

function clickTracking(i) {
    if (!trackingActive) return;

    if (i === trackingPos) {
        saveScore("attention", 1);
        showMessage("✔ Přesně tady skončil!", "correct-msg");
    } else {
        saveScore("attention", 0);
        showMessage("✘ Špatně!", "wrong-msg");
    }

    trackingActive = false;
    trackingPos = null;

    setTimeout(nextMiniGame, 900);
}


// ---------------- GRID SETUP ---------------------

function setupGrid(count, columns) {
    const field = document.getElementById("field");
    field.innerHTML = "";
    field.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    for (let i = 0; i < count; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;

        // přiřazení klik funkce podle módu
        if (currentMode === "change") cell.onclick = () => clickChangeMode(i);
        if (currentMode === "double") cell.onclick = () => clickDouble(i);
        if (currentMode === "tracking") cell.onclick = () => clickTracking(i);

        field.appendChild(cell);
    }
}

function getCell(i) {
    return document.querySelectorAll(".cell")[i];
}

// ---------------- SAVE SCORE ---------------------

function saveScore(game, score) {
    let stats = JSON.parse(localStorage.getItem("stats"));
    stats[game] = stats[game] || [];
    stats[game].push(score);
    localStorage.setItem("stats", JSON.stringify(stats));
}
