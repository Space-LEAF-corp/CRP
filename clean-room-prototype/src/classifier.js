// Very simple heuristic classifier for prototype

import { LANE } from './contentModel.js';

export function classifyContent(text, mode) {
  const lower = text.toLowerCase();

  if (mode === 'kid') {
    return LANE.KID;
  }

  if (containsFactishWords(lower)) return LANE.FACT;
  if (containsOpinionWords(lower)) return LANE.OPINION;
  return LANE.CREATIVE;
}

function containsFactishWords(t) {
  return ['according to', 'report', 'data', 'study', 'news', 'source'].some(w => t.includes(w));
}

function containsOpinionWords(t) {
  return ['i think', 'i feel', 'in my opinion', 'personally'].some(w => t.includes(w));
}
