# Plan de objetivos y producto
## PokeNuzlockePlanner: Compañero de Aventura

> **Versión:** 0.9 · **Fecha:** 23 de octubre de 2026  
> **Estado:** decisiones iniciales cerradas: JavaScript, `es-ES`, Main Game + DLC, sin Legends ni spin-offs.  
> **Implementación:** Fases 1–4 completadas para Gen I–VIII: 18 juegos con rutas y fichas, y los 20 juegos con Pokédex. SV y BDSP quedan en dex/exclusividades por falta de encuentros en PokéAPI.  
> **Punto de partida:** Pokédex nacional con búsqueda, filtros, fichas, evoluciones y biblioteca de favoritos.

### Decisiones aprobadas (21/10/2026)

- **Juegos piloto:** Rojo Fuego / Verde Hoja, Esmeralda y Escarlata / Púrpura + DLC. La cobertura se amplió después a **todos los juegos principales de Gen I–VIII**: Rojo/Azul, Amarillo, Oro/Plata, Cristal, Rubí/Zafiro, Diamante/Perla, Platino, HeartGold/SoulSilver, Negro/Blanco, Negro 2/Blanco 2, X/Y, Rubí Omega/Zafiro Alfa, Sol/Luna, Ultrasol/Ultraluna, Let’s Go, Espada/Escudo + DLC y Diamante Brillante/Perla Reluciente.
- **Alcance:** **Main Game + DLC**. Se excluyen Legends y todos los spin-offs, incluidos los de GameCube (Colosseum y XD).
- **Lenguaje:** JavaScript moderno + JSX, con JSDoc para contratos y Zod para validación en runtime.
- **Locale:** español de España (`es-ES`). No se implementa `es-419` por ahora.
- **Versiones:** las parejas se muestran juntas separadas por “/” y conservan un selector de versión individual.
- **Planificador:** queda fuera del MVP; se implementará en una actualización posterior al lanzamiento.
- **Datos:** snapshots estáticos generados desde PokéAPI.

> **Definición de “Main Game” para este proyecto:** juegos principales de la serie y sus DLC. Por ejemplo, Escarlata / Púrpura incluye La Máscara Teal y El Disco Índigo. Legends y spin-offs quedan fuera.

### Estado de implementación (22/10/2026)

- **Fase 0:** validación de datos de PokéAPI y pipeline del catálogo.
- **Fase 1:** 20 juegos principales + 4 DLC, agrupados por generación, con nombres en español, selección persistente, navegación y ficha base.
- **Fase 2:** Pokédex regional, disponibilidad y exclusividades para los 20 juegos.
  - Rojo/Azul: 151 especies, 114 con método confirmado y 22 exclusivas (11 por versión).
  - Amarillo: 151 especies, 106 con método confirmado; versión única.
  - Oro/Plata: 251 especies, 164 con método confirmado y 20 exclusivas (10 por versión).
  - Cristal: 251 especies, 170 con método confirmado; versión única.
  - Rubí/Zafiro: 202 especies, 135 con método confirmado y 14 exclusivas (7 por versión).
  - Esmeralda: 202 especies, 129 con método confirmado; versión única.
  - RFVH: 151 especies, 116 con método confirmado y 26 exclusivas (13 por versión).
  - Diamante/Perla: 151 especies, 115 con método confirmado y 14 exclusivas en la dex regional (7 por versión).
  - Platino: 210 especies, 139 con método confirmado; versión única.
  - HeartGold/SoulSilver: 256 especies, 185 con método confirmado y 24 exclusivas en la dex regional (12 por versión).
  - Negro/Blanco: 156 especies, 120 con método confirmado y 18 exclusivas.
  - Negro 2/Blanco 2: 301 especies, 230 con método confirmado y 24 exclusivas.
  - X/Y: 457 especies, 308 con método confirmado y 17 exclusivas.
  - Rubí Omega/Zafiro Alfa: 211 especies, 70 con método confirmado y 8 exclusivas; cobertura de encuentros parcial.
  - Sol/Luna: 302 especies, 216 con método confirmado y 16 exclusivas.
  - Ultrasol/Ultraluna: 403 especies, 300 con método confirmado y 29 exclusivas.
  - Let’s Go: 153 especies, 128 con método confirmado y 22 exclusivas.
  - Espada/Escudo + DLC: 584 especies, 570 con método confirmado y 71 exclusivas.
  - Diamante Brillante/Perla Reluciente: 151 especies, 0 con método confirmado y 14 exclusivas curadas; PokéAPI no publica encuentros.
  - SV: 664 especies y 66 exclusivas curadas; PokéAPI no publica encuentros.
- **Fase 3:** rutas y tablas de encuentros para **18 juegos de Gen I–VIII**.
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
  - Rubí Omega/Zafiro Alfa: 50 localizaciones, 17 de 34 rutas, 91 áreas y 121 encuentros; cobertura parcial de PokéAPI.
  - Sol/Luna: 69 localizaciones, 17 rutas numeradas, 97 áreas y 690 encuentros.
  - Ultrasol/Ultraluna: 73 localizaciones, 17 rutas numeradas, 113 áreas y 900 encuentros.
  - Let’s Go: 40 localizaciones, 25 rutas numeradas, 59 áreas y 573 encuentros.
  - Espada/Escudo + DLC: 84 localizaciones, 10 rutas numeradas, 379 áreas y 12.064 encuentros. Incluye Isla de la Armadura y Nieves de la Corona.
  - Localizaciones en español para Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola y Galar. Los nombres propios de formas o personajes pueden conservar su forma original. En los juegos de Johto, esta región aparece antes del post-game de Kanto.
  - Tablas por método, filtros por versión, niveles, probabilidades y condiciones (hora, plaga, miel, Cabezazo, Zona Safari, monedas, intercambio…).
  - **Progreso HGSS hasta Red:** 20 rutas de Johto (471 encuentros de ruta), 27 de Kanto (507) y Monte Plata (79), con objetivo final en Red (Nv. 88) y su equipo completo.
- **Fase 4:** 4.543 fichas contextuales de 18 juegos.
  - Learnset por nivel del version group, tabla de movimientos y control de nivel 1–100.
  - Evoluciones filtradas por generación: Gen I no muestra Crobat, Espeon/Umbreon ni otras ramas posteriores; RFVH no usa reloj; Gen II–VIII incluyen evolución por hora cuando corresponde.
  - En Gen IV, las evoluciones por localización solo se muestran si el lugar existe en el juego: HGSS no incluye Leafeon/Glaceon.
  - Disponibilidad, habilidades, estadísticas, tipos, descripción y enlaces a rutas.
  - Gen I/II no tienen habilidades. Las habilidades ocultas se muestran desde Gen V, que es cuando se introdujeron.
  - Categorías **Físico / Especial / Otros (estado)**: hasta Gen III se deducen del tipo; desde Gen IV son propias de cada movimiento.
  - **Versiones del Pokémon:** cada especie enlaza entre sus fichas de los juegos donde está disponible, con la versión actual y el número regional de cada juego. El índice cubre 891 especies.
  - **Formas:** 131 variantes especiales en 119 especies (40 regionales, 48 Mega, 32 Gigamax, 11 Totem). La forma base queda separada; cada variante indica si está disponible en el juego actual y los Totem se marcan como encuentro especial.
  - **Movimientos:** pestañas de nivel, MT/MO y tutor por juego. Los movimientos de máquina y tutor se obtienen del version group correspondiente.
  - **Ruta y level caps:** gimnasios de todos los juegos con gimnasios en formato compacto. GSC y HGSS incluyen Johto, Kanto y Red como meta final; Alola no tiene gimnasios. Los caps usan el nivel más alto de cada líder.
  - **Equipos por versión:** base del planificador en `/equipos`, con seis huecos, selección de juego/versión, moveset editable y reordenable, level caps y persistencia local.
  - BDSP no tiene fichas ni rutas por falta de encuentros; SV queda en pausa. Las exclusividades de Gen V–VIII están curadas y las localizaciones están traducidas; las especies fuera de la dex regional se documentan en `docs/COBERTURA_DATOS.md`.
