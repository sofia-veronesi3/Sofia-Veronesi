class Carta {
  constructor(emoji) {
    this.emoji = emoji;
    this.estado = "oculta"; //puede ser tambien mostrada o resuelta
  }
}

class Juego {
  constructor() {
    this.cartas = [];
    this.seleccionadas = [];
    this.parejasEncontradas = 0;

    this.bloqueado = false;

    this.inicio = 0;
    this.fin = 0;

    this.intentos = 0; 
    this.intervaloTiempo = null;
    this.tiempoActual = 0;
  }

  iniciar() {
    this.crearCartas();
    this.mezclar();

    this.seleccionadas = [];
    this.parejasEncontradas = 0;
    this.bloqueado = false;
    this.intentos = 0;
    this.tiempoActual = 0;
    this.intentos = 0;

    this.inicio = Date.now();
    document.getElementById("tiempo").innerHTML = "Tiempo: 0 s";
    document.getElementById("intentos").innerHTML = "Intentos: 0";
    clearInterval(this.intervaloTiempo);

  this.intervaloTiempo = setInterval(() => {
  this.tiempoActual++;

  let minutos = Math.floor(this.tiempoActual / 60);
  let segundos = this.tiempoActual % 60;

 
  minutos = minutos.toString().padStart(2, "0");
  segundos = segundos.toString().padStart(2, "0");

  document.getElementById("tiempo").innerHTML =
    "Tiempo: " + minutos + ":" + segundos;
  }, 1000);


    document.getElementById("mensaje").innerHTML = "";

    this.render();
  }

  crearCartas() {
    const emojis = [
      "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐸","🐵",
      "🐔","🐧","🐦","🐤","🦆","🦅","🦉","🐺","🐗","🐴",
      "🦄","🐝","🐛","🦋","🐌","🐞","🐜","🕷️","🦂","🐢",
      "🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦀","🐡","🐠",
      "🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍"
    ];

    let pares = [];

    emojis.forEach(e => {
      pares.push(new Carta(e));
      pares.push(new Carta(e));
    });

    this.cartas = pares;
  }

  mezclar() {
    this.cartas.sort(() => Math.random() - 0.5);
  }

  render() {
    let tablero = document.getElementById("tablero");
    tablero.innerHTML = "";

    this.cartas.forEach((carta, indice) => {
      let div = document.createElement("div");
      div.classList.add("carta");

      if (carta.estado === "mostrada") {
        div.classList.add("mostrada");
        div.innerHTML = carta.emoji;
      }

      if (carta.estado === "resuelta") {
        div.classList.add("resuelta");
        div.innerHTML = carta.emoji;
      }

      div.onclick = () => this.seleccionarCarta(indice);

      tablero.appendChild(div);
    });
  }

  seleccionarCarta(indice) {
    if (this.bloqueado) return;

    let carta = this.cartas[indice];

    if (carta.estado !== "oculta") return;

    carta.estado = "mostrada";
    this.seleccionadas.push(carta);

    this.render();

    if (this.seleccionadas.length === 2) {
        this.bloqueado = true;

        this.intentos++;
        document.getElementById("intentos").innerHTML =
        "Intentos: " + this.intentos;

        this.verificar();
    }
  }

  verificar() {
    let [c1, c2] = this.seleccionadas;

    if (c1.emoji === c2.emoji) {
      c1.estado = "resuelta";
      c2.estado = "resuelta";

      this.parejasEncontradas++;
      this.seleccionadas = [];
      this.bloqueado = false;

      this.render();

      if (this.parejasEncontradas === this.cartas.length / 2) {
        clearInterval(this.intervaloTiempo);
        this.fin = Date.now();

       let totalSegundos = Math.floor((this.fin - this.inicio) / 1000);

       let minutos = Math.floor(totalSegundos / 60);
       let segundos = totalSegundos % 60;

          minutos = minutos.toString().padStart(2, "0");
          segundos = segundos.toString().padStart(2, "0");

      let tiempoTotal = minutos + ":" + segundos;

    
        let mejorTiempo = localStorage.getItem("mejorTiempo");

        if (!mejorTiempo || tiempoTotal < mejorTiempo) {
          localStorage.setItem("mejorTiempo", tiempoTotal);
          mejorTiempo = tiempoTotal;
        }

  
        let mejorIntentos = localStorage.getItem("mejorIntentos");

        if (!mejorIntentos || this.intentos < mejorIntentos) {
          localStorage.setItem("mejorIntentos", this.intentos);
          mejorIntentos = this.intentos;
        }

        document.getElementById("mensaje").innerHTML = `
           JUEGO TERMINADO <br>
           Tiempo: ${tiempoTotal}s <br>
           Intentos: ${this.intentos} <br><br>

           Mejor tiempo: ${mejorTiempo}s <br>
           Menor cantidad de intentos: ${mejorIntentos}
        `;
      }

    } else {
      setTimeout(() => {
        c1.estado = "oculta";
        c2.estado = "oculta";

        this.seleccionadas = [];
        this.bloqueado = false;

        this.render();
      }, 1000);
    }
  }
}

let juego;

function iniciarJuego() {
  juego = new Juego();
  juego.iniciar();
}
    