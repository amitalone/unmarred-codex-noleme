/**
 * A simple test to verify that Jest is working correctly with ESM
 */

// Explicitly import Jest functions from '@jest/globals'
// You can remove this import in your actual test files once everything is working
import { jest, describe, it, expect } from '@jest/globals';

describe('Basic test', () => {
  it('should work with Jest in ESM mode', () => {
    expect(1 + 1).toBe(2);
    
    // Test that jest.fn() is working
    const mockFn = jest.fn().mockReturnValue(42);
    expect(mockFn()).toBe(42);
  });
});
