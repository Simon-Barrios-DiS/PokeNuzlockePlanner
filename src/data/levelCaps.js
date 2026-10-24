/**
 * Level caps de gimnasio para Gen I–III.
 * El cap es el nivel más alto del equipo del líder, no el nivel del Alto Mando.
 * Red se incluye como meta final en GSC, no como cap de gimnasio.
 */
const kanto = [
  { name: 'Brock', city: 'Ciudad Plateada', badge: 'Roca', level: 14 },
  { name: 'Misty', city: 'Ciudad Celeste', badge: 'Cascada', level: 21 },
  { name: 'Lt. Surge', city: 'Ciudad Carmín', badge: 'Trueno', level: 24 },
  { name: 'Erika', city: 'Ciudad Azulona', badge: 'Arcoíris', level: 29 },
  { name: 'Koga', city: 'Ciudad Fucsia', badge: 'Alma', level: 43 },
  { name: 'Sabrina', city: 'Ciudad Azafrán', badge: 'Pantano', level: 43 },
  { name: 'Blaine', city: 'Isla Canela', badge: 'Volcán', level: 47 },
  { name: 'Giovanni', city: 'Ciudad Verde', badge: 'Tierra', level: 50 },
];

const kantoYellow = [
  { name: 'Brock', city: 'Ciudad Plateada', badge: 'Roca', level: 12 },
  { name: 'Misty', city: 'Ciudad Celeste', badge: 'Cascada', level: 21 },
  { name: 'Lt. Surge', city: 'Ciudad Carmín', badge: 'Trueno', level: 28 },
  { name: 'Erika', city: 'Ciudad Azulona', badge: 'Arcoíris', level: 32 },
  { name: 'Koga', city: 'Ciudad Fucsia', badge: 'Alma', level: 50 },
  { name: 'Sabrina', city: 'Ciudad Azafrán', badge: 'Pantano', level: 50 },
  { name: 'Blaine', city: 'Isla Canela', badge: 'Volcán', level: 54 },
  { name: 'Giovanni', city: 'Ciudad Verde', badge: 'Tierra', level: 55 },
];

const johto = [
  { name: 'Falkner', city: 'Ciudad Malva', badge: 'Céfiro', level: 9 },
  { name: 'Bugsy', city: 'Pueblo Azalea', badge: 'Insecto', level: 16 },
  { name: 'Whitney', city: 'Ciudad Trigal', badge: 'Planicie', level: 20 },
  { name: 'Morty', city: 'Ciudad Iris', badge: 'Niebla', level: 25 },
  { name: 'Chuck', city: 'Ciudad Orquídea', badge: 'Tormenta', level: 30 },
  { name: 'Jasmine', city: 'Ciudad Oliva', badge: 'Mineral', level: 35 },
  { name: 'Pryce', city: 'Pueblo Caoba', badge: 'Glaciar', level: 31 },
  { name: 'Clair', city: 'Ciudad Endrino', badge: 'Dragón', level: 40 },
];

const kantoGsc = [
  { name: 'Brock', city: 'Ciudad Plateada', badge: 'Roca', level: 44 },
  { name: 'Misty', city: 'Ciudad Celeste', badge: 'Cascada', level: 49 },
  { name: 'Lt. Surge', city: 'Ciudad Carmín', badge: 'Trueno', level: 46 },
  { name: 'Erika', city: 'Ciudad Azulona', badge: 'Arcoíris', level: 46 },
  { name: 'Janine', city: 'Ciudad Fucsia', badge: 'Alma', level: 39 },
  { name: 'Sabrina', city: 'Ciudad Azafrán', badge: 'Pantano', level: 46 },
  { name: 'Blaine', city: 'Isla Canela', badge: 'Volcán', level: 45 },
  { name: 'Blue', city: 'Ciudad Verde', badge: 'Tierra', level: 58 },
];

