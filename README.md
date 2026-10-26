# PokeNuzlockePlanner

Aplicación web construida con **React + Vite** que consume la [PokéAPI](https://pokeapi.co/api/v2/) para explorar Pokémon, armar tu propia biblioteca personal y planificar tus retos Nuzlocke con precisión.

> **Versión actual: 0.9** · Base de aventura, datos Gen I–VIII, formas, MT/tutor, level caps y equipos por versión.  
> **1.0:** Completar todos los datos faltantes documentados en [`docs/COBERTURA_DATOS.md`](docs/COBERTURA_DATOS.md).  
> **Después de 1.0:** MT/tutores disponibles antes de cada gimnasio y builder perfecto por gimnasio/juego.

## Funcionalidades Principales

- **Pokédex completa**: Más de 1000 Pokémon con carga progresiva (scroll infinito).
- **Búsqueda instantánea** por nombre o número (`#25`), con atajo de teclado `/`.
- **Filtro por los 18 tipos** y ordenamiento por número o nombre.
- **Ficha de detalle**: Tipos, descripción, altura, peso, habilidades, estadísticas, movimientos, grito y **línea evolutiva** interactiva.
- **Catálogo de juegos principales + DLC** con selección persistente y ficha base del juego.
- **Pokédex regional de los 20 juegos** (Gen I–VIII y SV + DLC) con búsqueda, filtros por tipo/método, selector de versión y secciones por subdex.
- **Exclusividades por versión** con insignias y filtro propio.
- **Rutas y tablas de encuentros de Gen I–VIII**: 18 juegos con niveles, probabilidad, métodos, condiciones y filtro por versión.
- **Progreso HGSS hasta Red**: Cálculo de rutas y encuentros por Johto, Kanto y Monte Plata, rango de niveles y equipo final de Red.
- **Fichas contextuales por juego**: Learnset por nivel, control de nivel, evoluciones aplicables, habilidades, estadísticas y disponibilidad.
- **Versiones y Formas**: Índice que cubre 891 especies, separando formas base, variantes regionales, Mega, Gigamax y Totem.
- **Level caps y Gimnasios**: Ruta compacta de gimnasios para todos los juegos correspondientes, con nivel del líder.
- **Planificador de Equipos**: Vista `/equipos` con equipo de seis huecos, búsqueda en la dex, nivel, moveset editable, reordenable y level caps.
- **Mi biblioteca**: Guarda y quita Pokémon favoritos (persistencia en `localStorage`).
- Diseño oscuro responsive con skeletons de carga, estados vacíos y manejo de errores.

## Estado de Implementación

- **Fase 1 completada:** Catálogo de 20 juegos + 4 DLC, selección persistente, navegación y ficha base.
- **Fase 2 completada:** Pokédex regional, disponibilidad y exclusividades para los 20 juegos (BDSP y SV solo dex/exclusividades).
- **Fase 3 completada:** Rutas, localizaciones y tablas de encuentros para 18 juegos (Gen I–VIII).

<details>
<summary><strong>Ver desglose de cobertura por juego (Fase 3)</strong></summary>
<br>

- **Rojo/Azul:** 45 localizaciones, 25 rutas numeradas, 74 áreas y 781 encuentros.
- **Amarillo:** 45 localizaciones, 25 rutas numeradas, 74 áreas y 699 encuentros.
- **Oro/Plata:** 83 localizaciones, 45 rutas numeradas, 124 áreas y 1.498 encuentros.
- **Cristal:** 84 localizaciones, 45 rutas numeradas, 126 áreas y 1.457 encuentros.
- **Rubí/Zafiro:** 67 localizaciones, 34 rutas numeradas, 104 áreas y 1.153 encuentros.
- **Esmeralda:** 73 localizaciones, 34 rutas numeradas, 111 áreas y 1.101 encuentros.
- **RFVH:** 70 localizaciones, 25 rutas numeradas, 119 áreas y 1.504 encuentros.
- **Diamante/Perla:** 69 localizaciones, 30 rutas numeradas, 156 áreas y 1.531 encuentros.
- **Platino:** 71 localizaciones, 30 rutas numeradas, 159 áreas y 1.546 encuentros.
- **HeartGold/SoulSilver:** 95 localizaciones, 47 rutas numeradas, 167 áreas y 2.163 encuentros.
- **Negro/Blanco:** 50 localizaciones, 18 rutas numeradas, 86 áreas y 975 encuentros.
- **Negro 2/Blanco 2:** 66 localizaciones, 22 rutas numeradas, 130 áreas y 1.803 encuentros.
- **X/Y:** 46 localizaciones, 21 rutas numeradas, 79 áreas y 1.096 encuentros.
- **Rubí Omega/Zafiro Alfa:** 50 localizaciones, 17 de 34 rutas, 91 áreas y 121 encuentros; cobertura parcial.
- **Sol/Luna:** 69 localizaciones, 17 rutas numeradas, 97 áreas y 690 encuentros.
- **Ultrasol/Ultraluna:** 73 localizaciones, 17 rutas numeradas, 113 áreas y 900 encuentros.
- **Let’s Go:** 40 localizaciones, 25 rutas numeradas, 59 áreas y 573 encuentros.
- **Espada/Escudo + DLC:** 84 localizaciones, 10 rutas numeradas, 379 áreas y 12.064 encuentros.
</details>

- **Fase 4 completada:** 4.543 fichas contextuales de 18 juegos con learnsets, evoluciones, nivel, habilidades, estadísticas y disponibilidad. (Detalles específicos de generación en `docs/COBERTURA_DATOS.md`).
- **Formas y movimientos:** 131 formas especiales y learnsets con pestañas de nivel, MT/MO y tutor.
- **Equipos y Level caps:** Sistema integral para gestionar equipos bajo las reglas de Nuzlocke de Kanto a Paldea.

## Plan de Producto y Roadmap

El plan completo hacia la versión 1.0 y posteriores está en [`docs/PLAN_OBJETIVOS.md`](docs/PLAN_OBJETIVOS.md). El próximo gran paso es convertir la app en un **compañero de aventura dinámico**, asociando MTs/tutores al punto exacto de la aventura y validando equipos contra checkpoints de gimnasio.

*Nota: La cobertura real, lagunas de la PokéAPI y pendientes técnicos están detallados en [`docs/COBERTURA_DATOS.md`](docs/COBERTURA_DATOS.md).*

## Requisitos y Puesta en Marcha

- **Node.js** 20 o superior (probado con Node 22).

```bash
npm install
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### Scripts de Producción y Datos

```bash
npm run build     # Compila la aplicación
npm run preview   # Previsualiza la build de producción
```

Para regenerar los archivos JSON estáticos desde PokéAPI:
```bash
npm run build:data
# O individualmente: build:games, build:pokedex, build:routes, build:pokemon
```

> **Nota para despliegue:** La app usa enrutamiento del lado del cliente. Al desplegar en un hosting estático (Vercel, Netlify, GitHub Pages), asegúrate de configurar la redirección de todas las rutas hacia `index.html`.

## Estructura del Proyecto

```text
src/
  api/            Cliente de PokéAPI con caché en memoria
  components/     Componentes reutilizables de UI (Navbar, tarjetas, filtros)
  context/        Estado global (Biblioteca de favoritos, juego seleccionado)
  hooks/          Lógica de carga y catálogo
  pages/          Vistas principales (Pokédex, detalle, rutas, builder)
  data/           Metadatos duros y diccionarios
  services/       Consumo de snapshots estáticos
  utils/          Formateadores y helpers
scripts/          Pipelines de recolección de datos desde PokéAPI
public/data/v1/   Snapshots JSON (Catálogo, rutas, fichas)
```

## Créditos

Los datos provienen de la fantástica [PokeAPI](https://pokeapi.co/).  
*Pokémon y los nombres de los Pokémon son marcas de Nintendo, Game Freak y The Pokémon Company. Este proyecto es una demo educativa de desarrollo de software sin fines comerciales.*