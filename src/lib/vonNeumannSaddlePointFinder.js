import { createSaddlePointFinder } from './saddlePointFinderBase';

/**
 * Von Neumann version value calculator
 * When folding, considers card strength - gains ante if card is stronger, loses ante if weaker
 */
function vonNeumannValueCalculator(strat1, strat2, ante, bet, cardRange) {
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

const finderBase = createSaddlePointFinder(vonNeumannValueCalculator);

function findSaddlePoints(var_ante, var_bet, var_cardRange) {
    return finderBase.findSaddlePoints(var_ante, var_bet, var_cardRange, 'Done calculating saddle points for');
}

export { findSaddlePoints };
