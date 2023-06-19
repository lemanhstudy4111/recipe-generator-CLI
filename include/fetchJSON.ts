import Bottleneck from "bottleneck";
import fetch from "cross-fetch";
import fs from "fs";

// Cache results so that repeated requests are not sent
interface CacheEntry {
  ttl: number;
  value: any;
}

const CACHE_PATH = "./include/cache.json";
const HOUR = 1000 * 60 * 60;

const cache: Record<string, CacheEntry> = fs.existsSync(CACHE_PATH)
  ? JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"))
  : {};

process.on("beforeExit", () => {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
});

// Limit new requests so student's don't get rate-limited
const limiterMap = new Map<string, Bottleneck>();
const LIMITER_OPTIONS: Bottleneck.ConstructorOptions = {
  minTime: 500,
};

/**
 * Fetches the JSON content at a URL, caches results and bottlenecks requests
 * @param url A url to a JSON object
 * @returns A promise that resolves to the JSON content of a page
 */
export function fetchJSON<T = any>(url: string): Promise<T> {
  if (url in cache && Date.now() < cache[url].ttl) {
    return Promise.resolve(cache[url].value);
  }

  const parsedURL = new URL(url);
  const host = parsedURL.hostname;

  let limiter = limiterMap.get(host);
  if (!limiter) {
    limiter = new Bottleneck(LIMITER_OPTIONS);
    limiterMap.set(host, limiter);
  }

  return limiter
    .schedule(() => fetch(url))
    .then(res => (res.ok ? res.json() : Promise.reject(`Received status code ${res.status}: ${res.statusText}`)))
    .then(json => {
      // Add JSON results to cache
      cache[url] = {
        ttl: Date.now() + HOUR,
        value: json,
      };

      return json as T;
    });
}
