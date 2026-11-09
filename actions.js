
let contador = 0;

// Elementos HTML
const pantalla = document.getElementById("contador");
const titulo = document.getElementById("titulo");
const nuevoTitulo = document.getElementById("nuevoTitulo");

// Botones
const botonSumar = document.getElementById("sumar");
const botonRestar = document.getElementById("restar");
const botonReiniciar = document.getElementById("reiniciar");

// Actualizar contador
function actualizarContador() {
  pantalla.textContent = contador;
}

// Agregar evento
botonSumar.addEventListener("click", () => {
  contador++;
  actualizarContador();
});

// Quitar evento
botonRestar.addEventListener("click", () => {
  if (contador > 0) {
    contador--;
    actualizarContador();
  }
});

// Reiniciar contador
botonReiniciar.addEventListener("click", () => {
  contador = 0;
  actualizarContador();
});

// Cambiar título en tiempo real
nuevoTitulo.addEventListener("input", () => {
  titulo.textContent =
    nuevoTitulo.value || "Contador de Eventos";
});

const durationSelect = document.getElementById("duration");
const timerDisplay = document.getElementById("timer");
const counterDisplay = document.getElementById("counter");
const startBtn = document.getElementById("startBtn");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

let clicks = 0;
let duration = 10;
let startTime = 0;
let running = false;
let animationId = null;

function updateTimer() {
  if (!running) return;

  const elapsed = performance.now() - startTime;
  const maxTime = duration * 1000;
  const currentTime = Math.min(elapsed, maxTime);

  timerDisplay.textContent =
    (currentTime / 1000).toFixed(3) + " s";

  if (elapsed >= maxTime) {
    finishGame();
    return;
  }

  animationId = requestAnimationFrame(updateTimer);
}

function startGame() {
  if (running) return;

  cancelAnimationFrame(animationId);

  clicks = 0;
  duration = Number(durationSelect.value);
  counterDisplay.textContent = clicks;
  timerDisplay.textContent = "0.000 s";
  message.textContent = "";

  running = true;
  startTime = performance.now();

  startBtn.disabled = true;
  durationSelect.disabled = true;
  clickBtn.disabled = false;

  animationId = requestAnimationFrame(updateTimer);
}

function finishGame() {
  if (!running) return;

  running = false;
  cancelAnimationFrame(animationId);

  timerDisplay.textContent = duration.toFixed(3) + " s";
  clickBtn.disabled = true;
  startBtn.disabled = false;
  durationSelect.disabled = false;

  message.textContent =
    `¡Tiempo terminado! Lograste ${clicks} clicks.`;
}

function resetGame() {
  running = false;
  cancelAnimationFrame(animationId);

  clicks = 0;
  counterDisplay.textContent = "0";
  timerDisplay.textContent = "0.000 s";
  message.textContent = "";

  startBtn.disabled = false;
  clickBtn.disabled = true;
  durationSelect.disabled = false;
}

function registerClick() {
  if (!running) return;

  if (performance.now() - startTime >= duration * 1000) {
    finishGame();
    return;
  }

  clicks++;
  counterDisplay.textContent = clicks;
}

startBtn.addEventListener("click", startGame);
clickBtn.addEventListener("click", registerClick);
resetBtn.addEventListener("click", resetGame);

const usernameInput = document.getElementById("username");
const durationSelect = document.getElementById("duration");
const timerDisplay = document.getElementById("timer");
const counterDisplay = document.getElementById("counter");

const startBtn = document.getElementById("startBtn");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");
const rankingBtn = document.getElementById("rankingBtn");

const message = document.getElementById("message");
const leaderboard = document.getElementById("leaderboard");
const rankingDuration = document.getElementById("rankingDuration");
const rankingBody = document.getElementById("rankingBody");

const STORAGE_KEY = "clickCounterLeaderboardV7";

let clicks = 0;
let duration = 10;
let playerName = "";
let startTime = 0;
let running = false;
let animationId = null;
let endTimeout = null;

// Cargar los puntajes guardados
function loadRanking() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!saved || typeof saved !== "object") {
      return { "10": {}, "20": {}, "30": {} };
    }

    return {
      "10": saved["10"] || {},
      "20": saved["20"] || {},
      "30": saved["30"] || {}
    };
  } catch (error) {
    return { "10": {}, "20": {}, "30": {} };
  }
}

