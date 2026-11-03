// Bounded-memory decoded-frame cache for the canvas scroll sequence.
// Uses createImageBitmap so decoded bitmaps can be explicitly freed
// (bitmap.close()) once they fall outside the LRU window -- plain <img>/
// Image objects give the browser no such explicit release, which is what
// "limit decoded-image memory, especially on mobile" requires here.
export class FrameCache {
  constructor({ maxSize = 36 } = {}) {
    this.maxSize = maxSize;
    this.bitmaps = new Map(); // frameIndex -> ImageBitmap
    this.inflight = new Map(); // frameIndex -> Promise
    this.lruOrder = []; // most-recently-used at the end
    this.failed = new Set();
  }

  has(index) {
    return this.bitmaps.has(index);
  }

  get(index) {
    const bmp = this.bitmaps.get(index);
    if (bmp) this._touch(index);
    return bmp || null;
  }

  hasFailed(index) {
    return this.failed.has(index);
  }

  async load(index, url) {
    if (this.bitmaps.has(index)) {
      this._touch(index);
      return this.bitmaps.get(index);
    }
    if (this.inflight.has(index)) return this.inflight.get(index);

    const promise = (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} for frame ${index}`);
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);
        this._store(index, bitmap);
        this.failed.delete(index);
        return bitmap;
      } catch (err) {
        this.failed.add(index);
        // eslint-disable-next-line no-console
        console.error(`[cinematic] failed to load frame ${index} (${url})`, err);
        return null;
      } finally {
        this.inflight.delete(index);
      }
    })();

    this.inflight.set(index, promise);
    return promise;
  }

  _store(index, bitmap) {
    this.bitmaps.set(index, bitmap);
    this._touch(index);
    this._evictIfNeeded();
  }

  _touch(index) {
    const pos = this.lruOrder.indexOf(index);
    if (pos !== -1) this.lruOrder.splice(pos, 1);
    this.lruOrder.push(index);
  }

  _evictIfNeeded() {
    while (this.lruOrder.length > this.maxSize) {
      const victim = this.lruOrder.shift();
      const bmp = this.bitmaps.get(victim);
      if (bmp) {
        bmp.close();
        this.bitmaps.delete(victim);
      }
    }
  }

  destroy() {
    for (const bmp of this.bitmaps.values()) bmp.close();
    this.bitmaps.clear();
    this.lruOrder = [];
    this.inflight.clear();
  }
}

// Fetches a small window of frames around `centerIndex` with limited
// concurrency, skipping anything already cached or already failed.
export async function prefetchWindow(cache, { centerIndex, radius, buildUrl, maxFrame, concurrency = 3 }) {
  const indices = [];
  for (let i = Math.max(1, centerIndex - radius); i <= Math.min(maxFrame, centerIndex + radius); i++) {
    if (!cache.has(i) && !cache.hasFailed(i)) indices.push(i);
  }
  // Closest-first so the frames the user is about to need load before distant ones.
  indices.sort((a, b) => Math.abs(a - centerIndex) - Math.abs(b - centerIndex));

  let cursor = 0;
  async function worker() {
    while (cursor < indices.length) {
      const i = indices[cursor++];
      await cache.load(i, buildUrl(i));
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, indices.length) }, worker));
}
