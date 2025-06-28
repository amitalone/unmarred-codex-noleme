import { IInvalidationStrategy, InvalidationOptions } from '../interfaces/IInvalidationStrategy';

export class TimeBasedStrategy implements IInvalidationStrategy {
  readonly name = 'time-based';
  
  private options: InvalidationOptions = {};
  private intervalId?: NodeJS.Timeout;
  private onInvalidateCallback?: (keys: string[]) => void;
  private keyTimestamps = new Map<string, number>();

  async initialize(options: InvalidationOptions): Promise<void> {
    this.options = { 
      ttl: 300, // 5 minutes default
      ...options 
    };
  }

  async shouldInvalidate(key: string, entry: any, metadata?: Record<string, any>): Promise<boolean> {
    if (!this.options.ttl) {
      return false;
    }

    const now = Date.now();
    const timestamp = entry.timestamp || this.keyTimestamps.get(key) || 0;
    const ttlMs = this.options.ttl * 1000;
    
    return (now - timestamp) > ttlMs;
  }

  async startWatching(onInvalidate: (keys: string[]) => void): Promise<void> {
    this.onInvalidateCallback = onInvalidate;
    
    if (!this.options.ttl) {
      return;
    }

    // Check for expired entries every minute
    const checkInterval = Math.min(this.options.ttl * 1000 / 4, 60000);
    
    this.intervalId = setInterval(async () => {
      await this.checkExpiredKeys();
    }, checkInterval);
  }

  async stopWatching(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    
    this.onInvalidateCallback = undefined;
  }

  async invalidate(keys: string[]): Promise<void> {
    // Remove timestamps for invalidated keys
    for (const key of keys) {
      this.keyTimestamps.delete(key);
    }
    
    if (this.onInvalidateCallback) {
      this.onInvalidateCallback(keys);
    }
  }

  async dispose(): Promise<void> {
    await this.stopWatching();
    this.keyTimestamps.clear();
  }

  /**
   * Register a key with current timestamp
   */
  registerKey(key: string): void {
    this.keyTimestamps.set(key, Date.now());
  }

  private async checkExpiredKeys(): Promise<void> {
    if (!this.options.ttl || !this.onInvalidateCallback) {
      return;
    }

    const now = Date.now();
    const ttlMs = this.options.ttl * 1000;
    const expiredKeys: string[] = [];

    for (const [key, timestamp] of this.keyTimestamps) {
      if ((now - timestamp) > ttlMs) {
        expiredKeys.push(key);
      }
    }

    if (expiredKeys.length > 0) {
      console.debug(`Time-based strategy found ${expiredKeys.length} expired cache keys`);
      
      // Remove expired keys from tracking
      for (const key of expiredKeys) {
        this.keyTimestamps.delete(key);
      }
      
      this.onInvalidateCallback(expiredKeys);
    }
  }

  /**
   * Get time until key expires
   */
  getTimeToExpiry(key: string): number | null {
    if (!this.options.ttl) {
      return null;
    }

    const timestamp = this.keyTimestamps.get(key);
    if (!timestamp) {
      return null;
    }

    const now = Date.now();
    const ttlMs = this.options.ttl * 1000;
    const expiryTime = timestamp + ttlMs;
    
    return Math.max(0, expiryTime - now);
  }
}
