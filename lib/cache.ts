// Simple caching utility for course data and frequently accessed data

const CACHE_PREFIX = 'sof_cache_';
const CACHE_VERSION = 'v1';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

export class Cache {
  private static getCacheKey(key: string): string {
    return `${CACHE_PREFIX}${CACHE_VERSION}_${key}`;
  }

  static set<T>(key: string, data: T, ttl: number = 30 * 60 * 1000): void {
    if (typeof window === 'undefined') return;
    
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      localStorage.setItem(this.getCacheKey(key), JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  static get<T>(key: string, ttl: number = 30 * 60 * 1000): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(this.getCacheKey(key));
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - entry.timestamp > ttl) {
        this.remove(key);
        return null;
      }

      // Check version compatibility
      if (entry.version !== CACHE_VERSION) {
        this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  static remove(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.getCacheKey(key));
    } catch (error) {
      console.warn('Failed to remove cached data:', error);
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  // Session-based caching (clears when browser closes)
  static setSession<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      sessionStorage.setItem(this.getCacheKey(key), JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to cache session data:', error);
    }
  }

  static getSession<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = sessionStorage.getItem(this.getCacheKey(key));
      if (!cached) return null;

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      // Check version compatibility
      if (entry.version !== CACHE_VERSION) {
        this.removeSession(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn('Failed to retrieve session cached data:', error);
      return null;
    }
  }

  static removeSession(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(this.getCacheKey(key));
    } catch (error) {
      console.warn('Failed to remove session cached data:', error);
    }
  }
}