- **Tema visual por juego:** cada generación y juego tiene su propia paleta; Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos, Alola y Galar conservan identidad propia.
- **Próximo:** completar rutas/encuentros de BDSP y SV si aparece una fuente fiable, revisar las formas fuera de la dex y valorar datos de entrenadores más allá de los level caps.

### Roadmap de versiones

- **0.9 (actual):** base de aventura; 20 juegos con dex, 18 con rutas/fichas, formas, MT/tutor, level caps y equipos por versión.
- **1.0:** completar **todos los datos faltantes** documentados en `COBERTURA_DATOS.md`: BDSP/SV, rutas ORAS, disponibilidad incompleta, exclusivas fuera de dex, formas restantes, números de MT, movimientos huevo, entrenadores/combates y DLC de SV.
- **Después de 1.0:** determinar las **MT y tutores disponibles antes de cada gimnasio** y construir un builder perfecto por gimnasio y juego, validando level cap, movimientos legales, disponibilidad y cobertura.

---

## 0. Resumen para decidir

La app actual responde bien a la pregunta **“¿qué Pokémon existe y qué datos tiene?”**. El siguiente salto es responder preguntas de aventura:

- ¿Este Pokémon está disponible en el juego que estoy jugando?
- ¿Dónde lo consigo y en qué versión?
- ¿A qué nivel aparece y con qué probabilidad?
- ¿Qué movimientos aprende y a qué nivel en ese juego?
- ¿Cómo evoluciona aquí y qué requisitos necesito?
- ¿Me conviene para mi equipo y en qué momento de la aventura?

La propuesta es convertir la app en un **compañero de aventura por juego**, no en una Pokédex genérica con un selector decorativo. El juego seleccionado debe ser contexto de primera clase: afecta la Pokédex que ves, las localizaciones, los encuentros, los learnsets, las evoluciones y, más adelante, el planificador de equipo.

### Decisión central recomendada

**No consultar PokéAPI en vivo para las vistas de juego.** Construir una capa de datos propia (snapshots estáticos) generada desde PokéAPI y enriquecida con curaciones de localización y orden de aventura. Motivos:

- La vista actual de 24 tarjetas hace 24 peticiones completas de Pokémon; una respuesta como `/pokemon/25` pesa ~309 KB sin comprimir.
- Los datos de juegos, rutas y learnsets requieren cruzar muchas entidades y no tienen un endpoint agregado.
- Necesitamos nombres en español para localizaciones, que PokéAPI no ofrece.
- Necesitamos que la app sea rápida, reproducible y no dependa de la disponibilidad o los límites de la API en cada visita.

### Alcance recomendado para el primer hito

1. Catálogo de **todos los juegos principales y sus DLC**. Sin Legends ni spin-offs.
2. Datos profundos para los **juegos piloto iniciales** con perfiles distintos:
   - **Pokémon Rojo Fuego / Verde Hoja** (remake, Kanto, GBA, datos clásicos).
   - **Pokémon Esmeralda** (tercera edición, Hoenn, GBA).
   - **Pokémon Escarlata / Púrpura + DLC** (juego base final, Paldea, Switch, La Máscara Teal y El Disco Índigo).
3. Pokédex del juego, disponibilidad, rutas y encuentros, learnsets por nivel, evoluciones y ficha de Pokémon con contexto de juego.
4. El **planificador de equipo** ya tiene una base funcional en `/equipos`; las funciones avanzadas (exportar, Nuzlocke, recomendaciones) quedan para una actualización posterior. El modelo de datos puede seguir creciendo sin rehacer la UI.

Después de validar esos tres juegos, ampliamos al resto de juegos principales y sus DLC. **Estado actual:** la profundidad cubre 18 juegos de Gen I–VIII con rutas y fichas; los 20 juegos tienen Pokédex. BDSP y SV conservan dex/exclusividades por falta de encuentros en PokéAPI.

> **Qué significa “prototipo” aquí:** el catálogo muestra los 20 juegos + 4 DLC desde ahora, pero la profundidad de datos se implementa por fases. La Pokédex, las exclusividades, las rutas y las fichas contextuales cubren Gen I–VIII; BDSP y SV mantienen dex y exclusividades. La cobertura de rutas y traducciones es parcial en algunos juegos y se indica en la interfaz.

---

## 1. Visión y propuesta de valor

### Visión

> Que cualquier jugador pueda abrir PokeNuzlockePlanner al empezar un juego y encontrar, sin hojas de cálculo ni varias wikis, todo lo necesario para planear y disfrutar su aventura.

### Usuarios principales

| Persona | Necesidad |
|---|---|
| Jugador que empieza o retoma un juego | Saber qué Pokémon puede usar y cuándo aparecen. |
| Jugador de aventura / equipo | Planear seis Pokémon, movimientos y evoluciones con un nivel objetivo. |
| Coleccionista | Completar la Pokédex regional y saber dónde buscar cada especie. |
| Jugador de Nuzlocke o retos | Consultar rutas, encuentros, niveles y riesgos con precisión. |
| Fan nostálgico | Redescubrir un juego concreto con datos de su versión. |

### Propuesta de valor

- **Contexto de juego real**, no una Pokédex nacional con filtros superficiales.
- **Respuestas accionables**: ubicación, método, nivel, probabilidad, versión y condiciones.
- **Desarrollo de la aventura**: qué aprende y cuándo, cuándo evoluciona y qué se puede conseguir en cada etapa.
- **En español**, incluyendo nombres de localizaciones y terminología de juego.
- **Rápida y offline-friendly**, gracias a datos precalculados.

### No objetivos de esta etapa

- Simulador de combates, cálculo de daño, IV/EV, naturalezas o competitivo.
- Mapas con coordenadas, sincronización con el juego o emuladores.
- Cuentas de usuario, edición comunitaria en vivo o mercado de intercambios.
- Sustituir una wiki completa de eventos, objetos o misiones secundarias.
- Spin-offs, incluidos los de GameCube (Colosseum y XD), y títulos Legends. No se catalogan en esta etapa.

---

## 2. Objetivos y métricas

### Objetivo general

Convertir PokeNuzlockePlanner en una herramienta de consulta y planificación para la aventura en cada juego principal de Pokémon, manteniendo la calidad visual, el rendimiento y la accesibilidad actuales.

### Objetivos específicos

| ID | Objetivo | Resultado esperado |
|---|---|---|
| O1 | Catálogo de juegos | Todos los juegos principales y sus DLC identificados, agrupados por generación, con nombres en español. Sin Legends ni spin-offs. |
| O2 | Disponibilidad por juego | Para cada juego, saber qué especies están disponibles y por qué método. |
| O3 | Localizaciones y encuentros | Rutas y áreas con tabla de encuentros, niveles, probabilidad, método y condiciones. |
| O4 | Learnsets por juego | Movimientos por nivel para la versión seleccionada y, después, TM, tutor y huevo. |
| O5 | Evoluciones contextualizadas | Requisitos legibles y filtrados por juego, incluyendo ramificaciones. |
| O6 (post-v1) | Plan de aventura | Nivel objetivo, movimientos disponibles, evoluciones y equipo planificado. |
| O7 | Localización y calidad | UI y datos principales en español, con cobertura medida y fallback explícito. |

### Métricas de éxito

| Métrica | Objetivo |
|---|---|
| Tiempo para responder “¿dónde consigo X en este juego?” | ≤ 30 segundos y ≤ 3 clics desde la portada. |
| Cobertura de juegos principales y DLC en el catálogo | 100 % de los títulos incluidos en el alcance. |
| Cobertura de disponibilidad validada en juegos piloto | ≥ 90 % de las especies del dex regional con método/localización. |
| Errores críticos de datos conocidos en juegos piloto | 0. |
| Rendimiento | LCP < 2,5 s en móvil medio; chunk de juego < 300 KB gzip. |
| Accesibilidad | Lighthouse Accessibility = 100 en las vistas principales. |
| Calidad de datos | 0 referencias huérfanas (especies, movimientos, objetos o áreas inexistentes). |
| Cobertura de traducción de localizaciones en juegos piloto | ≥ 95 % de las áreas visitables. |

