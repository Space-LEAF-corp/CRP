// Prototype "noise scrubber": flags obvious junk, doesn't delete yet

export function scrubContent(text) {
  const lower = text.toLowerCase();

  const isAI = lower.includes('as an ai') || lower.includes('chatgpt');
  const unverifiable = containsWildClaims(lower);
  const noisy = containsSpammyPatterns(lower);

  return { isAI, unverifiable, noisy };
}

function containsWildClaims(t) {
  return ['everyone knows', '100% guaranteed', 'secret truth', 'they don\'t want you to know']
    .some(w => t.includes(w));
}

function containsSpammyPatterns(t) {
  return ['click here', 'subscribe now', 'buy now', 'limited offer'].some(w => t.includes(w));
}
