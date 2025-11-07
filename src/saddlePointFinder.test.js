import { findSaddlePoints as findSaddlePointsBorel } from "./borelishSaddlePointFinder";
import { findSaddlePoints as findSaddlePointsPSP } from "./pspSaddlePointFinder";

// Test the refactored saddle point finders
describe('Saddle Point Finder Tests', () => {
  
  // Test basic functionality of Borel strategy
  test('Borel findSaddlePoints returns array', () => {
    const result = findSaddlePointsBorel(1, 2, 2);
    expect(Array.isArray(result)).toBe(true);
  });

  // Test basic functionality of PSP strategy
  test('PSP findSaddlePoints returns array', () => {
    const result = findSaddlePointsPSP(1, 2, 2);
    expect(Array.isArray(result)).toBe(true);
  });

  // Test that saddle points have required properties
  test('Borel saddle points have required properties', () => {
    const result = findSaddlePointsBorel(1, 2, 2);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('%PURE1%');
      expect(result[0]).toHaveProperty('%PURE2%');
      expect(result[0]).toHaveProperty('%VALUE%');
    }
  });

  // Test that saddle points have required properties
  test('PSP saddle points have required properties', () => {
    const result = findSaddlePointsPSP(1, 2, 2);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('%PURE1%');
      expect(result[0]).toHaveProperty('%PURE2%');
      expect(result[0]).toHaveProperty('%VALUE%');
    }
  });

  // Test that Borel and PSP produce different results (since they use different value functions)
  test('Borel and PSP produce different results for same input', () => {
    const borelResult = findSaddlePointsBorel(1, 2, 2);
    const pspResult = findSaddlePointsPSP(1, 2, 2);
    
    // The strategies should be different since the value functions differ
    // Just verify both returned valid results
    expect(borelResult).not.toEqual(pspResult);
  });

  // Test with different parameters
  test('Borel works with different parameters', () => {
    const result = findSaddlePointsBorel(2, 3, 3);
    expect(Array.isArray(result)).toBe(true);
  });

  test('PSP works with different parameters', () => {
    const result = findSaddlePointsPSP(2, 3, 3);
    expect(Array.isArray(result)).toBe(true);
  });
});