Las métricas de uso del planificador quedan pendientes de una analítica privacy-friendly; la base ya está implementada y las funciones avanzadas se medirán después.

---

## 3. Casos de uso y flujos

### Historias de usuario principales

1. **Elegir juego**
   - Como jugador, quiero elegir mi juego y ver su información para saber que la app está hablando de mi versión.
   - Aceptación: el juego seleccionado se conserva al navegar y se refleja en la URL.

2. **Consultar la Pokédex del juego**
   - Como jugador, quiero ver solo los Pokémon de mi juego, en el orden de su dex regional.
   - Aceptación: puedo filtrar por tipo, disponibilidad y método; puedo volver al modo nacional.

3. **Buscar un Pokémon en mi juego**
   - Como jugador, quiero buscar “Gengar” y saber si está en mi juego y dónde aparece.
   - Aceptación: si no está, la app lo dice claramente y ofrece el modo nacional.

4. **Consultar una ruta**
   - Como jugador, quiero abrir una ruta y ver todos los encuentros con niveles y probabilidad.
   - Aceptación: la tabla distingue caminando, surf, caña, regalo, estático, intercambio y eventos.

5. **Consultar el desarrollo de un Pokémon**
   - Como jugador, quiero ver a qué niveles aprende movimientos y cuándo evoluciona en este juego.
   - Aceptación: la línea de tiempo respeta el learnset del version group y muestra los requisitos de evolución aplicables.

6. **Comparar versiones**
   - Como jugador, quiero saber qué Pokémon son exclusivos de Rojo y cuáles de Azul.
   - Aceptación: la ficha y los listados marcan las versiones donde está disponible.

7. **Planificar un equipo (post-v1)**
   - Como jugador, quiero añadir Pokémon a un equipo, fijar un nivel y ver qué movimientos tendrían.
   - Aceptación: el plan se guarda por juego y sobrevive a recargas. Se implementa después del lanzamiento.

8. **Consultar sin conexión**
   - Como jugador, quiero volver a abrir el plan y los datos del juego sin conexión.
   - Aceptación (fase posterior): los datos del juego visitado quedan en caché local.

### Flujo principal

```text
Inicio / Pokédex nacional
   └── Elegir juego
         ├── Resumen del juego
         ├── Pokédex del juego
         │     └── Pokémon
         │           ├── Disponibilidad y localizaciones
         │           ├── Learnset y evoluciones
         │           └── Añadir a equipo / biblioteca
         ├── Rutas y encuentros
         │     └── Detalle de ruta
         └── Planificador de aventura (`/equipos`)
               └── Equipo guardado
```

---

## 4. Alcance funcional por fases

### Prioridades MoSCoW

| Prioridad | Capacidad |
|---|---|
| **Must** | Catálogo de juegos principales + DLC, selección persistente, Pokédex regional, disponibilidad básica, rutas/encuentros, learnset por nivel, evoluciones, fichas con contexto de juego, español en la UI y datos principales. |
| **Should** | Exclusividades por versión, métodos regalo/estático/intercambio, learnset TM/tutor/huevo, orden de aventura curado, biblioteca con estado por juego, cobertura completa del DLC de Escarlata/Púrpura. |
| **Could** | Formas regionales y variantes, comparador de juegos, reporte de errores, detalle de eventos. |
| **Post-v1** | Planificador avanzado (exportar/compartir, recomendaciones, Nuzlocke), cobertura de tipos y PWA offline. |
| **Won't (v1)** | Legends y spin-offs (incluidos Colosseum/XD), calculadora de combate, IV/EV, sincronización con partidas, mapas geográficos, cuentas, edición comunitaria en vivo. |

### Fases

#### Fase 0 — Decisiones y prueba técnica

**Entregables**

- Confirmar el alcance detallado de los juegos piloto ya aprobados.
- Confirmar estrategia de datos estáticos y formato de snapshots.
- Prueba de ingestión de un juego completo (por ejemplo, Rojo Fuego) y medición de tiempos/tamaños.
- Definir diccionario inicial de localizaciones y regiones.
- Documentar las convenciones de JavaScript, JSDoc y validación con Zod.
- Confirmar la cobertura del DLC de Escarlata/Púrpura (dex, rutas y learnsets).
- Definir la terminología en español de España (`es-ES`).

**Criterio de salida:** un dataset de prueba del juego piloto generado, validado y consumido por una pantalla mínima.

#### Fase 1 — Catálogo de juegos y navegación

**Entregables**

- Página `/juegos` agrupada por generación.
- Tarjetas de juego con nombre en español, versión(es), región, generación y estado de datos.
- Selección de juego persistida y reflejada en URL.
- Navbar actualizada y navegación móvil.
- Migración de favoritos a un esquema compatible con juego opcional.

**Criterio de salida:** se puede entrar a cualquier juego principal o DLC catalogado y ver su resumen, aunque algunas pestañas indiquen “datos en preparación”.

#### Fase 2 — Pokédex del juego y disponibilidad

**Entregables**

- Pokédex regional con número local, tipos, sprite y estado de disponibilidad.
- Filtros por tipo, método, exclusividad y texto.
- Ficha de Pokémon con contexto de juego: disponible / no disponible, versiones, métodos.
- Comparación de exclusividades entre versiones del mismo grupo.
- Datos de disponibilidad derivados de dex + encuentros + regalos/estáticos + curaduría.

**Criterio de salida:** en los juegos con encuentros publicados, ≥ 90 % de cobertura donde PokéAPI lo permita; la interfaz muestra la cobertura real. En BDSP y SV, dex y exclusividades completas; los encuentros quedan pendientes por la falta de datos en PokéAPI.

#### Fase 3 — Rutas, localizaciones y encuentros de Gen I–VIII

**Entregables**

- Listado de rutas/áreas para 18 juegos, agrupado por tipo y ordenado por aventura y número de ruta.
- Detalle de zona con tabla de encuentros: especie, método, nivel mínimo/máximo, probabilidad, condiciones y versión.
- Filtros por método, tipo de zona y versión.
- Nombres de localización en español para Kanto, Johto y Hoenn.
- Indicadores de regalo, estático, intercambio y condiciones especiales (hora, plaga, monedas, intercambio…).
- SV: rutas en pausa hasta decidir una fuente de encuentros adicional.

**Criterio de salida:** todas las zonas con datos de Gen I–VIII tienen nombre (en español o marcado EN), al menos un encuentro y una tabla navegable; las rutas numeradas coinciden con la cobertura publicada por PokéAPI. ORAS se marca como cobertura parcial.

**Criterio de salida:** todas las áreas visitables de los juegos piloto tienen nombre en español y tabla de encuentros validada.

#### Fase 4 — Learnsets, evoluciones y ficha contextual

**Entregables**

- Learnset por nivel del version group seleccionado.
- Línea evolutiva con requisitos normalizados y aplicables al juego.
- Línea de tiempo “nivel → movimientos → evolución”.
- Selector de nivel para previsualizar el estado del Pokémon.
- Nombres en español de movimientos, habilidades y objetos vía API/curación.
- Pestañas de TM/tutor/huevo (si la fase se extiende).

**Criterio de salida:** un jugador puede resolver “qué aprende y cuándo evoluciona” para cualquier Pokémon disponible en los juegos piloto.