const hoenn = [
  { name: 'Roxanne', city: 'Ciudad Férrica', badge: 'Piedra', level: 15 },
  { name: 'Brawly', city: 'Pueblo Azuliza', badge: 'Puño', level: 19 },
  { name: 'Wattson', city: 'Ciudad Malvalona', badge: 'Dinamo', level: 24 },
  { name: 'Flannery', city: 'Pueblo Lavacalda', badge: 'Calor', level: 29 },
  { name: 'Norman', city: 'Ciudad Petalia', badge: 'Equilibrio', level: 31 },
  { name: 'Winona', city: 'Ciudad Arborada', badge: 'Cielo', level: 33 },
  { name: 'Tate & Liza', city: 'Ciudad Algaria', badge: 'Mente', level: 42 },
  { name: 'Wallace', city: 'Ciudad Arrecípolis', badge: 'Lluvia', level: 43 },
];

const hoennEmerald = [
  ...hoenn.slice(0, 7),
  { name: 'Juan', city: 'Ciudad Arrecípolis', badge: 'Lluvia', level: 46 },
];

const kantoHgss = [
  { name: 'Brock', city: 'Ciudad Plateada', badge: 'Roca', level: 51 },
  { name: 'Misty', city: 'Ciudad Celeste', badge: 'Cascada', level: 54 },
  { name: 'Lt. Surge', city: 'Ciudad Carmín', badge: 'Trueno', level: 51 },
  { name: 'Erika', city: 'Ciudad Azulona', badge: 'Arcoíris', level: 51 },
  { name: 'Janine', city: 'Ciudad Fucsia', badge: 'Alma', level: 47 },
  { name: 'Sabrina', city: 'Ciudad Azafrán', badge: 'Pantano', level: 53 },
  { name: 'Blaine', city: 'Isla Canela', badge: 'Volcán', level: 54 },
  { name: 'Blue', city: 'Ciudad Verde', badge: 'Tierra', level: 60 },
];

const sinnohDp = [
  { name: 'Roark', city: 'Ciudad Pirita', badge: 'Lignito', level: 14 },
  { name: 'Gardenia', city: 'Ciudad Vetusta', badge: 'Bosque', level: 22 },
  { name: 'Maylene', city: 'Ciudad Rocavelo', badge: 'Adoquín', level: 30 },
  { name: 'Crasher Wake', city: 'Ciudad Pastoria', badge: 'Ciénaga', level: 30 },
  { name: 'Fantina', city: 'Ciudad Corazón', badge: 'Reliquia', level: 32 },
  { name: 'Byron', city: 'Ciudad Canal', badge: 'Mina', level: 39 },
  { name: 'Candice', city: 'Ciudad Puntaneva', badge: 'Glacial', level: 42 },
  { name: 'Volkner', city: 'Ciudad Marina', badge: 'Faro', level: 49 },
];

const sinnohPlatinum = [
  { name: 'Roark', city: 'Ciudad Pirita', badge: 'Lignito', level: 14 },
  { name: 'Gardenia', city: 'Ciudad Vetusta', badge: 'Bosque', level: 22 },
  { name: 'Maylene', city: 'Ciudad Rocavelo', badge: 'Adoquín', level: 32 },
  { name: 'Crasher Wake', city: 'Ciudad Pastoria', badge: 'Ciénaga', level: 33 },
  { name: 'Fantina', city: 'Ciudad Corazón', badge: 'Reliquia', level: 36 },
  { name: 'Byron', city: 'Ciudad Canal', badge: 'Mina', level: 41 },
  { name: 'Candice', city: 'Ciudad Puntaneva', badge: 'Glacial', level: 44 },
  { name: 'Volkner', city: 'Ciudad Marina', badge: 'Faro', level: 50 },
];

