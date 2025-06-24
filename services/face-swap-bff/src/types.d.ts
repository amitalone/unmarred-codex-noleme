// This file contains type declarations for Jest globals
import { Mock } from 'jest-mock';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenCalled(): R;
      toEqual(expected: any): R;
    }
    
    type MockableFunction = (...args: any[]) => any;
    
    interface MockInstance<T extends MockableFunction> {
      new (...args: any[]): T;
      (...args: Parameters<T>): ReturnType<T>;
      mockImplementation(fn: T): this;
      mockReturnValue(value: ReturnType<T>): this;
      mockResolvedValue(value: Awaited<ReturnType<T>>): this;
      mockRejectedValue(value: any): this;
    }
    
    type Mock<T extends MockableFunction = MockableFunction> = MockInstance<T> & {
      calls: Array<Parameters<T>>;
      results: Array<{ type: string; value: ReturnType<T> }>;
      instances: Array<T>;
    };
    
    function fn<T extends MockableFunction = MockableFunction>(): Mock<T>;
    function clearAllMocks(): void;
    function mock(moduleName: string, factory?: () => any): void;
    
    const any: (constructor: any) => any;
  }
  
  function describe(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function it(name: string, fn: () => void | Promise<void>): void;
  const expect: {
    <T>(value: T): {
      toHaveBeenCalledWith: (...args: any[]) => void;
      toHaveBeenCalled: () => void;
      toEqual: (expected: any) => void;
      not: {
        toHaveBeenCalled: () => void;
      };
    };
    any: (constructor: any) => any;
  };
}

export {};