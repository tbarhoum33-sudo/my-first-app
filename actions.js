
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

