const nameMappings: Record<string, string> = {
  'Kasia Niewiadoma': 'katarzyna-niewiadoma',
  'Noemi Rüegg': 'ruegg-moemi',
  'Lizzie Deignan': 'elizabeth-deignan',
  "Ben O'Connor": 'ben-o-connor',
  'Josh Tarling': 'joshua-tarling',
  'Tom Pidcock': 'thomas-pidcock',
  'Søren Kragh Andersen': 'soren-kragh-andersen',
  'Santiago Buitrago': 'santiago-buitrago-sanchez',
  'Juan Ayuso': 'juan-ayuso-pesquera',
  'Alexey Lutsenko': 'aleksey-lutsenko',
  'Esteban Chaves': 'johan-esteban-chaves',
  'Mattias Skjelmose': 'mattias-skjelmose-jensen',
  'Fred Wright': 'alfred-wright',
};

/** Get the ProCyclingStats URL for a rider */
export function getPcsUrl(params: { name: string; year?: number }) {
  const { name, year } = params;
  // By default assume the URL is the lowercase name with dashes
  const pcsName = nameMappings[name] || name.toLowerCase().replace(/ /g, '-');
  const url = `https://www.procyclingstats.com/rider/${pcsName}`;
  return year ? `${url}/${year}` : url;
}
