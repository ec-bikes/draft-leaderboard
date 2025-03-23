import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import * as getPcsRiderDataModule from '../pcs/getPcsRiderData.js';
import { getTeamData } from './getTeamData.js';
import { getRiderId } from '../../data/getRiderId.js';
import type { RiderDetails } from '../../common/types/Rider.js';
import type { Draft } from '../../common/types/Draft.js';

const name = 'Demi Vollering';
const id = getRiderId(name, 'women')!;

function getParams(
  tradeInfo?: Required<Pick<Draft, 'tradeDate'>> & { traded: 'in' | 'out' },
): Parameters<typeof getTeamData>[0] {
  const { tradeDate = '2021-01-03', traded } = tradeInfo || {};
  return {
    source: 'pcs',
    momentId: 1,
    draft: { group: 'women', year: 2021, tradeDate },
    team: {
      owner: 'owner',
      name: 'team',
      tradedIn: traded === 'in' ? name : undefined,
      tradedOut: traded === 'out' ? name : undefined,
      riders: [name],
    },
    uciRiderInfo: {
      [id]: { name, team: 'ABC', country: 'us' },
    },
  };
}

describe('getTeamData', () => {
  let extraRiderData: Partial<RiderDetails> | undefined;

  beforeAll(() => {
    vi.spyOn(getPcsRiderDataModule, 'getPcsRiderData').mockImplementation(async ({ rider }) => ({
      ...rider,
      totalPoints: 50,
      results: [
        { name: 'race', date: '01 Jan 2021', points: 10 },
        { name: 'race', date: '02 Jan 2021', points: 10 },
        { name: 'race', date: '03 Jan 2021', points: 10 },
        { name: 'race', date: '04 Jan 2021', points: 10 },
        { name: 'race', date: '05 Jan 2021', points: 10 },
      ],
      ...extraRiderData,
    }));
  });

  afterEach(() => {
    extraRiderData = undefined;
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('includes sanctions in total points', async () => {
    extraRiderData = { sanctions: 10 };
    const team = await getTeamData(getParams());
    expect(team.riders[0].totalPoints).toEqual(40);
    expect(team.totalPoints).toEqual(40);
  });

  it('sorts results by date descending', async () => {
    extraRiderData = {
      results: [
        { name: 'race', date: '04 Jan 2021', points: 10 },
        { name: 'race', date: '01 Jan 2021', points: 10 },
        { name: 'race', date: '05 Jan 2021', points: 10 },
        { name: 'race', date: '03 Jan 2021', points: 10 },
        { name: 'race', date: '02 Jan 2021', points: 10 },
      ],
    };
    const team = await getTeamData(getParams());
    expect(team.riders[0].results.map((r) => r.date)).toEqual([
      '05 Jan 2021',
      '04 Jan 2021',
      '03 Jan 2021',
      '02 Jan 2021',
      '01 Jan 2021',
    ]);
  });

  // it('trims results for traded in rider', async () => {
  //   const team = await getTeamData(getParams({ tradedIn: true }));

  //   // including trade date
  //   expect(team.riders[0].results.map((r) => r.date)).toEqual([
  //     '2021-01-05',
  //     '2021-01-04',
  //     '2021-01-03',
  //   ]);
  //   expect(team.riders[0].totalPoints).toEqual(30);
  //   expect(team.totalPoints).toEqual(30);
  // });

  it('trims results for traded out rider', async () => {
    const team = await getTeamData(getParams({ tradeDate: '2021-01-03', traded: 'out' }));

    expect(team.riders[0].tradedOut).toEqual(true);
    // excluding trade date
    expect(team.riders[0].results.map((r) => r.date)).toEqual(['02 Jan 2021', '01 Jan 2021']);
    expect(team.riders[0].totalPoints).toEqual(20);
    expect(team.totalPoints).toEqual(20);
  });

  // it('handles traded in rider with no results after trade date', async () => {
  //   const params = getParams({ tradedIn: true }, '2021-01-06');
  //   const team = await getTeamData(params);

  //   expect(team.riders[0].results).toEqual([]);
  //   expect(team.riders[0].totalPoints).toEqual(0);
  //   expect(team.totalPoints).toEqual(0);
  // });

  it('handles traded out rider with no results after trade date', async () => {
    const params = getParams({ traded: 'out', tradeDate: '2021-01-06' });
    const team = await getTeamData(params);

    expect(team.riders[0].results).toHaveLength(5);
    expect(team.riders[0].totalPoints).toEqual(50);
    expect(team.totalPoints).toEqual(50);
  });

  it('handles traded in rider with no results before trade date', async () => {
    const params = getParams({ traded: 'in', tradeDate: '2021-01-01' });
    const team = await getTeamData(params);

    expect(team.riders[0].tradedIn).toEqual(true);
    expect(team.riders[0].results).toHaveLength(5);
    expect(team.riders[0].totalPoints).toEqual(50);
    expect(team.totalPoints).toEqual(50);
  });

  it('handles traded out rider with no results before trade date', async () => {
    const params = getParams({ traded: 'out', tradeDate: '2021-01-01' });
    const team = await getTeamData(params);

    expect(team.riders[0].results).toEqual([]);
    expect(team.riders[0].totalPoints).toEqual(0);
    expect(team.totalPoints).toEqual(0);
  });
});
