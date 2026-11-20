import { describe, expect, it } from 'vitest';
import { loadData } from '../src/data.js';
import { formatReport, parse, validate } from '../src/validate.js';

const data = loadData();
const messages = (code: string) => validate(data, code).problems.map((p) => `${p.severity}: ${p.message}`);

describe('parse', () => {
  it('reads attributes, values and content', () => {
    const [button] = parse('<uf-button variant="ghost" disabled label=Save><uf-icon name="x"></uf-icon></uf-button>');
    expect(button!.attrs.map((a) => [a.raw, a.value])).toEqual([
      ['variant', { kind: 'static', text: 'ghost' }],
      ['disabled', undefined],
      ['label', { kind: 'static', text: 'Save' }],
    ]);
    expect(button!.content).toBe('<uf-icon name="x"></uf-icon>');
  });

  it('skips JSX expressions as a whole, arrows and quotes included', () => {
    const [input] = parse('<UfInput label="Name" onChange={(e) => set(e.target.value > 1 ? "a" : "b")} {...rest} />');
    expect(input!.tag).toBe('uf-input');
    expect(input!.attrs.map((a) => a.raw)).toEqual(['label', 'onChange']);
  });

  it('finds the matching closing tag of nested elements', () => {
    const [outer] = parse('<uf-card><uf-card>inner</uf-card>outer</uf-card>');
    expect(outer!.content).toBe('<uf-card>inner</uf-card>outer');
  });

  it('reports the line of each element and attribute', () => {
    const [, select] = parse('<uf-input label="A"></uf-input>\n<uf-select\n  label="B"\n></uf-select>');
    expect(select!.line).toBe(2);
    expect(select!.attrs[0]!.line).toBe(3);
  });
});

