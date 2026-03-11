//1. paso #1: Capturamos elemntos del doom//
// DOM: Document Object Model//
const nombreUsuario = document.getElementById("nombreUsuario"); //lo que se pone entre parentesis debe ser igual a lo que esta en html//
const btnSaludar = document.getElementById("btnSaludar");
const mensaje = document.getElementById("mensaje");

// 2. Paso #2: Creamos la función//
function registrar(){
    // Registrando o capturando el dato desde el DOM//

    let nombre = nombreUsuario.value; //a la variable se le asigna el valor que tenga la constante nombreusuario//
    //Mostramos en consola
    console.log("El nombre registrado en consola es: " + nombre);





// 3. Mostrar todo en el DOM//
 mensaje.textContent ="¡Hola,! " + nombre + "¡Bienvenido al curso!"; 

}