**Implementado en Gen I–VIII:** 4.543 fichas individuales de 18 juegos, con learnset, evoluciones, nivel, habilidades, estadísticas y disponibilidad. Gen I/II no tienen habilidades; las ocultas aparecen desde Gen V. Las categorías Físico/Especial/Otros se deducen del tipo hasta Gen III y son propias de cada movimiento desde Gen IV. BDSP no tiene fichas por falta de encuentros. TM/tutor/huevo quedan para una ampliación posterior.

#### Fase 5 — Cobertura, calidad y lanzamiento

**Entregables**

- Ampliación al resto de juegos principales y sus DLC.
- Validación de datos y cobertura de traducciones.
- Pruebas E2E, auditoría de accesibilidad y presupuesto de rendimiento.
- PWA/caché offline (si se aprueba).
- Documentación de datos, atribución y reporte de errores.

**Criterio de salida:** catálogo completo, datos validados, documentación publicada y build de producción estable.

> **Estimación orientativa:** 5 a 7 semanas de una persona para el MVP (Fases 0–5). Las fases 1–3 pueden solaparse parcialmente.

#### Fase 6 — Post-v1: planificador de aventura y biblioteca avanzada

> **Fuera del alcance del MVP.** Se implementa después de la entrega estable y no bloquea el lanzamiento.

**Entregables**

- Equipo de hasta 6 Pokémon por juego.
- Nivel objetivo global o por Pokémon.
- Movimientos recomendados/disponibles al nivel, evoluciones pendientes y cobertura de tipos.
- Estado de la biblioteca: favorito global, “en mi equipo”, “capturado”, “planeado”.
- Persistencia local y exportación/importación JSON.

**Criterio de salida (post-v1):** el plan de equipo se conserva, se puede revisar al reabrir la app y no pierde datos al cambiar de juego.

> **Estimación orientativa post-v1:** 1 a 2 semanas adicionales.

---

## 5. Experiencia de usuario

### Nomenclatura de juegos y versiones

Las parejas de versiones se muestran juntas y separadas por “/”:

- Pokémon Rojo Fuego / Verde Hoja
- Pokémon Escarlata / Púrpura
- Pokémon Escarlata / Púrpura — El Tesoro Oculto del Área Cero (La Máscara Teal + El Disco Índigo)

Modelo de interacción:

- Un **Game** representa el version group (por ejemplo, `firered-leafgreen`) y es la unidad de navegación.
- Un **Version** representa cada edición (por ejemplo, `firered` o `leafgreen`) y se elige con un selector dentro del juego.
- La tarjeta del catálogo usa “/” para mostrar la pareja; el detalle conserva el selector para ver exclusividades, encuentros y diferencias.
- La URL mantiene el grupo y, opcionalmente, la versión: `/juegos/firered-leafgreen?version=firered`.
- Si no hay versión seleccionada, se muestra la unión de ambas y se marcan las diferencias con etiquetas “Solo Rojo Fuego” / “Solo Verde Hoja”.
- Los DLC se anidan bajo el juego base y conservan su propia dex, localizaciones y learnsets, sin duplicar especies en el listado principal.

### Tema visual por juego

Cada juego tiene un tema de dos colores que tiñe las tarjetas, la ficha, la Pokédex y las rutas:

| Juego | Primario | Secundario |
|---|---|---|
| Rojo Fuego / Verde Hoja | Naranja fuego | Verde hoja |
| Esmeralda | Verde esmeralda | Teal |
| Escarlata / Púrpura | Violeta | Naranja |

- `getGameTheme(game)` devuelve `{ primary, secondary }`.
- Si un juego no tiene tema propio, se usa el color de su generación.
- Los colores se aplican con variables CSS (`--gen-color`, `--gen-color-2`), sin duplicar estilos por juego.
- La paleta global sigue siendo oscura; el color del juego es un acento, no un cambio de tema completo.

### Mapa de navegación propuesto

| Ruta | Propósito |
|---|---|
| `/` | Inicio con Pokédex nacional y acceso destacado a “Elige tu juego”. |
| `/juegos` | Catálogo de juegos por generación. |
| `/juegos/:gameId` | Resumen del juego y accesos a sus secciones. |
| `/juegos/:gameId/pokedex` | Pokédex regional con disponibilidad. |
| `/juegos/:gameId/rutas` | Rutas y áreas con encuentros. |
| `/juegos/:gameId/rutas/:areaId` | Tabla detallada de una ruta. |
| `/juegos/:gameId/pokemon/:name` | Ficha de Pokémon con contexto de juego. |
| `/equipos` | Equipo por juego/versión, moveset y level caps. |
| `/pokemon/:name` | Ficha nacional actual, con selector para abrirla en un juego. |
| `/biblioteca` | Favoritos y estados de colección. |

### Piezas de interfaz

#### Catálogo de juegos

- Agrupación por generación con una línea temporal.
- Tarjeta con nombre oficial en español, edición(es), región, año y estado de datos.
- Chips: “Principal”, “DLC”, “Datos completos”, “Datos parciales”.
- Buscador por juego, región o generación.
- Sin portadas oficiales en el MVP: tarjetas tipográficas con color de generación para evitar dependencias de assets externos.

#### Resumen del juego

- Cabecera con nombre, generación, región, versiones y selector de versión.
- Los DLC se muestran como secciones dentro del juego base, con su propia dex y localizaciones.
- Acciones rápidas: “Ver Pokédex”, “Buscar en rutas”, “Comparar versiones”.
- Datos destacados: número de especies, rutas, exclusivas, movimientos y evoluciones.
- Aviso de cobertura: “Datos completos” o “En preparación”, con enlace a incidencias.

#### Pokédex del juego

- Orden por dex regional, no por ID nacional.
- Filtros: tipo, disponibilidad, método, versión, solo exclusivas, búsqueda.
- Tarjeta con número regional, artwork, nombre en español, tipos y método principal.
- Estados vacíos claros: “Este Pokémon no aparece en Esmeralda” + “Ver en la Pokédex nacional”.

#### Rutas y encuentros

- Lista ordenada por progresión de aventura cuando exista orden curado.
- Cada ruta muestra: nombre en español, número de especies, métodos disponibles y rango de niveles.
- Tabla de encuentros con columnas: Pokémon, método, niveles, probabilidad, versión, condiciones.
- Agrupación por método (caminando, surf, caña, regalo, estático, intercambio).
- En móvil, tabla convertida en tarjetas apiladas; nunca scroll horizontal para leer datos esenciales.

#### Ficha contextual de Pokémon

- Cabecera existente + contexto de juego.
- Bloque “Dónde encontrarlo” con rutas, niveles y métodos.
- Bloque “Desarrollo en este juego”: timeline de nivel con movimientos y evolución.
- “Disponible en”: versiones del grupo.
- “Comparar con otro juego”: acceso secundario.
- Botón: “Guardar en biblioteca”.
- Botón “Añadir al equipo”: **post-v1**, cuando exista el planificador.

#### Planificador (base implementada)

> Esta sección describe la actualización posterior. No forma parte del MVP.

- Seis ranuras de equipo.
- Nivel objetivo con slider 1–100 y atajos por medallas si existe orden curado.
- Para cada Pokémon: movimientos disponibles al nivel, evolución pendiente, tipo y rol.
- Panel de cobertura de tipos del equipo.
- Estado vacío con sugerencia de Pokémon disponibles en la primera ruta.
- Guardado local por juego y exportación JSON.

---

## 6. Modelo de dominio

### Entidades principales

> Los esquemas se muestran en notación tipo TypeScript únicamente como documentación. La implementación será **JavaScript + JSDoc**, con validación Zod en el pipeline y en la carga de datos.

