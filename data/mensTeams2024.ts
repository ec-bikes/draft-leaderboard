import type { Draft } from '../common/types/Draft.js';
import type { BaseTeam } from '../common/types/Team.js';

export const draft: Draft = {
  group: 'men',
  year: 2024,
  podcast: 'Placeholders',
  link: 'https://escapecollective.com/behold-our-mens-worldtour-draft-2024/',
};

export const teams: BaseTeam[] = [
  // NOTE: PCS name differences are in `getPcsUrl`.
  {
    owner: 'Abby Mickey',
    name: 'Lidl-Trek M&Ms',
    riders: [
      'Mads Pedersen',
      'Sepp Kuss',
      'Matteo Jorgenson',
      'Ben Healy',
      'Kaden Groves', // Kaden Alexander Groves
      'Toms Skujiņš', // Toms Skujins
      'Alex Aranburu', // Alex Aranburu Deva
      'Egan Bernal', // Egan Arley Bernal Gomez
      "Ben O'Connor",
      'Benoît Cosnefroy', // Benoit Cosnefroy
    ],
  },
  {
    owner: 'Caley Fretz',
    name: 'Arkéa-Formula 1 Hotels',
    riders: [
      'Tadej Pogačar',
      'Neilson Powless',
      'Matej Mohoric',
      'Victor Lafay',
      'Lenny Martinez',
      'Tiesj Benoot',
      'Josh Tarling', // Joshua Tarling
      'Enric Mas', // Enric Mas Nicolau
      'Rui Costa',
      'Guillaume Martin', // Guillaume Martin Guyonnet
    ],
  },
  {
    owner: 'Ronan Mc Laughlin',
    name: 'DSM-Firmenich-PostNL-TIAGOYPWDWBTCC WOLUUNLITL',
    riders: [
      'Primož Roglič',
      'Biniam Girmay',
      'Tom Pidcock', // Thomas Pidcock
      'Olav Kooij',
      'Jonathan Milan',
      'Richard Carapaz',
      'Jhonatan Narváez', // Jhonatan Manuel Narvaez Prado
      'Sam Bennett',
      'Isaac del Toro', // Isaac Del Toro Romero
      'Darren Rafferty',
    ],
  },
  {
    owner: 'Dane Cash',
    name: 'Visma-Lease a Bike-Monster Energy',
    riders: [
      'Jonas Vingegaard', // Jonas Vingegaard Hansen
      'Christophe Laporte',
      'Geraint Thomas',
      'Mikel Landa', // Mikel Landa Meana
      'Carlos Rodriguez', // Carlos Rodriguez Cano
      'Marc Hirschi',
      'Stefan Küng',
      'Fabio Jakobsen',
      'Arnaud Démare', // Arnaud Demare
      'Søren Kragh Andersen',
    ],
  },
  {
    owner: 'Joe Lindsey',
    name: 'AlUla-Palantir',
    riders: [
      'Remco Evenepoel',
      'Mathieu van der Poel',
      'Tao Geoghegan Hart',
      'Santiago Buitrago', // Santiago Buitrago Sanchez
      'Tim Merlier',
      'Julian Alaphilippe',
      'Felix Gall',
      'Giulio Ciccone',
      'Dylan Groenewegen',
      'Andrea Bagioli',
    ],
  },
  {
    owner: 'Kit Nicholson',
    name: 'Ag2r La Mondiale-Criterion',
    riders: [
      'Wout van Aert',
      'Juan Ayuso', // Juan Ayuso Pesquera
      'Sam Welsford',
      'Filippo Ganna',
      'Pello Bilbao', // Pello Bilbao Lopez De Armentia
      'Alexey Lutsenko',
      'Lennard Kämna',
      'Gerben Thijssen',
      'Wout Poels', // Wouter Poels
      'Esteban Chaves', // Jhoan Esteban Chaves Rubio
    ],
  },
  {
    owner: 'Toms Skujiņš',
    name: 'EF Education-EasyPost p/b Haribo',
    riders: [
      'Adam Yates', // Adam Richard Yates
      'Mattias Skjelmose',
      'Valentin Madouas',
      'João Almeida', // Joao Pedro Gonçalves Almeida
      'Kévin Vauquelin',
      'Brandon McNulty',
      'Cian Uijtdebroeks',
      'Laurence Pithie',
      'Jordi Meeus',
      'Casper van Uden',
    ],
  },
  {
    owner: 'Jonny Long',
    name: 'Ines Grenadiers-Greenpeace',
    riders: [
      'Jasper Philipsen',
      'Simon Yates', // Simon Philip Yates
      'David Gaudu',
      'Romain Bardet',
      'Jai Hindley',
      'Yves Lampaert',
      'Fred Wright',
      'Bryan Coquard',
      'Romain Grégoire', // Romain Gregoire
      'Jack Haig',
    ],
  },
];
