
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