```ts
type GameCategory = 'main' | 'dlc';
type DataQuality = 'complete' | 'partial';
type AvailabilityMethod =
  | 'wild'
  | 'gift'
  | 'static'
  | 'trade'
  | 'event'
  | 'unknown'
  | 'other';

interface RegionRef {
  id: string;
  name: string;
}

interface VersionRef {
  id: string;
  name: string;
}

interface PokedexRef {
  id: string;
  name: string;
  isDlc?: boolean;
}

interface Game {
  id: string;                 // version group, ej. "firered-leafgreen"
  name: string;               // nombre en español
  generation: number;
  region: RegionRef;
  versions: VersionRef[];
  pokedexes: PokedexRef[];
  category: GameCategory;
  dataQuality: DataQuality;
  releaseYear?: number;
  adventureOrder?: string[];  // ids de localizaciones (curado)
}

interface GamePokedexEntry {
  speciesId: number;
  slug: string;               // nombre interno de PokéAPI
  pokemonId: number;          // variedad por defecto
  nationalNumber: number;
  name: string;               // español
  types: string[];
  image: string;
  regionalNumbers: Array<{
    dexId: number;
    dexName: string;
    number: number;
    dexOrder: number;
  }>;
  availability: Record<string, VersionAvailability>;
  methods: AvailabilityMethod[];
  exclusiveTo: string[];      // ids de versiones base
  exclusiveNote?: string | null;
  hasConfirmedAvailability: boolean;
}

interface VersionAvailability {
  known: boolean;             // false = la API no cubre este juego/versión
  methods: AvailabilityMethod[];
  locationCount: number;
  locations: AvailabilityLocation[];
}

interface AvailabilityLocation {
  areaId: string;
  areaName: string;
  areaNameFallback: boolean;
  method: string;             // método interno de PokéAPI
  methodGroup: AvailabilityMethod;
  minLevel?: number;
  maxLevel?: number;
  chance?: number;
  versionId: string;
  baseVersionId: string;
  contentId: string;          // base o DLC
  contentName: string;
  conditions: string[];
}

interface GamePokedexData {
  gameId: string;
  encounterDataAvailable: boolean;
  exclusivitySource: 'curated' | 'encounters' | null;
  dataQuality: DataQuality;
  entryCount: number;
  availableCount: number;
  exclusiveCount: number;
  entries: GamePokedexEntry[];
}

interface RouteLocation {
  locationId: string;
  name: string;
  nameFallback: boolean;
  kind: 'route' | 'town' | 'dungeon' | 'other';
  order: number | null;
  subAreas: string[];
  methods: AvailabilityMethod[];
  versions: string[];
  minLevel: number | null;
  maxLevel: number | null;
  speciesCount: number;
  encounterCount: number;
  encounters: RouteEncounter[];
}

interface RouteEncounter {
  speciesId: number;
  pokemonId: number;
  nationalNumber: number;
  name: string;
  types: string[];
  image: string;
  method: string;
  methodGroup: AvailabilityMethod;
  minLevel: number | null;
  maxLevel: number | null;
  chance: number | null;
  versions: string[];
  conditions: string[];
  exclusiveTo: string[];
  subAreas: string[];
}

interface EncounterArea {
  id: string;
  locationId: string;
  displayName: string;        // "Ruta 1"
  regionId: string;
  order?: number;
  encounters: Encounter[];
}

interface Encounter {
  speciesId: number;
  pokemonId: number;
  method: string;             // walk, surf, old-rod, gift...
  minLevel: number;
  maxLevel: number;
  chance: number;
  versions: string[];
  conditions: string[];
}

interface LearnsetEntry {
  moveId: number;
  moveName: string;           // español
  method: 'level-up' | 'machine' | 'egg' | 'tutor' | 'other';
  level: number;              // 0 en métodos que no son por nivel
  versionGroup: string;
}

interface EvolutionNode {
  speciesId: number;
  name: string;
  methods: EvolutionMethod[];
  children: EvolutionNode[];
}

interface EvolutionMethod {
  trigger: string;
  versionGroup?: string;
  minLevel?: number;
  item?: string;
  heldItem?: string;
  happiness?: number;
  timeOfDay?: 'day' | 'night';
  location?: string;
  knownMove?: string;
  knownMoveType?: string;
  trade?: boolean;
  specialConditions?: string[];
  rawConditions?: Record<string, unknown>;
}

interface AdventurePlan {
  // Post-v1: no forma parte del MVP.
  gameId: string;
  level: number;
  team: Array<{
    speciesId: number;
    pokemonId: number;
    level?: number;
    selectedMoves?: number[];
  }>;
  updatedAt: number;
}
```

### Reglas de disponibilidad

Una especie se considera disponible en un juego si cumple al menos una condición:

1. Aparece en algún encuentro del version group (caminando, surf, caña, regalo, estático, intercambio…).
2. Está en el dex regional y existe una entrada de regalo/estático/intercambio en los datos.
3. Está marcada en una lista curada de eventos o casos especiales.
4. En caso contrario, se muestra como **no disponible** o **sin datos**, nunca como disponible por defecto.

Estados de UI:

- **Salvaje**: al menos un encuentro que no sea regalo/estático.
- **Regalo**: solo métodos de regalo.
- **Estático**: legendario o encuentro fijo.
- **Intercambio**: NPC o intercambio especial.
- **Evento**: curado; no implica disponibilidad offline actual.
- **Sin datos**: aparece en el dex pero no hay encuentro validado; requiere revisión.

### Exclusividad entre versiones

La exclusividad se modela **por versión base**, no por version group. Una pareja como Rojo Fuego / Verde Hoja comparte dex y learnset, pero cada edición tiene encuentros y exclusivas distintas.

Reglas:

1. Una especie es exclusiva de una versión si tiene disponibilidad confirmada en esa versión y no en la otra.
2. Si falta cobertura de encuentros para una versión, la especie se marca como **sin datos**, nunca como exclusiva por inferencia.
3. Regalos, estáticos e intercambios cuentan como disponibilidad. Un Pokémon obtenible por intercambio en la otra versión no se considera exclusivo estricto.
4. Las evoluciones heredan la exclusividad de su línea cuando la lista curada lo indica.
5. Las listas curadas se usan cuando PokéAPI no cubre todos los métodos o directamente no publica encuentros.
6. En parejas con DLC, la comparación agrupa todo el contenido de cada versión; cada DLC conserva su propia dex para filtrar.
7. Las formas se tratan aparte: Tauros tiene formas exclusivas por versión, pero la especie está en ambas. Vulpix y Sandshrew tienen forma base exclusiva, mientras sus formas de Alola están en ambas versiones.

Campos del dato:

```json
{
  "availability": {
    "firered": {
      "known": true,
      "methods": ["wild", "gift"],
      "locationCount": 6,
      "locations": []
    },
    "leafgreen": {
      "known": true,
      "methods": [],
      "locationCount": 0,
      "locations": []
    }
  },
  "exclusiveTo": ["firered"],
  "exclusiveNote": null,
  "hasConfirmedAvailability": true
}
```

Fuente de exclusividades por piloto:

| Juego | Fuente | Resultado |
|---|---|---|
| Rojo Fuego / Verde Hoja | Lista curada + encuentros de PokéAPI | 13 + 13 exclusivas |
| Esmeralda | Versión única | Sin exclusividades de pareja |
| Escarlata / Púrpura + DLC | Lista curada (PokéAPI sin encuentros) | 33 + 33 exclusivas |

En la interfaz:

- Selector **Ambas / versión** en la Pokédex.
- Insignia **“Solo Rojo Fuego”**, **“Solo Verde Hoja”**, **“Solo Escarlata”** o **“Solo Púrpura”**.
- Filtro “Solo exclusivos”.
- Al seleccionar una versión, se ocultan las exclusivas de la otra y las estadísticas se recalculan para esa versión.
- La ficha puede mostrar una nota para casos de forma o evento.

> **Limitación conocida:** PokéAPI no publica encuentros de Escarlata/Púrpura. Por eso la disponibilidad de SV es parcial y las exclusividades son curadas. La Fase 3 abordará las rutas con una fuente adicional o curaduría.

### Casos de DLC

Los casos de DLC se agrupan bajo el juego base, pero conservan su propia dex y su propio version group para no mezclar mapas ni learnsets. La comparación de exclusividades de una pareja incluye el contenido base y sus expansiones.

