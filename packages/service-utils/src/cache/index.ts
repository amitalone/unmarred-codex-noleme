// Core interfaces
export * from './interfaces/ICacheManager';
export * from './interfaces/ICacheProvider';
export * from './interfaces/IInvalidationStrategy';

// Cache manager implementation
export { CacheManager } from './CacheManager';

// Providers
export { InMemoryCacheProvider } from './providers/InMemoryCacheProvider';

// Strategies
export { FileWatcherStrategy } from './strategies/FileWatcherStrategy';
export { TimeBasedStrategy } from './strategies/TimeBasedStrategy';
export { HybridStrategy } from './strategies/HybridStrategy';

// Convenience factory functions
import { CacheManager } from './CacheManager';
import { InMemoryCacheProvider } from './providers/InMemoryCacheProvider';
import { FileWatcherStrategy } from './strategies/FileWatcherStrategy';
import { TimeBasedStrategy } from './strategies/TimeBasedStrategy';
import { HybridStrategy } from './strategies/HybridStrategy';
import { CacheManagerConfig } from './interfaces/ICacheManager';

/**
 * Create a cache manager with file system watching for the face-swap use case
 */
export function createFileSystemCacheManager(config?: {
  watchPaths?: string[];
  ttl?: number;
  debug?: boolean;
}): CacheManager {
  const provider = new InMemoryCacheProvider();
  
  const fileWatcherStrategy = new FileWatcherStrategy();
  const timeBasedStrategy = new TimeBasedStrategy();
  const hybridStrategy = new HybridStrategy(fileWatcherStrategy, timeBasedStrategy);
  
  const strategies = new Map();
  strategies.set('file-watcher', fileWatcherStrategy);
  strategies.set('time-based', timeBasedStrategy);
  strategies.set('hybrid', hybridStrategy);
  
  const managerConfig: CacheManagerConfig = {
    provider,
    strategies,
    defaultOptions: {
      strategy: 'hybrid',
      ttl: config?.ttl || 300,
      strategyOptions: {
        watchPaths: config?.watchPaths || [],
        watchExtensions: ['.png', '.jpg', '.jpeg'],
        recursive: true,
        ttl: config?.ttl || 300
      }
    },
    debug: config?.debug || false
  };
  
  return new CacheManager(managerConfig);
}

/**
 * Create a simple time-based cache manager
 */
export function createTimeBasedCacheManager(config?: {
  ttl?: number;
  debug?: boolean;
}): CacheManager {
  const provider = new InMemoryCacheProvider();
  const timeBasedStrategy = new TimeBasedStrategy();
  
  const strategies = new Map();
  strategies.set('time-based', timeBasedStrategy);
  
  const managerConfig: CacheManagerConfig = {
    provider,
    strategies,
    defaultOptions: {
      strategy: 'time-based',
      ttl: config?.ttl || 300,
      strategyOptions: {
        ttl: config?.ttl || 300
      }
    },
    debug: config?.debug || false
  };
  
  return new CacheManager(managerConfig);
}
