import { defineComponent, h, mergeProps, ref, type DefineSetupFnComponent, type EmitsOptions } from 'vue';

export interface ModelConfig {
  /** Element property holding the value: `value` or `checked`. */
  prop: string;
  /** Event the element fires when the user changes the value. */
  event: string;
  /** Other properties the user can change, emitted as `update:<prop>` (e.g. `v-model:indeterminate`). */
  synced?: readonly string[];
}

/** Props added to form controls so `v-model` works. */
export interface ModelProps<T> {
  modelValue?: T;
}

export type ModelEmits<T> = { 'update:modelValue': (value: T) => true };

/**
 * Builds a Vue component that renders an Unframed custom element.
 *
 * - Props are set as element properties, so objects and booleans arrive intact;
 *   unset props are left alone so the element keeps its defaults.
 * - Anything else (attributes, `class`, `slot`, `onUfShow`…) falls through to the element,
 *   so `@uf-show` and `slot="prefix"` work as usual.
 * - Form controls get `modelValue` / `update:modelValue`, so `v-model` works.
 * - The element is exposed as `el` on the component instance, for its methods.
 */
export function createWrapper<Props extends Record<string, any>, Model = never, SyncedEmits extends EmitsOptions = {}>(
  tagName: string,
  name: string,
  propNames: readonly string[],
  model?: ModelConfig,
) {
  const component = defineComponent({
    name,
    inheritAttrs: false,
    props: [...propNames, ...(model ? ['modelValue'] : [])],
    emits: model ? ['update:modelValue', ...(model.synced ?? []).map((p) => `update:${p}`)] : [],
    setup(props, { attrs, slots, emit, expose }) {
      const el = ref<HTMLElement>();
      expose({ el });
      const values = props as Record<string, unknown>;

      return () => {
        const defined: Record<string, unknown> = {};
        for (const key of propNames) if (values[key] !== undefined) defined[key] = values[key];

        const modelBinding: Record<string, unknown> = {};
        if (model) {
          if (values.modelValue !== undefined) modelBinding[model.prop] = values.modelValue;
          // e.g. onChange listens for the element's `change` event.
          modelBinding[`on${model.event[0].toUpperCase()}${model.event.slice(1)}`] = () => {
            const element = el.value as unknown as Record<string, unknown>;
            emit('update:modelValue', element[model.prop]);
            for (const prop of model.synced ?? []) emit(`update:${prop}`, element[prop]);
          };
        }

        return h(tagName, mergeProps(attrs, defined, modelBinding, { ref: el }), slots.default?.());
      };
    },
  });
  return component as unknown as WrapperComponent<
    Props & ModelProps<Model>,
    ([Model] extends [never] ? {} : ModelEmits<Model>) & SyncedEmits
  >;
}

/**
 * The public type of a wrapper: typed props (including `onX` event handlers),
 * typed `v-model`, and `el` on the instance.
 */
export type WrapperComponent<Props extends Record<string, any>, Emits extends EmitsOptions> = DefineSetupFnComponent<Props, Emits> & {
  new (): { el: HTMLElement | undefined };
};
