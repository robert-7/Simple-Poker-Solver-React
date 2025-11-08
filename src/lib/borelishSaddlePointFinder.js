import { createSaddlePointFinder } from './saddlePointFinderBase';

/**
 * Borel version value calculator
 * When folding, always subtracts ante regardless of card strength
 */
function borelValueCalculator(strat1, strat2, ante, bet, cardRange) {
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

const { findSaddlePoints } = createSaddlePointFinder(borelValueCalculator);

export { findSaddlePoints };
