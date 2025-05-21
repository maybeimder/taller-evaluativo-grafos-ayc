// Metodo pirncipal para realizar el algoritmo pageRank
function pageRankMethod(initialVector, adjList, iterations, dampingFactor) {
    var pageRankVector = initialVector
    const sthocasticTransitionMatrix = createSthocasticTransitionMatrix(adjList);
    console.log(sthocasticTransitionMatrix)
    for (let iteration = 0; iteration < iterations; iteration++) {
        console.log(pageRankVector)
        pageRankVector = matrixVectorMultiply(pageRankVector, sthocasticTransitionMatrix);
        for (let element = 0; element < pageRankVector.length; element++) {
            pageRankVector[element] = pageRankVector[element] * dampingFactor + ((1 - dampingFactor) / pageRankVector.length);
        }
    }
    return pageRankVector;
}

// Metodo para normalizar las filas de la matriz y multiplicarlas por el factor de amortiguamiento
function createSthocasticTransitionMatrix(matrix) {
    const rows = matrix.length;
    let result = JSON.parse(JSON.stringify(matrix));
    // se obtiene la norma de cada fila y luego se divide cada elemento de esta por ella
    for (let row = 0; row < rows; row++) {
        let norm = normalize(matrix[row]);
        for (let column = 0; column < matrix[row].length; column++) {
            if (norm !== 0) {
                result[row][column] = result[row][column] / norm;
            }
        }
    }
    return result;
}

//Metodo para hallar la norma del vector
function normalize(vector) {
    let sum = 0;
    for (let i = 0; i < vector.length; i++) {
        sum += vector[i];
    }
    return sum;
}

//Metodo para calcular la multiplicación de el vector con la matriz
function matrixVectorMultiply(A, B) {
    const colsA = A.length;
    const colsB = B[0].length;

    let result = Array(colsB).fill(0);

    for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
            result[j] += A[k] * B[k][j];
        }
    }

    return result;
}
