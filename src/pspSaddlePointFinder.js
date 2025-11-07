import { findSaddlePoints as findSaddlePointsBase } from "./saddlePointFinderBase";

// Helper function to convert matrix to string for PSP strategy
function matrixToString(valueMatrix) {
    let matrixStr = "";
    let tempStr = "";
    for (const i in valueMatrix) {
        for (const j in valueMatrix[i]) {
            tempStr += valueMatrix[i][j].toString();
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

// PSP-specific value calculation function
function pspValue(strat1, strat2, ante, bet, cardRange) {
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

// Wrapper function that uses the base implementation with PSP-specific value function
function findSaddlePoints(var_ante, var_bet, var_cardRange) {
    return findSaddlePointsBase(var_ante, var_bet, var_cardRange, pspValue, matrixToString);
}

export { findSaddlePoints };
