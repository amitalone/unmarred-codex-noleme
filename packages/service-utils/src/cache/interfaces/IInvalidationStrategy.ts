export type InvalidationTrigger = 'time' | 'file-change' | 'manual' | 'hybrid';

export interface InvalidationOptions {
  /**
   * Time-to-live in seconds
   */
  ttl?: number;
  
  /**
   * Paths to watch for file changes
   */
  watchPaths?: string[];
  
  /**
   * File extensions to watch
   */
  watchExtensions?: string[];
  
  /**
   * Whether to watch subdirectories
   */
  recursive?: boolean;
  
  /**
   * Custom validation function
   */
  validator?: (key: string, metadata?: Record<string, any>) => boolean;
}

export interface IInvalidationStrategy {
  /**
   * Strategy name
   */
  readonly name: string;
  
  /**
   * Initialize the strategy
   */
  initialize(options: InvalidationOptions): Promise<void>;
  
  /**
   * Check if a cache entry should be invalidated
   */
  shouldInvalidate(key: string, entry: any, metadata?: Record<string, any>): Promise<boolean>;
  
  /**
   * Start watching for invalidation triggers
   */
  startWatching(onInvalidate: (keys: string[]) => void): Promise<void>;
  
  /**
   * Stop watching
   */
  stopWatching(): Promise<void>;
  
  /**
   * Manually trigger invalidation for specific keys
   */
  invalidate(keys: string[]): Promise<void>;
  
  /**
   * Cleanup resources
   */
  dispose(): Promise<void>;
}
