let tiempo = 4000;
let numeros = [];
let respuestaCorrecta = 0;
let tiempoRespuesta;
let intervalo;
let intervaloCuentaRegresiva;

let juegoIniciado = false; //esto me controla si se puede responder o no

function iniciarJuego() {
  
  document.querySelector("#botonIniciar").disabled = true; 
  document.querySelector("#botonVerificar").disabled = false; 

  juegoIniciado = true;
  generarNumeros();
  mostrarNumeros();
}

function generarNumeros() {
  numeros = [];
  respuestaCorrecta = 0;

  let cantidad = parseInt(document.getElementById("cantidad").value);
  let incluirNegativos = document.getElementById("negativos").checked;

  let baseNumeros = [];

  
  for (let i = -10; i <= 10; i++) {
    if (i !== 0) {
      baseNumeros.push(i); //evito que el 0 este en  mi array
    }
  }

  // si elige q no haya negativos
  if (!incluirNegativos) {
    baseNumeros = baseNumeros.filter(num => num > 0);
  }

  // mezclo
  baseNumeros.sort(() => Math.random() - 0.5);

  if (cantidad > baseNumeros.length) {
    alert("Elegí menos números");
    return;
  }

  for (let i = 0; i < cantidad; i++) {
    let num = baseNumeros[i];
    numeros.push(num);
    respuestaCorrecta += num;
  }
}

function mostrarNumeros() {
  let contenedor = document.getElementById("numero");
  let indice = 0;

  intervalo = setInterval(() => {

    if (indice >= numeros.length) {
      clearInterval(intervalo);

      setTimeout(() => {
        contenedor.innerHTML = "FIN";
        iniciarTiempoRespuesta();
      }, tiempo);

      return;
    }

    contenedor.innerHTML = numeros[indice];

    setTimeout(() => {
      contenedor.innerHTML = "";
    }, tiempo / 2);

    indice++;

  }, tiempo);
}

function iniciarTiempoRespuesta() {
  let mensaje = document.getElementById("mensaje");

  let segundos= 5;


  intervaloCuentaRegresiva = setInterval(() => {
    segundos--;
      mensaje.innerHTML = `Te quedan:  ${segundos} segundos`;
      if (segundos === 0) {
        clearInterval(intervaloCuentaRegresiva);
      }
  },1000);


  tiempoRespuesta = setTimeout(() => {
    juegoIniciado = false;
    mensaje.innerHTML = `<div class="cartel incorrecto">Tiempo agotado</div>`;
    document.querySelector("#botonIniciar").disabled = false;
    document.querySelector("#botonVerificar").disabled = true;
  }, 5000);
}

function validarRespuesta() {

  if (!juegoIniciado) return;
  
    juegoIniciado = false;

    let respuestaUsuario = document.getElementById("botonRespuesta").value;
    let mensaje = document.getElementById("mensaje");

     clearTimeout(tiempoRespuesta);
     clearInterval(intervaloCuentaRegresiva);

      if (parseInt(respuestaUsuario) === respuestaCorrecta) {
       mensaje.innerHTML = `
      <div class="cartel correcto"> Correcto</div>
       `;
      } else {
       mensaje.innerHTML = `
       <div class="cartel incorrecto">
        Incorrecto <br>
        Resultado: ${respuestaCorrecta}
        </div>
       `;
      }
 document.querySelector("#botonIniciar").disabled=false;
 document.querySelector("#botonVerificar").disabled=true;
}

