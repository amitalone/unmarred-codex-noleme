import type { StrykerOptions } from '@stryker-mutator/api/core';

declare module '@repo/stryker-config' {
  const config: StrykerOptions;
  export = config;
}