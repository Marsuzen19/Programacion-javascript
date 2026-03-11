//1. Recupero el conteo previo guardado en el navegador//
let contador = localStorage.getItem("contador");

//2. Uso de un condicional terniario//
contador = contador ? parseInt(contador) : 0;

//3. Captura del elemento mediante su ID//
const conteo =document.getElementById("contador");

//4. Muestra del valor inicial en pantalla//
conteo.textContent = contador;

//5. función que recibe un valor  (+1 o -1) y actualiza todo//
function actualizarConteo(valor){

    contador += valor;

    localStorage.setItem("contador", contador);

    conteo.textContent = contador;
}

//6. función para el boton AUMENTAR//
function aumentar (){
    actualizarConteo(+1);
}

//7. función para el boton REDUCIR//
function reducir (){
    actualizarConteo(-1);
}


//7. función para el boton RESET//
function reset (){
    contador = 0; //devuelve el contador a 0//
    localStorage.setItem("contador", contador);
    conteo.textContent = contador;
}