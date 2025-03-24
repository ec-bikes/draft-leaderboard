import { describe, it, expect } from 'vitest';
import { formatDate, parseDate } from './dates.js';

describe('parseDate', () => {
  it('parses YYYY-MM-DD', () => {
    const date = parseDate('2024-03-22');
    expect(date.toNativeDate().toISOString()).toEqual('2024-03-22T00:00:00.000Z');
  });

  it('parses D Mon YYYY', () => {
    const date = parseDate('22 Mar 2024');
    expect(date.toNativeDate().toISOString()).toEqual('2024-03-22T00:00:00.000Z');
  });

  it('parses DD/MM/YYYY with dmy option', () => {
    const date = parseDate('22/03/2024', { dmy: true });
    expect(date.toNativeDate().toISOString()).toEqual('2024-03-22T00:00:00.000Z');
  });
});

describe('formatDate', () => {
  const startStr = '2024-03-22T23:34:56Z';

  it('formats an isoDate', () => {
    expect(formatDate(startStr, 'isoDate')).toEqual('2024-03-22');
  });

  it('formats a shortDate', () => {
    expect(formatDate(startStr, 'shortDate')).toEqual('22 Mar 2024');
  });

  it('formats a longDate', () => {
    expect(formatDate(startStr, 'longDate')).toEqual('22 March 2024');
  });

  it('formats a datetime', () => {
    expect(formatDate(startStr, 'datetime')).toEqual('22 March 2024 23:34 GMT');
  });
});
