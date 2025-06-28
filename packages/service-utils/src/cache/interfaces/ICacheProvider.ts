export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl?: number;
  metadata?: Record<string, any>;
}

export interface ICacheProvider {
  /**
   * Get a value from cache
   */
  get<T = any>(key: string): Promise<CacheEntry<T> | null>;

  /**
   * Set a value in cache
   */
  set<T = any>(key: string, value: T, options?: {
    ttl?: number;
    metadata?: Record<string, any>;
  }): Promise<void>;

  /**
   * Delete a value from cache
   */
  delete(key: string): Promise<void>;

  /**
   * Clear all cache entries
   */
  clear(): Promise<void>;

  /**
   * Check if a key exists in cache
   */
  has(key: string): Promise<boolean>;

  /**
   * Get all keys matching a pattern
   */
  keys(pattern?: string): Promise<string[]>;

  /**
   * Delete multiple keys matching a pattern
   */
  deletePattern(pattern: string): Promise<void>;
}
