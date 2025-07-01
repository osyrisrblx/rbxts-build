interface CacheEntry<T> {
	value: T;
	expires: number;
}

/**
 * TTL-based cache for expensive operations
 */
export class OperationCache {
	private cache = new Map<string, CacheEntry<unknown>>();

	/**
	 * Get a cached value or compute it if not found/expired
	 */
	public async getOrCompute<T>(key: string, fn: () => Promise<T>, ttlMs: number = 60000): Promise<T> {
		const cached = this.cache.get(key);
		if (cached && Date.now() < cached.expires) {
			return cached.value as T;
		}

		const value = await fn();
		this.cache.set(key, {
			value,
			expires: Date.now() + ttlMs,
		});

		return value;
	}

	/**
	 * Get a cached value or compute it synchronously if not found/expired
	 */
	public getOrComputeSync<T>(key: string, fn: () => T, ttlMs: number = 60000): T {
		const cached = this.cache.get(key);
		if (cached && Date.now() < cached.expires) {
			return cached.value as T;
		}

		const value = fn();
		this.cache.set(key, {
			value,
			expires: Date.now() + ttlMs,
		});

		return value;
	}

	/**
	 * Manually set a cache entry
	 */
	public set<T>(key: string, value: T, ttlMs: number = 60000): void {
		this.cache.set(key, {
			value,
			expires: Date.now() + ttlMs,
		});
	}

	/**
	 * Check if a key exists and is not expired
	 */
	public has(key: string): boolean {
		const cached = this.cache.get(key);
		return cached ? Date.now() < cached.expires : false;
	}

	/**
	 * Clear expired entries from the cache
	 */
	public cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.cache.entries()) {
			if (now >= entry.expires) {
				this.cache.delete(key);
			}
		}
	}

	/**
	 * Clear all cache entries
	 */
	public clear(): void {
		this.cache.clear();
	}

	/**
	 * Get cache statistics
	 */
	public getStats(): { size: number; expired: number } {
		const now = Date.now();
		let expired = 0;

		for (const entry of this.cache.values()) {
			if (now >= entry.expires) {
				expired++;
			}
		}

		return {
			size: this.cache.size,
			expired,
		};
	}
}

// Global cache instances for common operations
export const pathCache = new OperationCache();
export const tempPathCache = new OperationCache();
export const fileMetadataCache = new OperationCache();

// Manual cleanup function for short-lived commands
export function cleanupAllCaches(): void {
	pathCache.cleanup();
	tempPathCache.cleanup();
	fileMetadataCache.cleanup();
}
