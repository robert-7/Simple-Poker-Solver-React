import { findSaddlePoints } from './pspSaddlePointFinder';

describe('pspSaddlePointFinder', () => {
  describe('findSaddlePoints', () => {
    test('should return an array of saddle points', () => {
      const result = findSaddlePoints(1, 2, 3);
      expect(Array.isArray(result)).toBe(true);
    });

    test('should find saddle points for ante=1, bet=2, cards=3', () => {
      const result = findSaddlePoints(1, 2, 3);

      expect(result.length).toBeGreaterThan(0);

      // Each saddle point should have the required properties
      result.forEach(point => {
        expect(point).toHaveProperty('%PURE1%');
        expect(point).toHaveProperty('%PURE2%');
        expect(point).toHaveProperty('%VALUE%');
      });
    });

    test('should find saddle points for ante=1, bet=2, cards=4', () => {
      const result = findSaddlePoints(1, 2, 4);

      // Not all game configurations have pure strategy saddle points
      expect(Array.isArray(result)).toBe(true);

      // Validate structure for all results (may be empty array)
      result.forEach(point => {
        // Strategies should be comma-separated strings of 0s and 1s
        const p1Strategy = point['%PURE1%'].split(',');
        const p2Strategy = point['%PURE2%'].split(',');

        expect(p1Strategy.length).toBe(4);
        expect(p2Strategy.length).toBe(4);

        // Each element should be 0 or 1
        p1Strategy.forEach(val => {
          expect(['0', '1']).toContain(val);
        });
        p2Strategy.forEach(val => {
          expect(['0', '1']).toContain(val);
        });
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

    test('should find expected saddle points for ante=1, bet=1, cards=2', () => {
      const result = findSaddlePoints(1, 1, 2);

      expect(result.length).toBeGreaterThan(0);

      // For a simple 2-card game, verify strategies are valid
      result.forEach(point => {
        const p1Strategy = point['%PURE1%'].split(',');
        const p2Strategy = point['%PURE2%'].split(',');

        expect(p1Strategy.length).toBe(2);
        expect(p2Strategy.length).toBe(2);
      });
    });

    test('should handle larger card ranges', () => {
      const result = findSaddlePoints(1, 2, 5);

      expect(Array.isArray(result)).toBe(true);

      result.forEach(point => {
        const p1Strategy = point['%PURE1%'].split(',');
        const p2Strategy = point['%PURE2%'].split(',');

        expect(p1Strategy.length).toBe(5);
        expect(p2Strategy.length).toBe(5);
      });
    });

    test('should compute different results for different bet values', () => {
      const result1 = findSaddlePoints(1, 1, 3);
      const result2 = findSaddlePoints(1, 3, 3);

      // Different bet values should potentially produce different strategies
      // At minimum, the payoff values should differ
      const values1 = result1.map(p => p['%VALUE%']);
      const values2 = result2.map(p => p['%VALUE%']);

      expect(values1).not.toEqual(values2);
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

  describe('integration tests', () => {
    test('should find consistent saddle points for known game parameters', () => {
      // Test with standard parameters
      const result = findSaddlePoints(1, 2, 7);

      // Should find exactly 3 saddle points for this configuration
      expect(result.length).toBe(3);

      // Expected saddle points for ante=1, bet=2, cards=7
      const expected = [
        {
          '%PURE1%': '1,0,0,0,0,1,1',
          '%PURE2%': '0,0,1,0,0,1,1',
          '%VALUE%': '0.09523809523809523'
        },
        {
          '%PURE1%': '1,0,0,0,0,1,1',
          '%PURE2%': '0,0,0,1,0,1,1',
          '%VALUE%': '0.09523809523809523'
        },
        {
          '%PURE1%': '1,0,0,0,0,1,1',
          '%PURE2%': '0,0,0,0,1,1,1',
          '%VALUE%': '0.09523809523809523'
        }
      ];

      // Verify each expected saddle point is in the results
      expected.forEach(expectedPoint => {
        const found = result.find(r =>
          r['%PURE1%'] === expectedPoint['%PURE1%'] &&
          r['%PURE2%'] === expectedPoint['%PURE2%'] &&
          r['%VALUE%'] === expectedPoint['%VALUE%']
        );
        expect(found).toBeDefined();
      });

      // All saddle points should have valid structure
      result.forEach(point => {
        const p1Strategy = point['%PURE1%'].split(',');
        const p2Strategy = point['%PURE2%'].split(',');

        expect(p1Strategy.length).toBe(7);
        expect(p2Strategy.length).toBe(7);

        // Verify payoff is a valid number
        const value = parseFloat(point['%VALUE%']);
        expect(isFinite(value)).toBe(true);
      });
    });

    test('should handle minimum card range (1 card)', () => {
      const result = findSaddlePoints(1, 2, 1);

      expect(Array.isArray(result)).toBe(true);

      result.forEach(point => {
        const p1Strategy = point['%PURE1%'].split(',');
        const p2Strategy = point['%PURE2%'].split(',');

        expect(p1Strategy.length).toBe(1);
        expect(p2Strategy.length).toBe(1);
      });
    });
  });
});