describe('validate', () => {
  it('passes correct markup', () => {
    expect(messages('<uf-button variant="ghost">Save</uf-button><uf-input label="Email" type="email" required></uf-input>')).toEqual([]);
  });

  it('flags an unknown tag and suggests the right one', () => {
    expect(messages('<uf-datepicker label="Day"></uf-datepicker>')).toEqual([
      'error: <uf-datepicker> isn\'t an Unframed element. Did you mean <uf-date-picker>? Call list_components to see every component.',
    ]);
  });

  it('flags an unknown attribute and suggests the right one', () => {
    expect(messages('<uf-button varient="ghost">Save</uf-button>')).toEqual(['error: <uf-button> has no "varient" attribute. Did you mean "variant"?']);
  });

  it('flags a value outside the allowed list', () => {
    expect(messages('<uf-button variant="primay">Save</uf-button>')[0]).toMatch(/variant="primay" isn't a valid value\. Use one of "primary", .* Did you mean "primary"\?/);
  });

  it('flags a boolean attribute set to "false"', () => {
    expect(messages('<uf-button disabled="false">Save</uf-button>')[0]).toMatch(/disabled="false" still turns disabled on/);
  });

  it('allows global, data- and aria- attributes', () => {
    expect(messages('<uf-button id="a" class="b" slot="c" data-x="1" aria-describedby="d">Save</uf-button>')).toEqual([]);
  });

  it('warns about a property used as an attribute', () => {
    expect(messages('<uf-input label="A" validity="x"></uf-input>')).toEqual([expect.stringMatching(/^warning: "validity" is a property/)]);
  });

  describe('labels', () => {
    it('requires a label on form controls', () => {
      expect(messages('<uf-input></uf-input>')).toEqual([expect.stringMatching(/^error: <uf-input> needs a label/)]);
    });

    it('accepts a bound label in every framework', () => {
      for (const code of ['<uf-input :label="t(\'a\')"></uf-input>', '<uf-input [label]="a"></uf-input>', '<UfInput label={t("a")} />', '<uf-input .label=${a}></uf-input>']) {
        expect(messages(code), code).toEqual([]);
      }
    });

    it('asks for label instead of aria-label', () => {
      expect(messages('<uf-input aria-label="Email"></uf-input>')).toEqual([expect.stringMatching(/^warning: Use label instead of aria-label/)]);
    });

    it('requires a label on an icon-only button', () => {
      expect(messages('<uf-button><uf-icon name="x"></uf-icon></uf-button>')).toEqual([expect.stringMatching(/only holds an icon: add label/)]);
      expect(messages('<uf-button label="Close"><uf-icon name="x"></uf-icon></uf-button>')).toEqual([]);
      expect(messages('<uf-button><uf-icon name="plus"></uf-icon>Add</uf-button>')).toEqual([]);
      expect(messages('<UfButton><UfIcon name="x" />{t("close")}</UfButton>')).toEqual([]);
    });

    it('requires content on a switch', () => {
      expect(messages('<uf-switch></uf-switch>')).toEqual([expect.stringMatching(/takes its label as content/)]);
      expect(messages('<uf-switch>Dark mode</uf-switch>')).toEqual([]);
    });
  });

  describe('events', () => {
    it('accepts the element\'s own events and DOM events, in every framework', () => {
      const ok = [
        '<uf-pagination label="Pages" @uf-page-change="go"></uf-pagination>',
        '<uf-pagination label="Pages" (uf-page-change)="go($event)"></uf-pagination>',
        '<uf-pagination label="Pages" on:uf-page-change={go}></uf-pagination>',
        '<UfPagination label="Pages" onUfPageChange={go} onClick={x} />',
        '<uf-input label="A" @keydown.enter="submit"></uf-input>',
      ];
      for (const code of ok) expect(messages(code), code).toEqual([]);
    });

    it('flags an event the element never fires', () => {
      expect(messages('<uf-tabs label="Sections" @uf-change="go"></uf-tabs>')).toEqual([
        'error: "@uf-change" listens for a "uf-change" event, which <uf-tabs> never fires. Its events are "uf-tab-change". Did you mean "uf-tab-change"?',
      ]);
      expect(messages('<UfTabs label="Sections" onUfChange={go} />')[0]).toMatch(/"uf-change" event/);
      expect(messages('<UfSwitch onToggle={go}>Dark mode</UfSwitch>')[0]).toMatch(/"toggle" event, which <uf-switch> never fires/);
    });
  });

  describe('framework syntax', () => {
    it('ignores directives, refs and keys', () => {
      const code = `
        <uf-input v-if="show" v-model="name" #field ref="input" :key="id" label="Name"></uf-input>
        <uf-input *ngIf="show" #field [(ngModel)]="name" [class.wide]="true" label="Name"></uf-input>
        <UfInput key={id} ref={input} className="wide" label="Name" />
        <uf-input bind:this={input} class:wide={true} label="Name"></uf-input>`;
      expect(messages(code)).toEqual([]);
    });

    it('checks bound properties by name', () => {
      expect(messages('<uf-input label="A" :valeu="x"></uf-input>')).toEqual(['error: <uf-input> has no "valeu" property. Did you mean "value"?']);
      expect(messages('<uf-table label="A" [rows]="rows" [columns]="cols"></uf-table>')).toEqual([]);
    });

    it('checks the values of static props on React wrappers', () => {
      expect(messages('<UfButton variant="primay">Save</UfButton>')[0]).toMatch(/isn't a valid value/);
    });
  });
});

describe('formatReport', () => {
  it('numbers each problem with its line and tag', () => {
    expect(formatReport(validate(data, '<uf-button>Save</uf-button>\n<uf-input></uf-input>'))).toBe(
      'Found 1 error in 2 Unframed elements. Fix the errors, then call validate_usage again.\n\n' +
        '1. error, line 2, <uf-input>: <uf-input> needs a label: add label="…" so assistive technology can name it. Visible text next to it isn\'t enough.',
    );
  });

  it('says when there is nothing to check', () => {
    expect(formatReport(validate(data, '<button>Save</button>'))).toMatch(/^No Unframed elements found/);
  });
});

describe('Vue wrappers', () => {
  it('treats a bound value as an expression, not text', () => {
    expect(messages('<UfTable label="Users" :sort-direction="sortDirection" :rows="rows"></UfTable>')).toEqual([]);
    expect(messages('<uf-button :variant="kind">Save</uf-button>')).toEqual([]);
    expect(messages('<uf-button [variant]="kind">Save</uf-button>')).toEqual([]);
  });

  it('still checks static values on wrappers', () => {
    expect(messages('<UfTable label="Users" sort-direction="up"></UfTable>')[0]).toMatch(/sort-direction="up" isn't a valid value/);
  });

  it('accepts v-model written out on form controls', () => {
    expect(messages('<UfNumberInput label="Qty" :model-value="q" @update:model-value="set" />')).toEqual([]);
    expect(messages('<UfCheckbox :modelValue="a" @update:modelValue="set" @update:indeterminate="mixed">A</UfCheckbox>')).toEqual([]);
    expect(messages('<UfInput label="Name" v-model:value="name" />')).toEqual([]);
  });

  it('rejects v-model on components that have none', () => {
    expect(messages('<UfButton :model-value="a">Save</UfButton>')).toEqual(['error: <uf-button> has no "model-value" property.']);
    expect(messages('<UfButton @update:model-value="set">Save</UfButton>')[0]).toMatch(/"update:model-value" event, which <uf-button> never fires/);
  });
});