// Guardar un nuevo récord personal
function saveScore(name, time, score) {
  const rankings = loadRanking();
  const category = String(time);
  const previousScore = rankings[category][name];

  if (
    previousScore === undefined ||
    score > previousScore
  ) {
    rankings[category][name] = score;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(rankings)
      );
      return true;
    } catch (error) {
      message.textContent =
        "No se pudo guardar el récord en este navegador.";
      return false;
    }
  }

  return false;
}

// Mostrar tabla ordenada de mayor a menor
function showRanking() {
  const rankings = loadRanking();
  const category = rankingDuration.value;

  const sorted = Object.entries(rankings[category])
    .sort((a, b) => b[1] - a[1]);

  rankingBody.replaceChildren();

  if (sorted.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 3;
    cell.textContent = "Todavía no hay récords.";

    row.appendChild(cell);
    rankingBody.appendChild(row);
    return;
  }

  sorted.forEach(([name, score], index) => {
    const row = document.createElement("tr");

    const positionCell = document.createElement("td");
    const nameCell = document.createElement("td");
    const scoreCell = document.createElement("td");

    positionCell.textContent = index + 1;
    nameCell.textContent = name;
    scoreCell.textContent = score;

    row.append(
      positionCell,
      nameCell,
      scoreCell
    );

    rankingBody.appendChild(row);
  });
}

// Actualizar el cronómetro
function updateTimer() {
  if (!running) return;

  const elapsed = performance.now() - startTime;
  const maximum = duration * 1000;
  const current = Math.min(elapsed, maximum);

  timerDisplay.textContent =
    (current / 1000).toFixed(3) + " s";

  if (elapsed >= maximum) {
    finishGame();
    return;
  }

  animationId = requestAnimationFrame(updateTimer);
}

// Iniciar partida
function startGame() {
  if (running) return;

  const name = usernameInput.value.trim();

  if (!name) {
    message.textContent =
      "Debes escribir tu nombre antes de jugar.";
    usernameInput.focus();
    return;
  }

  cancelAnimationFrame(animationId);
  clearTimeout(endTimeout);

  playerName = name;
  duration = Number(durationSelect.value);
  clicks = 0;

  counterDisplay.textContent = "0";
  timerDisplay.textContent = "0.000 s";
  message.textContent = "";

  running = true;
  startTime = performance.now();

  usernameInput.disabled = true;
  durationSelect.disabled = true;
  startBtn.disabled = true;
  clickBtn.disabled = false;

  endTimeout = setTimeout(
    finishGame,
    duration * 1000
  );

  animationId = requestAnimationFrame(updateTimer);
}

// Finalizar partida
function finishGame() {
  if (!running) return;

  running = false;
  cancelAnimationFrame(animationId);
  clearTimeout(endTimeout);

  timerDisplay.textContent =
    duration.toFixed(3) + " s";

  clickBtn.disabled = true;
  startBtn.disabled = false;
  usernameInput.disabled = false;
  durationSelect.disabled = false;

  const newRecord = saveScore(
    playerName,
    duration,
    clicks
  );

  message.textContent = newRecord
    ? `¡Nuevo récord de ${playerName}: ${clicks} clicks!`
    : `¡Tiempo terminado! ${playerName} logró ${clicks} clicks.`;

  rankingDuration.value = String(duration);
  leaderboard.classList.remove("hidden");
  showRanking();
}

// Reiniciar partida
function resetGame() {
  running = false;

  cancelAnimationFrame(animationId);
  clearTimeout(endTimeout);

  clicks = 0;

  counterDisplay.textContent = "0";
  timerDisplay.textContent = "0.000 s";
  message.textContent = "";

  startBtn.disabled = false;
  clickBtn.disabled = true;
  usernameInput.disabled = false;
  durationSelect.disabled = false;
}

// Registrar clicks
function registerClick() {
  if (!running) return;

  if (
    performance.now() - startTime >=
    duration * 1000
  ) {
    finishGame();
    return;
  }

  clicks++;
  counterDisplay.textContent = clicks;
}

// Eventos de botones
startBtn.addEventListener("click", startGame);
clickBtn.addEventListener("click", registerClick);
resetBtn.addEventListener("click", resetGame);

rankingBtn.addEventListener("click", () => {
  leaderboard.classList.toggle("hidden");

  if (!leaderboard.classList.contains("hidden")) {
    showRanking();
  }
});

rankingDuration.addEventListener("change", showRanking);

// Mostrar los récords existentes al cargar
showRanking();