---

## 7. Datos: validación, fuentes y pipeline

### Hallazgos de la validación (22/10/2026)

| Dato | Resultado |
|---|---|
| Version groups | 32 |
| Pokédexes | 35 |
| Pokémon (formas incluidas) | 1.351 |
| Especies | 1.025 |
| Movimientos | 937 |
| Habilidades | 374 |
| Objetos | 2.223 |
| Localizaciones | 1.104 |
| Áreas de localización | 1.539 |
| Cadenas evolutivas | 540 |
| Regiones | 11 (incluye Orre) |

Verificaciones importantes:

- **`/game` no está disponible**: devuelve error 400. Los juegos deben modelarse con `/version-group` y `/version`.
- **Nombres en español disponibles** para versiones, especies, movimientos, habilidades y objetos (`names[]`).
- **Nombres de localizaciones sin español**: por ejemplo, `/location/pallet-town` solo trae `en`, `fr` y `de`. Es imprescindible una curación propia.
- **Los encuentros incluyen regalos**: `/location-area/pallet-town-area` registra a Bulbasaur como `gift` en Rojo/Azul, lo que permite derivar starters.
- **Learnsets por version group**: Pikachu tiene 7 movimientos por nivel en Rojo/Azul y 20 en Escarlata/Púrpura.
- **Evoluciones ramificadas**: Eevee tiene 8 ramas con condiciones distintas y `version_group` en cada detalle.
- **Las 32 entradas de `version-group` incluyen categorías fuera del alcance**: DLC, spin-offs, versiones japonesas y entradas no principales. El catálogo debe filtrar explícitamente para mostrar solo Main Game + DLC y no asumir la misma profundidad de datos para todas.
- **Peso de los payloads**: `/pokemon/25` ≈ 309 KB, `/pokemon/25/encounters` ≈ 86 KB, `/location-area/pallet-town-area` ≈ 55 KB, `/pokedex/paldea` ≈ 47 KB, `/evolution-chain/67` ≈ 19 KB.
- **Escarlata / Púrpura no tienen encuentros publicados**: las consultas de `/pokemon/{id}/encounters` y las áreas de Paldea devuelven vacío. La dex y los learnsets sí están disponibles; la disponibilidad de rutas requiere otra fuente o curaduría.

### Particularidades de DLC y alcance

- **Escarlata / Púrpura:** el version group base (`scarlet-violet`) ya incluye las dex `paldea`, `kitakami` y `blueberry`, mientras que `the-teal-mask` y `the-indigo-disk` también existen como version groups separados. El catálogo debe mostrar una ficha del juego base con secciones de DLC y evitar duplicar especies, encuentros o learnsets.
- **DLC:** se anidan bajo el juego base y conservan su propia dex, localizaciones y learnsets. No se cuentan como juegos independientes en las métricas.
- **Spin-offs, Legends y entradas no principales:** quedan fuera del catálogo, aunque aparezcan en `/version-group`. Se filtran explícitamente.
- **Versiones japonesas:** `red-green-japan` y `blue-japan` no se muestran como juegos separados; se conservan como metadata si hacen falta para datos.

### Mapeo de endpoints

| Necesidad | Endpoint | Campos clave | Notas |
|---|---|---|---|
| Catálogo de juegos | `/version-group`, `/version` | `versions`, `generation`, `regions`, `pokedexes`, `names` | No usar `/game`. |
| Dex regional | `/pokedex/{id}` | `pokemon_entries`, `entry_number`, `pokemon_species` | Cada juego puede tener varias dex (base + DLC). |
| Especie y nombres | `/pokemon-species/{id}` | `names`, `varieties`, `evolution_chain`, `generation` | Nombre español y variedad por defecto. |
| Tipos y stats | `/pokemon/{id}` | `types`, `stats`, `abilities`, `sprites` | Evitar en listas; usar resumen precalculado. |
| Learnset | `/pokemon/{id}` | `moves[].version_group_details` | Filtrar por version group y método. |
| Movimientos | `/move/{id}` | `names`, `type`, `power`, `accuracy`, `pp`, `damage_class` | Precalcular catálogo en español. |
| Habilidades | `/ability/{id}` | `names`, `effect_entries` | Precalcular catálogo. |
| Objetos evolutivos | `/item/{id}` | `names`, `sprites` | Piedras, cordones, etc. |
| Evoluciones | `/evolution-chain/{id}` | `chain`, `evolution_details` | Normalizar todas las condiciones. |
| Áreas y encuentros | `/location-area/{id}` | `pokemon_encounters`, `version_details`, `encounter_details` | Fuente principal de rutas. |
| Localizaciones | `/location/{id}` | `areas`, `region`, `names` | Nombres en español curados. |
| Regiones | `/region/{id}` | `locations`, `pokedexes`, `names` | Nombres en español curados. |
| Métodos de encuentro | `/encounter-method` | `name` | Diccionario de traducción. |
| Tipos | `/type/{id}` | `damage_relations` | Para cobertura de tipos futura. |

### Por qué snapshots y no consultas en vivo

1. **Volumen**: mostrar una lista de 24 Pokémon con `/pokemon/{id}` completo implica descargar varios MB y datos que la tarjeta no usa.
2. **Agregación**: no existe un endpoint “todos los encuentros de Esmeralda” ni “learnset de Escarlata”.
3. **Latencia y límites**: la experiencia no debe depender de la latencia de una API externa ni de sus límites.
4. **Localización**: hay que enriquecer con diccionarios propios que la API no tiene.
5. **Reproducibilidad**: un dataset versionado permite pruebas, validación y despliegues estables.
6. **Offline**: los snapshots se pueden cachear y servir como PWA en el futuro.

### Pipeline de datos propuesto

```text
PokéAPI
  │
  ├── 1. Fetch con caché cruda (.cache/pokeapi, fuera de git)
  ├── 2. Normalización a entidades propias
  ├── 3. Traducción y curaduría (locations.es, regiones, juegos, métodos)
  ├── 4. Validación de esquemas y referencias
  ├── 5. Emisión de snapshots JSON + manifest
  └── 6. Consumo estático desde la app
```

Características del script de ingestión:

- Escrito en Node.js, sin backend.
- Fetch con concurrencia limitada (4–8), reintentos con backoff y respeto de rate limits.
- Caché de respuestas crudas para poder iterar sin volver a descargar todo.
- Validación con Zod en el pipeline (dependencia de desarrollo; la app puede seguir en JS).
- Salida determinista: mismo input, mismo output, ideal para revisar diffs.
- Manifest con versión del dataset, fecha, conteos y cobertura de traducción.

### Salida de datos propuesta

```text
public/data/v1/
  manifest.json
  games.json
  games/
    firered-leafgreen.json
    emerald.json
    scarlet-violet.json
  encounters/
    firered-leafgreen.json
    emerald.json
    scarlet-violet.json
  learnsets/
    firered-leafgreen.json
    emerald.json
    scarlet-violet.json
  routes/
    firered-leafgreen.json
    emerald.json
  pokemon/
    index.json
    firered-leafgreen/
      1.json
      2.json
    emerald/
      252.json
  evolutions.json
  moves.json
  abilities.json
  items.json
  locations.json
  regions.json
  search-index.json
```

Presupuesto orientativo por juego:

| Archivo | Tamaño objetivo (gzip) |
|---|---|
| Resumen del juego + dex | < 100 KB |
| Encuentros | < 250 KB |
| Learnsets por nivel | < 200 KB |
| Catálogo de movimientos | < 150 KB |
| Evoluciones | < 150 KB |

La app carga solo el juego activo y el catálogo mínimo; el resto se solicita por demanda.

### Curaduría necesaria