const sinnohBdsp = [
  { name: 'Roark', city: 'Ciudad Pirita', badge: 'Lignito', level: 14 },
  { name: 'Gardenia', city: 'Ciudad Vetusta', badge: 'Bosque', level: 22 },
  { name: 'Maylene', city: 'Ciudad Rocavelo', badge: 'Adoquín', level: 30 },
  { name: 'Crasher Wake', city: 'Ciudad Pastoria', badge: 'Ciénaga', level: 30 },
  { name: 'Fantina', city: 'Ciudad Corazón', badge: 'Reliquia', level: 32 },
  { name: 'Byron', city: 'Ciudad Canal', badge: 'Mina', level: 39 },
  { name: 'Candice', city: 'Ciudad Puntaneva', badge: 'Glacial', level: 42 },
  { name: 'Volkner', city: 'Ciudad Marina', badge: 'Faro', level: 49 },
];

const unovaBw = [
  { name: 'Cilan / Chili / Cress', city: 'Ciudad Gres', badge: 'Trío', level: 14 },
  { name: 'Lenora', city: 'Ciudad Nacrene', badge: 'Básica', level: 20 },
  { name: 'Burgh', city: 'Ciudad Porcelana', badge: 'Insecto', level: 23 },
  { name: 'Elesa', city: 'Ciudad Mayólica', badge: 'Voltio', level: 27 },
  { name: 'Clay', city: 'Ciudad Teja', badge: 'Temblor', level: 31 },
  { name: 'Skyla', city: 'Ciudad Loza', badge: 'Jet', level: 35 },
  { name: 'Brycen', city: 'Ciudad Caolín', badge: 'Congelación', level: 39 },
  { name: 'Drayden / Iris', city: 'Ciudad Caolín', badge: 'Leyenda', level: 43 },
];

const unovaB2w2 = [
  { name: 'Cheren', city: 'Ciudad Aspertia', badge: 'Básica', level: 12 },
  { name: 'Roxie', city: 'Ciudad Virbank', badge: 'Tóxica', level: 18 },
  { name: 'Burgh', city: 'Ciudad Porcelana', badge: 'Insecto', level: 24 },
  { name: 'Elesa', city: 'Ciudad Mayólica', badge: 'Voltio', level: 30 },
  { name: 'Clay', city: 'Ciudad Teja', badge: 'Temblor', level: 36 },
  { name: 'Skyla', city: 'Ciudad Loza', badge: 'Jet', level: 42 },
  { name: 'Drayden', city: 'Ciudad Caolín', badge: 'Leyenda', level: 48 },
  { name: 'Marlon', city: 'Ciudad Humilau', badge: 'Ola', level: 51 },
];

const kalos = [
  { name: 'Viola', city: 'Ciudad Santalune', badge: 'Bicho', level: 12 },
  { name: 'Grant', city: 'Ciudad Cyllage', badge: 'Acantilado', level: 25 },
  { name: 'Korrina', city: 'Ciudad Shalour', badge: 'Combate', level: 32 },
  { name: 'Ramos', city: 'Ciudad Coumarine', badge: 'Planta', level: 34 },
  { name: 'Clemont', city: 'Ciudad Luminalia', badge: 'Voltaje', level: 37 },
  { name: 'Valerie', city: 'Ciudad Laverre', badge: 'Hada', level: 41 },
  { name: 'Olympia', city: 'Ciudad Anistar', badge: 'Psíquica', level: 48 },
  { name: 'Wulfric', city: 'Ciudad Snowbelle', badge: 'Hielo', level: 56 },
];

const hoennOras = [
  { name: 'Roxanne', city: 'Ciudad Férrica', badge: 'Piedra', level: 15 },
  { name: 'Brawly', city: 'Pueblo Azuliza', badge: 'Puño', level: 19 },
  { name: 'Wattson', city: 'Ciudad Malvalona', badge: 'Dinamo', level: 24 },
  { name: 'Flannery', city: 'Pueblo Lavacalda', badge: 'Calor', level: 29 },
  { name: 'Norman', city: 'Ciudad Petalia', badge: 'Equilibrio', level: 31 },
  { name: 'Winona', city: 'Ciudad Arborada', badge: 'Pluma', level: 33 },
  { name: 'Tate & Liza', city: 'Ciudad Algaria', badge: 'Mente', level: 45 },
  { name: 'Wallace', city: 'Ciudad Arrecípolis', badge: 'Lluvia', level: 46 },
];

