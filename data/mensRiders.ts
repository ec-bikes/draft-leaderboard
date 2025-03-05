/**
 * Mapping from top rider names (not necessarily selected) to UCI object IDs.
 * Some name variants are included, mapping to the same ID.
 */
const mensRiders: Record<string, number | undefined> = {
  'Adam Yates': 70590,
  'Adam Richard Yates': 70590,
  'Alberto Bettiol': 86630,
  'Aleksandr Vlasov': 97280,
  'Alex Aranburu': 422863,
  'Alex Aranburu Deva': 422863,
  'Alex Baudin': 1772214,
  'Alexander Kristoff': 32691,
  'Alexandre Mayer': 108443,
  'Alexey Lutsenko': 68778,
  'Anders Foldager': 1542544,
  'Andrea Bagioli': 157221,
  'Andrea Vendrame': 93924,
  'Anthony Turgis': 75920,
  'Antonio Eric Fagundez Lima': 1588190,
  'Antonio Tiberi': 308040,
  'António Tomas Morgado': 442797,
  'Archie Ryan': 171147,
  'Arnaud de Lie': 735965,
  'Arnaud Démare': 64670,
  'Arnaud Demare': 64670,
  'Arvid de Kleijn': 98176,
  'Attila Valter': 98207,
  'Aurélien Paret Peintre': 250807,
  'Axel Laurance': 1754009,
  'Axel Zingle': 101278,
  'Bauke Mollema': 55131,
  'Ben Healy': 235075,
  "Ben O'Connor": 97805,
  "Ben Alexander O'Connor": 97805,
  'Benoît Cosnefroy': 79522,
  'Benoit Cosnefroy': 79522,
  'Biniam Girmay': 1707195,
  'Brandon McNulty': 150923,
  'Bryan Coquard': 68950,
  'Carlos Rodriguez': 428096,
  'Carlos Rodriguez Cano': 428096,
  'Casper van Uden': 226805,
  'Christian Scaroni': 144019,
  'Christophe Laporte': 81980,
  'Cian Uijtdebroeks': 1789559,
  'Clément Berthet': 112281,
  'Clément Champoussin': 98323,
  'Clement Venturini': 70965,
  'Corbin John Strong': 236644,
  'Cristian Rodriguez Martin': 86932,
  'Daniel Martínez': 92264,
  'Daniel Felipe Martínez': 92264,
  'Daniel Felipe Martinez Poveda': 92264,
  'Danny van Poppel': 69149,
  'Darren Rafferty': 171058,
  'David Gaudu': 112351,
  'Derek James Gee': 111148,
  'Diego Ulissi': 54679,
  'Dorian Godon': 112353,
  'Dylan Groenewegen': 72932,
  'Dylan Teuns': 75247,
  'Dylan van Baarle': 68844,
  'Edoardo Affini': 95012,
  'Edoardo Zambanini': 300493,
  'Edward Dunbar': 97939,
  'Egan Bernal': 95844,
  'Egan Arley Bernal Gomez': 95844,
  'Einer Augusto Rubio Reyes': 1578987,
  'Emilien Jeanniere': 152898,
  'Enric Mas': 109803,
  'Enric Mas Nicolau': 109803,
  'Esteban Chaves': 75873,
  'Jhoan Esteban Chaves Rubio': 75873,
  'Fabio Christen': 462391,
  'Fabio Jakobsen': 87061,
  'Felix Gall': 150925,
  'Fernando Gaviria Rendon': 86568,
  'Filippo Baroncini': 306260,
  'Filippo Ganna': 91640,
  'Filippo Zana': 158293,
  'Finn Fisher-Black': 217083,
  'Finn Lachlan Fox Fisher-Black': 217083,
  'Florian Lipowitz': 2097255,
  'Frank van Den Broek': 230938,
  'Fred Wright': 153275,
  'Fredrik Dversnes': 197259,
  'Georg Steinhauser': 1596781,
  'George Bennett': 64445,
  'Geraint Thomas': 32532,
  'Gerben Thijssen': 107713,
  'Gianni Vermeersch': 66562,
  'Giovanni Aleotti': 158278,
  'Giulio Ciccone': 97091,
  'Giulio Pellizzari': 308599,
  'Guillaume Martin': 75170,
  'Guillaume Martin Guyonnet': 75170,
  'Guillermo Thomas Silva Coussan': 2022613,
  'Henok Mulueberhan': 235007,
  'Ilan van Wilder': 165041,
  'Ion Izaguirre Insausti': 422366,
  'Isaac del Toro': 2002910,
  'Isaac del Toro Romero': 2002910,
  'Ivan Romeo Abad': 418882,
  'Jack Haig': 78342,
  'Jai Hindley': 109829,
  'Jan Christen': 462394,
  'Jan Tratnik': 64864,
  'Jasper Philipsen': 148275,
  'Jasper Stuyven': 68235,
  'Javier Romo Oliver': 2178033,
  'Jay Vine': 148689,
  'Jefferson Cepeda': 96889,
  'Jelte Krijnsen': 232331,
  'Jenno Berckmoes': 1720261,
  'Jenthe Biermans': 86633,
  'Jhonatan Narváez': 96372,
  'Jhonatan Manuel Narvaez Prado': 96372,
  'João Almeida': 107840,
  'Joao Pedro Gonçalves Almeida': 107840,
  'Jonas Abrahamsen': 86594,
  'Jonas Vingegaard': 112082,
  'Jonas Vingegaard Hansen': 112082,
  'Jonathan Milan': 301151,
  'Jordan Jegat': 162430,
  'Jordi Meeus': 148901,
  'Joseph Blackmore': 2083636,
  'Josh Tarling': 1557793,
  'Joshua Tarling': 1557793,
  'Joshua Michael Tarling': 1557793,
  'Juan Ayuso': 415141,
  'Juan Ayuso Pesquera': 415141,
  'Julian Alaphilippe': 71557,
  'Kaden Groves': 111683,
  'Kaden Alexander Groves': 111683,
  'Kévin Vauquelin': 1745291,
  'Kevin Vermaerke': 762315,
  'Laurence Pithie': 221617,
  'Laurens de Plus': 100877,
  'Laurenz Rex': 110158,
  'Lennard Kämna': 97741,
  'Lennert van Eetvelt': 1720439,
  'Lenny Martinez': 1843476,
  'Lionel Taminiaux': 91361,
  'Lorenzo Fortunato': 112350,
  'Lorenzo Rota': 93935,
  'Luca Mozzato': 149918,
  'Luke Plapp': 1557079,
  'Lucas Plapp': 1557079,
  'Madis Mihkels': 1858789,
  'Mads Pedersen': 86895,
  'Magnus Cort': 73817,
  'Magnus Cort Nielsen': 73817,
  'Magnus Sheffield': 361433,
  'Marc Hirschi': 111440,
  'Marc Soler': 89223,
  'Marcin Budzinski': 110268,
  'Marco Brenner': 363549,
  'Marijn van den Berg': 156869,
  'Markus Hoelgaard': 86759,
  'Matej Mohoric': 86863,
  'Mathias Vacek': 472995,
  'Mathieu van der Poel': 79462,
  'Matteo Jorgenson': 159567,
  'Matteo Trentin': 47742,
  'Matthew Riccitello': 1706565,
  'Mattias Skjelmose': 365033,
  'Mattias Jensen': 365033,
  'Mauri Vansevenant': 154227,
  'Mauro Schmid': 109483,
  'Max David Poole': 1600745,
  'Max Kanter': 101735,
  'Maxim van Gils': 154218,
  'Max Schachmann': 86938,
  'Maximilian Schachmann': 86938,
  'Merhawi Kudus': 88551,
  'Michal Kwiatkowski': 58528,
  'Michael Matthews': 62919,
  'Michael Russell Woods': 86480,
  'Michael Storer': 102035,
  'Mike Teunissen': 66315,
  'Mikel Landa': 68367,
  'Mikel Landa Meana': 68367,
  'Mikkel Bjerg': 158259,
  'Mikkel Norsgaard Bjerg': 158259,
  'Milan Fretin': 1714193,
  'Neilson Powless': 88143,
  'Nils Politt': 87226,
  'Oier Lazkano Lopez': 159068,
  'Olav Kooij': 227110,
  'Oliver Naesen': 93654,
  'Orluis Alberto Aular Sanabria': 97204,
  'Oscar Onley': 1710249,
  'Pablo Castrillo': 373832,
  'Pablo Castrillo Zapater': 373832,
  'Pascal Ackermann': 77380,
  'Patrick Konrad': 71677,
  'Pau Miquel Delgado': 235739,
  'Paul Lapeira': 257361,
  'Paul Magnier': 1759987,
  'Paul Penhoet': 1758297,
  'Pavel Bittner': 467185,
  'Pavel Sivakov': 111343,
  'Pello Bilbao': 76092,
  'Pello Bilbao Lopez de Armentia': 76092,
  'Per Strand Hagenes': 199947,
  'Phil Bauhaus': 86624,
  'Primož Roglič': 88889,
  'Quentin Pacher': 88929,
  'Quinten Hermans': 79451,
  'Remco Evenepoel': 1596046,
  'Richard Carapaz': 91656,
  'Riley Sheehan': 235343,
  'Roger Adria Oliveras': 407508,
  'Romain Bardet': 64917,
  'Romain Grégoire': 1759422,
  'Romain Gregoire': 1759422,
  'Rudy Molard': 77534,
  'Rui Costa': 32596,
  'Sam Bennett': 65995,
  'Sam Welsford': 91180,
  'Santiago Buitrago': 353375,
  'Santiago Buitrago Sanchez': 353375,
  'Sepp Kuss': 88346,
  'Simon Yates': 1558112,
  'Simon Philip Yates': 1558112,
  'Simone Velasco': 80188,
  'Søren Kragh Andersen': 79156,
  'Stanislaw Aniolkowski': 109575,
  'Stefan Bissegger': 101183,
  'Stefan Küng': 74994,
  'Stephen Williams': 100931,
  'Tadej Pogačar': 149727,
  'Tao Geoghegan Hart': 86735,
  'Thibau Nys': 1721034,
  'Thymen Arensman': 109481,
  'Tiesj Benoot': 77502,
  'Tim Merlier': 70962,
  'Tim Wellens': 64531,
  'Tobias Andresen': 482927,
  'Tobias Halland Johannessen': 1905765,
  'Tom Pidcock': 109775,
  'Thomas Pidcock': 109775,
  'Tom van Asbroeck': 79141,
  'Toms Skujiņš': 68892,
  'Toms Skujins': 68892,
  'Urko Berrade Fernandez': 424785,
  'Valentin Madouas': 91637,
  'Valentin Paret Peintre': 1748274,
  'Victor Campenaerts': 89133,
  'Victor Lafay': 136296,
  'Vincenzo Albanese': 95054,
  'Wilco Kelderman': 64730,
  'Wout Poels': 1974873,
  'Wouter Poels': 1974873,
  'Wout van Aert': 75859,
  'Xandro Meurisse': 66427,
  'Yves Lampaert': 86228,
};

const mensRidersLower: Record<string, number | undefined> = Object.fromEntries(
  Object.entries(mensRiders).map(([name, id]) => [name.toLowerCase(), id]),
);

/** Get the UCI object ID for a rider name. */
export function getMensRiderId(name: string): number | undefined {
  return mensRidersLower[name.toLowerCase()];
}
