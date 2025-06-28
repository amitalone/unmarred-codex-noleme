import { ICacheProvider, CacheEntry } from '../interfaces/ICacheProvider';

export class InMemoryCacheProvider implements ICacheProvider {
  private cache = new Map<string, CacheEntry>();
  private timers = new Map<string, NodeJS.Timeout>();

  async get<T = any>(key: string): Promise<CacheEntry<T> | null> {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (this.isExpired(entry)) {
      await this.delete(key);
      return null;
    }

    return entry as CacheEntry<T>;
  }

  async set<T = any>(
    key: string, 
    value: T, 
    options?: { ttl?: number; metadata?: Record<string, any> }
  ): Promise<void> {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: options?.ttl,
      metadata: options?.metadata,
    };

    this.cache.set(key, entry);

    // Clear existing timer if any
    const existingTimer = this.timers.get(key);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set expiration timer if TTL is specified
    if (options?.ttl) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, options.ttl * 1000);
      this.timers.set(key, timer);
    }
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  async clear(): Promise<void> {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    
    this.cache.clear();
    this.timers.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = await this.get(key);
    return entry !== null;
  }

  async keys(pattern?: string): Promise<string[]> {
    const allKeys = Array.from(this.cache.keys());
    
    if (!pattern) {
      return allKeys;
    }

    // Simple pattern matching - convert glob-like pattern to regex
    const regex = new RegExp(
      pattern
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.')
    );
    
    return allKeys.filter(key => regex.test(key));
  }

  async deletePattern(pattern: string): Promise<void> {
    const keysToDelete = await this.keys(pattern);
    
    for (const key of keysToDelete) {
      await this.delete(key);
    }
  }

  private isExpired(entry: CacheEntry): boolean {
    if (!entry.ttl) {
      return false;
    }
    
    const now = Date.now();
    const expirationTime = entry.timestamp + (entry.ttl * 1000);
    return now > expirationTime;
  }

  // Additional methods for debugging and monitoring
  getSize(): number {
    return this.cache.size;
  }

  getMemoryUsage(): number {
    // Rough estimation of memory usage
    let size = 0;
    for (const [key, entry] of this.cache) {
      size += key.length * 2; // Approximate string size
      size += JSON.stringify(entry.value).length * 2; // Approximate object size
    }
    return size;
  }
}
