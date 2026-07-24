// Deterministic pseudo-random ordering so a "random" sort can be paginated (skip/take)
// without repeating items across pages: the same id+seed always hashes to the same value,
// so a given seed always yields the same permutation.
const hashSeed = (value) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  // FNV-1a's last byte barely avalanches on its own (seeds differing only in a
  // trailing character produce near-identical orderings without this) - finish
  // with a murmur3-style mix so the whole hash space gets scrambled.
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return hash >>> 0;
};

const sortIdsByRandomSeed = (ids, seed) => {
  const seedStr = seed ? String(seed) : 'default';
  return ids
    .map((id) => ({ id, hash: hashSeed(`${id}:${seedStr}`) }))
    .sort((a, b) => a.hash - b.hash)
    .map((entry) => entry.id);
};

module.exports = { hashSeed, sortIdsByRandomSeed };
