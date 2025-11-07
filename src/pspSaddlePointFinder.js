// Module-scoped variables
let ante, bet, cardRange, vMatrix;

function findSaddlePoints(var_ante, var_bet, var_cardRange) {
    ante = parseInt(var_ante);
    bet = parseInt(var_bet);
    cardRange = parseInt(var_cardRange);

    vMatrix = valueMatrix();

    const matrixStr = matrixToString(vMatrix);
    console.log(matrixStr);

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
                console.log("(" + "(" + pure1 + ")" + "," + "(" + pure2 + ")" + ")" + " value = " + value(pure1, pure2));

            }
            nextstrat(pure2);
        }
        nextstrat(pure1);
    }
    console.log("done");
    return saddlePoints;
}

function matrixToString(valueMatrix) {
    let matrixStr = "";
    let tempStr = ""
    for (const i in vMatrix) {
        for (const j in vMatrix[i]) {
            tempStr += vMatrix[i][j].toString();
            if (tempStr === "0") {
                tempStr += ".00";
            } else if (tempStr.length < 4) {
                tempStr += "0";
            } else {
                tempStr = tempStr.substring(0, 4);
            }
            matrixStr += tempStr;
            matrixStr += ", "
			tempStr = "";
        }
        matrixStr += "\n "
    }
    return matrixStr;
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
    let temp = 0;
    for (let i = 0; i < cardRange; i++) {
        for (let j = 0; j < cardRange; j++) {
            if (i !== j) {

                if (strat1[i] === 0) {
                    if (i > j) {

                        temp = temp + ante;
                    } else {

                        temp = temp - ante;
                    }
                }


                if (strat1[i] === 1) {

                    if (strat2[j] === 0) {

                        temp = temp + ante;
                    }
                    if (strat2[j] === 1) {
                        if (i > j) {
                            temp = temp + ante + bet;
                        } else {
                            temp = temp - ante - bet;
                        }
                    }

                }
            }
        }
    }
    return temp / (Math.pow(cardRange, 2) - cardRange);
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
