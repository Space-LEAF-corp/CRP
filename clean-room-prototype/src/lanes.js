import { LANE } from './contentModel.js';

export function laneLabel(lane) {
  switch (lane) {
    case LANE.FACT: return 'Factual Lane';
    case LANE.OPINION: return 'Opinion Lane';
    case LANE.CREATIVE: return 'Creative Lane';
    case LANE.KID: return 'Kid Sandbox Lane';
    default: return 'Unknown Lane';
  }
}

export function laneCssClass(lane) {
  switch (lane) {
    case LANE.FACT: return 'lane lane-fact';
    case LANE.OPINION: return 'lane lane-opinion';
    case LANE.CREATIVE: return 'lane lane-creative';
    case LANE.KID: return 'lane lane-kid';
    default: return 'lane';
  }
}
