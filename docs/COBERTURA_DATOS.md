# Cobertura de datos

Generado desde los snapshots de `public/data/v1` el 2026-10-23.

> **Estado:** versión 0.9. La versión 1.0 se reserva para completar los datos faltantes de este reporte.

## Resumen

- **20 juegos** en el catálogo.
- **18 juegos** con rutas y fichas contextuales.
- **4.543 fichas** contextuales.
- **891 especies** en el índice de versiones.
- **1.180 localizaciones** con encuentros.
- **31.655 encuentros** registrados.
- **0 localizaciones** pendientes de traducción en Gen V–VIII.
- **53 métodos** de encuentro, **0** sin etiqueta en español.
- **131 formas** especiales en **119 especies**: 40 regionales, 48 Mega, 32 Gigamax y 11 Totem.

## Traducciones

- Localizaciones de Gen V–VIII: **0 nombres pendientes**; los escasos nombres propios de formas o personajes se mantienen en su forma original.
- Métodos de encuentro: **53** identificadores, **0** pendientes.
- Condiciones especiales: etiquetas en español para clima, estaciones, Zona Safari, Guaridas Max, intercambios, inicio de aventura, objetos y estados de historia.

## Formas

- **40** formas regionales, **48** Mega Evoluciones, **32** formas Gigamax y **11** formas Totem.
- La forma base se muestra separada de las variantes en la ficha contextual.
- Las formas regionales usan los encuentros de su variedad para indicar en qué juego están disponibles.
- La disponibilidad de una forma regional puede quedar incompleta si PokéAPI no registra esa variedad como encuentro.
- Mega y Gigamax se marcan por juego compatible; los Totem se presentan como encuentro especial.
- No se modelan otras variantes (Rotom, Deoxys, Unown, etc.) ni formas de Legends: Arceus.

## Movimientos y level caps

- Los learnsets incluyen movimientos por nivel, MT/MO y tutor. El huevo queda pendiente.
- Los level caps cubren todos los juegos con gimnasios: Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Galar y Paldea, además de Let’s Go y las versiones dobles.
- GSC y HGSS incluyen Johto, Kanto y Red como meta final. Solo los gimnasios definen caps; el Alto Mando no entra.
- Alola (Sol/Luna y USUM) no tiene gimnasios; no se definen caps de gimnasio.
- No hay números de MT ni equipos completos de entrenadores en la base.

## Planificador de equipos

- Vista `/equipos` con seis huecos por juego y versión.
- Moveset de cuatro movimientos por Pokémon, con nivel, MT/MO y tutor; se puede reordenar.
- Los level caps de todos los juegos con gimnasios se pueden seleccionar y aplicar al equipo; hay aviso si un nivel los supera.
- Persistencia local por versión. No hay exportación, recomendaciones automáticas ni modo Nuzlocke.
- El planificador elige especies, no formas regionales concretas; esa selección queda pendiente.

## Cobertura por juego

| Juego | Dex | Método | Exclusivas | Fuente | Rutas | Zonas | Encuentros | Fichas |
|---|---:|---:|---:|---|---:|---:|---:|---:|
| Rojo / Azul | 151 | 114 | 22 | curated | 25 | 45 | 781 | 151 |
| Amarillo | 151 | 106 | 0 | — | 25 | 45 | 699 | 151 |
| Oro / Plata | 251 | 164 | 20 | curated | 45 | 83 | 1.498 | 251 |
| Cristal | 251 | 170 | 0 | — | 45 | 84 | 1.457 | 251 |
| Rubí / Zafiro | 202 | 135 | 14 | curated | 34 | 67 | 1.153 | 202 |
| Esmeralda | 202 | 129 | 0 | — | 34 | 73 | 1.101 | 202 |
| Rojo Fuego / Verde Hoja | 151 | 116 | 26 | curated | 25 | 70 | 1.504 | 151 |
| Diamante / Perla | 151 | 115 | 14 | curated | 30 | 69 | 1.531 | 151 |
| Platino | 210 | 139 | 0 | — | 30 | 71 | 1.546 | 210 |
| HeartGold / SoulSilver | 256 | 185 | 24 | curated | 47 | 95 | 2.163 | 256 |
| Negro / Blanco | 156 | 120 | 18 | curated | 18 | 50 | 975 | 156 |
| Negro 2 / Blanco 2 | 301 | 230 | 32 | curated | 22 | 66 | 1.803 | 301 |
| X / Y | 457 | 308 | 32 | curated | 21 | 46 | 1.096 | 457 |
| Rubí Omega / Zafiro Alfa | 211 | 70 | 14 | curated | 17 | 50 | 121 | 211 |
| Sol / Luna | 302 | 216 | 30 | curated | 17 | 69 | 690 | 302 |
| Ultrasol / Ultraluna | 403 | 300 | 56 | curated | 17 | 73 | 900 | 403 |
| Let’s Go, Pikachu! / Eevee! | 153 | 128 | 23 | curated | 25 | 40 | 573 | 153 |
| Espada / Escudo | 584 | 570 | 74 | curated | 10 | 84 | 12.064 | 584 |
| Diamante Brillante / Perla Reluciente | 151 | 0 | 14 | curated | — | — | — | 0 |
| Escarlata / Púrpura | 664 | 0 | 66 | curated | — | — | — | 0 |

## Lo que falta o queda limitado

### Sin encuentros publicados

- **Diamante Brillante / Perla Reluciente:** sin rutas ni fichas; PokéAPI no publica encuentros. Mantiene 151 especies de dex y 14 exclusivas curadas.
- **Escarlata / Púrpura:** excluido de la ampliación profunda; mantiene 664 especies de dex y 66 exclusivas curadas.

### Cobertura de rutas y disponibilidad