| Dataset | Motivo | Estrategia inicial |
|---|---|---|
| Nombres de juegos | `version-group` no tiene nombres ni etiquetas comerciales | Diccionario manual en español. |
| Nombres de regiones | La API no trae `es` | Diccionario manual. |
| Nombres de localizaciones | La API no trae `es` | Diccionario por juego/región; priorizar juegos piloto. |
| Orden de aventura | No existe orden cronológico fiable | Curaduría por juego, con `game_index` solo como pista. |
| Niveles de gimnasios / progreso | No están en la API | Curaduría opcional, post-v1. |
| Exclusividades y eventos | No siempre derivables | Overrides curados y campo `source`. |
| Métodos de encuentro | Nombres internos en inglés | Diccionario de traducción. |
| Formas regionales | La variedad por defecto no cubre todas las formas | Fase posterior; marcar como pendiente. |

---

## 8. Localización

### Lo que ya ofrece PokéAPI

- Nombres de versiones en español (`Rojo`, `Espada`, `Escarlata`).
- Nombres de especies en español.
- Nombres de movimientos (`Impactrueno`, `Rayo`).
- Nombres de habilidades (`Electricidad Estática`, `Mar Llamas`).
- Nombres de objetos (`Piedra Agua`, `Piedra Trueno`).

### Lo que falta

- Nombres de localizaciones y regiones.
- Nombres de métodos de encuentro.
- Etiquetas de condiciones evolutivas.
- Terminología de UI y mensajes.
- Nombres comerciales de version groups y DLC.

### Estrategia

1. **Diccionario de UI** en español, centralizado.
2. **Diccionario de datos curados** para juegos, regiones, localizaciones y métodos.
3. **Uso de `names[es]`** cuando exista, con fallback a inglés si falta.
4. **Nunca mostrar un identificador interno** como `kanto-route-2-south-towards-viridian-city`; si falta traducción, mostrar el nombre en inglés con una etiqueta de “nombre sin traducir”.
5. **Reporte de cobertura**: el pipeline debe indicar cuántas localizaciones de cada juego tienen nombre en español.
6. **Glosario y revisión**: mantener un glosario de términos (ruta, encuentro, regalo, estático, huevo, tutor, TM, MO, etc.) para consistencia.
7. **Locale**: `es-ES` para toda la interfaz y los datos curados. No se implementa `es-419` por ahora.

### Prioridad de traducción

1. Juegos piloto (FRLG, Esmeralda, Escarlata/Púrpura + DLC).
2. Regiones y localizaciones principales de todos los juegos.
3. Métodos y condiciones.
4. Nombres de objetos y movimientos especiales.
5. Contenido de eventos, textos secundarios y DLC.

---

## 9. Arquitectura y cambios sobre el código actual

### Estado actual

- React 18 + Vite 6, JavaScript.
- React Router 7.
- Fetch con caché de promesas en memoria.
- Páginas: Pokédex nacional, detalle, biblioteca.
- Favoritos en `localStorage`.
- CSS propio, sin librería de componentes.

### Arquitectura propuesta

```text
src/
  api/                  Cliente PokéAPI (solo pipeline o fallback)
  data/
    curated/            Juegos, regiones, localizaciones, métodos
    generated/          Tipos y constantes derivadas (si aplica)
  domain/               Normalización, disponibilidad, evoluciones
  schemas/              Esquemas Zod de los snapshots
  services/             Carga de snapshots, caché, índices
  hooks/                useGame, useGamePokedex, useEncounters, useLearnset
  context/              GameProvider, FavoritesProvider
  components/           GameCard, GameSwitcher, EncounterTable, LevelTimeline...
  pages/
    Pokedex
    PokemonDetail
    Games
    GameDetail
    GamePokedex
    GameRoutes
    GameRouteDetail
    Planner (post-v1)
    Library
  utils/                Formatos, traducción, fechas
scripts/
  build-data.mjs        Pipeline de snapshots
  validate-data.mjs     Validación e informe de cobertura
```

### Decisiones de estado

- **GameProvider** para el juego activo, persistido en `localStorage` y sincronizado con la URL.
- **URL como fuente de verdad** para el juego y las vistas; el contexto solo mantiene la selección por defecto.
- **Favoritos** se mantiene global, con campos opcionales `gameIds` y `status` (`saved`, `planned`, `caught`). El equipo vive en `AdventurePlan`, no dentro del favorito.
- **Planificador** en `/equipos`, con persistencia por juego/versión; las funciones avanzadas quedan para después.
- No introducir Redux: el estado es acotado y las rutas ya organizan la mayor parte.

### Lenguaje: JavaScript (decidido)

La implementación será en **JavaScript moderno (ES2022+) con JSX**, sin TypeScript. La decisión prioriza la velocidad de entrega, la continuidad con la base actual y la ausencia de una migración.

**Ventajas que aprovechamos**

- Arranque inmediato de la Fase 1 sin configuración adicional.
- Continuidad total con los componentes, hooks y utilidades existentes.
- Menos ceremonia para prototipos y pantallas nuevas.
- El equipo ya conoce el lenguaje y la herramienta.
- Vite sigue encargándose del build sin cambios.

**Riesgos y mitigaciones**

| Riesgo de JavaScript | Mitigación |
|---|---|
| Datos anidados y campos mal escritos | Contratos con JSDoc (`@typedef`) para las entidades principales y convenciones de nombres (`speciesId`, `pokemonId`, `versionGroup`). |
| Respuestas de PokéAPI con formas inesperadas | Esquemas Zod en el pipeline y en la carga de snapshots; fallar con un error claro. |
| Refactorizaciones silenciosas | Módulos pequeños, pruebas unitarias de normalización y E2E de los flujos críticos. |
| Errores que solo aparecen en runtime | Validación de datos en los límites del sistema y estados de error explícitos en la UI. |
| Deriva de documentación | JSDoc junto al código y esquemas versionados en `docs/` o `scripts/`. |

**Comparativa que sustentó la decisión**

| Criterio | TypeScript | JavaScript |
|---|---|---|
| Seguridad estática | Alta. | Baja; depende de pruebas y validación runtime. |
| Autocompletado y refactorización | Excelente. | Limitado. |
| Velocidad inicial | Menor por configuración y tipos. | Inmediata. |
| Curva de aprendizaje | Mayor. | Conocida por el equipo. |
| Mantenimiento de datos complejos | Más seguro. | Requiere disciplina y JSDoc. |
| Validación de la API | Necesita Zod igualmente. | Zod cubre el contrato en runtime. |

**Decisión:** JavaScript. Se acepta menor seguridad estática a cambio de velocidad y continuidad; se compensa con **JSDoc + Zod + pruebas**. Si en el futuro el dominio se vuelve inmanejable, se puede reevaluar TypeScript sin reescribir la app de golpe.

### Cambios en favoritos

Esquema actual:

```json
{ "id": 25, "name": "pikachu", "image": "...", "types": ["electric"], "addedAt": 0 }
```

Esquema propuesto, compatible:

```json
{
  "id": 25,
  "name": "pikachu",
  "image": "...",
  "types": ["electric"],
  "addedAt": 0,
  "gameIds": ["firered-leafgreen"],
  "status": "planned"
}
```

Migración: leer `v1`, completar campos y guardar como `v2`, conservando los favoritos existentes. Los estados `planned` y `caught` son opcionales; los favoritos antiguos se interpretan como `saved`.

### Rendimiento

- Precargar solo el catálogo de juegos y el resumen del juego activo.
- Cargar encuentros y learnsets por juego bajo demanda y cachearlos.
- No descargar `/pokemon/{id}` completo para listas; usar resúmenes precalculados.
- Imágenes con `loading="lazy"` y tamaños explícitos.
- Abortar peticiones al cambiar de juego.
- Presupuesto: < 300 KB gzip para la primera vista de un juego, sin contar imágenes.
- Mantener Lighthouse ≥ 90 en Performance y 100 en Accessibility como objetivo.

### Manejo de errores y datos incompletos

