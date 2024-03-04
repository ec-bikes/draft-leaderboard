import fetch from 'node-fetch';

(async () => {
  // Turns out it's this simple because Node isn't restrictive about CORS like browsers are...
  const result2 = await fetch('https://dataride.uci.ch/iframe/IndividualEventRankings/', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'individualId=151466&rankingId=32&momentId=175727&groupId=2&baseRankingTypeId=1&disciplineSeasonId=432&disciplineId=10&categoryId=23&raceTypeId=0&countryId=0&teamId=0&take=40&skip=0&page=1&pageSize=40',
  });
  const text = await result2.text();
  console.log(text);
})().catch((err) => {
  console.error((err as Error).stack || err);
  process.exit(1);
});
