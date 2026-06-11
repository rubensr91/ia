# Plan Genérico: Prospección + Landing Pages para Negocios sin Web

## Objetivo General
Pipeline completo: buscar negocios locales sin página web en Google Maps → extraer datos públicos → generar landing pages responsive con identidad visual única por categoría.

## Flujo de Trabajo

```
Sisyphus (Orquestador — DeepSeek V4 Flash)
│
├─▶ FASE 0: Preparar directorios y archivo base
│
├─▶ FASE 1: Buscar en Google Maps (Composio MCP)
│   └─▶ Por cada búsqueda: GOOGLE_MAPS_TEXT_SEARCH
│       → Identificar places sin websiteUri
│       → GOOGLE_MAPS_GET_PLACE_DETAILS para enriquecer
│
├─▶ FASE 2: Investigación web (Composio MCP)
│   └─▶ web_search por cada negocio
│   → Construir JSON por negocio con datos reales
│
├─▶ FASE 3: Validar datos
│
├─▶ FASE 4: Generar landing pages (DeepSeek V4 Flash + frontend-ui-ux)
│   └─▶ Cada página con diseño único según categoría
│
├─▶ FASE 4b: Pulido de diseño (DeepSeek V4 Pro + frontend-ui-ux) ← NUEVO
│   └─▶ Revisar y mejorar CSS/HTML/JS con criterios profesionales
│
├─▶ FASE 5: Crear índice general con buscador y filtros
│
└─▶ FASE 6: Verificar entregables
```

---

## Fase 0: Preparación

**Responsable**: Sisyphus

### Acciones:
1. Crear estructura de directorios:
   ```
   C:\Users\Rubén\opencode_results\
   ├── data/           # JSONs con datos de cada negocio
   ├── pages/          # Landing pages (una carpeta por negocio)
   │   ├── index.html  ← Índice general (se genera al final)
   │   ├── {id}-{slug}/
   │   │   ├── index.html
   │   │   ├── style.css
   │   │   └── script.js
   └── plans/          # Planes de trabajo
   ```
2. No hay archivo de entrada fijo — los datos se obtienen en Fase 1.

---

## Fase 1: Búsqueda en Google Maps (Composio MCP)

**Responsable**: Sisyphus (usa directamente las herramientas de Composio)
**Stack**: `GOOGLE_MAPS_TEXT_SEARCH` + `GOOGLE_MAPS_GET_PLACE_DETAILS`
**Sin Gemini — todo via Composio MCP + DeepSeek V4 Flash**

### Proceso:
1. **Definir query**: El usuario indica qué buscar y dónde.
   - Ej: "centros de fisioterapia en Córdoba"
   - Ej: "talleres mecánicos en Sevilla"
   - Ej: "gimnasios en Málaga"

2. **GOOGLE_MAPS_TEXT_SEARCH**: Lanzar búsqueda con `textQuery`, `maxResultCount=20`, fieldMask que incluya `websiteUri` para detectar ausencia de web.

3. **Filtrar candidatos**: De los resultados, conservar solo los que NO tengan `websiteUri` (campo ausente o nulo).

4. **GOOGLE_MAPS_GET_PLACE_DETAILS**: Para cada candidato, obtener detalles completos: `displayName`, `formattedAddress`, `nationalPhoneNumber`, `rating`, `userRatingCount`, `types`, `editorialSummary`, `reviews`, `googleMapsUri`.

### Output:
- Lista de negocios sin web con datos base de Google Maps

---

## Fase 2: Investigación Web (Composio MCP)

**Responsable**: Sisyphus (usa `web_search` vía Composio)
**Stack**: `COMPOSIO_SEARCH_WEB` (Composio Search) para buscar información adicional

### Proceso:
Para cada negocio, realizar búsquedas web para encontrar:
- Redes sociales (Facebook, Instagram)
- Menciones en directorios (Doctoralia, páginas amarillas, etc.)
- Servicios específicos que ofrezcan
- Horarios
- Artículos o reseñas en prensa local
- Cualquier otra mención online

### Construcción del JSON:
Por cada negocio, generar un archivo `{id}-{slug}.json` en `data/` con esta estructura:

```json
{
  "id": "01",
  "nombre": "",
  "slug": "",
  "categoria": "fisioterapia",     ← Se infiere de types[] o del nombre
  "zona": "",
  "direccion": "",
  "telefono": "",
  "rating": 0,
  "total_resenas": 0,
  "servicios": [],
  "horario": "",
  "redes_sociales": {
    "facebook": null,
    "instagram": null,
    "twitter": null
  },
  "descripcion": "",
  "testimonios": [],
  "email": null,
  "web": null,
  "maps_url": "",
  "fuentes": [],
  "metadata": {
    "fecha_extraccion": "",
    "agente": "deepseek-v4-flash"
  }
}
```

