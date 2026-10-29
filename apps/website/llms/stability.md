# Stability

What counts as a breaking change, which browsers and frameworks are supported, and how APIs are retired.

## Versions

Every package follows semantic versioning, and they're all released together with the same version number. Patch releases fix bugs, minor releases add features, and only major releases break the public API.

While the version starts with `0.`, a minor release (0.10 → 0.11) may also include breaking changes. Each one is listed in the changelog with what to change in your code.

## The public API

Changing or removing any of these is a breaking change:

| What | Includes |
|---|---|
| Tags | `<uf-button>`, `<uf-dialog>`… |
| Attributes and properties | Their names, types, defaults and what they do. |
| Methods | `show()`, `checkValidity()`…: names, arguments and return values. |
| Events | Names, `detail`, and whether they bubble. |
| Slots and CSS parts | `slot="prefix"`, `::part(base)`… |
| CSS custom properties | The `--uf-*` properties of each component, and the design tokens. |
| Translation keys | The keys of `setTranslations()`, and their placeholders like `{count}`. |
| Framework packages | Component and prop names, events like `onUfHide`, and the `v-model` and `ngModel` bindings. |
| CLI | The commands and options of `@unframed/cli`. |

These are not part of it, and can change in any release:

| What | Why |
|---|---|
| Shadow DOM | The elements inside a component, their classes, and `--_*` properties. Style through parts and custom properties instead. |
| Members marked internal | Anything not in the API tables, even if JavaScript lets you reach it. |
| Exact look | Colors, spacing and motion can be refined in any release, within the same design. |
| Default texts | The English wording, and that of the built-in languages, may be improved. The keys stay. |

## Browsers

The current and the previous version of Chrome, Edge, Firefox and Safari, on desktop and mobile. The components use web standards those browsers support: custom elements and shadow DOM, form-associated elements, the Popover API and `<dialog>`. Every change is tested in Chromium, Firefox and WebKit before it's released.

A few refinements only show where the browser supports them, like the accordion's animated height. Elsewhere the component works the same, without the animation.

## Frameworks

| Package | Supports |
|---|---|
| `@unframed/react` | React 18 and later |
| `@unframed/vue` | Vue 3.4 and later |
| `@unframed/angular` | Angular 20 and later |
| `@unframed/core` | Any framework, or none |

Dropping a framework version is a breaking change.

## Deprecations

An API is deprecated before it's removed. It keeps working for at least one minor release, marked as deprecated in the docs and the changelog with what to use instead, and is removed in the next major release.
