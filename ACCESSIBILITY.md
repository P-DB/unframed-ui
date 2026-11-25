# Accessibility

Unframed exists to make accessible interfaces the easy default, in any framework. Accessibility is part of every component's definition of done, not a later pass.

## Our target

**[WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA** for every component, in its default theme, light and dark. Component behavior follows the patterns of the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/).

A component library can't make an app accessible on its own: it gives you accessible building blocks, and how you use them decides the result (see [Your part](#your-part)).

## What's built in

- **Keyboard:** every component works without a mouse, with the keys the WAI-ARIA patterns expect (arrows in lists, tabs, menus and radio groups, Home and End, Escape to close). Each component's keyboard support is described in [its docs](https://p-db.github.io/unframed-ui/).
- **Names and roles:** form controls take a `label` that becomes their accessible name, and icon-only buttons, tables and navigation take one too. Built-in texts (the dialog's close button, pagination, "No results") are translated in Italian, French, German, Spanish and Portuguese, and you can add other languages.
- **Forms:** form controls are form-associated, use native validation, and show errors under the field, linked to it.
- **Focus:** a visible focus ring on every interactive part; dialogs and drawers trap focus, make the rest of the page inert, and return focus to the opener when they close.
- **Announcements:** toasts, alerts and changing results (combobox, multi-select, file upload) use live regions, so screen readers announce them.
- **Contrast:** the default tokens meet WCAG AA text contrast in light and dark, and form control borders meet 3:1 ([1.4.11](https://www.w3.org/TR/WCAG22/#non-text-contrast)). The [theme generator](https://p-db.github.io/unframed-ui/docs/theme-generator) checks the contrast of your own colors.
- **Motion:** animations in dialogs, toasts, switches, accordions, tabs, progress and loading indicators respect `prefers-reduced-motion`.
- **AI coding tools:** the agent skill and the MCP server's `validate_usage` tool flag a form control or an icon-only button without a label, so assistants write accessible markup too.

## How we test

**Automated, on every pull request:**

- An [axe](https://github.com/dequelabs/axe-core) check in the tests of all 39 components.
- Every component's tests run in Chromium, Firefox and WebKit.
- Accessible names are read from the browser's own accessibility tree (Chromium), not just the DOM, including when a label changes after the first render.
- Screenshots of every docs example, in light and dark.

**Manual:**

- VoiceOver with Safari, on macOS and iOS.
- Keyboard only.

## Known limitations

- **Windows high contrast (`forced-colors`) isn't supported yet.** Borders and states drawn with the tokens may not show in forced colors mode.
- **NVDA and JAWS aren't part of regular testing.** The components follow the WAI-ARIA patterns those screen readers support, but differences can slip through.
- **Right-to-left layouts aren't tested systematically.** Components with direction-dependent keyboard or layout (calendar, drawer, segmented control, button group) handle `dir="rtl"`; report anything that looks wrong.
- **No external audit yet.** The target above is ours, checked by the tests and reviews described here, not by a third party.

## Your part

- Give every form control a `label`, and every icon-only button one too. Visible text next to a field isn't a label.
- Don't override the components' accessible names with `aria-label`; set their `label`, or translate their built-in texts.
- If you change the theme, check its contrast with the theme generator.
- Test your app with a keyboard and a screen reader: page structure, headings, focus order between components and content are yours.

## Report a barrier

If something in Unframed is hard or impossible to use with a keyboard, a screen reader, zoom, voice control or any other assistive technology, please [open a bug report](https://github.com/P-DB/unframed-ui/issues/new?template=bug_report.yml) and answer **Yes** to "Does it affect accessibility?". Tell us the component, the browser and the assistive technology.

Contributions are welcome: see what's expected of a component in [CONTRIBUTING.md](CONTRIBUTING.md).
