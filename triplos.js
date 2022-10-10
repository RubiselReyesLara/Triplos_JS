document.getElementById('btn-calcular').addEventListener('click', ()=>{
    let start = window.performance.now();
    let indiceMemoria = 0; 
    let arrResultados = new Array(); 
    const OPERADORES_REGEX = new RegExp(/[+*\-=\(\)\/]/, 'g');

    let expresion = document.getElementById('input-expresion').value.replace(/ /g, '');
    
    const EJECUCION = calculoTriplos(expresion, OPERADORES_REGEX, indiceMemoria);
    expresion = expresion.replace(EJECUCION[0],EJECUCION[1]); 
    indiceMemoria = EJECUCION[2];
    arrResultados = arrResultados.concat(EJECUCION[3]);

    generarTabla(arrResultados);
    console.log(window.performance.now() - start);
});

/** CALCULO DE LOS TRIPLOS donde se aceptan expresiones con multiples operaciones agrupadas entre parentesis */
function calculoTriplos(expresion, operadoresRegEx, indiceMemoria){
    let expresionOriginalActual = expresion; // Guardar el estado original de n expresion a evaluar
    let arregloVarsOps = new Array();
    let arrResultado = new Array();

    while(expresion.includes('(') && expresion.includes(')')){ // SI SE TIENE UNA OPERACION CON PARENTESIS
        
        arregloVarsOps = expresion.split(/(?=[+-/*=()])|(?<=[+-/*=()])/g); // Convertir expresion a arreglo
        let contadorAperturas = 1; // Aperturas de parentesis
        let iUltimaCerr_PrimerApert = 0; // Verificador del cierre de una apertura de parentesis
        let iterador = arregloVarsOps.indexOf('(') + 1; // Indice del primer parentesis

        while(contadorAperturas > 0){ // CONTEO DE LAS APERTURA, DONDE CADA QUE HAYA ALGUNA, SE INCREMENTA...
            if(arregloVarsOps[iterador] == '('){ // DE LO CONTRARIO, DECREMENTA. AL LLEGAR A 0 SIGNIFICA QUE 
                    contadorAperturas++;         // SE LLEGO AL CIERRE DE LA PRIMER APERTURA
            } else if(arregloVarsOps[iterador] == ')'){
                contadorAperturas--;
            }
            iterador++;
        }
        iUltimaCerr_PrimerApert = iterador - 1;

        // RECURSIVIDAD -> Permite llegar a la operacion entre parentesis mas profunda, calcular los triplos, y retornar 
        const EJECUCION_PARENTESIS = calculoTriplos(arregloVarsOps.slice(arregloVarsOps.indexOf('(') + 1, // los resultados
                                                iUltimaCerr_PrimerApert).join(''), operadoresRegEx, indiceMemoria); 

        // EXPRESION ACTUAL reemplaza lo de la cadena generada en la cadena actual:
        /* Primero: x = (a + b) - (c * d), donde se evalua (a + b)
        ** Segundo: x = (a + b) - (c * d), donde obtuve [indiceMemoriaN] = (a + b)
        ** Tercero: x = [indiceMemoriaN] - (c * d), reemplazado **/
        expresion = expresion.replace(`(${EJECUCION_PARENTESIS[0]})`,EJECUCION_PARENTESIS[1]); 
        indiceMemoria = EJECUCION_PARENTESIS[2];
        arrResultado = arrResultado.concat(EJECUCION_PARENTESIS[3]);
    }
    
    // Conversion de expresion, a arreglo
    arregloVarsOps = arregloVarsOps = expresion.split(/(?=[+-/*=()])|(?<=[+-/*=()])/g);

    // Expresiones regulares para la jerarquia de operaciones
    const REGEX_MULT_DIV = new RegExp(/[*\/]/, 'i');
    const REGEX_SUM_RES = new RegExp(/[+-]/, 'i');
    const REGEX_IGUALACION = new RegExp(/[=]/, 'i');

    // Jerarquia de operaciones ^,/,*,+,-
    if(REGEX_MULT_DIV.test(arregloVarsOps)){
        const RESULTADO = generarResultados(REGEX_MULT_DIV, arregloVarsOps, indiceMemoria, arrResultado);
        arregloVarsOps = RESULTADO[0];
        indiceMemoria = RESULTADO[1];
        arrResultado = RESULTADO[2];
    } 
    if(REGEX_SUM_RES.test(arregloVarsOps)){
        const RESULTADO = generarResultados(REGEX_SUM_RES, arregloVarsOps, indiceMemoria, arrResultado);
        arregloVarsOps = RESULTADO[0];
        indiceMemoria = RESULTADO[1];
        arrResultado = RESULTADO[2];
    }
    if(REGEX_IGUALACION.test(arregloVarsOps)){
        const RESULTADO = generarResultados(REGEX_IGUALACION, arregloVarsOps, indiceMemoria, arrResultado);
        arregloVarsOps = RESULTADO[0];
        indiceMemoria = RESULTADO[1];
        arrResultado = RESULTADO[2];
    }
    
    // Retorno de resultados para la recursividad que genero esta recursividad
    return [expresionOriginalActual, arregloVarsOps, indiceMemoria, arrResultado];
}

/** PERMITE GENERAR LOS RESULTADOS de triplos */
function generarResultados(expReg, arregloVarsOps, indiceMemoria, arrResultado){
    while(expReg.test(arregloVarsOps)){ // Si la cadena cumple con la regex actual, ej: a + b, donde regex contiene +
        let operador = arregloVarsOps.toString().match(expReg); // Obtengo el operador
        indiceMemoria++; // Indico la posicion en la memoria
        let indice = arregloVarsOps.indexOf(operador[0]); // Indice del operador en la expresion
        arrResultado.push(
                [arregloVarsOps[indice - 1], arregloVarsOps[indice], arregloVarsOps[indice + 1], `[${indiceMemoria}]`]);
        // Medidas para darle aspecto a la cadena, eliminando los valores de la cadena y reemplazando por el espacio
        arregloVarsOps.splice(indice - 1, 1); // Ej. [a,+,b], con espacio [1]... -> [+,b] -> [[1],b] ->> [[1]] <<-
        arregloVarsOps[indice - 1] = `[${indiceMemoria}]`;
        arregloVarsOps.splice(indice, 1);
    }

    return [arregloVarsOps, indiceMemoria, arrResultado]; // Retorno de los resultados
}

/**PERMITE GENERAR LA TABLA PARA LOS RESULTADOS */
function generarTabla(arrResultados = new Array()){
    const TABLA = document.getElementById('tabla-resultados');
    TABLA.innerHTML = ''; // Limpiamos lo que estaba en la tabla

    const ENCABEZADO = TABLA.createTHead();
    ENCABEZADO.setAttribute('id', 'encabezado-tabla');
    const CUERPO = TABLA.createTBody();

    const FILA_ENCABEZADO = ENCABEZADO.insertRow(0); 
    FILA_ENCABEZADO.insertCell(0).innerHTML = 'Operación';
    FILA_ENCABEZADO.insertCell(1).innerHTML = 'Argumento 1';
    FILA_ENCABEZADO.insertCell(2).innerHTML = 'Argumento 2';
    FILA_ENCABEZADO.insertCell(3).innerHTML = '';
    
    for(let i = 0; i < arrResultados.length; i++){
        const FILA_CUERPO = CUERPO.insertRow(i);
        FILA_CUERPO.insertCell(0).innerHTML = arrResultados[i][1];
        FILA_CUERPO.insertCell(1).innerHTML = arrResultados[i][0];
        FILA_CUERPO.insertCell(2).innerHTML = arrResultados[i][2];
        FILA_CUERPO.insertCell(3).innerHTML = arrResultados[i][3];
    }
}
