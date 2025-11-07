// Base module for saddle point finding algorithms
// Contains common functions shared by borelish and psp strategies

// Module-scoped variables
let ante, bet, cardRange, vMatrix, valueFunction;

/**
 * Main function to find all saddle points for the given game parameters
 * @param {number} var_ante - The ante value
 * @param {number} var_bet - The bet value
 * @param {number} var_cardRange - The number of cards in the deck
 * @param {Function} valueFn - The value calculation function (strategy-specific)
 * @param {Function} matrixToStringFn - Optional function to convert matrix to string
 * @returns {Array} Array of saddle point objects
 */
function findSaddlePoints(var_ante, var_bet, var_cardRange, valueFn, matrixToStringFn = null) {
    ante = parseInt(var_ante);
    bet = parseInt(var_bet);
    cardRange = parseInt(var_cardRange);
    valueFunction = valueFn;

    vMatrix = valueMatrix();

    if (matrixToStringFn) {
        const matrixStr = matrixToStringFn(vMatrix);
        console.log(matrixStr);
    }

    let pure1 = newStrat();

    // these arrays will hold the solutions we'd like to return
    const saddlePoints = [];
    let saddlePoint;

    for (let x = 0; x < Math.pow(2, cardRange); x++) {

        let pure2 = newStrat();

        for (let y = 0; y < Math.pow(2, cardRange); y++) {

            if (SaddlePoint(pure1, pure2)) {
                saddlePoint = {
                    "%PURE1%": pure1.toString(),
                    "%PURE2%": pure2.toString(),
                    "%VALUE%": value(pure1, pure2).toString()
                };
                saddlePoints.push(saddlePoint);
                console.log(`((${pure1}),(${pure2})) value = ${value(pure1, pure2)}`);

            }
            nextstrat(pure2);
        }
        nextstrat(pure1);
    }
    console.log("done");
    return saddlePoints;
}

function SaddlePoint(s1, s2) {
    let sad1 = false;
    let sad2 = false;

    const st = [s1, s2];
    let sum = 9999999;
    let temp = 0;

    const stratP1 = newStrat();
    const stratP2 = newStrat();

    const str = [stratP1, stratP2];

    for (let s = 0; s < Math.pow(2, cardRange); s++) {

        temp = vMatrix[toDec(st[0])][toDec(str[1])];

        if (sum > temp || ((sum >= temp) && equal(str[1], st[1]))) {
            sum = temp;
            sad2 = false;
            if (equal(str[1], st[1])) {
                sad2 = true;
            }

        }
        temp = 0;
        nextstrat(str[1]);
    }

    sum = 0;
    temp = 0;

    for (let s = 0; s < Math.pow(2, cardRange); s++) {
        temp = vMatrix[toDec(str[0])][toDec(st[1])];

        if (sum < temp || ((sum <= temp) && equal(str[0], st[0]))) {
            sum = temp;
            sad1 = false;
            if (equal(str[0], st[0])) {
                sad1 = true;
            }

        }
        temp = 0;
        nextstrat(str[0]);
    }

    return (sad1 && sad2);

}

function nextstrat(strat) {
    strat[0]++;
    fix(strat);
}

function fix(strat) {
    for (let i = 0; i < cardRange; i++) {
        if (strat[i] === 2) {
            strat[i] = 0;
            if (i !== cardRange - 1) {
                strat[i + 1]++;
            }
            fix(strat);
            i = cardRange;
        }
    }
}

function equal(strat1, strat2) {
    let bool = true;
    for (let i = 0; i < cardRange; i++) {
        bool = bool && (strat1[i] === strat2[i]);
    }
    return (bool);
}

function value(strat1, strat2) {
    return valueFunction(strat1, strat2, ante, bet, cardRange);
}

function newStrat() {
    const strat = [];

    for (let i = 0; i < cardRange; i++) {
        strat[i] = 0;
    }

    return strat;
}

function valueMatrix() {
    const valMat = new Array(cardRange);

    let strati = newStrat();
    let stratj = newStrat();

    for (let i = 0; i < Math.pow(2, cardRange); i++) {
        valMat[i] = new Array(cardRange);
        for (let j = 0; j < Math.pow(2, cardRange); j++) {
            valMat[i][j] = value(strati, stratj);
            nextstrat(stratj);
        }
        nextstrat(strati);
    }
    return valMat;
}

function toDec(strat) {
    let dec = 0;

    for (let i = 0; i < strat.length; i++) {
        dec = dec + Math.pow(2, i) * strat[i];
    }

    return dec;
}

export { findSaddlePoints };
