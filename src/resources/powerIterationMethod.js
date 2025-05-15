function powerIterationMethod (initialVector, adjMatrix, iterations) {
    var nextVector = initialVector
    for (let i = 0; i < iterations; i++){
        console.log("Iteración " + i);
        nextVector = matrixMultiply(nextVector, adjMatrix);
        for (let j = 0; j < nextVector[0].length; j++){
            nextVector[0][j] /= normalize(nextVector)
        }
        console.log("vector propio: " + nextVector + "; m: " + nextVector.length + "; n: " + nextVector[0].length)
    }
    return nextVector;
}

function normalize (vector) {
    let sum = 0;
    for (let i = 0; i < vector[0].length; i++){
        sum += Math.pow(vector[0][i], 2);
    }

    return Math.sqrt(sum);
}

function matrixMultiply (A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;
    
    let result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
    
    if (colsA !== rowsB) {
        throw new Error("no se puede multiplicar...");
    }
    
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return result;

}