const kantoLetsGo = [
  { name: 'Brock', city: 'Ciudad Plateada', badge: 'Roca', level: 12 },
  { name: 'Misty', city: 'Ciudad Celeste', badge: 'Cascada', level: 18 },
  { name: 'Lt. Surge', city: 'Ciudad Carmín', badge: 'Trueno', level: 24 },
  { name: 'Erika', city: 'Ciudad Azulona', badge: 'Arcoíris', level: 29 },
  { name: 'Koga', city: 'Ciudad Fucsia', badge: 'Alma', level: 38 },
  { name: 'Sabrina', city: 'Ciudad Azafrán', badge: 'Pantano', level: 41 },
  { name: 'Blaine', city: 'Isla Canela', badge: 'Volcán', level: 47 },
  { name: 'Giovanni', city: 'Ciudad Verde', badge: 'Tierra', level: 50 },
];

const galar = [
  { name: 'Milo', city: 'Ciudad Turffield', badge: 'Planta', level: 20 },
  { name: 'Nessa', city: 'Ciudad Hulbury', badge: 'Agua', level: 24 },
  { name: 'Kabu', city: 'Ciudad Motostoke', badge: 'Fuego', level: 27 },
  { name: 'Bea / Allister', city: 'Ciudad Motostoke', badge: 'Lucha / Fantasma', level: 34 },
  { name: 'Opal', city: 'Pueblo Ballonlea', badge: 'Hada', level: 38 },
  { name: 'Gordie / Melony', city: 'Ciudad Circhester', badge: 'Roca / Hielo', level: 42 },
  { name: 'Piers', city: 'Ciudad Spikemuth', badge: 'Siniestra', level: 46 },
  { name: 'Raihan', city: 'Ciudad Wyndon', badge: 'Dragón', level: 48 },
];

const paldea = [
  { name: 'Katy', city: 'Cortondo', badge: 'Bicho', level: 15 },
  { name: 'Brassius', city: 'Artazon', badge: 'Planta', level: 17 },
  { name: 'Iono', city: 'Levincia', badge: 'Eléctrica', level: 24 },
  { name: 'Kofu', city: 'Cascarrafa', badge: 'Agua', level: 30 },
  { name: 'Larry', city: 'Medali', badge: 'Normal', level: 36 },
  { name: 'Ryme', city: 'Montenevera', badge: 'Fantasma', level: 42 },
  { name: 'Tulip', city: 'Alfornada', badge: 'Psíquica', level: 45 },
  { name: 'Grusha', city: 'Glaseado', badge: 'Hielo', level: 48 },
];

