// src/utils/avatar.ts
export function getAvatarUrl(seed?: string): string {
  const randomSeed = seed || `user-${Math.floor(Math.random() * 100000)}`;
  const encodedSeed = encodeURIComponent(randomSeed);
  return `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodedSeed}`;
}