### Reglas:
- NO inventar datos. Si no se encuentra información, `null` o `[]`
- Solo información verificable en las fuentes
- Los testimonios se extraen de las reseñas de Google Maps (reviews), no se inventan

---

## Fase 3: Validación de Datos

**Responsable**: Sisyphus

### Acciones:
1. Leer todos los JSONs generados
2. Validar estructura vs schema esperado
3. Verificar que no haya datos inventados
4. Reportar: "X negocios procesados, Y con datos completos, Z con datos parciales"

---

## Fase 4: Generación de Landing Pages (DeepSeek V4 Flash)

**Responsable**: Sisyphus (escribe los archivos directamente)
**Stack**: DeepSeek V4 Flash, skill `frontend-ui-ux`
**Cada página debe tener diseño y sensación distintos según la categoría del negocio.**

> ⚠️ **Esta fase genera la VERSIÓN INICIAL.** El pulido final de diseño se hace en la **Fase 4b** con DeepSeek V4 Pro.

### Identidad visual por categoría

| Categoría | Paleta de color sugerida | Sensación | Ejemplo de variación |
|-----------|--------------------------|-----------|---------------------|
| Fisioterapia / Salud | Verdes (#2A7F62) + crema (#F5F5F0) | Profesional, limpio, natural | Hero con gradiente suave, iconos de hojas/cuerpo |
| Gimnasio / Fitness | Naranjas (#E76F51) + grises oscuros (#264653) | Energético, potente | Hero con foto de fondo, tipografía bold, CTA grande |
| Taller Mecánico | Azules (#1D3557) + rojos (#E63946) | Robusto, confiable | Estilo industrial, bordes duros, iconos de herramientas |
| Peluquería / Estética | Rosas (#F4A261) + tonos cálidos | Elegante, femenino | Tipografía serif, bordes suaves, fotos grid |
| Restaurante | Rojos (#C1121F) + cremas (#FDF0D5) | Cálido, apetitoso | Hero con imagen de comida, sección menú |
| Dentista | Azules claros (#457B9D) + blanco | Limpio, clínico | Formas geométricas, iconos de dientes |
| Otros | Usar paleta neutra (#2D6A4F, #1B4332) | Genérico profesional | Por defecto si no hay categoría conocida |

### Reglas de variación obligatoria:
- **Paleta única por categoria**: Cada categoría usa su propia paleta de colores (no compartir variables CSS entre landing pages de distinto tipo)
- **Layout variable**: Alternar entre layouts single-column, two-column, o con sidebar según el tipo de negocio
- **Hero variable**: Unos pueden tener gradiente, otros imagen de fondo, otros patrón geométrico
- **Secciones variables**: Un taller mecánico no necesita sección de "pilates" igual que un fisio no necesita "diagnóstico de motor". Las secciones se adaptan al tipo de negocio
- **Misma paleta intra-categoría**: Todos los negocios de la misma categoría comparten la misma paleta y familia de diseño para coherencia visual

### Estructura de archivos por negocio:
```
pages/{id}-{slug}/
├── index.html
├── style.css
└── script.js
```

### Requisitos técnicos comunes (TODAS las landing pages):

**HTML:**
- DOCTYPE html5, charset UTF-8, viewport meta responsive
- Etiquetas semánticas (header, nav, main, section, footer)
- Open Graph meta tags (og:title, og:description, og:type=business)
- Schema.org LocalBusiness JSON-LD en `<head>`
- Botón "Llamar ahora" con `tel:` (visible siempre)
- CTA flotante en móvil (fijo abajo)
- Si falta data para una sección → se omite completamente

**CSS:**
- Mobile-first responsive (breakpoints: 480px, 768px, 1024px)
- CSS Grid y/o Flexbox
- Variables CSS (la paleta depende de la categoría)
- Animaciones suaves en hover
- Scroll reveal (Intersection Observer via JS)
- `.container` con max-width: 1200px, padding: 0 20px, margin: auto
- Footer con año dinámico

**JavaScript (vanilla, sin frameworks):**
- Smooth scroll para navegación
- Scroll reveal con Intersection Observer
- Año actual en footer
- Menú hamburguesa en móvil
- Datos estáticos inline (no se carga JSON externo en runtime)

---

---

## Fase 4b: Pulido de Diseño con DeepSeek V4 Pro

**Responsable**: Sisyphus
**Stack**: DeepSeek V4 Pro, skill `frontend-ui-ux`
**Objetivo**: Revisar y mejorar cada landing page generada en Fase 4 aplicando criterios de diseño profesional.

### Proceso para cada página:
1. **Análisis crítico**: Leer el HTML, CSS y JS generados. Identificar oportunidades de mejora en:
   - Composición y jerarquía visual (espaciados, tamaños, contraste)
   - Consistencia tipográfica (escalas, pesos, alturas de línea)
   - Micro-interacciones (transiciones, hovers, estados activos)
   - Accesibilidad (contraste WCAG, etiquetas aria, foco visible)
   - Rendimiento CSS (selectores eficientes, evitar !important, propiedades shorthand)
   - Responsive (verificar todos los breakpoints, desbordamientos)

2. **Refactorizar CSS**: Reescribir selectores innecesarios, agrupar reglas repetidas, añadir variables faltantes.

3. **Mejorar HTML**: Añadir atributos aria donde falten, mejorar semántica, optimizar meta tags.

4. **Enriquecer JS**: Añadir micro-interacciones (efecto parallax suave, contador animado, transición de carga de página).

5. **NO cambiar**:
   - La paleta de colores definida por categoría (solo ajustar tonos si el contraste es insuficiente)
   - La estructura de secciones determinada por los datos disponibles
   - Los testimonios ni datos del negocio

### Criterios de calidad para dar por buena una página:
- [ ] Pasa Lighthouse con 90+ en Performance, Accessibility, Best Practices
- [ ] Todos los hovers tienen transiciones suaves (≥200ms)
- [ ] Los espaciados siguen una escala coherente (4px o 8px base)
- [ ] No hay fugas de overflow horizontal en ningún viewport
- [ ] Los botones y enlaces tienen estados :focus-visible
- [ ] El código CSS no supera 400 líneas (si lo supera, refactorizar)

---

## Fase 5: Índice General

**Responsable**: Sisyphus

### Requisitos:
- Grid de tarjetas responsive (1 col móvil, 2 tablet, 3-4 desktop)
- Cada tarjeta: nombre, zona, tipo de negocio (icono/etiqueta), rating, teléfono, enlace a landing
- Buscador por texto (nombre, dirección, zona)
- Filtro por zona en dropdown (poblado dinámicamente)
- Ordenación por rating descendente
- Banner superior con nombre de la categoría principal

---

## Fase 6: Verificación y Cierre

**Responsable**: Sisyphus

### Lista de verificación:
- [ ] Mínimo 5 negocios sin web identificados en Google Maps
- [ ] Datos reales (no inventados) en cada JSON
- [ ] Una landing page por negocio (index.html + style.css + script.js) — generada con V4 Flash
- [ ] Cada página pasó por **pulido V4 Pro** (Fase 4b)
- [ ] Cada página tiene Schema.org LocalBusiness JSON-LD
- [ ] Cada página es responsive (sin overflow horizontal en ningún viewport)
- [ ] Cada página tiene botón de llamada flotante en móvil
- [ ] Las páginas de distinta categoría tienen diseños VISIBLEMENTE diferentes (colores, layout, hero)
- [ ] Las páginas de la MISMA categoría comparten paleta y coherencia visual
- [ ] Página índice creada con buscador y filtros
- [ ] Sin datos inventados — secciones sin info se omiten
- [ ] Sin dependencias externas (solo HTML+CSS+JS puro)
- [ ] Transiciones hover suaves (≥200ms) en todos los elementos interactivos

---

## Stack Tecnológico

| Herramienta | Uso |
|------------|-----|
| **Composio MCP** (`GOOGLE_MAPS_TEXT_SEARCH`, `GOOGLE_MAPS_GET_PLACE_DETAILS`) | Búsqueda de negocios en Google Maps |
| **Composio Search** (`web_search`) | Investigación web complementaria |
| **DeepSeek V4 Flash** (agente Sisyphus) | Orquestación, validación, generación inicial de landing pages |
| **DeepSeek V4 Pro** (agente Sisyphus) | Pulido final de diseño y código (Fase 4b) |
| **Skill `frontend-ui-ux`** | Diseño y maquetación de landing pages |
| **Write tool** | Guardar archivos JSON y landing pages |

**No se usa Gemini en ninguna fase.**

---

## Notas Críticas
1. **NO inventar datos.** Si no se encuentra información → `null` o `[]`. No generar reseñas, servicios u horarios ficticios.
2. **Las categorías se infieren de `types[]` en Google Maps** o del nombre del negocio. Si no se puede determinar, usar paleta neutra por defecto.
3. **Cada categoría debe tener diseño propio y distinguible.** No repetir la misma maqueta cambiando solo el texto.
4. **Sin dependencias externas.** HTML+CSS+JS puro. Sin Bootstrap, Tailwind, jQuery, React, ni CDNs.
5. **Los datos se escriben inline en el HTML** (variable global o directo en el DOM), no se carga JSON externo en runtime.
6. **Misma categoría = mismo diseño.** Coherencia visual para todos los negocios del mismo tipo.
