import { 
  ICacheManager, 
  CacheOptions, 
  CacheManagerConfig 
} from './interfaces/ICacheManager';
import { ICacheProvider } from './interfaces/ICacheProvider';
import { IInvalidationStrategy } from './interfaces/IInvalidationStrategy';

export class CacheManager implements ICacheManager {
  private provider: ICacheProvider;
  private strategies: Map<string, IInvalidationStrategy>;
  private defaultOptions: Partial<CacheOptions>;
  private debug: boolean;
  private stats = {
    hits: 0,
    misses: 0,
    totalKeys: 0
  };

  constructor(config: CacheManagerConfig) {
    this.provider = config.provider;
    this.strategies = config.strategies;
    this.defaultOptions = config.defaultOptions || {};
    this.debug = config.debug || false;
    
    this.initializeStrategies();
  }

  cacheable<TArgs extends any[], TReturn>(
    options: CacheOptions
  ): (fn: (...args: TArgs) => TReturn | Promise<TReturn>) => (...args: TArgs) => Promise<TReturn> {
    const finalOptions = { ...this.defaultOptions, ...options };
    
    return (fn: (...args: TArgs) => TReturn | Promise<TReturn>) => {
      return async (...args: TArgs): Promise<TReturn> => {
        // Generate cache key
        const cacheKey = this.generateCacheKey(finalOptions, args);
        
        // Try to get from cache first
        const cachedEntry = await this.provider.get<TReturn>(cacheKey);
        
        if (cachedEntry) {
          // Check if should invalidate
          const strategy = finalOptions.strategy ? this.strategies.get(finalOptions.strategy) : null;
          
          if (strategy) {
            const shouldInvalidate = await strategy.shouldInvalidate(cacheKey, cachedEntry);
            if (shouldInvalidate) {
              await this.provider.delete(cacheKey);
              this.logDebug(`Cache invalidated for key: ${cacheKey}`);
            } else {
              this.stats.hits++;
              this.logDebug(`Cache hit for key: ${cacheKey}`);
              return cachedEntry.value;
            }
          } else {
            this.stats.hits++;
            this.logDebug(`Cache hit for key: ${cacheKey}`);
            return cachedEntry.value;
          }
        }

        // Cache miss - execute function
        this.stats.misses++;
        this.logDebug(`Cache miss for key: ${cacheKey}`);
        
        const result = await fn(...args);
        
        // Store in cache
        await this.provider.set(cacheKey, result, {
          ttl: finalOptions.ttl,
          metadata: {
            strategy: finalOptions.strategy,
            args: args,
            timestamp: Date.now()
          }
        });

        // Register with strategy if applicable
        if (finalOptions.strategy) {
          this.registerWithStrategy(finalOptions.strategy, cacheKey, args, finalOptions);
        }

        this.stats.totalKeys++;
        return result;
      };
    };
  }

  async get<T = any>(key: string): Promise<T | null> {
    const entry = await this.provider.get<T>(key);
    if (entry) {
      this.stats.hits++;
      return entry.value;
    }
    this.stats.misses++;
    return null;
  }

  async set<T = any>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const finalOptions = { ...this.defaultOptions, ...options };
    
    await this.provider.set(key, value, {
      ttl: finalOptions.ttl,
      metadata: {
        strategy: finalOptions.strategy,
        timestamp: Date.now()
      }
    });

    if (finalOptions.strategy) {
      this.registerWithStrategy(finalOptions.strategy, key, [], finalOptions);
    }
  }

  async delete(key: string): Promise<void> {
    await this.provider.delete(key);
  }

  async clear(pattern?: string): Promise<void> {
    if (pattern) {
      await this.provider.deletePattern(pattern);
    } else {
      await this.provider.clear();
    }
  }

  getStats() {
    const totalRequests = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      totalKeys: this.stats.totalKeys
    };
  }

  async dispose(): Promise<void> {
    // Dispose all strategies
    for (const strategy of this.strategies.values()) {
      await strategy.dispose();
    }
    
    // Clear cache
    await this.provider.clear();
  }

  private generateCacheKey(options: CacheOptions, args: any[]): string {
    if (options.key) {
      return options.key;
    }
    
    if (options.keyGenerator) {
      return options.keyGenerator(...args);
    }
    
    // Default key generation
    const argsString = JSON.stringify(args);
    const hash = this.simpleHash(argsString);
    return `cache:${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private async initializeStrategies(): Promise<void> {
    for (const [name, strategy] of this.strategies) {
      await strategy.startWatching((keys) => {
        this.handleInvalidation(keys);
      });
    }
  }

  private async handleInvalidation(keys: string[]): Promise<void> {
    this.logDebug(`Invalidating ${keys.length} cache keys:`, keys);
    
    for (const key of keys) {
      await this.provider.delete(key);
    }
  }

  private registerWithStrategy(
    strategyName: string, 
    cacheKey: string, 
    args: any[], 
    options: CacheOptions
  ): void {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      return;
    }

    // Special handling for FileWatcherStrategy with scanFolderRecursive
    if (strategy.name === 'file-watcher' && args.length >= 2) {
      const [basePath, subPath] = args;
      if (typeof basePath === 'string' && typeof subPath === 'string') {
        (strategy as any).generatePathMapping?.(cacheKey, basePath, subPath);
      }
    }

    // Special handling for TimeBasedStrategy
    if (strategy.name === 'time-based') {
      (strategy as any).registerKey?.(cacheKey);
    }

    // Special handling for HybridStrategy
    if (strategy.name === 'hybrid') {
      const primaryStrategy = (strategy as any).getPrimaryStrategy?.();
      const fallbackStrategy = (strategy as any).getFallbackStrategy?.();
      
      if (primaryStrategy?.name === 'file-watcher' && args.length >= 2) {
        const [basePath, subPath] = args;
        if (typeof basePath === 'string' && typeof subPath === 'string') {
          (primaryStrategy as any).generatePathMapping?.(cacheKey, basePath, subPath);
        }
      }
      
      if (fallbackStrategy?.name === 'time-based') {
        (fallbackStrategy as any).registerKey?.(cacheKey);
      }
    }
  }

  private logDebug(message: string, ...args: any[]): void {
    if (this.debug) {
      console.debug(`[CacheManager] ${message}`, ...args);
    }
  }
}
