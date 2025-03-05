const nameMappings: Record<string, string> = {
  'Alexey Lutsenko': 'aleksey-lutsenko',
  "Ben O'Connor": 'ben-o-connor',
  'Carlos Rodriguez': 'carlos-rodriguez-cano',
  'Esteban Chaves': 'johan-esteban-chaves',
  'Fred Wright': 'alfred-wright',
  'Josh Tarling': 'joshua-tarling',
  'Juan Ayuso': 'juan-ayuso-pesquera',
  'Kasia Niewiadoma': 'katarzyna-niewiadoma',
  'Kim Cadzow': 'kimberly-cadzow',
  'Kim le Court': 'kimberley-le-court',
  'Lizzie Deignan': 'elizabeth-deignan',
  'Mattias Skjelmose': 'mattias-skjelmose-jensen',
  'Max Schachmann': 'maximilian-schachmann',
  'Pablo Castrillo': 'pablo-castrillo-zapater',
  'Romain Grégoire': 'romain-gregoire1',
  'Santiago Buitrago': 'santiago-buitrago-sanchez',
  'Søren Kragh Andersen': 'soren-kragh-andersen',
  'Tobias Andresen': 'tobias-lund-andresen',
  'Tom Pidcock': 'thomas-pidcock',
};

/** Get the ProCyclingStats URL for a rider */
export function getPcsUrl(params: { name: string; year: number }) {
  const { name, year } = params;
  // By default assume the URL is the lowercase name with dashes.
  // PCS usually accepts proper non-ASCII versions of names.
  const pcsName = nameMappings[name] || name.toLowerCase().replace(/ /g, '-');
  return `https://www.procyclingstats.com/rider/${pcsName}/${year}`;
}
