// Color math for the theme generator: OKLCH palettes and WCAG contrast.
// OKLab conversion from Björn Ottosson, https://bottosson.github.io/posts/oklab/

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

type Rgb = [number, number, number];

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLinear = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

/** '#6930c3' or '6930c3' -> [r, g, b] in 0..1, or null if it isn't a 6-digit hex color. */
export function parseHex(hex: string): Rgb | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const n = parseInt(match[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('')}`;
}

export function rgbToOklch([r, g, b]: Rgb): Oklch {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(a, bb), h: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

/** OKLCH -> linear-free sRGB, possibly out of gamut (components outside 0..1). */
function oklchToRgbUnclamped({ l: L, c, h }: Oklch): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -0.0005 && v <= 1.0005);

/** OKLCH -> sRGB, reducing chroma until the color fits, so hue and lightness are kept. */
export function oklchToRgb(color: Oklch): Rgb {
  let rgb = oklchToRgbUnclamped(color);
  if (inGamut(rgb)) return rgb;
  let low = 0;
  let high = color.c;
  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    rgb = oklchToRgbUnclamped({ ...color, c: mid });
    if (inGamut(rgb)) low = mid;
    else high = mid;
  }
  return oklchToRgbUnclamped({ ...color, c: low });
}

export const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
export type Step = (typeof STEPS)[number];
export type Palette = Record<Step, string>;

/**
 * A palette with `base` as its 600 step, shaped like `reference`: each step
 * keeps the reference's lightness position (relative to its 600) and chroma
 * ratio, with the base color's hue.
 */
export function generatePalette(base: string, reference: Palette): Palette {
  const input = rgbToOklch(parseHex(base)!);
  const ref = Object.fromEntries(STEPS.map((step) => [step, rgbToOklch(parseHex(reference[step])!)])) as Record<Step, Oklch>;
  const refBase = ref['600'];
  const palette = {} as Palette;
  for (const step of STEPS) {
    if (step === '600') {
      palette[step] = toHex(parseHex(base)!);
      continue;
    }
    const r = ref[step];
    // Lighter steps keep their distance to white, darker ones to black, in proportion.
    const l =
      r.l >= refBase.l
        ? input.l + ((r.l - refBase.l) * (1 - input.l)) / (1 - refBase.l)
        : (input.l * r.l) / refBase.l;
    const c = refBase.c > 0 ? input.c * (r.c / refBase.c) : 0;
    palette[step] = toHex(oklchToRgb({ l, c, h: input.h }));
  }
  return palette;
}

/** WCAG 2 contrast ratio between two hex colors. */
export function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, bl] = parseHex(hex)!.map(toLinear);
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
