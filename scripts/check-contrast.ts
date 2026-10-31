/**
 * Revisa el contraste de cada tema. La librería culori calcula el contraste de WCAG y
 * mezcla los colores translúcidos con lo que hay debajo; aquí solo se definen las
 * combinaciones de la app y sus mínimos. Se usa el peor caso del degradado de fondo, y
 * termina con error si alguna combinación no cumple.
 *
 * Uso: npm run check:contrast
 */

import { blend, wcagContrast } from 'culori';

import { Themes, type ThemeColors } from '../src/constants/themes.ts';

/** Texto normal: 4,5:1 (WCAG 1.4.3). Iconos y bordes de control: 3:1 (WCAG 1.4.11). */
const TEXT = 4.5;
const UI = 3;

/** Mezcla capas de la más cercana al usuario a la más lejana, que debe ser opaca. */
function flatten(layers: string[]) {
  return blend([...layers].reverse() as [string, ...string[]]);
}

type Pair = { name: string; minimum: number; front: string[]; backs: string[][] };

function getPairs(c: ThemeColors): Pair[] {
  const page = [[c.background], [c.backgroundEnd]];
  const card = page.map((back) => [c.surface, ...back]);
  const solid = [[c.surfaceSolid]];
  const header = [[c.header], [c.headerEnd]];
  const muted = page.map((back) => [c.surfaceMuted, ...back]);
  const soft = page.map((back) => [c.primarySoft, ...back]);
  const softOnSolid = [[c.primarySoft, c.surfaceSolid]];

  return [
    { name: 'Texto sobre fondo', minimum: TEXT, front: [c.text], backs: page },
    { name: 'Texto sobre tarjeta', minimum: TEXT, front: [c.text], backs: card },
    { name: 'Texto secundario sobre fondo', minimum: TEXT, front: [c.textSecondary], backs: page },
    { name: 'Texto secundario sobre tarjeta', minimum: TEXT, front: [c.textSecondary], backs: card },
    { name: 'Texto secundario sobre superficie', minimum: TEXT, front: [c.textSecondary], backs: solid },
    { name: 'Filtro sin seleccionar', minimum: TEXT, front: [c.textSecondary], backs: muted },
    { name: 'Filtro seleccionado y botón', minimum: TEXT, front: [c.onPrimary], backs: [[c.primary]] },
    { name: 'Botón secundario', minimum: TEXT, front: [c.onPrimarySoft], backs: [...soft, ...softOnSolid] },
    { name: 'Título del encabezado', minimum: TEXT, front: [c.onHeader], backs: header },
    { name: 'Subtítulo del encabezado', minimum: TEXT, front: [c.onHeaderMuted], backs: header },
    { name: 'Botón de peligro', minimum: TEXT, front: [c.onDanger], backs: [[c.danger]] },
    { name: 'Texto de peligro en superficie', minimum: TEXT, front: [c.danger], backs: solid },
    { name: 'Error sobre fondo', minimum: TEXT, front: [c.danger], backs: page },
    { name: 'Mensaje breve', minimum: TEXT, front: [c.onSnackbar], backs: [[c.snackbar]] },
    { name: 'Icono primario sobre tarjeta', minimum: UI, front: [c.primary], backs: card },
    { name: 'Icono de peligro sobre tarjeta', minimum: UI, front: [c.danger], backs: card },
    { name: 'Pestaña activa', minimum: UI, front: [c.primary], backs: solid },
    { name: 'Borde de campo de texto', minimum: UI, front: [c.borderStrong], backs: [...page, ...solid] },
    { name: 'Barra de progreso en encabezado', minimum: UI, front: [c.headerProgress], backs: header.map((back) => [c.headerTrack, ...back]) },
  ];
}

let failures = 0;

for (const [name, { colors }] of Object.entries(Themes)) {
  const rows = getPairs(colors).map(({ name: pair, minimum, front, backs }) => {
    const worst = Math.min(...backs.map((back) => wcagContrast(flatten(front), flatten(back))));
    if (worst < minimum) failures += 1;
    return { pair, minimum, worst: Number(worst.toFixed(2)), ok: worst >= minimum ? 'sí' : 'NO' };
  });

  const lowest = rows.filter((row) => row.minimum === TEXT).sort((a, b) => a.worst - b.worst)[0];
  console.log(`\nTema: ${name} (menor contraste de texto: ${lowest.worst}:1, ${lowest.pair})`);
  console.table(rows);
}

console.log(failures === 0 ? '\nTodas las combinaciones cumplen.' : `\n${failures} combinaciones no cumplen.`);
process.exit(failures === 0 ? 0 : 1);
