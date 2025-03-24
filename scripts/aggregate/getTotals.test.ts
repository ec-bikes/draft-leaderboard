import { describe, it, expect } from 'vitest';
import type { RaceResult } from '../../common/types/Rider.js';
import { getRiderTotal, getTeamTotal } from './getTotals.js';
import { parseDate } from '../../common/dates.js';

describe('getRiderTotal', () => {
  function makeResults(points: number[]) {
    return points.map<RaceResult>((points, i) => ({
      name: `race ${i + 1}`,
      // this is the format used in actual results
      date: `${i + 1} Jan 2025`,
      points,
    }));
  }

  it('calculates rounded total', () => {
    const total = getRiderTotal({
      results: makeResults([1, 2, 3.555555555]),
    });
    expect(total).toBe(6.56);
  });

  it('includes and rounds sanctions', () => {
    // Actual example of why rounding must be applied after subtracting sanctions
    // (results of Axel Zingle as of mid-March 2025)
    const total = getRiderTotal({
      results: makeResults([5, 25, 8.57, 15, 20, 3]),
      sanctions: 25,
    });
    expect(total).toBe(51.57);
  });

  it('includes results up to end date', () => {
    const endDate = parseDate('2 Jan 2025');
    const total = getRiderTotal({ results: makeResults([1, 2, 3]) }, endDate);
    expect(total).toBe(3);
  });

  it('includes results up to latest date as end date', () => {
    const endDate = parseDate('2025-01-03');
    const total = getRiderTotal({ results: makeResults([1, 2, 3]) }, endDate);
    expect(total).toBe(6);
  });
});

describe('getTeamTotal', () => {
  it('calculates rounded total', () => {
    // verify rounding is applied at end
    const total = getTeamTotal([{ totalPoints: 1 }, { totalPoints: 2.7 }, { totalPoints: 3.56 }]);
    expect(total).toBe(7.26);
  });
});
