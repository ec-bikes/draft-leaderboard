import fetch from 'node-fetch';
import { parse } from 'node-html-parser';

(async () => {
  // fetching from PCS to validate its 2023 totals against UCI
  const result = await fetch('https://www.procyclingstats.com/rider/demi-vollering/2023');
  const root = parse(await result.text());
  const text = root.querySelector('.rdrResultsSum')?.textContent.trim() || '';
  console.log(text);
  const totals = Object.fromEntries(
    text
      .split('|')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.includes(':') && !s.includes('pcs'))
      .map((s) => s.replaceAll(' ', '').split(':'))
      .map(([key, value]) => [key, parseInt(value)]),
  ) as { ucipoints: number; penalties?: number };
  console.log(totals);
})().catch((err) => {
  console.error((err as Error).stack || err);
  process.exit(1);
});
