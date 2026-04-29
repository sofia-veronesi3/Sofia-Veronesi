async function convertir() {
    try{

        let input= document.getElementById("pesos").value;
        let error = document.getElementById("error");
        let resultado = document.getElementById("resultado");
        input = input.replace(/\./g, "").replace(",", "."); 

        error.innerHTML="";
        resultado.innerHTML="";

        if (input === "") {
            error.innerHTML = "ingrese un valor";
            return;
        } //verifico  si  hay valor en el input  y sino muestra error

        if ( isNaN(input)){
            error.innerHTML = "Debe ser un número";
            return;
        } //si no es numero entra al if y muestra el error;

        let pesos = parseFloat(input); //traigo lo ingresado, lo convierto en decimales y lo guardo en pesos

        const response= await fetch ("https://dolarapi.com/v1/dolares");
        const data= await response.json();

        let oficial = data.find(d=> d.nombre === "Oficial"); // busco en el  en el array el primer objeto que  su nombre sea "Oficial" y lo guardo
        let blue = data.find(d=> d.nombre === "Blue");
        let mep = data.find(d=> d.nombre === "Bolsa");

        mostrarResultados(pesos,oficial,blue,mep);
    } catch(e){
         document.getElementById("error").innerHTML="Error con la API";
    } 
}
document.getElementById("pesos").addEventListener("input", formatearInput);

function formatearInput(evento){
    let valor = evento.target.value;

    valor= valor.replace(/[^0-9,]/g, ""); //limpio lo ingresado

    let partes= valor.split(","); //separo decimal y entero
    let entero= partes[0];
    let decimal = partes[1] || "";

    if (partes.length > 2) {
    decimal = partes[1]; // ignora comas extra
    }
    // saco puntos anteriores
    entero = entero.replace(/\./g, "");

    entero= entero.replace(/\B(?=(\d{3})+(?!\d))/g, "."); //agrego . 
    let resultado= entero;

    if (valor.includes(",")){
        resultado += ","+decimal;
    }
     evento.target.value =resultado;

}

function mostrarResultados(pesos,oficial,blue,mep){
    let resultado = document.getElementById("resultado");

        resultado.innerHTML= `
        <div class= "tarjeta" >
        <h3>Oficial</h3>
        Compra: $${oficial.compra} -> USD ${(pesos/ oficial.compra).toFixed(2)} <br> <!--uso el toFixed(2) para que solo me muestre ese num con hasta 2 decimales.-->
        Venta: $${oficial.venta} -> USD ${(pesos / oficial.venta).toFixed(2)}
        </div>
        
        <div class= "tarjeta" >
        <h3>Blue</h3>
        Compra: $${blue.compra} -> USD ${(pesos/ blue.compra).toFixed(2)} <br> <!--uso el toFixed(2) para que solo me muestre ese num con hasta 2 decimales.-->
        Venta: $${blue.venta} -> USD ${(pesos / blue.venta).toFixed(2)}
        </div>

        <div class= "tarjeta" >
        <h3>MEP</h3>
        Compra: $${mep.compra} -> USD ${(pesos/ mep.compra).toFixed(2)} <br> <!--uso el toFixed(2) para que solo me muestre ese num con hasta 2 decimales.-->
        Venta: $${mep.venta} -> USD ${(pesos / mep.venta).toFixed(2)}
        </div>`;

      document.getElementById("botonReiniciar").style.display = "block";
    
}

function reiniciar() {
    document.getElementById("pesos").value = "";
    document.getElementById("error").innerHTML = "";
    document.getElementById("resultado").innerHTML = "";

  
    document.getElementById("botonReiniciar").style.display = "none";
}