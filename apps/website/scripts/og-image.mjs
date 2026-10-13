// Renders scripts/og-image.html to public/og-image.png, the image shown in link previews.
// Link previews need a raster image: most apps ignore SVG.
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const source = new URL('./og-image.html', import.meta.url);
const output = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(source.href);
await page.screenshot({ path: output });
await browser.close();
console.log(`Wrote ${output}`);