- **Rubí Omega / Zafiro Alfa:** PokéAPI solo publica encuentros para 17 de las 34 rutas de Hoenn. Mostramos esas rutas y el resto de localizaciones disponibles; la cobertura es parcial.
- **Rojo / Azul:** 114/151 especies con método confirmado.
- **Amarillo:** 106/151 especies con método confirmado.
- **Oro / Plata:** 164/251 especies con método confirmado.
- **Cristal:** 170/251 especies con método confirmado.
- **Rubí / Zafiro:** 135/202 especies con método confirmado.
- **Esmeralda:** 129/202 especies con método confirmado.
- **Rojo Fuego / Verde Hoja:** 116/151 especies con método confirmado.
- **Diamante / Perla:** 115/151 especies con método confirmado.
- **Platino:** 139/210 especies con método confirmado.
- **HeartGold / SoulSilver:** 185/256 especies con método confirmado.
- **Negro / Blanco:** 120/156 especies con método confirmado.
- **Negro 2 / Blanco 2:** 230/301 especies con método confirmado.
- **X / Y:** 308/457 especies con método confirmado.
- **Rubí Omega / Zafiro Alfa:** 70/211 especies con método confirmado.
- **Sol / Luna:** 216/302 especies con método confirmado.
- **Ultrasol / Ultraluna:** 300/403 especies con método confirmado.
- **Let’s Go, Pikachu! / Eevee!:** 128/153 especies con método confirmado.
- **Espada / Escudo:** 570/584 especies con método confirmado.
- **Diamante Brillante / Perla Reluciente:** 0/151 especies con método confirmado.
- **Escarlata / Púrpura:** 0/664 especies con método confirmado.

### Exclusividades fuera de la dex regional

Estas especies están en las listas curadas, pero no aparecen en la Pokédex regional del juego ni tienen ficha contextual:

- **Diamante / Perla:** 26 exclusivas curadas fuera de la dex regional (seel, dewgong, scyther, scizor, larvitar, pupitar, tyranitar, poochyena, mightyena, aron, lairon, aggron…).
- **HeartGold / SoulSilver:** 16 exclusivas curadas fuera de la dex regional (sableye, baltoy, claydol, kyogre, mantyke, gliscor, anorith, armaldo, latias, mawile, gulpin, swalot…).
- **Negro / Blanco:** 22 exclusivas curadas fuera de la dex regional (weedle, kakuna, beedrill, murkrow, houndour, houndoom, shroomish, breloom, plusle, volbeat, honchkrow, caterpie…).
- **Negro 2 / Blanco 2:** 27 exclusivas curadas fuera de la dex regional (weedle, kakuna, beedrill, spinarak, ariados, sudowoodo, bonsly, plusle, volbeat, latios, stunky, skuntank…).
- **X / Y:** 8 exclusivas curadas fuera de la dex regional (lileep, cradily, anorith, armaldo, omanyte, omastar, kabuto, kabutops).
- **Rubí Omega / Zafiro Alfa:** 26 exclusivas curadas fuera de la dex regional (kabuto, kabutops, ho-oh, shieldon, bastiodon, palkia, throh, archen, archeops, tornadus, reshiram, skrelp…).
- **Ultrasol / Ultraluna:** 18 exclusivas curadas fuera de la dex regional (raikou, ho-oh, latios, groudon, dialga, heatran, tornadus, reshiram, xerneas, entei, lugia, latias…).
- **Espada / Escudo:** 16 exclusivas curadas fuera de la dex regional (ho-oh, latios, groudon, dialga, tornadus, reshiram, xerneas, solgaleo, lugia, latias, kyogre, palkia…).
- **Diamante Brillante / Perla Reluciente:** 26 exclusivas curadas fuera de la dex regional (seel, dewgong, scyther, scizor, larvitar, pupitar, tyranitar, poochyena, mightyena, aron, lairon, aggron…).

### Capas todavía no implementadas

- **Otras formas** distintas de regionales/Mega/Gigamax/Totem (Rotom, Deoxys, Unown, etc.) no están modeladas. Las formas de Hisui quedan fuera por el alcance.
- **Disponibilidad de formas regionales:** se apoya en encuentros de la variedad y cobertura regional; puede quedar incompleta si PokéAPI no registra la forma.
- **Número de MT y movimientos huevo:** los learnsets distinguen MT/MO y tutor, pero no muestran el número de MT ni movimientos huevo.
- **Entrenadores, gimnasios y combates finales:** solo hay level caps de gimnasio y la meta de Red en GSC/HGSS; no hay equipos completos de entrenadores, Alto Mando ni combates.
- **Alola:** Sol/Luna y USUM no tienen gimnasios, así que no hay caps de gimnasio.
- **DLC de Escarlata / Púrpura:** queda fuera; el DLC de Espada / Escudo sí está incluido en Galar.
- **Planificador:** no hay exportación, recomendaciones automáticas, cálculo de daño, EVs/naturalezas, modo Nuzlocke ni selección de forma regional.
- **Localizaciones de Gen V–VIII:** los nombres visibles están traducidos; las condiciones y métodos también tienen etiqueta en español. Los nombres propios de formas o personajes pueden quedar en su forma original.

## Después de 1.0

- Modelar qué **MT y tutores** están disponibles antes de cada gimnasio, por juego y versión.
- Asociar cada movimiento a su checkpoint de aventura y validar el moveset legal.
- Builder perfecto por gimnasio: level cap, equipo, movimientos, disponibilidad y cobertura.

## Archivos fuente

- `public/data/v1/pokedex/manifest.json`
- `public/data/v1/routes/manifest.json`
- `public/data/v1/pokemon/index.json`
- `scripts/pilots.config.mjs` y `scripts/exclusives.gen58.mjs`
