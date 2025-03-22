import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import * as getPcsRiderDataModule from '../pcs/getPcsRiderData.js';
import { getTeamData } from './getTeamData.js';
import { getRiderId } from '../../data/getRiderId.js';
import type { RiderDetails } from '../../common/types/Rider.js';

const name = 'Demi Vollering';
const id = getRiderId(name, 'women')!;

function getParams(
  params: { tradedIn?: boolean; tradedOut?: boolean } = {},
  tradeDate: string = '2021-01-03',
): Parameters<typeof getTeamData>[0] {
  return {
    source: 'pcs',
    momentId: 1,
    draft: { group: 'women', year: 2021, tradeDate },
    team: {
      owner: 'owner',
      name: 'team',
      tradedIn: params.tradedIn ? name : undefined,
      tradedOut: params.tradedOut ? name : undefined,
      riders: [name],
    },
    uciRiderInfo: {
      [id]: {
        name,
        team: 'ABC',
        country: 'us',
      },
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
        { name: 'race', date: '2021-01-01', points: 10 },
        { name: 'race', date: '2021-01-02', points: 10 },
        { name: 'race', date: '2021-01-03', points: 10 },
        { name: 'race', date: '2021-01-04', points: 10 },
        { name: 'race', date: '2021-01-05', points: 10 },
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
    const team = await getTeamData(getParams({ tradedOut: true }));

    expect(team.riders[0].tradedOut).toEqual(true);
    // excluding trade date
    expect(team.riders[0].results.map((r) => r.date)).toEqual(['2021-01-02', '2021-01-01']);
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
    const params = getParams({ tradedOut: true }, '2021-01-06');
    const team = await getTeamData(params);

    expect(team.riders[0].results).toHaveLength(5);
    expect(team.riders[0].totalPoints).toEqual(50);
    expect(team.totalPoints).toEqual(50);
  });

  it('handles traded in rider with no results before trade date', async () => {
    const params = getParams({ tradedIn: true }, '2021-01-01');
    const team = await getTeamData(params);

    expect(team.riders[0].tradedIn).toEqual(true);
    expect(team.riders[0].results).toHaveLength(5);
    expect(team.riders[0].totalPoints).toEqual(50);
    expect(team.totalPoints).toEqual(50);
  });

  it('handles traded out rider with no results before trade date', async () => {
    const params = getParams({ tradedOut: true }, '2021-01-01');
    const team = await getTeamData(params);

    expect(team.riders[0].results).toEqual([]);
    expect(team.riders[0].totalPoints).toEqual(0);
    expect(team.totalPoints).toEqual(0);
  });
});
