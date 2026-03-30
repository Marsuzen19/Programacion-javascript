//Clase de POO//
//Vamos a crear un OBJETO//
const estudiante = {
    //Un mapa esta compuesto de CLAVE y VALOR//
    nombre: "Pepito",
    carrera: "Informatica y desarrollo de aplicaciones web",
    ciclo: 3,
    //Vamos a crear MÉTODOS (son las acciones - verbos)//
    estudiar : function(){ //por teoria se pone de esta manera pero esta bien poner function estudiar()//
        console.log("Pepito esta aprendiendo Javascript.");
    } 
};

// Forma de acceder al objeto//
console.log(estudiante.nombre); // accedo al objeto y llamo un atributo//
estudiante.estudiar(); //accedo al metodo del objeto y llamo a la funcion//




// Vamos a crear un CONSTRUCTOR (SIEMPRE DEBE EMPEZAR CON MAYUSCULA) almacena atributos y metodos//
function Computadora(marca, procesador, ram){
    // Usamos atributos públicos usando THIS//
    this.marca = marca; // la marca de esta linea es igual a la que esta dentro del parentesis//
    this.procesador = procesador;// lo que esta despues del igual es inventado///
    this.ram = ram;

// Creamos el METODO (Acciones)
    this.encender = function(){
        console.log("Iniciamos el Sistema " + this.marca);
    }


    this.aumentarRam = function(){
        return ram + "GB";
    }

}
 
// el operador NEW crea una instancia o copia a partir del modelo, es como hacer inserciones siguiendo los atributos colocados en la funcion computadora//
const PCLab1 = new Computadora("HP","Corei7","32"); //llama al objeto e inserta datos a partir de sus atributos//
const PCLab2 = new Computadora("Asus","Corei5","16");//Saca una copia del objeto(Computador) y le insertamos datos de sus atributos//

console.log(PCLab1.marca);
console.log(PCLab1.procesador);
console.log(PCLab1.ram);

const mensaje = "Tipos de datos en Javascript";
console.log(mensaje.length());//funcion que existe en javascript y sirve para contar el numero de caracteres//
console.log(mensaje.trim());//funcion que elimina los espacios limitando a una casilla de espacio por palabra//
console.log(mensaje.toUpperCase());//funcion que convierte todo a mayuscula//
console.log(mensaje.includes("es"));//funcion que busca la palabra entre parentesis en la frase//
//quiero buscar si la palabra esta dentro de mi mensaje puede ser verdadero o falso,funciona como una condicional//
const lenguajes = ["HTML","CSS","PHP","JAVASCRIPT"]; //cuando hay corchetes es un arreglo//
//llave son mapas//

//para agregar mas datos al arreglo//
lenguajes.push("JAVA");//El nuevo valor se agrega al final,despues de javascript//
lenguajes.pop();// Elimina el ultimo valor//
lenguajes.unshift("JAVA");//Funcion que agrega el valor entre parentesis de primero en el array//
lenguajes.shift();//funcion que elimina el primer valor del array//
lenguajes.join("-");//funcion que une los elementos del array con el simbolo que se le indique entre parentesis//
console.log(lenguajes.join("-"));