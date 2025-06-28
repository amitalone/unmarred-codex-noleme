import { createFileSystemCacheManager } from '../src/cache';
import { scanFolderRecursive, addWatchPath } from '../src/utils/FileSystemUtil';
import { ScannedFile } from '@repo/shared-interfaces';

// Example usage of the cache manager
async function testCacheManager() {
  console.log('Testing FileSystem Cache Manager...');
  
  // Example paths - you can modify these for your actual use case
  const testBasePath = 'C:/temp';  // Change this to your actual base path
  const testSubPath = '';
  
  // Add the path to be watched
  addWatchPath(testBasePath);
  
  console.log('\n1. First call (should be cache miss):');
  const start1 = Date.now();
  const result1 = await scanFolderRecursive(testBasePath, testSubPath) as ScannedFile[];
  const end1 = Date.now();
  console.log(`Found ${result1.length} files in ${end1 - start1}ms`);
  
  console.log('\n2. Second call (should be cache hit):');
  const start2 = Date.now();
  const result2 = await scanFolderRecursive(testBasePath, testSubPath) as ScannedFile[];
  const end2 = Date.now();
  console.log(`Found ${result2.length} files in ${end2 - start2}ms`);
  
  console.log('\n3. Cache should be much faster on second call');
  console.log(`Speed improvement: ${Math.round((end1 - start1) / (end2 - start2))}x faster`);
  
  // Test the cache manager directly
  const cacheManager = createFileSystemCacheManager({
    watchPaths: [testBasePath],
    ttl: 60, // 1 minute for testing
    debug: true
  });
  
  // Test direct caching
  const testFunction = cacheManager.cacheable({
    keyGenerator: (name: string) => `test:${name}`,
    strategy: 'hybrid',
    ttl: 30
  })((name: string) => {
    console.log(`Executing expensive operation for: ${name}`);
    return Promise.resolve(`Hello, ${name}! Time: ${Date.now()}`);
  });
  
  console.log('\n4. Testing direct cache function:');
  console.log('First call:', await testFunction('World'));
  console.log('Second call (cached):', await testFunction('World'));
  
  // Display cache stats
  const stats = (cacheManager as any).getStats();
  console.log('\n5. Cache Statistics:');
  console.log(`Cache hits: ${stats.hits}`);
  console.log(`Cache misses: ${stats.misses}`);
  console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);
  console.log(`Total keys: ${stats.totalKeys}`);
}

export { testCacheManager };
