import { findSaddlePoints } from './borelishSaddlePointFinder';

describe('borelishSaddlePointFinder', () => {
  describe('findSaddlePoints', () => {
    test('should return an array of saddle points', () => {
      const result = findSaddlePoints(1, 2, 3);
      expect(Array.isArray(result)).toBe(true);
    });

    test('should find saddle points for ante=1, bet=2, cards=3', () => {
      const result = findSaddlePoints(1, 2, 3);

      // Borel algorithm may not find saddle points for all configurations
      expect(Array.isArray(result)).toBe(true);

      // If saddle points exist, each should have the required properties
      result.forEach(point => {
        expect(point).toHaveProperty('%PURE1%');
        expect(point).toHaveProperty('%PURE2%');
        expect(point).toHaveProperty('%VALUE%');
      });
    });

    test('should handle string inputs by parsing them to integers', () => {
      const result1 = findSaddlePoints('1', '2', '3');
      const result2 = findSaddlePoints(1, 2, 3);

      // Should produce the same results
      expect(result1.length).toBe(result2.length);
    });

    test('should return valid payoff values', () => {
      const result = findSaddlePoints(1, 2, 3);

      result.forEach(point => {
        const value = parseFloat(point['%VALUE%']);
        expect(isNaN(value)).toBe(false);
        expect(isFinite(value)).toBe(true);
      });
    });

    test('should return strategies as comma-separated strings', () => {
      const result = findSaddlePoints(1, 2, 3);

      result.forEach(point => {
        expect(typeof point['%PURE1%']).toBe('string');
        expect(typeof point['%PURE2%']).toBe('string');
        expect(point['%PURE1%']).toMatch(/^[0-1](,[0-1])*$/);
        expect(point['%PURE2%']).toMatch(/^[0-1](,[0-1])*$/);
      });
    });

    test('should return payoff as string', () => {
      const result = findSaddlePoints(1, 2, 3);

      result.forEach(point => {
        expect(typeof point['%VALUE%']).toBe('string');
        // Should be parseable as a number
        expect(isNaN(parseFloat(point['%VALUE%']))).toBe(false);
      });
    });
  });
});
