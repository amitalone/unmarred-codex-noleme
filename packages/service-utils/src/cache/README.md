# Cache Manager

A flexible, enterprise-grade caching solution with support for multiple invalidation strategies and providers.

## Features

- **Multiple Invalidation Strategies**: File watcher, time-based, and hybrid approaches
- **Provider Abstraction**: Easy to switch between in-memory and Redis (future)
- **Function Decorators**: Wrap any function with caching capabilities
- **Hierarchical Invalidation**: Smart invalidation of parent/child dependencies
- **TypeScript Support**: Full type safety and IntelliSense support
- **Performance Monitoring**: Built-in cache hit/miss statistics

## Quick Start

### Basic Usage

```typescript
import { createFileSystemCacheManager } from "@repo/service-utils/cache";
import {
  scanFolderRecursive,
  addWatchPath,
} from "@repo/service-utils/utils/FileSystemUtil";

// For file system operations (like scanFolderRecursive)
const basePath = "C:/your/directory";
addWatchPath(basePath);

// First call - cache miss, executes function
const files1 = await scanFolderRecursive(basePath, "");

// Second call - cache hit, returns cached result
const files2 = await scanFolderRecursive(basePath, "");
```

### Custom Cache Manager

```typescript
import {
  CacheManager,
  InMemoryCacheProvider,
  HybridStrategy,
  FileWatcherStrategy,
  TimeBasedStrategy,
} from "@repo/service-utils/cache";

// Create custom cache manager
const provider = new InMemoryCacheProvider();
const fileWatcher = new FileWatcherStrategy();
const timeBased = new TimeBasedStrategy();
const hybrid = new HybridStrategy(fileWatcher, timeBased);

const strategies = new Map();
strategies.set("hybrid", hybrid);

const cacheManager = new CacheManager({
  provider,
  strategies,
  defaultOptions: {
    strategy: "hybrid",
    ttl: 300, // 5 minutes
  },
  debug: true,
});
```

### Caching Any Function

```typescript
// Cache any expensive function
const expensiveFunction = cacheManager.cacheable({
  keyGenerator: (id: string) => `user:${id}`,
  strategy: "time-based",
  ttl: 60, // 1 minute
})(async (id: string) => {
  // Simulate expensive operation
  const data = await fetchUserFromDatabase(id);
  return data;
});

// Usage
const user1 = await expensiveFunction("123"); // Cache miss
const user2 = await expensiveFunction("123"); // Cache hit
```

## Strategies

### File Watcher Strategy

Monitors file system changes and invalidates cache when files are modified.

```typescript
const fileWatcherStrategy = new FileWatcherStrategy();
await fileWatcherStrategy.initialize({
  watchPaths: ["C:/watched/directory"],
  watchExtensions: [".png", ".jpg", ".jpeg"],
  recursive: true,
});
```

**Best for**: File system operations, image processing, content management

### Time-Based Strategy

Invalidates cache entries after a specified time-to-live (TTL).

```typescript
const timeBasedStrategy = new TimeBasedStrategy();
await timeBasedStrategy.initialize({
  ttl: 300, // 5 minutes
});
```

**Best for**: API responses, database queries, computed values

### Hybrid Strategy

Combines file watcher (primary) with time-based fallback for maximum reliability.

```typescript
const hybridStrategy = new HybridStrategy(
  fileWatcherStrategy,
  timeBasedStrategy
);
```

**Best for**: Production environments, critical operations requiring reliability

## Configuration Options

### Cache Options

```typescript
interface CacheOptions {
  keyGenerator?: (...args: any[]) => string; // Generate cache key
  key?: string; // Static cache key
  ttl?: number; // Time-to-live in seconds
  strategy?: string; // Strategy name
  strategyOptions?: InvalidationOptions; // Strategy-specific options
  staleWhileRevalidate?: boolean; // Return stale data while refreshing
}
```

### Invalidation Options

```typescript
interface InvalidationOptions {
  ttl?: number; // Time-to-live in seconds
  watchPaths?: string[]; // Paths to watch for changes
  watchExtensions?: string[]; // File extensions to monitor
  recursive?: boolean; // Watch subdirectories
  validator?: (key: string, metadata?: Record<string, any>) => boolean;
}
```

## Performance Monitoring

```typescript
const stats = cacheManager.getStats();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);
console.log(`Total requests: ${stats.hits + stats.misses}`);
console.log(`Cache size: ${stats.totalKeys} keys`);
```

## Integration with FileSystemUtil

The cache manager is already integrated with `scanFolderRecursive`:

```typescript
import {
  scanFolderRecursive,
  addWatchPath,
} from "@repo/service-utils/utils/FileSystemUtil";

// Add directory to watch list
addWatchPath("C:/your/images/directory");

// This function is now automatically cached
const imageFiles = await scanFolderRecursive("C:/your/images/directory", "");
```

## Architecture

```
CacheManager
├── ICacheProvider (Storage Layer)
│   ├── InMemoryCacheProvider
│   └── RedisCacheProvider (Future)
├── IInvalidationStrategy (Invalidation Logic)
│   ├── FileWatcherStrategy
│   ├── TimeBasedStrategy
│   └── HybridStrategy
└── Cache Decorators (Function Wrapping)
```

## Migration to Redis

To switch to Redis in the future:

1. Implement `RedisCacheProvider`
2. Replace `InMemoryCacheProvider` in configuration
3. No changes needed in business logic

```typescript
// Future Redis configuration
const redisCacheManager = new CacheManager({
  provider: new RedisCacheProvider({
    host: "localhost",
    port: 6379,
  }),
  // ... rest of configuration remains the same
});
```

## Best Practices

1. **Use appropriate strategies**: File watcher for file operations, time-based for API calls
2. **Set reasonable TTLs**: Balance between performance and data freshness
3. **Monitor cache performance**: Regular review of hit rates and memory usage
4. **Handle cache failures gracefully**: Always provide fallback to original function
5. **Use hierarchical keys**: Structure cache keys for efficient pattern-based invalidation

## Troubleshooting

### Common Issues

1. **File watcher not working**: Check file permissions and path existence
2. **Memory usage**: Monitor cache size, implement LRU eviction if needed
3. **Cache misses**: Verify key generation consistency
4. **Performance**: Profile TTL settings and strategy overhead

### Debug Mode

Enable debug logging:

```typescript
const cacheManager = createFileSystemCacheManager({
  debug: true,
});
```

This will log cache hits, misses, and invalidation events to help with troubleshooting.
