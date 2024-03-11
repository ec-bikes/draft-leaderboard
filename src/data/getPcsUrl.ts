const nameMappings: Record<string, string> = {
  'Kasia Niewiadoma': 'katarzyna-niewiadoma',
  'Noemi Rüegg': 'ruegg-moemi',
  'Lizzie Deignan': 'elizabeth-deignan',
};

/** Get the ProCyclingStats URL for a rider */
export function getPcsUrl(params: { name: string; year?: number }) {
  const { name, year } = params;
  // By default assume the URL is the lowercase name with dashes
  const pcsName = nameMappings[name] || name.toLowerCase().replaceAll(' ', '-');
  const url = `https://www.procyclingstats.com/rider/${pcsName}`;
  return year ? `${url}/${year}` : url;
}
