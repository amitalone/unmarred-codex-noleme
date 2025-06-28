import { IInvalidationStrategy, InvalidationOptions } from '../interfaces/IInvalidationStrategy';

export class HybridStrategy implements IInvalidationStrategy {
  readonly name = 'hybrid';
  
  private primaryStrategy?: IInvalidationStrategy;
  private fallbackStrategy?: IInvalidationStrategy;
  private options: InvalidationOptions = {};
  private onInvalidateCallback?: (keys: string[]) => void;

  constructor(
    primaryStrategy: IInvalidationStrategy,
    fallbackStrategy: IInvalidationStrategy
  ) {
    this.primaryStrategy = primaryStrategy;
    this.fallbackStrategy = fallbackStrategy;
  }

  async initialize(options: InvalidationOptions): Promise<void> {
    this.options = options;
    
    if (this.primaryStrategy) {
      await this.primaryStrategy.initialize(options);
    }
    
    if (this.fallbackStrategy) {
      await this.fallbackStrategy.initialize(options);
    }
  }

  async shouldInvalidate(key: string, entry: any, metadata?: Record<string, any>): Promise<boolean> {
    // Check primary strategy first
    if (this.primaryStrategy) {
      const primaryResult = await this.primaryStrategy.shouldInvalidate(key, entry, metadata);
      if (primaryResult) {
        return true;
      }
    }

    // Fallback to secondary strategy
    if (this.fallbackStrategy) {
      return await this.fallbackStrategy.shouldInvalidate(key, entry, metadata);
    }

    return false;
  }

  async startWatching(onInvalidate: (keys: string[]) => void): Promise<void> {
    this.onInvalidateCallback = onInvalidate;
    
    // Start both strategies
    const promises: Promise<void>[] = [];
    
    if (this.primaryStrategy) {
      promises.push(
        this.primaryStrategy.startWatching((keys) => {
          console.debug(`Primary strategy (${this.primaryStrategy!.name}) invalidated keys:`, keys);
          onInvalidate(keys);
        })
      );
    }
    
    if (this.fallbackStrategy) {
      promises.push(
        this.fallbackStrategy.startWatching((keys) => {
          console.debug(`Fallback strategy (${this.fallbackStrategy!.name}) invalidated keys:`, keys);
          onInvalidate(keys);
        })
      );
    }
    
    await Promise.all(promises);
  }

  async stopWatching(): Promise<void> {
    const promises: Promise<void>[] = [];
    
    if (this.primaryStrategy) {
      promises.push(this.primaryStrategy.stopWatching());
    }
    
    if (this.fallbackStrategy) {
      promises.push(this.fallbackStrategy.stopWatching());
    }
    
    await Promise.all(promises);
    this.onInvalidateCallback = undefined;
  }

  async invalidate(keys: string[]): Promise<void> {
    const promises: Promise<void>[] = [];
    
    if (this.primaryStrategy) {
      promises.push(this.primaryStrategy.invalidate(keys));
    }
    
    if (this.fallbackStrategy) {
      promises.push(this.fallbackStrategy.invalidate(keys));
    }
    
    await Promise.all(promises);
    
    if (this.onInvalidateCallback) {
      this.onInvalidateCallback(keys);
    }
  }

  async dispose(): Promise<void> {
    const promises: Promise<void>[] = [];
    
    if (this.primaryStrategy) {
      promises.push(this.primaryStrategy.dispose());
    }
    
    if (this.fallbackStrategy) {
      promises.push(this.fallbackStrategy.dispose());
    }
    
    await Promise.all(promises);
  }

  /**
   * Get the primary strategy
   */
  getPrimaryStrategy(): IInvalidationStrategy | undefined {
    return this.primaryStrategy;
  }

  /**
   * Get the fallback strategy
   */
  getFallbackStrategy(): IInvalidationStrategy | undefined {
    return this.fallbackStrategy;
  }

  /**
   * Forward method calls to specific strategies
   */
  forwardToPrimary<T = any>(methodName: string, ...args: any[]): T | undefined {
    if (this.primaryStrategy && typeof (this.primaryStrategy as any)[methodName] === 'function') {
      return (this.primaryStrategy as any)[methodName](...args);
    }
    return undefined;
  }

  forwardToFallback<T = any>(methodName: string, ...args: any[]): T | undefined {
    if (this.fallbackStrategy && typeof (this.fallbackStrategy as any)[methodName] === 'function') {
      return (this.fallbackStrategy as any)[methodName](...args);
    }
    return undefined;
  }
}
