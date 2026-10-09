/** An `<option>` read from a component's light DOM. */
export interface OptionItem {
  kind: 'option';
  value: string;
  label: string;
  disabled: boolean;
  selected: boolean;
}

/** An `<optgroup>` and its options. */
export interface GroupItem {
  kind: 'group';
  label: string;
  disabled: boolean;
  options: OptionItem[];
}

export type Item = OptionItem | GroupItem;

function readOption(option: HTMLOptionElement, groupDisabled = false): OptionItem {
  return {
    kind: 'option',
    value: option.value,
    label: option.label || option.textContent?.trim() || '',
    disabled: option.disabled || groupDisabled,
    selected: option.hasAttribute('selected'),
  };
}

/** Reads the `<option>` and `<optgroup>` children of a host element. */
export function readItems(host: Element): Item[] {
  return [...host.children].flatMap((child): Item[] => {
    if (child instanceof HTMLOptionElement) return [readOption(child)];
    if (child instanceof HTMLOptGroupElement) {
      return [
        {
          kind: 'group',
          label: child.label,
          disabled: child.disabled,
          options: [...child.querySelectorAll('option')].map((o) => readOption(o, child.disabled)),
        },
      ];
    }
    return [];
  });
}

/** All options, with groups flattened. */
export function flattenOptions(items: Item[]): OptionItem[] {
  return items.flatMap((item) => (item.kind === 'group' ? item.options : [item]));
}

/** Calls `onChange` whenever the host's options are added, removed or edited. */
export function observeOptions(host: Element, onChange: () => void): MutationObserver {
  const observer = new MutationObserver(onChange);
  observer.observe(host, { childList: true, subtree: true, attributes: true, characterData: true });
  return observer;
}
