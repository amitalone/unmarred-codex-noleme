import { helloWorld, SHARED_CONSTANT } from './index';

describe('shared-interfaces index', () => {
  describe('helloWorld function', () => {
    it('should return the correct greeting message', () => {
      // Arrange & Act
      const result = helloWorld();

      // Assert
      expect(result).toBe('Hello, World! Hotreload');
    });

    it('should return a string', () => {
      // Act
      const result = helloWorld();

      // Assert
      expect(typeof result).toBe('string');
    });
  });

  describe('SHARED_CONSTANT', () => {
    it('should have the correct value', () => {
      // Assert
      expect(SHARED_CONSTANT).toBe('This is a shared constant');
    });

    it('should be a string', () => {
      // Assert
      expect(typeof SHARED_CONSTANT).toBe('string');
    });
  });
});
