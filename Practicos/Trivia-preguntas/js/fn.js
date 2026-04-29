let datos = [];
let categoriaSelecionada = null;
let preguntasJuego= [];
let indicePregunta= 0;
let tiempo= 10;
let intervalo;
let correctas= 0;
let incorrectas = 0;
let noRespondidas=0;



async function cargarDatos() {
    try{
        const response = await fetch ("trivia_realista_240.json");
        const data = await response.json();

        datos=data.categorias;

        mostrarCategorias();
        //console.log(data)
    }catch (error){
        document.getElementById("categorias").innerHTML = "Error al cargar datos";
        
    }
}


function mostrarCategorias (){
    let mostrar = "";
   

    mostrar= `Elegi una categoria <br> `
    datos.forEach((categoria ,  indice ) => {
        mostrar += `<button onclick= "seleccionarCategoria(${indice})"> ${categoria.nombre}</button>`;

    });

  
    document.getElementById("categorias").innerHTML = mostrar ;
}


function seleccionarCategoria(indice){
    categoriaSelecionada = datos[indice];

    obtenerPreguntasRandom();
}

function obtenerPreguntasRandom(){
    let total = categoriaSelecionada.preguntas;
    let usadas = [];

    while (usadas.length < 5 ){
        let random = Math.floor(Math.random() * total.length);

        if (!usadas.includes(random)){
            usadas.push(random);
        }
    }

    preguntasJuego = usadas.map(i => total[i]);

    iniciarJuego();
}



function iniciarJuego(){
    indicePregunta= 0;
    mostrarPregunta();
}

function mostrarPregunta(){
    let preguntaActual = preguntasJuego[indicePregunta];

    let opciones= [
        preguntaActual.correcta,
        ...preguntaActual.incorrectas
    ];

    opciones.sort(() => Math.random() - 0.5);

    let mostrar = `
    <h2>Pregunta ${indicePregunta+1} de 5 </h2>
    <p> ${preguntaActual.pregunta}</p>`;

    opciones.forEach(op=> {
        mostrar += `<button onclick="responder('${op}')"> ${op}</button><br>`;

    });
    document.getElementById("juego").innerHTML = mostrar;

    iniciarTiempo();
}


function iniciarTiempo(){
    tiempo = 10;
    document.getElementById("tiempo").innerHTML = tiempo;

    intervalo= setInterval(()=>{
        tiempo--;

        document.getElementById("tiempo").innerHTML= tiempo;

        if (tiempo === 0) {
            clearInterval(intervalo);
            noRespondidas++;
            siguientePregunta();
        }
    }, 1000);
    
}



function responder(opcion){
    clearInterval(intervalo);

    let preguntaActual = preguntasJuego[indicePregunta];

    let botones = document.querySelectorAll("#juego button");

    botones.forEach(boton => {
        boton.disabled = true;

        if (boton.innerText == preguntaActual.correcta){
            boton.classList.add("correcta");
        } else {
            boton.classList.add("incorrecta");
        }
    });

    if (opcion === preguntaActual.correcta){
        correctas++;
    } else{
        incorrectas++;
    }

    setTimeout(() => {
        siguientePregunta();
    }, 1000);
}

function siguientePregunta() {
  indicePregunta++;

  if (indicePregunta < 5) {
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
}

function mostrarResultado() {
  document.getElementById("juego").innerHTML = `
    <h2>Resultado final</h2>
    <p>Total: 5</p>
    <p>Correctas: ${correctas}</p>
    <p>Incorrectas: ${incorrectas}</p>
    <p>No respondidas: ${noRespondidas}</p>
  `;

   document.getElementById("botonReiniciar").style.display = "block";
}

function reiniciarJuego() {

    indicePregunta = 0;
    correctas = 0;
    incorrectas = 0;
    noRespondidas = 0;
    preguntasJuego = [];

    clearInterval(intervalo);

    document.getElementById("juego").innerHTML = "";
    document.getElementById("resultado").innerHTML = "";

    // ocultar nuevamente porq no quiero que se vea desde el principio deñ juego
    document.getElementById("botonReiniciar").style.display = "none";

    mostrarCategorias();
}