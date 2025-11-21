let currentAnswer;

function newTask() {
    const types = ["add", "sub", "mul", "div"];
    const type = types[Math.floor(Math.random() * types.length)];

    let a, b, text;

    switch (type) {
        case "add":
            a = Math.floor(Math.random() * 200) + 20;
            b = Math.floor(Math.random() * 200) + 20;
            text = `${a} + ${b}`;
            currentAnswer = a + b;
            break;

        case "sub":
            a = Math.floor(Math.random() * 200) + 20;
            b = Math.floor(Math.random() * a);
            text = `${a} - ${b}`;
            currentAnswer = a - b;
            break;

        case "mul":
            a = Math.floor(Math.random() * 30) + 5;
            b = Math.floor(Math.random() * 20) + 3;
            text = `${a} × ${b}`;
            currentAnswer = a * b;
            break;

        case "div":
            b = Math.floor(Math.random() * 12) + 2;
            currentAnswer = Math.floor(Math.random() * 20) + 2;
            a = currentAnswer * b;
            text = `${a} ÷ ${b}`;
            break;
    }

    document.getElementById("task").textContent = text;
}

function showMessage(text, type) {
    let msg = document.getElementById("message");
    msg.textContent = text;
    msg.className = type;

    setTimeout(() => {
        msg.textContent = "";
        msg.className = "";
    }, 900);
}

function checkMath() {
    let ans = Number(document.getElementById("answer").value);

    if (ans === currentAnswer) {
        saveScore("math", 1);
        showMessage("✔ Správně!", "correct-msg");
    } else {
        saveScore("math", 0);
        showMessage(`✘ Špatně!`, "wrong-msg");
    }

    document.getElementById("answer").value = "";
    newTask();
}

newTask();

function saveScore(game, score) {
    let stats = JSON.parse(localStorage.getItem("stats"));
    stats[game].push(score);
    localStorage.setItem("stats", JSON.stringify(stats));
}
