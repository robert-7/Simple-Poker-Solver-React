# Saddle Point Finder Library

This directory contains the core algorithms for computing saddle points (Nash equilibria) in simplified poker games.

## Files

### `borelishSaddlePointFinder.js`

Implements the saddle point finding algorithm for **Borel's Simplified Poker Game (1938)**.

**Game Rules:**

* Player 1 options: **bet** or **fold**
* Player 2 options: **call** or **fold**
* When P1 folds, they always lose the ante regardless of hand strength

**Usage:**

```javascript
import { findSaddlePoints } from './lib/borelishSaddlePointFinder';

const results = findSaddlePoints(anteValue, betValue, numCards);
// Returns array of saddle points with strategies for both players
```

### `vonNeumannSaddlePointFinder.js`

Implements the saddle point finding algorithm for **Von Neumann's Simplified Poker Game (1947)**.

**Game Rules:**

* Player 1 options: **bet** or **check**
* Player 2 options: **call** or **fold**
* When P1 checks with a stronger hand, they win the ante

**Usage:**

```javascript
import { findSaddlePoints } from './lib/vonNeumannSaddlePointFinder';

const results = findSaddlePoints(anteValue, betValue, numCards);
// Returns array of saddle points with strategies for both players
```

### `saddlePointUtils.js`

Common utility functions shared by both algorithms.

**Functions:**

* `matrixToString(vMatrix)` - Converts a value matrix to a formatted string representation for debugging

## Common Game Rules

Both variants share these core mechanics:

* **2 players**: P1 plays first, P2 responds
* **Ante**: Fixed at `A` units (typically 1)
* **Bet**: `B` units
* **Hands**: Players receive a card numbered from 1 to `n`
* **Payoff**: If one player folds, the other wins the ante. If both bet/call, the higher card wins `A + B`

## Algorithm Overview

Both algorithms:

1. Generate all possible pure strategies (2^n for n cards)
1. Build a value matrix representing expected payoffs
1. Find all saddle points where neither player can improve by unilateral deviation
1. Return strategies as binary arrays where:
   * `0` = fold/check for that card
   * `1` = bet/call for that card

## Example Output

```javascript
{
  "%PURE1%": "0,0,1,1,0,1,0",  // P1 strategy: fold cards 1,2,5,7; bet cards 3,4,6
  "%PURE2%": "1,0,0,1,1,0,0",  // P2 strategy: call cards 1,4,5; fold cards 2,3,6,7
  "%VALUE%": "3.25"             // Expected payoff for P1
}
```

## References

* Borel, E. (1938). "Applications aux Jeux de Hasard"
* von Neumann, J. & Morgenstern, O. (1947). "Theory of Games and Economic Behavior"
* [Bluffing and Betting Behavior in a Simplified Poker Game](https://drive.google.com/file/d/0B305za0bQ_wWcF9qTWRsa2ppS0E/view?usp=sharing&resourcekey=0-tVM4i_DOkr6ZCIQJ88PeZQ)
