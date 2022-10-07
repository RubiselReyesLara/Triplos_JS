document.getElementById('btn-calcular').addEventListener('click', ()=>{
    const operadoresIzqDer = ['/', '*'];
    const operadoresDerIzq = ['+', '-'];
    let arrResultados = new Array();

    let expresion = document.getElementById('input-expresion').value.replace(/ /g, '');
    const operadoresRegEx = /[+*\-=\(\)\/]/g;

    if(expresion.length > 0 && operadoresRegEx.test(expresion)){
        if(expresion.includes('(') && expresion.includes(')')){

            let indiceMemoria = 0;
            while(expresion.includes('(')) {
                let grupoParentesis = expresion.substring(expresion.lastIndexOf('(') + 1, expresion.indexOf(')'));
                const ejecucionParentesis = calcularAgrupaciones(
                    operadoresIzqDer, operadoresDerIzq, grupoParentesis, operadoresRegEx, indiceMemoria);
                expresion = expresion.replace(ejecucionParentesis[0], ejecucionParentesis[1]); 
                indiceMemoria = ejecucionParentesis[2];
                arrResultados = arrResultados.concat(ejecucionParentesis[3]);
            }
            const ejecucionSinParentesis = calcularAgrupaciones(operadoresIzqDer, operadoresDerIzq, 
                                                           expresion, operadoresRegEx, indiceMemoria);
            arrResultados = arrResultados.concat(ejecucionSinParentesis[3]);

        } else if(expresion.includes('(')){
            alert('La expresión es invalida debido a que dejo un "(" sin cerrar');
        }

    } else {
        alert('Disculpe, dejo un espacio en blanco, o ingreso una expresión NO válida')
    }
});

function calcularAgrupaciones(operadoresIzqDer, operadoresDerIzq, expresion, operadoresRegEx, indiceMemoria){
    // FALTA VERIFICAR SI SOLO HAY UNA VARIABLE O VALOR DENTRO DE PARENTESIS '''''''''''''''''''''''''
    let arrResultado = new Array();
    let arregloVariables = expresion.split(operadoresRegEx); // Obtengo las vars (a, b, c)
    let arregloOperadores = expresion.match(operadoresRegEx).concat(['']); // Obtengo los ops (+, -, ...)
    let arregloVarsOps = new Array();

    for(let i = 0; i < arregloVariables.length; i++){ // Conbino las variables con los operadores
        arregloVarsOps.push(arregloVariables[i]);
        arregloVarsOps.push(arregloOperadores[i]);
    }


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

    return [`(${expresion})`, arregloVarsOps.join(''), indiceMemoria, arrResultado];
}


