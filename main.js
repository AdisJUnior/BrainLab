console.log("BrainLab 2.0 loaded");

// Init stats if missing
if (!localStorage.getItem("stats")) {
    localStorage.setItem("stats", JSON.stringify({
        memory: [],
        math: [],
        attention: []
    }));
}

// DARK / LIGHT MODE GLOBAL
const body = document.body;
const toggle = document.getElementById("modeToggle");

// Load saved mode
let savedMode = localStorage.getItem("mode") || "dark";

if (savedMode === "light") {
    body.classList.add("light");
    if (toggle) toggle.textContent = "☀️";
} else {
    if (toggle) toggle.textContent = "🌙";
}

// Toggle mode
if (toggle) {
    toggle.onclick = () => {
        body.classList.toggle("light");

        if (body.classList.contains("light")) {
            localStorage.setItem("mode", "light");
            toggle.textContent = "☀️";
        } else {
            localStorage.setItem("mode", "dark");
            toggle.textContent = "🌙";
        }
    };
}
