document.getElementById('btn-calcular').addEventListener('click', ()=>{
    const operadoresIzqDer = ['/', '*'];
    const operadoresDerIzq = ['+', '-', '='];
    let arrResultados = new Array();
    let indiceMemoria = 0;

    let expresion = document.getElementById('input-expresion').value.replace(/ /g, '');
    const operadoresRegEx = /[+*\-=\(\)\/]/g;

    const ejecucionParentesis = calculoTriplos(expresion, operadoresRegEx, 
                                operadoresIzqDer, operadoresDerIzq, indiceMemoria);

    expresion = expresion.replace(ejecucionParentesis[0],ejecucionParentesis[1]); 
    indiceMemoria = ejecucionParentesis[2];
    arrResultados = arrResultados.concat(ejecucionParentesis[3]);

    generarTabla(arrResultados);
});

function calculoTriplos(expresion, operadoresRegEx, operadoresIzqDer, 
                              operadoresDerIzq, indiceMemoria){
    let expresionOriginalActual = expresion;
    let arrResultado = new Array();

    while(expresion.includes('(') && expresion.includes(')')){
        const arregloVarsOps = conversion_Exp_Arr(expresion, operadoresRegEx);

        let contadorAperturas = 1; // Aperturas de parentesis
        let iterador = arregloVarsOps.indexOf('(') + 1;

        while(contadorAperturas > 0){
            if(arregloVarsOps[iterador] == '('){
                    contadorAperturas++;
            } else if(arregloVarsOps[iterador] == ')'){
                contadorAperturas--;
            }
            iterador++;
        }

        let iUltimaCerr_PrimerApert = iterador - 1;

        const ejecucionParentesis = calculoTriplos(arregloVarsOps.slice(
                                        arregloVarsOps.indexOf('(') + 1,iUltimaCerr_PrimerApert).join(''),
                                        operadoresRegEx, operadoresIzqDer, operadoresDerIzq, indiceMemoria);
        expresion = expresion.replace(`(${ejecucionParentesis[0]})`,ejecucionParentesis[1]); 
        indiceMemoria = ejecucionParentesis[2];
        arrResultado = arrResultado.concat(ejecucionParentesis[3]);
    }
     
    let arregloVarsOps = conversion_Exp_Arr(expresion, operadoresRegEx);

    const multDiv = new RegExp(/[*\/]/, 'i');
    const sumRes = new RegExp(/[+-]/, 'i');
    const igual = new RegExp(/[=]/, 'i');

    const resultadoMultDiv = generarResultados(multDiv, arregloVarsOps, indiceMemoria, arrResultado);

    const resultadoSumRes = generarResultados(sumRes, resultadoMultDiv[0], resultadoMultDiv[1], resultadoMultDiv[2]);

    const resultadoIgualacion = generarResultados(igual, resultadoSumRes[0], resultadoSumRes[1], resultadoSumRes[2]);

    return [expresionOriginalActual, resultadoIgualacion[0], resultadoIgualacion[1], resultadoIgualacion[2]];
}


function generarResultados(expReg, arregloVarsOps, indiceMemoria, arrResultado){
    while(expReg.test(arregloVarsOps)){
        let operador = arregloVarsOps.toString().match(expReg);
        indiceMemoria++;
        let indice = arregloVarsOps.indexOf(operador[0]);
        arrResultado.push(
                [arregloVarsOps[indice - 1], arregloVarsOps[indice], arregloVarsOps[indice + 1], `[${indiceMemoria}]`]);
        
        arregloVarsOps[indice - 1] = '';
        arregloVarsOps[indice] = `[${indiceMemoria}]`;
        arregloVarsOps[indice + 1] = '';
        arregloVarsOps = arregloVarsOps.filter(elemento => String(elemento).trim());
        console.log(arregloVarsOps);
    }
    return [arregloVarsOps, indiceMemoria, arrResultado];
}


function generarTabla(arrResultados = new Array()){
    const tabla = document.getElementById('tabla-resultados');
    tabla.innerHTML = ''; // Limpiamos lo que estaba en la tabla

    const encabezado = tabla.createTHead();
    const cuerpo = tabla.createTBody();

    const filaEncabezado = encabezado.insertRow(0); 
    filaEncabezado.insertCell(0).innerHTML = 'Operación';
    filaEncabezado.insertCell(1).innerHTML = 'Argumento 1';
    filaEncabezado.insertCell(2).innerHTML = 'Argumento 2';
    filaEncabezado.insertCell(3).innerHTML = '';
    
    for(let i = 0; i < arrResultados.length; i++){
        const filaCuerpo = cuerpo.insertRow(i);
        filaCuerpo.insertCell(0).innerHTML = arrResultados[i][1];
        filaCuerpo.insertCell(1).innerHTML = arrResultados[i][0];
        filaCuerpo.insertCell(2).innerHTML = arrResultados[i][2];
        filaCuerpo.insertCell(3).innerHTML = arrResultados[i][3];
    }
}

function conversion_Exp_Arr(expresion, operadoresRegEx){
    const arregloVariables = expresion.split(operadoresRegEx); // Obtengo las vars (a, b, c)

    // CORREGIR QUE NO ACEPTA CUANDO NO VENGAN CADENAS
    if(operadoresRegEx.test(expresion)){
        const arregloOperadores = expresion.match(operadoresRegEx).concat(['']); // Obtengo los ops (+, -, ...)
        const arregloVarsOps = new Array();
        
        for(let i = 0; i < arregloVariables.length; i++){ // Conbino las variables con los operadores
            arregloVarsOps.push(arregloVariables[i]);
            arregloVarsOps.push(arregloOperadores[i]);
        }
        return arregloVarsOps; // Retorna un arreglo de la expresion
    } else {
        return [expresion]; // Retorna la expresión en arreglo
    }
}