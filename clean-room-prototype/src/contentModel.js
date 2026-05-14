// Core data shapes for the prototype

export const LANE = {
  FACT: 'fact',
  OPINION: 'opinion',
  CREATIVE: 'creative',
  KID: 'kid',
};

export function createContentObject({ text, author, mode, lane, labels, lineage }) {
  return {
    id: crypto.randomUUID(),
    text,
    author,
    mode,      // 'adult' | 'kid'
    lane,      // one of LANE
    labels,    // { isAI: boolean, unverifiable: boolean, noisy: boolean }
    lineage,   // { deviceId, timestamp, signature }
  };
}
