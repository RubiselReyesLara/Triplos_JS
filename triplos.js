document.getElementById('btn-calcular').addEventListener('click', ()=>{
    const operadoresDerIqz = ['/', '*'];
    const operadoresIzqDer = ['+', '-'];

    let expresion = document.getElementById('input-expresion').value.replace(/ /g, '');
    const operadoresRegEx = /[+*\-=\(\)\/]/g;

    if(expresion.length > 0 && operadoresRegEx.test(expresion)){
        if(expresion.includes('(') && expresion.includes(')')){

            let indiceMemoria = 0;
            while(expresion.includes('(')) {
                let grupoParentesis = expresion.substring(expresion.lastIndexOf('('), expresion.indexOf(')') + 1);
                const ejecucionParentesis = calcularAgrupaciones(
                    operadoresDerIqz, operadoresIzqDer, grupoParentesis, operadoresRegEx, indiceMemoria);
                expresion = expresion.replace(ejecucionParentesis[0], ejecucionParentesis[1]); 
                indiceMemoria = ejecucionParentesis[2];
            }

            calcularAgrupaciones(operadoresDerIqz, operadoresIzqDer, expresion, operadoresRegEx);




        } else if(expresion.includes('(')){
            alert('La expresión es invalida debido a que dejo un "(" sin cerrar');
        }
    } else {
        alert('Disculpe, dejo un espacio en blanco, o ingreso una expresión NO válida')
    }
});

function calcularAgrupaciones(operadoresDerIqz, operadoresIzqDer, expresion, operadoresRegEx, iMemoria){
    // FALTA VERIFICAR SI SOLO HAY UNA VARIABLE O VALOR DENTRO DE PARENTESIS '''''''''''''''''''''''''
    const expresionOriginal = expresion;
    expresion = expresion.replace('(','');
    expresion = expresion.replace(')','');

    let arregloVariables = expresion.split(operadoresRegEx); // Obtengo las vars (a, b, c)
    let arregloOperadores = expresion.match(operadoresRegEx).concat(['']); // Obtengo los ops (+, -, ...)
    let arregloVarsOps = new Array();

    for(let i = 0; i < arregloVariables.length; i++){ // Conbino las variables con los operadores
        arregloVarsOps.push(arregloVariables[i]);
        arregloVarsOps.push(arregloOperadores[i]);
    }

    operadoresDerIqz.forEach((operador) => {
        while(arregloVarsOps.includes(operador)) {
            iMemoria++;
            let indice = arregloVarsOps.indexOf(operador);
            arregloVarsOps[indice - 1] = '';
            arregloVarsOps[indice] = `[${iMemoria}]`;
            arregloVarsOps[indice + 1] = '';
            arregloVarsOps = arregloVarsOps.filter(elemento => String(elemento).trim());
            console.log(arregloVarsOps);
        }
    });

    operadoresIzqDer.forEach((operador) => {
        while(arregloVarsOps.includes(operador)){
            iMemoria++;
            let indice = arregloVarsOps.lastIndexOf(operador);
            arregloVarsOps[indice - 1] = '';
            arregloVarsOps[indice] = `[${iMemoria}]`;
            arregloVarsOps[indice + 1] = '';
            arregloVarsOps = arregloVarsOps.filter(elemento => String(elemento).trim());
            console.log(arregloVarsOps);
        }
    });

    return [expresionOriginal, ...arregloVarsOps, iMemoria];



}


