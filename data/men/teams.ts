import type { Draft } from '../../common/types/Draft.js';
import type { BaseTeam } from '../../common/types/Team.js';

export const draft: Draft = {
  podcast: 'Placeholders',
  link: 'https://escapecollective.com/behold-our-mens-worldtour-draft-2024/',
};

/**
 * Team names, owners, and riders.
 * https://escapecollective.com/behold-our-mens-worldtour-draft-2024/
 *
 * NOTE: PCS name differences are in `getPcsUrl`.
 */
export const mensTeams: BaseTeam[] = [
  {
    owner: 'Abby Mickey',
    name: 'Lidl-Trek M&Ms',
    riders: [
      { name: 'Mads Pedersen', id: 86895 },
      { name: 'Sepp Kuss', id: 88346 },
      { name: 'Matteo Jorgenson', id: 159567 },
      { name: 'Ben Healy', id: 235075 },
      { name: 'Kaden Groves', id: 111683 }, // Kaden Alexander Groves
      { name: 'Toms Skujiņš', id: 68892 }, // Toms Skujins
      { name: 'Alex Aranburu', id: 422863 }, // Alex Aranburu Deva
      { name: 'Egan Bernal', id: 95844 }, // Egan Arley Bernal Gomez
      { name: "Ben O'Connor", id: 97805 },
      { name: 'Benoît Cosnefroy', id: 79522 }, // Benoit Cosnefroy
    ],
  },
  {
    owner: 'Caley Fretz',
    name: 'Arkéa-Formula 1 Hotels',
    riders: [
      { name: 'Tadej Pogačar', id: 149727 },
      { name: 'Neilson Powless', id: 88143 },
      { name: 'Matej Mohoric', id: 86863 },
      { name: 'Victor Lafay', id: 136296 },
      { name: 'Lenny Martinez', id: 1843476 },
      { name: 'Tiesj Benoot', id: 77502 },
      { name: 'Josh Tarling', id: 1557793 }, // Joshua Tarling
      { name: 'Enric Mas', id: 109803 }, // Enric Mas Nicolau
      { name: 'Rui Costa', id: 32596 },
      { name: 'Guillaume Martin', id: 75170 }, // Guillaume Martin Guyonnet
    ],
  },
  {
    owner: 'Ronan Mc Laughlin',
    name: 'DSM-Firmenich-PostNL-TIAGOYPWDWBTCC WOLUUNLITL',
    riders: [
      { name: 'Primož Roglič', id: 88889 },
      { name: 'Biniam Girmay', id: 1707195 },
      { name: 'Tom Pidcock', id: 109775 }, // Thomas Pidcock
      { name: 'Olav Kooij', id: 227110 },
      { name: 'Jonathan Milan', id: 301151 },
      { name: 'Richard Carapaz', id: 91656 },
      { name: 'Jhonatan Narváez', id: 96372 }, // Jhonatan Manuel Narvaez Prado
      { name: 'Sam Bennett', id: 65995 },
      { name: 'Isaac del Toro', id: 2002910 }, // Isaac Del Toro Romero
      { name: 'Darren Rafferty', id: 171058 },
    ],
  },
  {
    owner: 'Dane Cash',
    name: 'Visma-Lease a Bike-Monster Energy',
    riders: [
      { name: 'Jonas Vingegaard', id: 112082 }, // Jonas Vingegaard Hansen
      { name: 'Christophe Laporte', id: 81980 },
      { name: 'Geraint Thomas', id: 32532 },
      { name: 'Mikel Landa', id: 68367 }, // Mikel Landa Meana
      { name: 'Carlos Rodriguez', id: 428096 }, // Carlos Rodriguez Cano
      { name: 'Marc Hirschi', id: 111440 },
      { name: 'Stefan Küng', id: 74994 },
      { name: 'Fabio Jakobsen', id: 87061 },
      { name: 'Arnaud Démare', id: 64670 }, // Arnaud Demare
      { name: 'Søren Kragh Andersen', id: 79156 },
    ],
  },
  {
    owner: 'Joe Lindsey',
    name: 'AlUla-Palantir',
    riders: [
      { name: 'Remco Evenepoel', id: 1596046 },
      { name: 'Mathieu van der Poel', id: 79462 },
      { name: 'Tao Geoghegan Hart', id: 86735 },
      { name: 'Santiago Buitrago', id: 353375 }, // Santiago Buitrago Sanchez
      { name: 'Tim Merlier', id: 70962 },
      { name: 'Julian Alaphilippe', id: 71557 },
      { name: 'Felix Gall', id: 150925 },
      { name: 'Giulio Ciccone', id: 97091 },
      { name: 'Dylan Groenewegen', id: 72932 },
      { name: 'Andrea Bagioli', id: 157221 },
    ],
  },
  {
    owner: 'Kit Nicholson',
    name: 'Ag2r La Mondiale-Criterion',
    riders: [
      { name: 'Wout van Aert', id: 75859 },
      { name: 'Juan Ayuso', id: 415141 }, // Juan Ayuso Pesquera
      { name: 'Sam Welsford', id: 91180 },
      { name: 'Filippo Ganna', id: 91640 },
      { name: 'Pello Bilbao', id: 76092 }, // Pello Bilbao Lopez De Armentia
      { name: 'Alexey Lutsenko', id: 68778 },
      { name: 'Lennard Kämna', id: 97741 },
      { name: 'Gerben Thijssen', id: 107713 },
      { name: 'Wout Poels', id: 1974873 }, // Wouter Poels
      { name: 'Esteban Chaves', id: 75873 }, // Jhoan Esteban Chaves Rubio
    ],
  },
  {
    owner: 'Toms Skujiņš',
    name: 'EF Education-EasyPost p/b Haribo',
    riders: [
      { name: 'Adam Yates', id: 70590 }, // Adam Richard Yates
      { name: 'Mattias Skjelmose', id: 365033 },
      { name: 'Valentin Madouas', id: 91637 },
      { name: 'João Almeida', id: 107840 }, // Joao Pedro Gonçalves Almeida
      { name: 'Kévin Vauquelin', id: 1745291 },
      { name: 'Brandon McNulty', id: 150923 },
      { name: 'Cian Uijtdebroeks', id: 1789559 },
      { name: 'Laurence Pithie', id: 221617 },
      { name: 'Jordi Meeus', id: 148901 },
      { name: 'Casper van Uden', id: 226805 },
    ],
  },
  {
    owner: 'Jonny Long',
    name: 'Ines Grenadiers-Greenpeace',
    riders: [
      { name: 'Jasper Philipsen', id: 148275 },
      { name: 'Simon Yates', id: 1558112 }, // Simon Philip Yates
      { name: 'David Gaudu', id: 112351 },
      { name: 'Romain Bardet', id: 64917 },
      { name: 'Jai Hindley', id: 109829 },
      { name: 'Yves Lampaert', id: 86228 },
      { name: 'Fred Wright', id: 153275 },
      { name: 'Bryan Coquard', id: 68950 },
      { name: 'Romain Grégoire', id: 1759422 }, // Romain Gregoire
      { name: 'Jack Haig', id: 78342 },
    ],
  },
];
