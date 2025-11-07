import { findSaddlePoints as findSaddlePointsBase } from "./saddlePointFinderBase";

// Borel-specific value calculation function
function borelishValue(strat1, strat2, ante, bet, cardRange) {
    let temp = 0;
    for (let i = 0; i < cardRange; i++) {
        for (let j = 0; j < cardRange; j++) {
            if (i !== j) {

                if (strat1[i] === 0) {
                    // Borel version: always subtract ante when folding
                    temp = temp - ante;
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

// Wrapper function that uses the base implementation with Borel-specific value function
function findSaddlePoints(var_ante, var_bet, var_cardRange) {
    return findSaddlePointsBase(var_ante, var_bet, var_cardRange, borelishValue);
}

export { findSaddlePoints };
