//1. PASO #1: Declarar un array con 5 lenguajes de programación//
const lenguajes =[ "Phyton","Java","Javascript","PHP","C#" ];

// 2. PASO #2: Capturamos//
const lista = document.getElementById("lista");

let elementos ="";

// 3.PASO #3:Usamos el bucle FOR para recorrer un array//
for (let i =0 ;i < lenguajes.length;i++){
    if (lenguajes[i] ==="Javascript"){
        alert("Javascript sirve para el fronted y para el backend");
    }
    // 4. PASO #4: Acumulamos cada lenguaje dentro de las etiquetas li//
    elementos+= "<li>" + lenguajes[i] + "</li>";   

}


// 5. PASO #5:Capturamos y mostramos toda la lista en pantalla//
lista.innerHTML = elementos;