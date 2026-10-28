import { afterEach, expect, it } from 'vitest';
import { cdp } from 'vitest/browser';
import { fixture } from './test-utils.js';
import './index.js';

interface FrameTree {
  frame: { id: string };
  childFrames?: FrameTree[];
}

interface AXNode {
  ignored: boolean;
  role?: { value: string };
  name?: { value: string };
}

/** The accessible names Chromium computed for a role: what assistive tech reads, not the DOM. */
async function accessibleNames(role: string): Promise<string[]> {
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  // Tests run in an iframe, so read every frame's tree.
  const { frameTree } = (await cdp().send('Page.getFrameTree')) as { frameTree: FrameTree };
  const frameIds: string[] = [];
  const walk = (tree: FrameTree) => {
    frameIds.push(tree.frame.id);
    tree.childFrames?.forEach(walk);
  };
  walk(frameTree);
  const trees = await Promise.all(frameIds.map((frameId) => cdp().send('Accessibility.getFullAXTree', { frameId })));
  return trees
    .flatMap((tree) => (tree as { nodes: AXNode[] }).nodes)
    .filter((node) => !node.ignored && node.role?.value === role)
    .map((node) => String(node.name?.value ?? ''));
}

const cases: [tag: string, markup: string, role: string][] = [
  ['uf-input', '<uf-input label="Email"></uf-input>', 'textbox'],
  ['uf-textarea', '<uf-textarea label="Email"></uf-textarea>', 'textbox'],
  ['uf-select', '<uf-select label="Email"><option>a</option></uf-select>', 'combobox'],
  ['uf-combobox', '<uf-combobox label="Email"><option>a</option></uf-combobox>', 'combobox'],
  ['uf-slider', '<uf-slider label="Email"></uf-slider>', 'slider'],
  ['uf-radio-group', '<uf-radio-group label="Email"><uf-radio value="a">A</uf-radio></uf-radio-group>', 'radiogroup'],
  ['uf-checkbox-group', '<uf-checkbox-group label="Email"><uf-checkbox>A</uf-checkbox></uf-checkbox-group>', 'group'],
  ['uf-button', '<uf-button label="Email"><uf-icon name="x"></uf-icon></uf-button>', 'button'],
  ['uf-progress', '<uf-progress label="Email" value="5"></uf-progress>', 'progressbar'],
  ['uf-tabs', '<uf-tabs label="Email"><uf-tab panel="a">A</uf-tab><uf-tab-panel name="a">A</uf-tab-panel></uf-tabs>', 'tablist'],
  ['uf-pagination', '<uf-pagination label="Email" pages="3"></uf-pagination>', 'navigation'],
  ['uf-breadcrumbs', '<uf-breadcrumbs label="Email"><uf-breadcrumb-item>A</uf-breadcrumb-item></uf-breadcrumbs>', 'navigation'],
  ['uf-icon', '<uf-icon name="x" label="Email"></uf-icon>', 'image'],
];

afterEach(() => {
  document.body.innerHTML = '';
});

// E.g. a language switch: the label attribute changes after the first render.
for (const [tag, markup, role] of cases) {
  it(`${tag}: the accessible name follows the label attribute after the first render`, async () => {
    const el = await fixture<HTMLElement & { updateComplete: Promise<unknown> }>(markup, tag);
    expect(await accessibleNames(role)).toContain('Email');
    el.setAttribute('label', 'E-Mail');
    await el.updateComplete;
    const names = await accessibleNames(role);
    expect(names).toContain('E-Mail');
    expect(names).not.toContain('Email');
  });
}
