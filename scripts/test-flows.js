/**
 * Recorre la app en Microsoft Edge con tamaño de teléfono, comprueba cada flujo y guarda
 * capturas en `test-results/`. Usa un navegador nuevo, sin tocar tus tareas.
 *
 * Uso: en una terminal `npm run web`, y en otra `npm run test:flows`.
 */

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');

const SHOTS = path.join(__dirname, '..', 'test-results');
fs.mkdirSync(SHOTS, { recursive: true });
const URL = 'http://localhost:8100/';
const results = [];
const problems = [];

function check(name, ok) {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
}

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
    colorScheme: 'light',
    locale: 'es-CL',
  });
  const page = await ctx.newPage();
  // La primera carga compila la app y puede tardar más que las siguientes.
  page.setDefaultNavigationTimeout(180000);
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) problems.push(`[${m.type()}] ${m.text().slice(0, 300)}`);
  });
  page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message.slice(0, 300)}`));

  const shot = async (n) => {
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(SHOTS, `${n}.png`) });
  };
  const visible = (t) => page.getByText(t, { exact: false }).last().isVisible();
  const title = () => page.getByLabel('Título, obligatorio');
  const desc = () => page.getByLabel('Descripción, obligatorio');

  await page.goto(URL, { waitUntil: 'networkidle' });
  const emptyState = page.getByText('Tu lista está vacía', { exact: false }).last();
  await emptyState.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  check('Estado vacío visible', await emptyState.isVisible());
  await shot('01-vacio');

  await page.getByText('Agregar tarea', { exact: true }).click();
  const formOpened = await page.getByLabel('Título, obligatorio').waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
  check('Abre el formulario', formOpened && (await visible('Nueva tarea')));
  await page.getByText('Guardar tarea', { exact: true }).click();
  await page.waitForTimeout(200);
  check('Valida título obligatorio', await visible('Escribe un título'));
  check('Valida descripción obligatoria', await visible('Agrega una descripción'));
  await shot('02-validacion');

  await title().fill('Estudiar para la prueba');
  await desc().fill('Repasar los capítulos 1 al 3 de Desarrollo Móvil');
  await shot('03-formulario');
  await page.getByText('Guardar y agregar otra', { exact: true }).click();
  await page.waitForTimeout(300);
  check('Limpia título tras agregar', (await title().inputValue()) === '');
  check('Limpia descripción tras agregar', (await desc().inputValue()) === '');

  await title().fill('Comprar materiales');
  await desc().fill('Cuaderno, lápices y carpeta para el proyecto');
  await page.getByText('Guardar y agregar otra', { exact: true }).click();
  await page.waitForTimeout(200);
  await title().fill('Preparar presentación');
  await desc().fill('Armar las diapositivas y ensayar con el grupo');
  await page.getByText('Guardar tarea', { exact: true }).click();
  await page.waitForTimeout(700);
  check('Vuelve a la lista con mensaje', await visible('Tarea agregada'));
  check('Muestra tres tareas', await visible('Todas (3)'));
  await shot('04-lista');

  await page.getByLabel('Marcar "Comprar materiales" como completada').click();
  await page.waitForTimeout(300);
  check('Marca completada', await visible('Listas (1)'));
  check('Actualiza avance', await visible('33% completado'));
  await shot('05-completada');

  await page.getByRole('tab', { name: 'Pendientes: 2' }).click();
  await page.waitForTimeout(300);
  check('Filtro oculta completada', !(await page.getByText('Comprar materiales').count()));
  await page.getByRole('tab', { name: 'Listas: 1' }).click();
  await page.waitForTimeout(300);
  check('Filtro Listas muestra completada', await visible('Comprar materiales'));
  await page.getByRole('tab', { name: 'Todas: 3' }).click();

  await page.getByLabel('Editar "Preparar presentación"').click();
  await page.waitForTimeout(600);
  check('Editar abre con datos', (await title().inputValue()) === 'Preparar presentación');
  await shot('06-editar');
  await title().fill('Preparar presentación final');
  await page.getByLabel('Cerrar formulario').click();
  await page.waitForTimeout(300);
  check('Avisa cambios sin guardar', await visible('¿Descartar los cambios?'));
  await shot('07-descartar');
  await page.getByText('Seguir editando', { exact: true }).click();
  await page.waitForTimeout(300);
  await page.getByText('Guardar cambios', { exact: true }).click();
  await page.waitForTimeout(700);
  check('Edición guardada', await visible('Preparar presentación final'));

  await page.getByLabel('Eliminar "Estudiar para la prueba"').click();
  await page.waitForTimeout(300);
  check('Pide confirmar eliminación', await visible('¿Eliminar esta tarea?'));
  await shot('08-eliminar');
  await page.getByText('Cancelar', { exact: true }).click();
  await page.waitForTimeout(300);
  check('Cancelar conserva tarea', await visible('Estudiar para la prueba'));

  await page.getByLabel('Más opciones').click();
  await page.waitForTimeout(300);
  check('Abre menú', await visible('Más antiguas primero'));
  await shot('09-menu');
  await page.getByText('Más antiguas primero', { exact: true }).click();
  await page.waitForTimeout(400);
  const order = await page.getByLabel(/^Editar /).evaluateAll((els) => els.map((e) => e.getAttribute('aria-label')));
  check('Ordena por antiguas', order[0] && order[0].includes('Estudiar'));
  results.push(`      orden: ${JSON.stringify(order)}`);

  await page.getByRole('tab', { name: /Resumen/ }).or(page.getByText('Resumen', { exact: true })).last().click();
  await page.waitForTimeout(700);
  check('Navega a Resumen', await visible('Avance general'));
  await shot('10-resumen');

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  check('Las tareas persisten al recargar', await visible('Preparar presentación final'));

  await page.getByLabel('Eliminar "Estudiar para la prueba"').click();
  await page.waitForTimeout(300);
  await page.getByText('Eliminar', { exact: true }).last().click();
  await page.waitForTimeout(500);
  check('Elimina tarea', !(await page.getByText('Estudiar para la prueba').count()));
  check('Mensaje de eliminación', await visible('Tarea eliminada'));

  const tab = (name) => page.getByText(name, { exact: true }).last();
  await tab('Ajustes').click();
  await page.getByRole('radio', { name: /Automático/ }).waitFor({ timeout: 15000 });
  check('Ajustes muestra seis opciones de tema', (await page.getByRole('radio').count()) === 6);
  await shot('12-ajustes');
  const themeBackground = () => page.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find((d) => getComputedStyle(d).backgroundImage.includes('linear-gradient'));
    return el ? getComputedStyle(el).backgroundImage : '';
  });
  const seen = new Set();
  for (const [label, file] of [['Claro', 'claro'], ['Oscuro', 'oscuro'], ['Rosado', 'rosado'], ['Azul', 'azul'], ['Verde', 'verde']]) {
    await page.getByRole('radio', { name: new RegExp(label) }).click();
    await page.waitForTimeout(300);
    check(`Selecciona el tema ${label}`, (await page.getByRole('radio', { name: new RegExp(label) }).getAttribute('aria-checked')) === 'true');
    seen.add(await page.evaluate(() => getComputedStyle(document.body).color + [...document.querySelectorAll('[role=radio]')].map((d) => getComputedStyle(d).borderColor).join()));
    await shot(`tema-${file}-ajustes`);
    await tab('Tareas').click();
    await page.waitForTimeout(500);
    await shot(`tema-${file}-lista`);
    await tab('Ajustes').click();
    await page.waitForTimeout(400);
  }
  check('Cada tema cambia los colores', seen.size === 5);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  check('El tema elegido persiste al recargar', (await page.getByRole('radio', { name: /Verde/ }).getAttribute('aria-checked')) === 'true');
  await page.getByRole('radio', { name: /Automático/ }).click();
  await page.waitForTimeout(300);
  await tab('Tareas').click();
  await page.waitForTimeout(500);

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForTimeout(600);
  await shot('11-oscuro');

  await page.goto(URL + 'task-form?id=no-existe', { waitUntil: 'networkidle' });
  const notFound = page.getByText('Esta tarea ya no existe', { exact: false }).last();
  await notFound.waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  check('Id inexistente muestra aviso', await notFound.isVisible());

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  check('Sin scroll horizontal', !overflow);

  await browser.close();
  console.log(results.join('\n'));
  console.log('\nConsola (errores y advertencias):');
  console.log([...new Set(problems)].join('\n') || 'ninguno');

  const passed = results.filter((line) => line.startsWith('PASS')).length;
  const failed = results.filter((line) => line.startsWith('FAIL')).length;
  console.log(`\nResultado: ${passed} de ${passed + failed} comprobaciones correctas.`);
  console.log(`Capturas guardadas en: ${SHOTS}`);
  process.exitCode = failed > 0 || problems.length > 0 ? 1 : 0;
}

main().catch((e) => {
  console.log(results.join('\n'));
  console.log('\nFALLO:', e.message.slice(0, 800));
  console.log([...new Set(problems)].join('\n'));
  process.exit(1);
});
