
const $ = id => document.getElementById(id);

let clicks = 0;
let running = false;
let startTime = 0;
let duration = 10;
let timerInterval;

const KEY = "clickCounterLeaderboardV7";

function getScores() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ||
      { 10: {}, 20: {}, 30: {} };
  } catch {
    return { 10: {}, 20: {}, 30: {} };
  }
}

function showRanking() {
  const scores = getScores();
  const category = $("rankingDuration").value;
  const body = $("rankingBody");

  body.innerHTML = "";

  const entries = Object.entries(scores[category] || {})
    .sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    body.innerHTML = "<tr><td colspan='3'>Sin récords</td></tr>";
    return;
  }

  entries.forEach(([name, score], i) => {
    const row = document.createElement("tr");

    [i + 1, name, score].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    body.appendChild(row);
  });
}

function finishGame() {
  if (!running) return;

  running = false;
  clearInterval(timerInterval);

  $("timer").textContent = duration.toFixed(3) + " s";
  $("clickBtn").disabled = true;
  $("startBtn").disabled = false;
  $("username").disabled = false;
  $("duration").disabled = false;

  const name = $("username").value.trim();
  const scores = getScores();
  const category = String(duration);
  const oldScore = scores[category][name] ?? -1;

  let newRecord = false;

  if (clicks > oldScore) {
    scores[category][name] = clicks;
    try {
      localStorage.setItem(KEY, JSON.stringify(scores));
      newRecord = true;
    } catch {
      $("message").textContent = "No se pudo guardar el récord.";
    }
  }

  if (!$("message").textContent.includes("No se pudo")) {
    $("message").textContent = newRecord
      ? `¡Nuevo récord! ${name}: ${clicks} clicks`
      : `¡Terminaste con ${clicks} clicks!`;
  }

  $("rankingDuration").value = category;
  $("leaderboard").classList.remove("hidden");
  showRanking();
}

function startGame() {
  if (running) return;

  const name = $("username").value.trim();

  if (!name) {
    $("message").textContent = "Escribe tu nombre primero.";
    return;
  }

  resetGame();

  duration = Number($("duration").value);
  running = true;
  startTime = performance.now();

  $("username").disabled = true;
  $("duration").disabled = true;
  $("startBtn").disabled = true;
  $("clickBtn").disabled = false;

  timerInterval = setInterval(() => {
    const elapsed = performance.now() - startTime;
    const current = Math.min(elapsed, duration * 1000);

    $("timer").textContent =
      (current / 1000).toFixed(3) + " s";

    if (elapsed >= duration * 1000) {
      finishGame();
    }
  }, 10);
}

function resetGame() {
  running = false;
  clearInterval(timerInterval);
  clicks = 0;

  $("counter").textContent = "0";
  $("timer").textContent = "0.000 s";
  $("message").textContent = "";

  $("clickBtn").disabled = true;
  $("startBtn").disabled = false;
  $("username").disabled = false;
  $("duration").disabled = false;
}

$("startBtn").onclick = startGame;
$("resetBtn").onclick = resetGame;

$("clickBtn").onclick = () => {
  if (!running) return;

  if (performance.now() - startTime >= duration * 1000) {
    finishGame();
    return;
  }

  clicks++;
  $("counter").textContent = clicks;
};

$("rankingBtn").onclick = () => {
  $("leaderboard").classList.toggle("hidden");
  showRanking();
};

$("rankingDuration").onchange = showRanking;

showRanking();
