import type { RawTeam } from '../types/RawTeam';

/**
 * Team names, owners, and riders.
 * https://escapecollective.com/the-wheel-talk-podcast-2024-draft/
 */
export const rawTeams: RawTeam[] = [
  {
    owner: 'Matt',
    name: 'Amateur Pro Cycling',
    riders: [
      { name: 'Lotte Kopecky', id: 73504 },
      { name: 'Cecilie Uttrup Ludwig', id: 86838, searchName: 'Cecilie Ludwig' },
      { name: 'Silvia Persico', id: 107539 },
      { name: 'Gaia Realini', id: 303036 },
      { name: 'Amanda Spratt', id: 32706 },
      { name: 'Ruby Roseman-Gannon', id: 111383 },
      { name: 'Antonia Niedermaier', id: 2188959 },
      { name: 'Kristen Faulkner', id: 1688341 },
      { name: 'Anna Henderson', id: 237690 },
      { name: 'Marta Cavalli', id: 111432 },
    ],
  },
  {
    owner: 'Tils',
    name: 'Collective Cartel',
    riders: [
      { name: 'Demi Vollering', id: 151466 },
      {
        name: 'Kasia Niewiadoma',
        id: 86824,
        searchName: 'Niewiadoma',
        pcsName: 'katarzyna-niewiadoma',
      },
      { name: 'Juliette Labous', id: 97498 },
      { name: 'Charlotte Kool', id: 157612 },
      { name: 'Riejanne Markus', id: 86854 },
      { name: 'Sarah Gigante', id: 1557078 },
      { name: 'Ella Wyllie', id: 220428 },
      { name: 'Marta Lach', id: 96399 },
      { name: 'Sofia Bertizzolo', id: 106607 },
      { name: 'Vittoria Guazzini', id: 153391 },
    ],
  },
  {
    owner: 'Abby',
    name: 'Death By A Thousand Attacks',
    riders: [
      { name: 'Marianne Vos', id: 31144 },
      { name: 'Pfeiffer Georgi', id: 153350 },
      { name: 'Shirin van Anrooij', id: 228375 },
      { name: 'Mischa Bredewold', id: 227721 },
      { name: 'Arlenis Sierra', id: 71998 },
      { name: 'Ricarda Bauernfeind', id: 153347 },
      { name: 'Elise Chabbey', id: 1638135 },
      { name: 'Noemi Rüegg', id: 347941, pcsName: 'ruegg-moemi' },
      { name: 'Soraya Paladin', id: 75244 },
      { name: 'Alison Jackson', id: 96860 },
    ],
  },
  {
    owner: 'Gracie',
    name: 'RBF Spokeswoman Racing',
    riders: [
      { name: 'Lorena Wiebes', id: 141733 },
      { name: 'Liane Lippert', id: 140495 },
      { name: 'Chloe Dygert', id: 109716 },
      { name: 'Mavi Garcia', id: 398547, searchName: 'Margarita Victo Garcia' },
      { name: 'Christina Schweinberger', id: 98623 },
      { name: 'Neve Bradbury', id: 1987823 },
      { name: 'Rosita Reijnhout', id: 228699 },
      { name: 'Olivia Baril', id: 151523 },
      {
        name: 'Lizzie Deignan',
        id: 45988,
        searchName: 'Elizabeth Deignan',
        pcsName: 'elizabeth-deignan',
      },
      { name: 'Dominika Wlodarczyk', id: 1549446 },
    ],
  },
  {
    owner: 'Loren',
    name: "Super Lekker Pro Potato Women's Cycling Team",
    riders: [
      { name: 'Marlen Reusser', id: 1589305 },
      { name: 'Elisa Longo Borghini', id: 76149 },
      { name: 'Elisa Balsamo', id: 101826 },
      { name: 'Maike van der Duin', id: 226974 },
      { name: 'Grace Brown', id: 143292 },
      { name: 'Emma Norsgaard', id: 151974 },
      { name: 'Evita Muzic', id: 109412 },
      { name: 'Chiara Consonni', id: 156600 },
      { name: 'Daria Pikulik', id: 99885 },
      { name: 'Niamh Fisher-Black', id: 217072, searchName: 'Niamh Fisher' },
    ],
  },
];
