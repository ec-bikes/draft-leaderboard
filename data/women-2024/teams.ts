import type { Draft } from '../../common/types/Draft.js';
import type { BaseTeam } from '../../common/types/Team.js';

export const draft: Draft = {
  group: 'women',
  year: 2024,
  podcast: 'Wheel Talk',
  link: 'https://escapecollective.com/the-wheel-talk-podcast-2024-draft/',
  // None of the riders traded in or out had sanctions at the time of the trade
  tradeDate: '2024-05-27',
};

export const teams: BaseTeam[] = [
  // NOTE: PCS name differences are in `getPcsUrl`.
  {
    owner: 'Matt de Neef',
    name: 'Amateur Pro Cycling',
    tradedOut: 'Anna Henderson',
    tradedIn: 'Thalita de Jong',
    riders: [
      'Lotte Kopecky',
      'Cecilie Uttrup Ludwig', // searchName: 'Cecilie Ludwig'
      'Silvia Persico',
      'Gaia Realini',
      'Amanda Spratt',
      'Ruby Roseman-Gannon',
      'Antonia Niedermaier',
      'Kristen Faulkner',
      'Anna Henderson',
      'Marta Cavalli',
      'Thalita de Jong',
    ],
  },
  {
    owner: 'Tils Raynolds',
    name: 'Collective Cartel',
    tradedOut: 'Sofia Bertizzolo',
    tradedIn: 'Puck Pieterse',
    riders: [
      'Demi Vollering',
      'Kasia Niewiadoma', // searchName: 'Niewiadoma'
      'Juliette Labous',
      'Charlotte Kool',
      'Riejanne Markus',
      'Sarah Gigante',
      'Ella Wyllie',
      'Marta Lach',
      'Sofia Bertizzolo',
      'Vittoria Guazzini',
      'Puck Pieterse',
    ],
  },
  {
    owner: 'Abby Mickey',
    name: 'Death By A Thousand Attacks',
    tradedOut: 'Alison Jackson',
    tradedIn: 'Karlijn Swinkels',
    riders: [
      'Marianne Vos',
      'Pfeiffer Georgi',
      'Shirin van Anrooij',
      'Mischa Bredewold',
      'Arlenis Sierra',
      'Ricarda Bauernfeind',
      'Elise Chabbey',
      'Noemi Rüegg',
      'Soraya Paladin',
      'Alison Jackson',
      'Karlijn Swinkels',
    ],
  },
  {
    owner: 'Gracie Elvin',
    name: 'RBF Spokeswoman Racing',
    riders: [
      'Lorena Wiebes',
      'Liane Lippert',
      'Chloe Dygert',
      'Mavi Garcia', // searchName: 'Margarita Victo Garcia'
      'Christina Schweinberger',
      'Neve Bradbury',
      'Rosita Reijnhout',
      'Olivia Baril',
      'Lizzie Deignan', // searchName: 'Elizabeth Deignan'
      'Dominika Wlodarczyk',
    ],
  },
  {
    owner: 'Loren Rowney',
    name: "Super Lekker Pro Potato Women's Cycling Team",
    tradedIn: 'Kim Cadzow',
    tradedOut: 'Maike van der Duin',
    riders: [
      'Marlen Reusser',
      'Elisa Longo Borghini',
      'Elisa Balsamo',
      'Maike van der Duin',
      'Grace Brown',
      'Emma Norsgaard',
      'Evita Muzic',
      'Chiara Consonni',
      'Daria Pikulik',
      'Niamh Fisher-Black', // searchName: 'Niamh Fisher'
      'Kim Cadzow',
    ],
  },
];
