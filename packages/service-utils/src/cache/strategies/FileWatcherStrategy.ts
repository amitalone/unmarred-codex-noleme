import * as fs from 'fs';
import * as path from 'path';
import { IInvalidationStrategy, InvalidationOptions } from '../interfaces/IInvalidationStrategy';

export class FileWatcherStrategy implements IInvalidationStrategy {
  readonly name = 'file-watcher';
  
  private watchers: fs.FSWatcher[] = [];
  private watchedPaths = new Set<string>();
  private options: InvalidationOptions = {};
  private onInvalidateCallback?: (keys: string[]) => void;
  private pathToKeysMap = new Map<string, Set<string>>();

  async initialize(options: InvalidationOptions): Promise<void> {
    this.options = { 
      recursive: true, 
      watchExtensions: ['.png', '.jpg', '.jpeg'],
      ...options 
    };
  }

  async shouldInvalidate(key: string, entry: any, metadata?: Record<string, any>): Promise<boolean> {
    // File watcher strategy doesn't do polling-based invalidation
    // It relies on real-time file system events
    return false;
  }

  async startWatching(onInvalidate: (keys: string[]) => void): Promise<void> {
    this.onInvalidateCallback = onInvalidate;
    
    if (!this.options.watchPaths?.length) {
      return;
    }

    for (const watchPath of this.options.watchPaths) {
      if (this.watchedPaths.has(watchPath)) {
        continue;
      }

      try {
        await this.watchDirectory(watchPath);
        this.watchedPaths.add(watchPath);
      } catch (error) {
        console.error(`Failed to watch path ${watchPath}:`, error);
      }
    }
  }

  async stopWatching(): Promise<void> {
    for (const watcher of this.watchers) {
      watcher.close();
    }
    
    this.watchers = [];
    this.watchedPaths.clear();
    this.pathToKeysMap.clear();
    this.onInvalidateCallback = undefined;
  }

  async invalidate(keys: string[]): Promise<void> {
    if (this.onInvalidateCallback) {
      this.onInvalidateCallback(keys);
    }
  }

  async dispose(): Promise<void> {
    await this.stopWatching();
  }

  /**
   * Register a cache key to be invalidated when a specific path changes
   */
  registerKeyForPath(cacheKey: string, watchPath: string): void {
    const normalizedPath = path.normalize(watchPath);
    
    if (!this.pathToKeysMap.has(normalizedPath)) {
      this.pathToKeysMap.set(normalizedPath, new Set());
    }
    
    this.pathToKeysMap.get(normalizedPath)!.add(cacheKey);
  }

  private async watchDirectory(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      console.warn(`Watch path does not exist: ${dirPath}`);
      return;
    }

    const watcher = fs.watch(dirPath, { recursive: this.options.recursive }, (eventType, filename) => {
      if (!filename) return;

      const fullPath = path.join(dirPath, filename);
      const ext = path.extname(filename).toLowerCase();

      // Check if file extension is watched
      if (this.options.watchExtensions?.length && 
          !this.options.watchExtensions.includes(ext)) {
        return;
      }

      this.handleFileSystemEvent(eventType, fullPath, dirPath);
    });

    watcher.on('error', (error) => {
      console.error(`File watcher error for ${dirPath}:`, error);
    });

    this.watchers.push(watcher);
  }

  private handleFileSystemEvent(eventType: string, fullPath: string, basePath: string): void {
    if (!this.onInvalidateCallback) return;

    // Find all cache keys that should be invalidated
    const keysToInvalidate = new Set<string>();

    // Direct path match
    const directKeys = this.pathToKeysMap.get(fullPath);
    if (directKeys) {
      directKeys.forEach(key => keysToInvalidate.add(key));
    }

    // Parent directory matches (for recursive invalidation)
    for (const [watchedPath, keys] of this.pathToKeysMap) {
      if (fullPath.startsWith(watchedPath) || watchedPath.startsWith(path.dirname(fullPath))) {
        keys.forEach(key => keysToInvalidate.add(key));
      }
    }

    // Pattern-based invalidation (for scanFolderRecursive)
    // Any change in a directory invalidates scans of that directory and parent directories
    const relativePath = path.relative(basePath, fullPath);
    const dirPath = path.dirname(relativePath);
    
    // Invalidate cache keys that match the directory pattern
    for (const [cachedPath, keys] of this.pathToKeysMap) {
      const cachedRelativePath = path.relative(basePath, cachedPath);
      if (relativePath.startsWith(cachedRelativePath) || cachedRelativePath.startsWith(dirPath)) {
        keys.forEach(key => keysToInvalidate.add(key));
      }
    }

    if (keysToInvalidate.size > 0) {
      console.debug(`File system event ${eventType} on ${fullPath}, invalidating ${keysToInvalidate.size} cache keys`);
      this.onInvalidateCallback(Array.from(keysToInvalidate));
    }
  }

  /**
   * Generate cache key to path mapping for scanFolderRecursive function
   */
  generatePathMapping(cacheKey: string, basePath: string, subPath: string): void {
    const fullPath = path.join(basePath, subPath);
    this.registerKeyForPath(cacheKey, fullPath);
    
    // Also register parent directories for hierarchical invalidation
    let currentPath = fullPath;
    while (currentPath !== basePath && currentPath !== path.dirname(currentPath)) {
      currentPath = path.dirname(currentPath);
      this.registerKeyForPath(cacheKey, currentPath);
    }
  }
}