- Estado “Datos en preparación” visible y honesto.
- Botón “Reportar un error” con contexto del juego, especie y ruta.
- Fallback a Pokédex nacional si el juego no tiene datos profundos.
- Errores de carga de snapshot con reintento y mensaje claro.
- Validación previa al despliegue: ningún enlace roto entre especies, movimientos, objetos y localizaciones.

---

## 10. Plan de calidad y pruebas

### Pruebas del pipeline

- Validación de esquema de todos los snapshots.
- Integridad referencial: especies, movimientos, objetos, áreas y cadenas.
- Duplicados en dex regional y encuentros.
- Cobertura de traducción por juego.
- Comparación de conteos contra la API.
- Pruebas de regresión con fixtures de un juego pequeño.

### Pruebas de aplicación

- **Unitarias:** normalización de disponibilidad, condiciones evolutivas, formato de niveles, exclusividades.
- **Integración:** carga de snapshots, filtros combinados, selector de juego y migración de favoritos.
- **E2E (Playwright):**
  - Elegir juego y conservarlo al recargar.
  - Buscar Pokémon y ver disponibilidad correcta.
  - Abrir ruta y filtrar encuentros.
  - Ver learnset y evolución en un juego concreto.
  - Añadir al equipo y recuperar el plan.
  - Cambiar entre modo nacional y regional.
- **Accesibilidad:** navegación por teclado, tabs, tablas, contraste, lectores de pantalla.
- **Rendimiento:** LCP, tamaño de chunks, número de peticiones.

### Criterios de aceptación del MVP

- [ ] Existe catálogo de todos los juegos principales y DLC incluidos en el alcance, con etiquetas en español.
- [ ] Las parejas se muestran como “Rojo Fuego / Verde Hoja” y permiten elegir la versión concreta.
- [ ] Los DLC se muestran anidados bajo el juego base sin duplicar especies.
- [ ] La interfaz y los datos curados usan `es-ES`.
- [ ] Se puede seleccionar un juego y la selección se conserva.
- [ ] La Pokédex regional muestra solo especies del juego y su número local.
- [ ] Las exclusividades por versión se muestran con insignias y se pueden filtrar.
- [ ] Al seleccionar una versión se ocultan las exclusivas de la otra.
- [ ] Los juegos piloto muestran “Datos piloto” en el catálogo; el resto muestra “Pokédex en preparación”.
- [ ] La ficha indica disponibilidad, métodos, ubicaciones y versiones.
- [ ] SV avisa de encuentros pendientes y no inventa disponibilidad.
- [ ] Las rutas muestran encuentros con nivel, probabilidad y método.
- [ ] El learnset por nivel respeta el version group.
- [ ] Las evoluciones muestran requisitos legibles y aplicables.
- [ ] La app funciona sin errores de consola en los flujos E2E.
- [ ] 0 referencias huérfanas en los datos de los juegos piloto.
- [ ] Lighthouse Accessibility = 100 en las vistas principales.
- [ ] Un usuario puede responder “¿dónde consigo X?” en menos de 30 segundos.

---

## 11. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Traducción manual de localizaciones | Alto esfuerzo y posible inconsistencia | Priorizar juegos piloto, glosario, revisión y fallback explícito. |
| Datos de disponibilidad incompletos en PokéAPI | Respuestas incorrectas | Cruce dex + encuentros + curaduría; estado “sin datos”; reporte de errores. |
| Orden de aventura no disponible | Rutas sin contexto de progreso | MVP sin orden estricto, solo lista de áreas; curaduría posterior. |
| Payloads grandes | Lentitud en móvil | Snapshots por juego, resúmenes, lazy loading y presupuesto de tamaño. |
| Complejidad de formas y variedades | Datos inconsistentes | MVP con variedad por defecto; formas en fase posterior. |
| Cambios en PokéAPI | Pipeline roto | Caché, versionado de datasets, validación y monitoreo del build. |
| Alcance excesivo | Retraso del MVP | Tres juegos piloto, criterios de salida y “Won’t” explícitos; planificador fuera del MVP. |
| Copyright de assets | Riesgo legal | Mantener atribución, evitar portadas oficiales y usar arte de sprites ya soportado. |
| Dependencia de una sola persona | Cuello de botella | Documentar pipeline, datasets generados y decisiones. |

---

## 12. Decisiones pendientes

Decisiones cerradas: juegos piloto, alcance **Main Game + DLC**, exclusión de Legends y spin-offs, nomenclatura de versiones con “/”, **JavaScript**, locale **es-ES**, planificador base en `/equipos` y snapshots estáticos.

Quedan por confirmar decisiones de implementación:

1. **Orden de aventura**  
   Recomendación: MVP sin orden estricto, con rutas agrupadas por región; curaduría posterior.

2. **Contenido evento / exclusivo**  
   Recomendación: incluirlo con etiqueta “Evento” y no considerarlo disponible por defecto.

3. **Fuente de encuentros para Escarlata / Púrpura**  
   **Pausado por decisión de producto.** SV conserva dex y exclusividades, pero no avanza en rutas hasta que exista una fuente fiable o se decida una curaduría. No bloquea la Fase 3/4 de Gen I–VIII.

4. **Rutas de DLC de Escarlata / Púrpura**  
   Pausadas junto con el resto de rutas de SV. Se retomarán después de completar las siguientes generaciones.

---

## 13. Próximos pasos concretos

1. Revisar con una prueba de usuario las fichas contextuales, learnsets y evoluciones de Gen I–VIII, empezando por Kanto, Johto y Sinnoh.
2. Ampliar la Pokédex, las rutas y las fichas contextuales al resto de juegos principales por generación.
3. Retomar SV solo si se decide una fuente de encuentros fiable.
4. Añadir TM/tutor/huevo y pulir la experiencia de aventura.
5. Ampliar el planificador de equipo con recomendaciones/exportación, sin bloquear el lanzamiento.

---

## Anexo A — Comandos de validación usados

```bash
# Catálogo de version groups
curl https://pokeapi.co/api/v2/version-group?limit=100

# Versiones y nombres en español
curl https://pokeapi.co/api/v2/version/red

# Dex regional
curl https://pokeapi.co/api/v2/pokedex/kanto

# Encuentros de una especie
curl https://pokeapi.co/api/v2/pokemon/25/encounters

# Área con encuentros y regalos
curl https://pokeapi.co/api/v2/location-area/pallet-town-area

# Learnset y detalles por version group
curl https://pokeapi.co/api/v2/pokemon/25

# Evoluciones
curl https://pokeapi.co/api/v2/evolution-chain/67
```

## Anexo B — Glosario

| Término | Significado |
|---|---|
| Version group | Agrupación de versiones que comparten datos, por ejemplo `firered-leafgreen`. |
| Dex regional | Listado numerado de especies de una región/juego. |
| Encuentro | Aparición de una especie en un área con un método y niveles. |
| Método | Caminando, surf, caña, regalo, estático, intercambio, evento… |
| Learnset | Conjunto de movimientos que aprende una especie en un juego. |
| Nivel de aprendizaje | Nivel al que se aprende un movimiento por subida de nivel. |
| Evolución | Transformación permanente con requisitos (nivel, objeto, amistad, lugar…). |
| Snapshot | Dataset estático generado y versionado a partir de la API. |
| Curaduría | Dato añadido o corregido manualmente porque la API no lo ofrece. |

## Anexo C — Referencias

- [PokéAPI](https://pokeapi.co/) — fuente principal de datos.
- [Documentación de PokéAPI](https://pokeapi.co/docs/v2) — recursos y esquemas.
- [Repositorio de sprites de PokeAPI](https://github.com/PokeAPI/sprites) — artwork usado por la app.
- Documentación interna: `README.md`, `src/api/pokeapi.js`, `src/pages/PokemonDetail.jsx`.

---

> **Siguiente paso:** aprobar las decisiones abiertas y convertir la Fase 0 en un spike técnico con el juego piloto. Después de eso, comenzamos la implementación del catálogo y la capa de datos.
