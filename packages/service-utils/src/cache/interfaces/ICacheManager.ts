import { ICacheProvider } from './ICacheProvider';
import { IInvalidationStrategy, InvalidationOptions } from './IInvalidationStrategy';

export interface CacheOptions {
  /**
   * Generate cache key from function arguments
   */
  keyGenerator?: (...args: any[]) => string;
  
  /**
   * Static cache key (if not using keyGenerator)
   */
  key?: string;
  
  /**
   * Time-to-live in seconds
   */
  ttl?: number;
  
  /**
   * Invalidation strategy name
   */
  strategy?: string;
  
  /**
   * Strategy-specific options
   */
  strategyOptions?: InvalidationOptions;
  
  /**
   * Whether to return stale data while refreshing
   */
  staleWhileRevalidate?: boolean;
  
  /**
   * Custom serializer for complex objects
   */
  serializer?: {
    serialize: (value: any) => string;
    deserialize: (value: string) => any;
  };
}

export interface CacheManagerConfig {
  /**
   * Default cache provider
   */
  provider: ICacheProvider;
  
  /**
   * Available invalidation strategies
   */
  strategies: Map<string, IInvalidationStrategy>;
  
  /**
   * Default cache options
   */
  defaultOptions?: Partial<CacheOptions>;
  
  /**
   * Enable debug logging
   */
  debug?: boolean;
}

export interface ICacheManager {
  /**
   * Wrap a function with caching
   */
  cacheable<TArgs extends any[], TReturn>(
    options: CacheOptions
  ): (fn: (...args: TArgs) => TReturn | Promise<TReturn>) => (...args: TArgs) => Promise<TReturn>;
  
  /**
   * Get cached value directly
   */
  get<T = any>(key: string): Promise<T | null>;
  
  /**
   * Set cached value directly
   */
  set<T = any>(key: string, value: T, options?: CacheOptions): Promise<void>;
  
  /**
   * Delete cached value
   */
  delete(key: string): Promise<void>;
  
  /**
   * Clear cache matching pattern
   */
  clear(pattern?: string): Promise<void>;
  
  /**
   * Get cache statistics
   */
  getStats(): {
    hits: number;
    misses: number;
    hitRate: number;
    totalKeys: number;
  };
  
  /**
   * Dispose all resources
   */
  dispose(): Promise<void>;
}
