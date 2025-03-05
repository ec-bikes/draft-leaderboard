/**
 * Mapping from top rider names (not necessarily selected) to UCI object IDs.
 * Some name variants are included, mapping to the same ID.
 *
 * (PCS name differences are in `getPcsUrl`.)
 */
const womensRiders: Record<string, number | undefined> = {
  'Agnieszka Skalniak-Sojka': 111153,
  'Alexandra Manly': 91152,
  'Alexandra Grace Manly': 91152,
  'Alice Maria Arzuffi': 78167,
  'Alice Towers': 1979285,
  'Alison Jackson': 96860,
  'Ally Wollaston': 220562,
  'Ally Marée Wollaston': 220562,
  'Amalie Dideriksen': 94870,
  'Amanda Spratt': 32706,
  'Amber Kraak': 2153619,
  'Ana Vitória Magalhães': 2316090,
  'Ana Vitoria Gouvea Vieira Almeida Magalhaes': 2316090,
  'Ane Santesteban': 64896,
  'Ane Santesteban Gonzalez': 64896,
  'Anna Henderson': 237690,
  'Anna Kiesenhofer': 2038923,
  'Anna van der Breggen': 59726,
  'Anne Knijnenburg': 2467271,
  'Anneke Dijkstra': 230750,
  'Anniina Ahtosalo': 151904,
  'Anouska Koster': 79689,
  'Antonia Niedermaier': 2188959,
  'Antri Christoforou': 77043,
  'Arlenis Sierra': 71998,
  'Arlenis Sierra Canadilla': 71998,
  'Ashleigh Moolman Pasio': 69196,
  'Audrey Cordon Ragot': 55409,
  'Babette van der Wolf': 227970,
  'Barbara Guarischi': 58863,
  'Barbara Malcotti': 299193,
  'Blanka Vas': 236562,
  'Brodie Chapman': 106168,
  'Camilla Rånes Bye': 202978,
  'Carina Schrempf': 2319808,
  'Caroline Andersson': 224473,
  'Cat Ferguson': 2317617,
  'Catalina Soto Campos': 1656726,
  'Cecilie Uttrup Ludwig': 86838,
  'Cecilie Ludwig': 86838,
  'Cedrine Kerbaol': 1750054,
  'Charlotte Kool': 157612,
  'Chiara Consonni': 156600,
  'Chloe Dygert': 109716,
  'Christina Schweinberger': 98623,
  'Christine Majerus': 56699,
  'Clara Copponi': 153287,
  'Daria Pikulik': 99885,
  'Demi Vollering': 151466,
  'Diane Ingabire': 1955169,
  'Dilyxine Miermont': 262620,
  'Dominika Wlodarczyk': 1549446,
  'Elena Hartmann': 2297313,
  'Elena Pirrone': 153313,
  'Eleonora Camilla Gasparrini': 315468,
  'Eleonora Ciabocco': 288003,
  'Eline Jansen': 2284799,
  'Elisa Balsamo': 101826,
  'Elisa Longo Borghini': 76149,
  'Elise Chabbey': 1638135,
  'Ella Wyllie': 220428,
  'Ellen van Dijk': 32643,
  'Emma Norsgaard': 151974,
  'Emma Cecilie Norsgaard Bjerg': 151974,
  'Erica Magnaldi': 483205,
  'Eugenia Bujak': 64125,
  'Evita Muzic': 109412,
  'Evy Kuijpers': 79609,
  'Fem van Empel': 1664320,
  'Femke de Vries': 1930266,
  'Femke Gerritse': 226984,
  'Fiona Mangan': 2031412,
  'Fleur Moors': 2142114,
  'Floortje Mackaij': 86843,
  'Flora Perkins': 2013747,
  'Franziska Brauße': 101692,
  'Franziska Koch': 153312,
  'Gaia Realini': 303036,
  'Georgia Baker': 78086,
  'Giada Borghesi': 306460,
  'Giorgia Vettorello': 301394,
  'Gladys Verhulst Wild': 141892,
  'Grace Brown': 143292,
  'Greta Marturano': 149638,
  'Hannah Ludwig': 438423,
  'Henrietta Christie': 219179,
  'Ingvild Gåskjenn': 101715,
  'Iurani Blanco Calbet': 101988,
  'Jade Wiel': 234905,
  'Jelena EriĆ': 77624,
  'Josie Nelson': 1911550,
  'Julia KopeckÝ': 230865,
  'Julie Bego': 1768545,
  'Juliette Labous': 97498,
  'Justine Ghekiere': 2202121,
  'Jutatip Maneephan': 56016,
  'Karen Villamizar Varon': 2173614,
  'Karlijn Swinkels': 98571,
  'Karolina Perekitko': 98822,
  'Kasia Niewiadoma': 86824,
  'Kasia Niewiadoma-Phinney': 86824,
  'Katarzyna Niewiadoma-Phinney': 86824,
  'Kathrin Schweinberger': 98622,
  'Katrine Aalerud': 153601,
  'Kiara Lylyk': 1914091,
  'Kim Cadzow': 2246047,
  'Kim le Court': 88660,
  'Mary Patricia Kimberley le Court de Billot': 88660,
  'Kristen Faulkner': 1688341,
  'Kristýna Burlová': 472083,
  'Lara Gillespie': 166366,
  'Laura Tomasi': 156618,
  'Lauren Stephens': 88384,
  'Lauretta Hanson': 78254,
  'Léa Curinier': 1751576,
  'Letizia Borghesi': 148199,
  'Letizia Paternoster': 153363,
  'Liane Lippert': 140495,
  'Lieke Nooijen': 231444,
  'Lily Williams': 459694,
  'Linda Riedmann': 1548351,
  'Linda Zanetti': 347967,
  'Lizzie Deignan': 45988,
  'Elizabeth Deignan': 45988,
  'Loes Adegeest': 142171,
  'Lore de Schepper': 2096868,
  'Lorena Wiebes': 141733,
  'Lotta Henttala': 63262,
  'Lotte Claes': 163639,
  'Lotte Kopecky': 73504,
  'Lucinda Brand': 66056,
  'Lucinda Stewart': 30268,
  'Maaike Boogaard': 102009,
  'Maeva Squiban': 1776053,
  'Magdeleine Vallieres Mill': 1561391,
  'Maggie Coles-Lyster': 109985,
  'Maike van der Duin': 226974,
  'Mareille Meijering': 142001,
  'Margot Vanpachtenbeke': 2358049,
  'Maria Giulia Confalonieri': 72788,
  'Marianne Vos': 31144,
  'Marie Le Net': 235222,
  'Marie Schreiber': 349984,
  'Marion Bunel': 1742562,
  'Marlen Reusser': 1589305,
  'Marta Cavalli': 111432,
  'Marta Jaskulska': 153355,
  'Marta Lach': 96399,
  'Marte Berg Edseth': 2296641,
  'Marthe Truyen': 110267,
  'Martina Fidanza': 156623,
  'Mavi Garcia': 398547,
  'Margarita Victo Garcia Cañellas': 398547,
  'Margarita Victo Garcia': 398547,
  'Michaela Drummond': 107472,
  'Mie Bjørndal Ottestad': 152655,
  'Mireia Benito Pellicer': 431396,
  'Mirre Knaven': 233359,
  'Mischa Bredewold': 227721,
  'Monica Trinca Colonel': 1897613,
  'Mylene de Zoete': 155099,
  'Nadia Gontova': 2240638,
  'Nadia Quagliotto': 106787,
  'Neve Bradbury': 1987823,
  'Neve Summer Bradbury': 1987823,
  'Niamh Fisher-Black': 217072,
  'Niamh Fisher': 217072,
  'Nienke Veenhoven': 233158,
  'Nienke Vinke': 1677353,
  'Nikola Nosková': 93351,
  'Nina Berton': 350159,
  'Noemi Rüegg': 347941,
  'Olivia Baril': 151523,
  'Paula Andrea Patiño Bedoya': 106619,
  'Pauliena Rooijakkers': 79690,
  'Pauline Ferrand-Prévot': 66298,
  'Pfeiffer Georgi': 153350,
  'Puck Pieterse': 234336,
  'Rachele Barbieri': 107147,
  'Rebecca Koerner': 2111826,
  'Ricarda Bauernfeind': 153347,
  'Riejanne Markus': 86854,
  'Rosita Reijnhout': 228699,
  'Ruby Roseman-Gannon': 111383,
  'Ruth Edwards': 75015,
  'Safia al Sayegh': 1516829,
  'Sandra Alonso Dominguez': 111544,
  'Sara Fiorin': 305459,
  'Sarah Gigante': 1557078,
  'Sarah Roy': 94570,
  'Sarah van Dam': 488553,
  'Scarlett Souren': 233425,
  'Sheyla Gutierrez Ruiz': 146495,
  'Shirin van Anrooij': 228375,
  'Silke Smulders': 231378,
  'Silvia Persico': 107539,
  'Silvia Zanardi': 301596,
  'Simone Boilard': 1515615,
  'Sofia Bertizzolo': 106607,
  'Sofie van Rooijen': 228141,
  'Solbjørk Anderson': 487867,
  'Soraya Paladin': 75244,
  'Sylvie Swinkels': 147571,
  'Tamara Dronova': 72722,
  'Tereza Neumanová': 101818,
  'Thalita de Jong': 79176,
  'Urška Žigart': 98928,
  'Usoa Ostolaza Zabala': 2178637,
  'Valentina Cavallar': 2611772,
  'Victoire Berteau': 153389,
  'Victorie Guilman': 99023,
  'Vittoria Guazzini': 153391,
  'Yanina Kuskova': 1717798,
  'Yara Kastelijn': 89901,
  'Yuliia Biriukova': 1993633,
  'Zoe Backstedt': 1546801,
};

export const womensRidersLower: Record<string, number | undefined> = Object.fromEntries(
  Object.entries(womensRiders).map(([name, id]) => [name.toLowerCase(), id]),
);
