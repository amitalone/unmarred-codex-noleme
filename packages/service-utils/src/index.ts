export function helloWorld(): string {
  return 'Hello, World! Hotreload';
}

export const SHARED_CONSTANT = 'This is a shared constant';

// Export all utilities
export * as utils from './utils';
export * as server from './server';