class Queue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(element) {
      this.queue.push(element);
      return this.queue;
    }
  
    dequeue() {
      return this.queue.shift();
    }
  
    peek() {
      return this.queue[0];
    }
  
    size() {
      return this.queue.length;
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  
    print() {
      return this.queue;
    }
}

class Stack {
    constructor() {
        this.stack = {};
        this.count = 0;
    }

    push(element) {
        this.stack[this.count] = element;
        this.count++;
        return this.stack;
    }

    pop() {
        this.count--;
        const element = this.stack[this.count];
        delete this.stack[this.count];
        return element;
    }

    top() {
        return this.stack[this.count - 1];
    }

    size() {
        return this.count;
    }

    isEmpty() {
        return this.size() == 0;
    }

    print() {
        console.log(this.stack);
    }
}

const toggleSwitch = document.getElementById("checkbox");
const currentTheme = localStorage.getItem("theme");

if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (currentTheme === 'light') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
    else {        
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

let hayQueBorrar = false;
const teclas = "C/*-789+456123=0.";
const idLetras = document.getElementById("letras");
/* Al hacer click en el input se debe limpiar el placeholder */
document.getElementById("displayText").addEventListener("focus", borrarPlaceholder);
/* Al dejar de hacer foco en el input se le agregara el placeholder */
document.getElementById("displayText").addEventListener("blur", agregarPlaceholder);
function borrarPlaceholder () {
    document.getElementById("displayText").placeholder = "";
}

function agregarPlaceholder () {
    document.getElementById("displayText").placeholder = "Ingrese la expresion aqui";
}

const mostrarLetras = listadoLetras => {
    idLetras.innerHTML="";
    //Añadimos las letras
    listadoLetras.split('').map(el => {
        let span = document.createElement("span");
        //Ingresando los distintos oyentes
        if (el == "C" ) {
            span.addEventListener("click", borrarTextoDelDisplayConDelete);
        } else if (el == "=") {
            span.addEventListener("click", resolver);
        } else {
            span.addEventListener("click", teclaPulsada);
        }
        //Agregar el texto al boton
        span.innerText=el;
        //Agregando un id y una clase a aquellas teclas que tiene una posicion distinta
        if( el == "+" || el == "-" || el == "*" || el == "/") {
            span.className = "operador";
            if(el == "+") {
                span.setAttribute("id", "btnPlus");
            }
        } else if ( el == "C") {
            span.className = "btnDelete";
        } else if ( el == "=") {
            span.setAttribute("id", "btnIgualdad");
            span.className = "btnIgualdad";
        } else { //numeros y el punto
            if (el == "0") {
                span.setAttribute("id", "btnCero");
            } 
            span.className = "numeros_y_punto";           
        }

        idLetras.appendChild(span);
    });
}

function teclaPulsada(e) {
    const tecla = this.classList && this.classList.contains("space") ? " ": this.innerText;
    if (hayQueBorrar) {
        borrarTextoDelDisplay();
        hayQueBorrar = false;
    }

    if (teclas.indexOf(tecla) >= 0) {
        document.getElementById("displayText").value+=tecla;
    }
}

mostrarLetras(teclas);
/* Al ya haber mostrado un resultado, al ingresar una 
tecla se limpiara el texto del display */
function borrarTextoDelDisplayConDelete() {
    document.getElementById("displayText").value = "";
}

function borrarTextoDelDisplay() {
    let resultado = document.getElementById("displayText").value;
    document.getElementById("last-expresion-display").textContent += " = "+ resultado;    
    document.getElementById("displayText").value = "";
}

function resolver() {
    let colaExpInt = new Queue();
    let colaExpPost = new Queue();
    let pila = new Stack();
    const textoIngresado = document.getElementById("displayText").value;
    ingresarElemento(textoIngresado ,colaExpInt);
    console.log("Cola infija:"+colaExpInt.print());
    infijaAPostfija( colaExpInt, colaExpPost);
    console.log("Cola postfija: "+colaExpPost.print());

    while (!colaExpPost.isEmpty()) {
        let atomo = colaExpPost.dequeue();
        let resultado = 0;
        if (!isNaN(atomo)) {
            pila.push(atomo);
            console.log("Se pushea "+pila.top()+" en la pila");
        } else {
            console.log("<--Operacion-->");
            operador = atomo;
            operando2 = pila.pop();
            operando1 = pila.pop();
            resultado = operar( operador, operando1, operando2);
            console.log("Resultado: "+resultado);
            pila.push(resultado);
        }
    }

    resultado = pila.pop();
    hayQueBorrar = true;
    document.getElementById("displayText").value = resultado;
    document.getElementById("last-expresion-display").textContent = textoIngresado;
}

function ingresarElemento(entrada, infija) {
    let sNumero = "";
    for(let i=0; i<entrada.length; i++) {
        let cAtomo = entrada.charAt(i);

        if(!isNaN(cAtomo)) {
            console.log("cAtomo: "+cAtomo+" es un numero");
            //concateno aquellos numero que se ingresan seguindos
            sNumero = sNumero+cAtomo; 
        } else {
            infija.enqueue(sNumero);
            infija.enqueue(cAtomo);
            sNumero = "";
        }

        if ( i == (entrada.length - 1)) {
            if (!isNaN(sNumero)){
                infija.enqueue(sNumero);
            } else {
                alert("Entrada invalida");
            }
        }
    }
}

function infijaAPostfija( infija, postfija) {
    let pila = new Stack();
    while ( !infija.isEmpty()) {
        let atomo = infija.dequeue();
        if (!isNaN(atomo)) {
            postfija.enqueue(atomo);
        } else {
            while (!pila.isEmpty() && (prioridad(atomo) <= prioridad(pila.top()))) {
                postfija.enqueue(pila.pop());
            }
            pila.push( atomo );
        }
    }

    while (!pila.isEmpty()) { //Si aun quedan operadores en la pila, ir agregandolos hasta que la pila quede vacia
        postfija.enqueue(pila.pop());
    }
}

function prioridad(elem) {
    let prioridad;
    if (elem == "*" || elem == "/") {
        console.log("elem: "+elem+" tiene prioridad 2");
        prioridad = 2;
    } else {
        console.log("elem: "+elem+" tiene prioridad 1");
        prioridad = 1;
    }
    return prioridad;
}

function operar ( operador, operando1, operando2) {
    let resultado = 0;
    let op1 = Number(operando1);
    let op2 = Number(operando2);
    console.log("operando 1: "+op1+" y operando 2: "+op2);
    if( operador == "*") {
        console.log("Se realizara la multiplicacion");
        resultado = op1 * op2;
    } else if (operador == "/") {
        console.log("Se realizara la division");
        resultado = op1 / op2;
    } else if (operador == "+") {
        console.log("Se realizara la suma");
        resultado = op1 + op2;
    } else {
        console.log("Se realizara la resta");
        resultado = op1 - op2;
    }
    return resultado;
}


