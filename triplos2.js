document.getElementById('btn-calcular').addEventListener('click', ()=>{
    const operadoresIzqDer = ['/', '*'];
    const operadoresDerIzq = ['+', '-', '='];
    let arrResultado = new Array();
    let indiceMemoria = 0;

    let expresion = document.getElementById('input-expresion').value.replace(/ /g, '');
    const operadoresRegEx = /[+*\-=\(\)\/]/g;

    let arregloVariables = expresion.split(operadoresRegEx); // Obtengo las vars (a, b, c)
    let arregloOperadores = expresion.match(operadoresRegEx).concat(['']); // Obtengo los ops (+, -, ...)
    let arregloVarsOps = new Array();

    for(let i = 0; i < arregloVariables.length; i++){ // Conbino las variables con los operadores
        arregloVarsOps.push(arregloVariables[i]);
        arregloVarsOps.push(arregloOperadores[i]);
    }

    evaluacionParentesis(arregloVarsOps, arrResultado, operadoresIzqDer, operadoresDerIzq, indiceMemoria);

});

function evaluacionParentesis(arregloVarsOps, arrResultado, operadoresIzqDer, operadoresDerIzq, indiceMemoria){
    while(arregloVarsOps.includes('(') && arregloVarsOps.includes(')')){
        let contadorAperturas = 0; // Aperturas de parentesis
        let contadorCerraduras = 0; // Cerraduras de parentesis
        let iterador = 0; 

        // Verifica los primeros parentesis antes de una cerradura ((( ->)
        while(arregloVarsOps[iterador] !=')'){
            if(arregloVarsOps[iterador] == '('){
                contadorAperturas++;
            }
            iterador++;
        }

        let iUltimaCerr_PrimerApert = 0;
        let continuarIterando = true;

        while(continuarIterando) {
            if(arregloVarsOps[iterador] == ')'){
                contadorCerraduras++;
                iterador++;
            } else if(contadorAperturas == contadorCerraduras){
                iUltimaCerr_PrimerApert = iterador - 1;
                continuarIterando = false;
            } else{
                iterador++;
            }
        }

        const ejecucionParentesis = evaluacionParentesis(arregloVarsOps.slice(
                                        arregloVarsOps.indexOf('(') + 1,iUltimaCerr_PrimerApert),
                                        arrResultado, operadoresIzqDer, operadoresDerIzq, indiceMemoria);
        arrResultado = arrResultado.concat(ejecucionParentesis[3]);
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

    return [`(${arregloVarsOps.join('')})`, arregloVarsOps.join(''), indiceMemoria, arrResultado];


}