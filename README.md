# PokeNuzlockePlanner

> **Versión actual: 0.9** · Base de aventura, datos Gen I–VIII, formas, MT/tutor, level caps y equipos por versión.  
> **1.0:** completar todos los datos faltantes que aparecen en [`docs/COBERTURA_DATOS.md`](docs/COBERTURA_DATOS.md).  
> **Después de 1.0:** MT/tutores disponibles antes de cada gimnasio y builder perfecto por gimnasio/juego.

Aplicación web hecha con **React + Vite** que consume la [PokéAPI](https://pokeapi.co/api/v2/) para explorar Pokémon y armar tu propia biblioteca personal.

## Funcionalidades

- **Pokédex completa**: más de 1000 Pokémon con carga progresiva (scroll infinito).
- **Búsqueda instantánea** por nombre o número (`#25`), con atajo de teclado `/`.
- **Filtro por los 18 tipos** y ordenamiento por número o nombre.
- **Ficha de detalle**: tipos, descripción, altura, peso, habilidades, estadísticas, movimientos, grito y **línea evolutiva** interactiva.
- **Catálogo de juegos principales + DLC** con selección persistente y ficha base del juego.
- **Pokédex regional de los 20 juegos** (Gen I–VIII y SV + DLC) con búsqueda, filtros por tipo/método, selector de versión y, cuando aplica, secciones por subdex.
- **Exclusividades por versión** con insignias y filtro propio. Las parejas de Gen I–VIII y BDSP/SV usan listas curadas; las especies fuera de la dex regional se documentan en el reporte de cobertura.
- **Rutas y tablas de encuentros de Gen I–VIII**: 18 juegos, desde Kanto y Johto hasta Teselia, Kalos, Alola y Galar, con niveles, probabilidad, métodos, condiciones y filtro por versión.
- **Progreso HGSS hasta Red**: cálculo de rutas y encuentros por Johto, Kanto y Monte Plata, rango de niveles y equipo final de Red.
- **Fichas contextuales por juego**: learnset por nivel, control de nivel, evoluciones aplicables, habilidades, estadísticas y disponibilidad para 4.543 fichas de 18 juegos.
- **Versiones del Pokémon**: cada especie enlaza entre sus fichas de los juegos donde está disponible, con el número regional de cada versión. El índice cubre 891 especies.
- **Formas**: la ficha separa la forma base de las variantes regionales, Mega, Gigamax y Totem. Indica en qué juego está disponible cada una; los Totem se tratan como encuentro especial.
- **Movimientos por nivel, MT/MO y tutor**: pestañas separadas en cada ficha contextual.
- **Ruta y level caps de todos los juegos con gimnasios**: gimnasios compactos por juego, con nivel del líder. GSC y HGSS incluyen Johto, Kanto y la meta final de Red; Alola no tiene gimnasios y se indica explícitamente.
- **Equipos por versión**: planificador local con seis huecos, búsqueda en la dex, nivel, moveset editable y reordenable, y level caps de gimnasio cuando existen.
- **Categorías de movimiento**: Físico, Especial y Otros (estado). Hasta Gen III se deducen del tipo; desde Gen IV son propias de cada movimiento. Las habilidades ocultas aparecen desde Gen V.
- **Cobertura transparente**: BDSP y SV quedan en dex/exclusividades por falta de encuentros; ORAS muestra solo 17 de 34 rutas; las localizaciones de Gen V–VIII sin traducción se marcan con “EN”.
- **Tema de color por juego**: cada generación y juego tiene su propia paleta.
- **Mi biblioteca**: guarda y quita Pokémon favoritos. Se conserva en `localStorage`.
- Diseño oscuro responsive con skeletons de carga, estados vacíos y manejo de errores.

## Estado de implementación

- **Fase 1 completada:** catálogo de 20 juegos + 4 DLC, selección persistente, navegación y ficha base.
- **Fase 2 completada con cobertura parcial de encuentros:** Pokédex regional, disponibilidad y exclusividades para los 20 juegos. BDSP y SV solo tienen dex/exclusividades.
- **Fase 3 completada en Gen I–VIII:** rutas, localizaciones y tablas de encuentros para 18 juegos. BDSP y SV quedan sin rutas por falta de encuentros.
  - Rojo/Azul: 45 localizaciones, 25 rutas numeradas, 74 áreas y 781 encuentros.
  - Amarillo: 45 localizaciones, 25 rutas numeradas, 74 áreas y 699 encuentros.
  - Oro/Plata: 83 localizaciones, 45 rutas numeradas, 124 áreas y 1.498 encuentros.
  - Cristal: 84 localizaciones, 45 rutas numeradas, 126 áreas y 1.457 encuentros.
  - Rubí/Zafiro: 67 localizaciones, 34 rutas numeradas, 104 áreas y 1.153 encuentros.
  - Esmeralda: 73 localizaciones, 34 rutas numeradas, 111 áreas y 1.101 encuentros.
  - RFVH: 70 localizaciones, 25 rutas numeradas, 119 áreas y 1.504 encuentros.
  - Diamante/Perla: 69 localizaciones, 30 rutas numeradas, 156 áreas y 1.531 encuentros.
  - Platino: 71 localizaciones, 30 rutas numeradas, 159 áreas y 1.546 encuentros.
  - HeartGold/SoulSilver: 95 localizaciones, 47 rutas numeradas, 167 áreas y 2.163 encuentros.
  - Negro/Blanco: 50 localizaciones, 18 rutas numeradas, 86 áreas y 975 encuentros.
  - Negro 2/Blanco 2: 66 localizaciones, 22 rutas numeradas, 130 áreas y 1.803 encuentros.
  - X/Y: 46 localizaciones, 21 rutas numeradas, 79 áreas y 1.096 encuentros.
  - Rubí Omega/Zafiro Alfa: 50 localizaciones, 17 de 34 rutas, 91 áreas y 121 encuentros; cobertura parcial.
  - Sol/Luna: 69 localizaciones, 17 rutas numeradas, 97 áreas y 690 encuentros.
  - Ultrasol/Ultraluna: 73 localizaciones, 17 rutas numeradas, 113 áreas y 900 encuentros.
  - Let’s Go: 40 localizaciones, 25 rutas numeradas, 59 áreas y 573 encuentros.
  - Espada/Escudo + DLC: 84 localizaciones, 10 rutas numeradas, 379 áreas y 12.064 encuentros.
- **Fase 4 completada en Gen I–VIII:** 4.543 fichas contextuales de 18 juegos con learnsets, evoluciones, nivel, habilidades, estadísticas y disponibilidad.
  - Gen I/II no tienen habilidades; las habilidades ocultas aparecen desde Gen V.
  - Las categorías Físico/Especial/Otros siguen la regla de cada generación; desde Gen IV son propias de cada movimiento.
  - Las evoluciones por localización de Gen IV solo aparecen en juegos donde existe el lugar: HGSS no muestra Leafeon/Glaceon.
  - El índice de versiones cubre 891 especies y conecta todas las fichas disponibles de cada especie.
  - BDSP no tiene fichas por falta de encuentros. Las exclusividades de Gen V–VIII son listas curadas; las que quedan fuera de la dex regional se detallan en `docs/COBERTURA_DATOS.md`.
- **Formas y movimientos:** 131 formas especiales (40 regionales, 48 Mega, 32 Gigamax y 11 Totem) y learnsets con pestañas de nivel, MT/MO y tutor.
- **Level caps:** ruta compacta de gimnasios para todos los juegos con gimnasios, de Kanto a Paldea. GSC y HGSS llegan hasta Red; Alola no tiene caps de gimnasio. Los caps usan el nivel más alto del líder.
- **Equipos:** vista `/equipos` con equipo de seis, selector juego/versión, moveset por nivel/MT-MO/tutor, reordenación de movimientos y persistencia por versión.
- **Siguiente:** completar BDSP/SV si aparece una fuente fiable, revisar las formas regionales fuera de la dex y añadir más datos de entrenadores si se necesitan.
- El plan completo está en [`docs/PLAN_OBJETIVOS.md`](docs/PLAN_OBJETIVOS.md).

## Plan de producto

El siguiente gran paso del proyecto está documentado en [`docs/PLAN_OBJETIVOS.md`](docs/PLAN_OBJETIVOS.md): convertir la app en un **compañero de aventura por juego** para los juegos principales y sus DLC, con disponibilidad por juego, rutas y encuentros, learnsets, evoluciones contextualizadas y planificador de equipo base.

La cobertura real por juego, las lagunas de PokéAPI y lo que queda pendiente están en [`docs/COBERTURA_DATOS.md`](docs/COBERTURA_DATOS.md).

## Roadmap

### 0.9 — base actual

- 20 juegos catalogados y con Pokédex.
- 18 juegos con rutas y fichas contextuales.
- Formas regionales/Mega/Gigamax/Totem.
- Learnsets por nivel, MT/MO y tutor.
- Level caps de gimnasio para todos los juegos con gimnasios.
- Equipos por versión con moveset, niveles y caps.

### 1.0 — completar los datos faltantes

Se reserva para cerrar las lagunas del reporte de cobertura: BDSP/SV, rutas ORAS, disponibilidad incompleta, exclusivas fuera de dex, formas restantes, números de MT, movimientos huevo, entrenadores/combates y DLC de SV.

### Después de 1.0 — builder por gimnasio

- Determinar qué **MT y tutores** están disponibles antes de cada gimnasio.
- Asociar TMs/tutores a la versión y al punto de aventura.
- Validar el equipo contra el level cap y el moveset legal en ese checkpoint.
- Recomendar equipo, movimientos y cobertura para cada gimnasio de cada juego.

## Requisitos

- Node.js 20 o superior (probado con Node 22).

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` (Vite lo abrirá automáticamente).

## Build de producción

```bash
npm run build
npm run preview
```

Para regenerar los datos desde PokéAPI:

```bash
npm run build:data
```

También puedes generarlos por separado:

```bash
npm run build:games
npm run build:pokedex
npm run build:routes
npm run build:pokemon
```

> La app usa rutas del navegador (`/pokemon/:name`, `/juegos/:gameId`, `/biblioteca`). Al desplegarla en un hosting estático, configura una redirección de todas las rutas hacia `index.html`.

## Estructura

```
src/
  api/            Cliente de PokéAPI con caché en memoria
  components/     Navbar, tarjetas, filtros, iconos, skeletons
  context/        Biblioteca de favoritos y juego seleccionado
  hooks/          Carga de detalles, catálogo y Pokédex de juego
  pages/          Pokédex, detalle, juegos, dex regional, rutas, biblioteca y 404
  data/           Tipos, generaciones, etiquetas y metadatos
  services/       Carga de snapshots estáticos
  utils/          Formateadores y helpers
scripts/          Pipelines de catálogo, Pokédex, rutas y fichas desde PokéAPI
public/data/v1/   Catálogo, Pokédex, rutas y fichas contextuales de Gen I–VIII
```

## API

Los datos provienen de [PokeAPI](https://pokeapi.co/). No requiere API key.

## Créditos

Pokémon y los nombres de los Pokémon son marcas de Nintendo, Game Freak y The Pokémon Company. Este proyecto es una demo educativa sin fines comerciales.