export const LEVEL_CAPS = {
  'red-blue': {
    title: 'Ruta de Kanto',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'kanto', name: 'Kanto', leaders: kanto }],
  },
  yellow: {
    title: 'Ruta de Kanto',
    note: 'Nivel más alto del equipo de cada líder. Amarillo ajusta varios niveles respecto a Rojo/Azul.',
    groups: [{ id: 'kanto', name: 'Kanto', leaders: kantoYellow }],
  },
  'firered-leafgreen': {
    title: 'Ruta de Kanto',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'kanto', name: 'Kanto', leaders: kanto }],
  },
  'gold-silver': {
    title: 'Ruta de Johto y Kanto',
    note: 'Solo gimnasios; el Alto Mando no entra en los caps. Red se muestra como meta final.',
    groups: [
      { id: 'johto', name: 'Johto', leaders: johto },
      { id: 'kanto', name: 'Kanto · post-game', leaders: kantoGsc },
    ],
    final: { name: 'Red', city: 'Monte Plata', level: 88, note: 'Combate final' },
  },
  crystal: {
    title: 'Ruta de Johto y Kanto',
    note: 'Solo gimnasios; el Alto Mando no entra en los caps. Red se muestra como meta final.',
    groups: [
      { id: 'johto', name: 'Johto', leaders: johto },
      { id: 'kanto', name: 'Kanto · post-game', leaders: kantoGsc },
    ],
    final: { name: 'Red', city: 'Monte Plata', level: 88, note: 'Combate final' },
  },
  'ruby-sapphire': {
    title: 'Ruta de Hoenn',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'hoenn', name: 'Hoenn', leaders: hoenn }],
  },
  emerald: {
    title: 'Ruta de Hoenn',
    note: 'Nivel más alto del equipo de cada líder. Juan sustituye a Wallace como último gimnasio.',
    groups: [{ id: 'hoenn', name: 'Hoenn', leaders: hoennEmerald }],
  },
  'heartgold-soulsilver': {
    title: 'Ruta de Johto y Kanto',
    note: 'Solo gimnasios; el Alto Mando no entra en los caps. Red se muestra como meta final.',
    groups: [
      { id: 'johto', name: 'Johto', leaders: johto },
      { id: 'kanto', name: 'Kanto · post-game', leaders: kantoHgss },
    ],
    final: { name: 'Red', city: 'Monte Plata', level: 88, note: 'Combate final' },
  },
  'diamond-pearl': {
    title: 'Ruta de Sinnoh',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'sinnoh', name: 'Sinnoh', leaders: sinnohDp }],
  },
  platinum: {
    title: 'Ruta de Sinnoh',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'sinnoh', name: 'Sinnoh', leaders: sinnohPlatinum }],
  },
  'brilliant-diamond-shining-pearl': {
    title: 'Ruta de Sinnoh',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'sinnoh', name: 'Sinnoh', leaders: sinnohBdsp }],
  },
  'black-white': {
    title: 'Ruta de Teselia',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'unova', name: 'Teselia', leaders: unovaBw }],
  },
  'black-2-white-2': {
    title: 'Ruta de Teselia',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'unova', name: 'Teselia', leaders: unovaB2w2 }],
  },
  'x-y': {
    title: 'Ruta de Kalos',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'kalos', name: 'Kalos', leaders: kalos }],
  },
  'omega-ruby-alpha-sapphire': {
    title: 'Ruta de Hoenn',
    note: 'Nivel más alto del equipo de cada líder. Wallace es el último gimnasio en ORAS.',
    groups: [{ id: 'hoenn', name: 'Hoenn', leaders: hoennOras }],
  },
  'lets-go-pikachu-lets-go-eevee': {
    title: 'Ruta de Kanto',
    note: 'Nivel más alto del equipo de cada líder. No se incluye el Alto Mando.',
    groups: [{ id: 'kanto', name: 'Kanto', leaders: kantoLetsGo }],
  },
  'sword-shield': {
    title: 'Ruta de Galar',
    note: 'Nivel más alto del equipo de cada líder. El DLC no añade gimnasios; no se incluye el Alto Mando.',
    groups: [{ id: 'galar', name: 'Galar', leaders: galar }],
  },
  'sun-moon': {
    title: 'Sin gimnasios',
    note: 'Alola usa pruebas de isla y kahunas; no hay level caps de gimnasio.',
    groups: [],
  },
  'ultra-sun-ultra-moon': {
    title: 'Sin gimnasios',
    note: 'Alola usa pruebas de isla y kahunas; no hay level caps de gimnasio.',
    groups: [],
  },
  'scarlet-violet': {
    title: 'Ruta de Paldea',
    note: 'Los gimnasios de Paldea se pueden visitar en orden libre; esta es la secuencia recomendada por nivel. No se incluye el Alto Mando.',
    groups: [{ id: 'paldea', name: 'Paldea', leaders: paldea }],
  },
};
