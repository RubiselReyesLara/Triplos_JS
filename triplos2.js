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

    operadoresIzqDer.forEach((operador) => {
        while(arregloVarsOps.includes(operador)) {
            indiceMemoria++;
            let indice = arregloVarsOps.indexOf(operador);
            arrResultado.push(
                [arregloVarsOps[indice - 1], arregloVarsOps[indice], arregloVarsOps[indice + 1], `[${indiceMemoria}]`]);

            arregloVarsOps[indice - 1] = '';
            arregloVarsOps[indice] = `[${indiceMemoria}]`;
            arregloVarsOps[indice + 1] = '';
            arregloVarsOps = arregloVarsOps.filter(elemento => String(elemento).trim());
            console.log(arregloVarsOps);
        }
    });

    operadoresDerIzq.forEach((operador) => {
        while(arregloVarsOps.includes(operador)){
            indiceMemoria++;
            let indice = arregloVarsOps.lastIndexOf(operador);
            arrResultado.push(
                [arregloVarsOps[indice - 1], arregloVarsOps[indice], arregloVarsOps[indice + 1], `[${indiceMemoria}]`]);

            arregloVarsOps[indice - 1] = '';
            arregloVarsOps[indice] = `[${indiceMemoria}]`;
            arregloVarsOps[indice + 1] = '';
            arregloVarsOps = arregloVarsOps.filter(elemento => String(elemento).trim());
            console.log(arregloVarsOps);
        }
    });

    return [expresionOriginalActual, arregloVarsOps.join(''), indiceMemoria, arrResultado];
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