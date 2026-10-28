# Unframed 0.10.0 components

## Accordion

Groups `<uf-accordion-item>`s. By default opening one item closes the
others; set `multiple` to let several stay open. Up and Down arrows move
between headers, Home and End jump to the first and last.

Tags: `<uf-accordion>`, `<uf-accordion-item>`. Import: `import '@unframed/core/accordion';` (or `npx @unframed/cli add accordion` to copy the source).

### One open at a time

Add `multiple` to let several items stay open.

```html
<uf-accordion>
  <uf-accordion-item summary="What is Unframed?" open>
    A library of web components that work in any framework, or none.
  </uf-accordion-item>
  <uf-accordion-item summary="Can I edit the components?">…</uf-accordion-item>
</uf-accordion>
```

### `<uf-accordion>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `multiple` |  | `boolean` | `false` | Allows several items to be open at once. |

#### Slots

| Slot | Description |
|---|---|
| (default) | `<uf-accordion-item>` elements. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The wrapper around the items. |

### `<uf-accordion-item>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` |  | `boolean` | `false` | Whether the item is expanded. |
| `summary` |  | `string \| undefined` |  | Header text. |
| `disabled` |  | `boolean` | `false` | Prevents the user from toggling the item. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `header` | `HTMLElement \| null` | Read-only. The header element, for keyboard navigation between items. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Expands the item. |
| `hide()` | Collapses the item. |
| `focus(options: FocusOptions)` | Focuses the header. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-show` |  | The item opened. |
| `uf-hide` |  | The item closed. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The content. |
| `summary` | The header, when you need markup. Overrides `summary`. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The native `<details>`. |
| `header` | The clickable header (`<summary>`). |
| `chevron` | The arrow icon. |
| `content` | The content wrapper. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-accordion-padding` | Horizontal padding of header and content. |

## Avatar

A picture of a person or an entity. Shows the image when it loads, the
initials of `name` when there's no image or it fails, and a generic icon
when there's neither.

`name` is also the accessible name. When the name is already written next
to the avatar, set `decorative` so screen readers don't read it twice.

Tags: `<uf-avatar>`. Import: `import '@unframed/core/avatar';` (or `npx @unframed/cli add avatar` to copy the source).

### Image, initials or icon

The image when it loads, the initials of `name` when it doesn't, a generic icon when there's neither.

```html
<uf-avatar name="John Smith" src="/photos/john.jpg"></uf-avatar>
<uf-avatar name="John Smith"></uf-avatar>
<uf-avatar></uf-avatar>
```

### Sizes and shapes

```html
<uf-avatar size="sm" name="John Smith"></uf-avatar>
<uf-avatar size="xl" name="John Smith"></uf-avatar>
<uf-avatar size="xl" shape="square" name="Unframed" initials="U"></uf-avatar>
```

### Next to a name

```html
<uf-avatar name="John Smith" decorative></uf-avatar>
<strong>John Smith</strong>
```

- `name` is the accessible name. When the name is written next to the avatar, add `decorative` so screen readers don't read it twice.

### `<uf-avatar>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `src` |  | `string \| undefined` |  | Image URL. |
| `name` |  | `string \| undefined` |  | The person's or entity's name: the accessible name, and the source of the initials. |
| `initials` |  | `string \| undefined` |  | Initials to show instead of the ones taken from `name`. |
| `size` |  | `AvatarSize` | `'md'` | Size: `sm`, `md`, `lg` or `xl`. |
| `shape` |  | `AvatarShape` | `'circle'` | `circle` or `square` (rounded corners). |
| `decorative` |  | `boolean` | `false` | Hides the avatar from assistive tech, when the name is already shown next to it. |
| `loading` |  | `'eager' \| 'lazy'` | `'eager'` | The image's `loading` attribute: `lazy` waits until it's near the viewport. |

#### Slots

| Slot | Description |
|---|---|
| (default) | Custom content instead of the initials or icon, e.g. an `<uf-icon>`. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The avatar. |
| `image` | The `<img>`. |
| `initials` | The initials. |
| `icon` | The fallback icon. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-avatar-size` | Width and height. Overrides `size`. |
| `--uf-avatar-bg` | Background behind initials and icon. |
| `--uf-avatar-color` | Color of the initials and icon. |
| `--uf-avatar-radius` | Corner radius. Overrides `shape`. |

## Badge

A short label for a status, a category or a count. It's plain text for
assistive tech: write text that makes sense out of context ("3 unread", not
just "3"), or describe it in the surrounding element's label.

Tags: `<uf-badge>`. Import: `import '@unframed/core/badge';` (or `npx @unframed/cli add badge` to copy the source).

### Variants

Six colors by meaning, in three appearances: `soft` (the default), `solid` and `outline`.

```html
<uf-badge>Draft</uf-badge>
<uf-badge variant="success">Paid</uf-badge>
<uf-badge variant="warning" appearance="solid">Expiring</uf-badge>
<uf-badge variant="info" appearance="outline">Beta</uf-badge>
```

### Dot, icon and size

```html
<uf-badge dot variant="success">Online</uf-badge>
<uf-badge variant="success"><uf-icon slot="prefix" name="check-circle"></uf-icon>Verified</uf-badge>
<uf-badge size="sm" variant="accent">New</uf-badge>
```

- Badges are read as plain text: write "3 unread" rather than "3", so the badge makes sense on its own.

### `<uf-badge>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` |  | `BadgeVariant` | `'neutral'` | Color, by meaning: `neutral`, `accent`, `info`, `success`, `warning` or `danger`. |
| `appearance` |  | `BadgeAppearance` | `'soft'` | `soft` (tinted background), `solid` (bold background) or `outline` (border only). |
| `size` |  | `BadgeSize` | `'md'` | Size: `sm`, `md` or `lg`. |
| `dot` |  | `boolean` | `false` | Shows a status dot before the text. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The badge text. |
| `prefix` | An icon before the text. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The badge. |
| `dot` | The status dot, when `dot` is set. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-badge-bg` | Background color. |
| `--uf-badge-color` | Text color. |
| `--uf-badge-border-color` | Border color. |
| `--uf-badge-radius` | Corner radius. Use `999px` for a pill. |

## Breadcrumbs

Shows where the current page sits in the site: a trail of links, from the
top level to here. It's a navigation landmark with a list inside, and the
last item is marked as the current page.

Tags: `<uf-breadcrumbs>`, `<uf-breadcrumb-item>`. Import: `import '@unframed/core/breadcrumbs';` (or `npx @unframed/cli add breadcrumbs` to copy the source).

### Basic

The last item is the current page: it is not a link, and screen readers announce it as the current page.

```html
<uf-breadcrumbs>
  <uf-breadcrumb-item href="/">Home</uf-breadcrumb-item>
  <uf-breadcrumb-item href="/docs">Docs</uf-breadcrumb-item>
  <uf-breadcrumb-item>Theming</uf-breadcrumb-item>
</uf-breadcrumbs>
```

- It is a navigation landmark named "Breadcrumb" (translatable), or `label`. Name it differently if a page has two.
- Separators are hidden from screen readers, which announce the trail as a list.

### Custom separator and an icon

Put any element in the `separator` slot: it is copied between the items.

```html
<uf-breadcrumbs>
  <span slot="separator">/</span>
  <uf-breadcrumb-item href="/people/john-smith">
    <uf-icon slot="prefix" name="user"></uf-icon>John Smith
  </uf-breadcrumb-item>
  <uf-breadcrumb-item href="/people/john-smith/projects">Projects</uf-breadcrumb-item>
  <uf-breadcrumb-item>Website redesign</uf-breadcrumb-item>
</uf-breadcrumbs>
```

### `<uf-breadcrumbs>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` |  | `string \| undefined` |  | Accessible name of the navigation. Defaults to "Breadcrumb", in the page's language. |

#### Slots

| Slot | Description |
|---|---|
| (default) | `<uf-breadcrumb-item>` elements. |
| `separator` | A custom separator, e.g. `<span slot="separator">/</span>`. Copied between the items. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The `<nav>` element. |
| `list` | The list of items. |

### `<uf-breadcrumb-item>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `href` |  | `string \| undefined` |  | Link to this step. |
| `target` |  | `string \| undefined` |  | Link target, used with `href`. |
| `current` |  | `boolean` | `false` | The current page. `<uf-breadcrumbs>` sets it on the last item. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The label. |
| `prefix` | An icon before the label. |
| `separator` | Set by `<uf-breadcrumbs>`; you don't need it yourself. |

#### CSS parts

| Part | Description |
|---|---|
| `link` | The link, for items with `href`. |
| `label` | The current page's label, or an item without `href`. |
| `separator` | The separator after the item. |

## Button

A button that works like a native `<button>`, inside or outside a form,
or renders as a link when `href` is set.

Tags: `<uf-button>`. Import: `import '@unframed/core/button';` (or `npx @unframed/cli add button` to copy the source).

### Variants

```html
<uf-button>Primary</uf-button>
<uf-button variant="secondary">Secondary</uf-button>
<uf-button variant="outline">Outline</uf-button>
<uf-button variant="ghost">Ghost</uf-button>
<uf-button variant="danger">Danger</uf-button>
<uf-button variant="link">Link</uf-button>
```

### Icons, sizes and states

Icon-only buttons need a `label` for screen readers.

```html
<uf-button size="sm"><uf-icon slot="prefix" name="plus"></uf-icon>New</uf-button>
<uf-button size="lg" variant="secondary">Next<uf-icon slot="suffix" name="chevron-right"></uf-icon></uf-button>
<uf-button variant="ghost" label="Search"><uf-icon slot="prefix" name="search"></uf-icon></uf-button>
<uf-button loading>Saving</uf-button>
<uf-button disabled>Disabled</uf-button>
```

### `<uf-button>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` |  | `ButtonVariant` | `'primary'` | Visual style. |
| `size` |  | `ButtonSize` | `'md'` | Size of the button. |
| `type` |  | `ButtonType` | `'button'` | Behaviour inside a form. Defaults to `button` so it never submits by accident. |
| `disabled` |  | `boolean` | `false` | Disables the button. |
| `loading` |  | `boolean` | `false` | Shows a spinner and ignores clicks, while keeping the button focusable. |
| `label` |  | `string \| undefined` |  | Accessible name, for icon-only buttons. |
| `href` |  | `string \| undefined` |  | Renders the button as a link to this URL. |
| `target` |  | `string \| undefined` |  | Link target, used with `href`. |
| `rel` |  | `string \| undefined` |  | Link rel, used with `href`. Defaults to `noreferrer noopener` when `target="_blank"`. |
| `download` |  | `string \| undefined` |  | Download filename, used with `href`. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `form` | `HTMLFormElement \| null` | Read-only. The form this button belongs to, if any. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The button's label. |
| `prefix` | An icon or element before the label. |
| `suffix` | An icon or element after the label. ARIA state set on the host (`aria-expanded`, `aria-haspopup`, `aria-pressed`, `aria-current`, `aria-description`) is forwarded to the inner button, so popovers, tooltips and toggle patterns work with it like with a native button. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The inner `<button>` or `<a>`. |
| `label` | The wrapper around the default slot. |
| `prefix` | The prefix slot. |
| `suffix` | The suffix slot. |
| `spinner` | The loading spinner. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-button-bg` | Background color (all states unless overridden). |
| `--uf-button-bg-hover` | Background color on hover. |
| `--uf-button-bg-active` | Background color while pressed. |
| `--uf-button-color` | Text color. |
| `--uf-button-border-color` | Border color. |
| `--uf-button-radius` | Corner radius. |
| `--uf-button-height` | Height. |
| `--uf-button-padding` | Horizontal padding. |
| `--uf-button-gap` | Space between prefix, label and suffix. |
| `--uf-button-font-family` | Font family. |
| `--uf-button-font-weight` | Font weight. |

## Card

A container that groups related content: an optional image, a header, the
content and actions. Empty sections take no space.

A card is a plain container for assistive tech. To make a whole card a link,
put a link in the header and let it cover the card with CSS, so the card's
buttons stay usable.

Tags: `<uf-card>`. Import: `import '@unframed/core/card';` (or `npx @unframed/cli add card` to copy the source).

### Media, header, content and footer

Every section is optional; empty ones take no space.

```html
<uf-card>
  <img slot="media" src="/cover.png" alt="The Unframed logo" />
  <div slot="header">
    <h3>Unframed 0.2</h3>
    <small>Released this week</small>
  </div>
  A link button variant, new colors and smaller Angular bundles.
  <uf-button slot="footer">Read more</uf-button>
  <uf-button slot="footer" variant="ghost">Dismiss</uf-button>
</uf-card>
```

### Appearance and orientation

```html
<uf-card appearance="elevated">…</uf-card>
<uf-card appearance="filled">…</uf-card>
<uf-card orientation="horizontal">
  <img slot="media" src="/cover.png" alt="" />
  Media beside the content.
</uf-card>
```

### `<uf-card>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `appearance` |  | `CardAppearance` | `'outline'` | `outline` (a border), `elevated` (a shadow, or an accent glow in dark mode) or `filled` (a tinted background). |
| `orientation` |  | `CardOrientation` | `'vertical'` | `vertical`, or `horizontal` to put the media beside the content. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The main content. |
| `media` | An image or video, edge to edge at the top (or the start, when horizontal). |
| `header` | The title area, e.g. a heading and a subtitle. |
| `footer` | Actions or details at the bottom. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The card. |
| `media` | The media wrapper. |
| `header` | The header wrapper. |
| `body` | The main content wrapper. |
| `footer` | The footer wrapper. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-card-padding` | Padding of header, body and footer. |
| `--uf-card-bg` | Background color. |
| `--uf-card-border-color` | Border color. |
| `--uf-card-radius` | Corner radius. |
| `--uf-card-shadow` | Shadow of an elevated card. Defaults to a soft shadow in light mode and an accent glow in dark mode. |
| `--uf-card-media-width` | Width of the media in a horizontal card. Defaults to 40%. |

## Checkbox

A checkbox with its label as content.

Tags: `<uf-checkbox>`, `<uf-checkbox-group>`. Import: `import '@unframed/core/checkbox';`, `import '@unframed/core/checkbox-group';` (or `npx @unframed/cli add checkbox checkbox-group` to copy the source).

### States

```html
<uf-checkbox checked hint="One email a month.">Subscribe to the newsletter</uf-checkbox>
<uf-checkbox indeterminate>Select all</uf-checkbox>
<uf-checkbox disabled>Disabled</uf-checkbox>
```

### Select all

```html
<uf-checkbox-group label="Toppings">
  <uf-checkbox select-all>All toppings</uf-checkbox>
  <uf-checkbox name="topping" value="cheese">Cheese</uf-checkbox>
  <uf-checkbox name="topping" value="olives" checked>Olives</uf-checkbox>
  <uf-checkbox name="topping" value="basil">Basil</uf-checkbox>
</uf-checkbox-group>
```

### Binding the indeterminate state

```html
<uf-checkbox indeterminate>Notify me</uf-checkbox>
```

### `<uf-checkbox>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `indeterminate` |  | `boolean` | `false` | Shows a dash instead of a check, for "some selected". Cleared when the user clicks. |
| `select-all` | `selectAll` | `boolean` | `false` | Inside `<uf-checkbox-group>`: checks or unchecks every other checkbox in the group, and shows checked, unchecked or indeterminate to match them. |
| `hint` |  | `string \| undefined` |  | Help text below the label. |
| `checked` | `defaultChecked` | `boolean` | `false` | Initial state, restored on form reset. Set with the `checked` attribute. |
| `value` |  | `string` | `'on'` | Value submitted with the form when checked. |
| `size` |  | `FieldSize` | `'md'` | Size of the control and its label: `sm`, `md` or `lg`. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `checked` | `boolean` | Whether the control is on. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `toggle()` | Toggles the control, as if the user clicked it. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` |  | Fired when the checked state changes. |
| `change` | `Event` | Fired when the checked state changes. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The label. |
| `hint` | Help text below the label. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The `<label>` wrapping control and label. |
| `control` | The box. |
| `checkmark` | The check or dash icon. |
| `label` | The label text. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-checkbox-size` | Size of the box. |
| `--uf-checkbox-radius` | Corner radius of the box. |
| `--uf-checkbox-checked-bg` | Background when checked. |
| `--uf-checkbox-indeterminate-bg` | Background when indeterminate. Defaults to the checked background. |

### `<uf-checkbox-group>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` |  | `string \| undefined` |  | Visible group label. |
| `hint` |  | `string \| undefined` |  | Help text below the checkboxes. |
| `orientation` |  | `'vertical' \| 'horizontal'` | `'vertical'` | Lays the checkboxes out in a column or a row. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `value` | `string[]` | The values of the checked checkboxes (other than "select all"). |

#### Events

| Event | Type | Description |
|---|---|---|
| `change` |  | A checkbox in the group changed (including through "select all"). |

#### Slots

| Slot | Description |
|---|---|
| (default) | `<uf-checkbox>` elements. |
| `label` | The group label, when you need markup. Overrides `label`. |
| `hint` | Help text below the checkboxes. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The element with `role="group"`. |
| `form-label` | The group label. |
| `options` | The wrapper around the checkboxes. |
| `hint` | The hint text. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-checkbox-group-indent` | Indent of the checkboxes under a "select all". |

## Combobox

A text field with a filterable list of options, following the WAI-ARIA
combobox pattern. Typing filters the list; arrow keys move through it and
Enter picks an option. Only listed values can be chosen. Write options as
plain `<option>` and `<optgroup>` children, like `<uf-select>`.

Tags: `<uf-combobox>`. Import: `import '@unframed/core/combobox';` (or `npx @unframed/cli add combobox` to copy the source).

### Searchable list

Type to filter, arrow keys to move, Enter to pick.

```html
<uf-combobox label="Time zone" placeholder="Search time zones">
  <optgroup label="Europe">
    <option value="Europe/Rome">Rome</option>
    <option value="Europe/Paris">Paris</option>
  </optgroup>
  <!-- … -->
</uf-combobox>
```

### `<uf-combobox>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `defaultValue` | `string \| undefined` |  | Initially selected value, restored on form reset. Set with the `value` attribute. |
| `label` |  | `string \| undefined` |  | Visible label. |
| `hint` |  | `string \| undefined` |  | Help text below the field. |
| `placeholder` |  | `string \| undefined` |  | Placeholder text in the field. |
| `size` |  | `FieldSize` | `'md'` | Size of the field. |
| `open` |  | `boolean` | `false` | Whether the list is showing. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `value` | `string` | The selected option's value, or an empty string. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Opens the list. |
| `hide()` | Closes the list. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-show` | `Event` | The list opened. |
| `uf-hide` | `Event` | The list closed. |
| `input` |  | Fired as the user types in the field (the search text, not the value). |
| `change` | `Event` | Fired when the selected value changes. |

#### Slots

| Slot | Description |
|---|---|
| (default) | `<option>` and `<optgroup>` elements. They are read, not rendered. |
| `label` | The label, when you need markup. Overrides `label`. |
| `hint` | Help text below the field. Overrides `hint`. |
| `prefix` | An icon before the input. |

#### CSS parts

| Part | Description |
|---|---|
| `field` | The wrapper around label, control, hint and error. |
| `form-label` | The label. |
| `box` | The bordered box. |
| `input` | The native `<input>`. |
| `toggle` | The button that opens the list. |
| `listbox` | The floating list. |
| `option` | Each option. |
| `group-label` | Each group heading. |
| `empty` | The "no results" message. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-combobox-max-height` | Maximum height of the list before it scrolls. |
| `--uf-field-bg` | Background of the box. |
| `--uf-field-border-color` | Border color of the box. |
| `--uf-field-radius` | Corner radius of the box. |

## Date picker

A date field: type a date in the page language's format, or pick one from a
calendar. The value is always `YYYY-MM-DD`, like `<input type="date">`, so
it's the same in every language and submits with the form.

Alt + Down Arrow opens the calendar; Escape closes it.

Tags: `<uf-date-picker>`, `<uf-calendar>`. Import: `import '@unframed/core/date-picker';`, `import '@unframed/core/calendar';` (or `npx @unframed/cli add date-picker calendar` to copy the source).

### Type or pick a date

Type a date in the page language's format, or open the calendar. The value is always `YYYY-MM-DD`.

```html
<uf-date-picker label="Check-in" hint="From 3 pm" name="checkin" min="2026-10-14" required></uf-date-picker>
```

- Arrow keys move by day and week, Page Up and Page Down by month (with Shift, by year). Alt + Down Arrow opens the calendar, Escape closes it.
- The format, month names and first day of the week follow the nearest `lang` attribute: `14/10/2026` in Italian, `10/14/2026` in US English.
- Typed text that isn't a date stays in the field with an error, so the user can fix it.

### Disabled dates

`min` and `max` limit the range; `isDateDisabled` rules out single dates, like weekends.

```html
<uf-date-picker id="delivery" label="Delivery day" hint="Weekdays only"></uf-date-picker>

<script type="module">
  // A property, not an attribute: it's a function.
  document.querySelector('#delivery').isDateDisabled = (date) =>
    [0, 6].includes(new Date(date).getUTCDay());
</script>
```

### Calendar on its own

`<uf-calendar>` is the grid inside the picker. Use it inline, e.g. on a booking page.

```html
<uf-calendar value="2026-10-14"></uf-calendar>

<script type="module">
  document.querySelector('uf-calendar').addEventListener('change', (event) => {
    console.log(event.target.value); // "2026-10-21"
  });
</script>
```

### `<uf-date-picker>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `defaultValue` | `string` | `''` | Initial date, restored on form reset. Set with the `value` attribute, as `YYYY-MM-DD`. |
| `label` |  | `string \| undefined` |  | The field's label, also its accessible name. |
| `hint` |  | `string \| undefined` |  | Help text below the field. |
| `placeholder` |  | `string \| undefined` |  | Shown when empty. Defaults to the date format, e.g. dd/mm/yyyy. |
| `size` |  | `FieldSize` | `'md'` | Size: `sm`, `md` or `lg`. |
| `min` |  | `string \| undefined` |  | The earliest allowed date, as `YYYY-MM-DD`. |
| `max` |  | `string \| undefined` |  | The latest allowed date, as `YYYY-MM-DD`. |
| `readonly` |  | `boolean` | `false` | Lets the user select the text but not change the date. |
| `open` |  | `boolean` | `false` | Whether the calendar is open. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `value` | `string` | The date, as `YYYY-MM-DD`, or an empty string. |
| `isDateDisabled` | `((date: string) => boolean) \| undefined` | Rules out dates, e.g. weekends: called with each date as `YYYY-MM-DD`, returns true to disable it. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Opens the calendar. |
| `hide()` | Closes the calendar. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` | `Event` | The value changed (a date was typed and committed, or picked). |
| `change` | `Event` | The value changed (a date was typed and committed, or picked). |
| `uf-show` |  | The calendar opened. |
| `uf-hide` |  | The calendar closed. |

#### Slots

| Slot | Description |
|---|---|
| `label` | The label, when you need markup. Overrides `label`. |
| `hint` | Help text below the field. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `field` | The wrapper around label, control, hint and error. |
| `form-label` | The label. |
| `box` | The bordered box around the input. |
| `input` | The text input. |
| `toggle` | The calendar button. |
| `popup` | The floating panel around the calendar. |
| `calendar` | The `<uf-calendar>`. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-field-bg` | Background of the box. |
| `--uf-field-border-color` | Border color of the box. |
| `--uf-field-radius` | Corner radius of the box. |

### `<uf-calendar>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` |  | `string` | `''` | The selected date, as `YYYY-MM-DD`, or an empty string. |
| `min` |  | `string \| undefined` |  | The earliest date that can be picked, as `YYYY-MM-DD`. |
| `max` |  | `string \| undefined` |  | The latest date that can be picked, as `YYYY-MM-DD`. |
| `first-day-of-week` | `firstDayOfWeek` | `number \| undefined` |  | First day of the week: 0 Sunday … 6 Saturday. Defaults to the language's. |
| `range` |  | `boolean` | `false` | Picks a range, from `start` to `end`, instead of one date. |
| `start` |  | `string` | `''` | With `range`, the first date of the range, as `YYYY-MM-DD`, or an empty string. |
| `end` |  | `string` | `''` | With `range`, the last date of the range, as `YYYY-MM-DD`, or an empty string. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `isDateDisabled` | `((date: string) => boolean) \| undefined` | Rules out dates, e.g. weekends: called with each date as `YYYY-MM-DD`, returns true to disable it. |

#### Methods

| Method | Description |
|---|---|
| `focus(options: FocusOptions)` | Moves keyboard focus to the selected day, or today. |

#### Events

| Event | Type | Description |
|---|---|---|
| `change` | `Event` | The user picked a date (read `value`), or, with `range`, completed a range (read `start` and `end`). |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The calendar. |
| `header` | The month title and the previous and next buttons. |
| `title` | The month and year. |
| `nav-button` | The previous and next month buttons. |
| `grid` | The `<table>` of days. |
| `weekday` | A weekday heading. |
| `day` | Every day. |
| `selected` | The selected day. |
| `today` | Today. |
| `range-start` | With `range`, the start date. |
| `range-end` | With `range`, the end date. |
| `in-range` | With `range`, a day between the start and the end. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-calendar-day-size` | Width and height of a day. |

## Date range picker

A date range field: type the start and end dates in the page language's
format, or pick both from a calendar. The value is an ISO 8601 interval,
`YYYY-MM-DD/YYYY-MM-DD`, the same in every language, and it submits with the
form; `start` and `end` hold the two dates.

Alt + Down Arrow opens the calendar; Escape closes it.

Tags: `<uf-date-range-picker>`, `<uf-calendar>`. Import: `import '@unframed/core/date-range-picker';`, `import '@unframed/core/calendar';` (or `npx @unframed/cli add date-range-picker calendar` to copy the source).

### Basic

Type the two dates, or pick them in the calendar: the first click sets the start, the second the end.

```html
<uf-date-range-picker name="stay" label="Stay" hint="Check-in from 3 pm"></uf-date-range-picker>
```

- The value is an ISO 8601 interval, `2026-10-14/2026-10-18`, the same in every language; `start` and `end` hold the two dates.
- The format, month names and first day of the week follow the nearest `lang`.

### Limits and validation

`min`, `max` and `isDateDisabled`, as in the date picker. A missing or reversed date gets its own message.

```html
<uf-date-range-picker name="leave" label="Leave" required min="2026-10-20" max="2027-01-18"></uf-date-range-picker>
<script>
  // A function, so it's set as a property.
  document.querySelector('uf-date-range-picker').isDateDisabled = (iso) => [0, 6].includes(new Date(iso).getUTCDay());
</script>
```

### Calendar on its own

`<uf-calendar range>` picks a range inline, e.g. on a booking page. `change` fires when both dates are picked.

```html
<uf-calendar range start="2026-10-22" end="2026-10-26"></uf-calendar>
```

### `<uf-date-range-picker>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `defaultValue` | `string` | `''` | Initial range, restored on form reset. Set with the `value` attribute, as `YYYY-MM-DD/YYYY-MM-DD`. |
| `label` |  | `string \| undefined` |  | The field's label, also its accessible name. |
| `hint` |  | `string \| undefined` |  | Help text below the field. |
| `placeholder` |  | `string \| undefined` |  | Shown in both inputs when empty. Defaults to the date format, e.g. dd/mm/yyyy. |
| `size` |  | `FieldSize` | `'md'` | Size: `sm`, `md` or `lg`. |
| `min` |  | `string \| undefined` |  | The earliest allowed date, as `YYYY-MM-DD`. |
| `max` |  | `string \| undefined` |  | The latest allowed date, as `YYYY-MM-DD`. |
| `readonly` |  | `boolean` | `false` | Lets the user select the text but not change the dates. |
| `open` |  | `boolean` | `false` | Whether the calendar is open. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `start` | `string` | The first date of the range, as `YYYY-MM-DD`, or an empty string. |
| `end` | `string` | The last date of the range, as `YYYY-MM-DD`, or an empty string. |
| `isDateDisabled` | `((date: string) => boolean) \| undefined` | Rules out dates, e.g. weekends: called with each date as `YYYY-MM-DD`, returns true to disable it. |
| `value` | `string` | The range as an ISO 8601 interval, `YYYY-MM-DD/YYYY-MM-DD`, or an empty string until both dates are set. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Opens the calendar. |
| `hide()` | Closes the calendar. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` | `Event` | The range changed (a date was typed and committed, or both were picked). |
| `change` | `Event` | The range changed (a date was typed and committed, or both were picked). |
| `uf-show` |  | The calendar opened. |
| `uf-hide` |  | The calendar closed. |

#### Slots

| Slot | Description |
|---|---|
| `label` | The label, when you need markup. Overrides `label`. |
| `hint` | Help text below the field. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `field` | The wrapper around label, control, hint and error. |
| `form-label` | The label. |
| `box` | The bordered box around the inputs. |
| `start-input` | The start date input. |
| `end-input` | The end date input. |
| `separator` | The dash between the two inputs. |
| `toggle` | The calendar button. |
| `popup` | The floating panel around the calendar. |
| `calendar` | The `<uf-calendar>`. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-field-bg` | Background of the box. |
| `--uf-field-border-color` | Border color of the box. |
| `--uf-field-radius` | Corner radius of the box. |

### `<uf-calendar>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` |  | `string` | `''` | The selected date, as `YYYY-MM-DD`, or an empty string. |
| `min` |  | `string \| undefined` |  | The earliest date that can be picked, as `YYYY-MM-DD`. |
| `max` |  | `string \| undefined` |  | The latest date that can be picked, as `YYYY-MM-DD`. |
| `first-day-of-week` | `firstDayOfWeek` | `number \| undefined` |  | First day of the week: 0 Sunday … 6 Saturday. Defaults to the language's. |
| `range` |  | `boolean` | `false` | Picks a range, from `start` to `end`, instead of one date. |
| `start` |  | `string` | `''` | With `range`, the first date of the range, as `YYYY-MM-DD`, or an empty string. |
| `end` |  | `string` | `''` | With `range`, the last date of the range, as `YYYY-MM-DD`, or an empty string. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `isDateDisabled` | `((date: string) => boolean) \| undefined` | Rules out dates, e.g. weekends: called with each date as `YYYY-MM-DD`, returns true to disable it. |

#### Methods

| Method | Description |
|---|---|
| `focus(options: FocusOptions)` | Moves keyboard focus to the selected day, or today. |

#### Events

| Event | Type | Description |
|---|---|---|
| `change` | `Event` | The user picked a date (read `value`), or, with `range`, completed a range (read `start` and `end`). |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The calendar. |
| `header` | The month title and the previous and next buttons. |
| `title` | The month and year. |
| `nav-button` | The previous and next month buttons. |
| `grid` | The `<table>` of days. |
| `weekday` | A weekday heading. |
| `day` | Every day. |
| `selected` | The selected day. |
| `today` | Today. |
| `range-start` | With `range`, the start date. |
| `range-end` | With `range`, the end date. |
| `in-range` | With `range`, a day between the start and the end. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-calendar-day-size` | Width and height of a day. |

## Dialog

A modal dialog built on the native `<dialog>`: it renders in the top layer,
traps focus, makes the page inert, and returns focus to the opener on close.
Any element inside with `data-dialog="close"` closes it.

Tags: `<uf-dialog>`. Import: `import '@unframed/core/dialog';` (or `npx @unframed/cli add dialog` to copy the source).

### Confirmation

Escape, the close button and any element with `data-dialog="close"` close it.

```html
<uf-button variant="danger" onclick="this.nextElementSibling.show()">Delete project…</uf-button>
<uf-dialog label="Delete project?" light-dismiss>
  <p>This permanently deletes the project and its 128 issues.</p>
  <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
  <uf-button slot="footer" variant="danger">Delete</uf-button>
</uf-dialog>
```

### `<uf-dialog>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` |  | `boolean` | `false` | Whether the dialog is open. |
| `label` |  | `string \| undefined` |  | Title of the dialog, also its accessible name. |
| `light-dismiss` | `lightDismiss` | `boolean` | `false` | Closes the dialog when the backdrop is clicked. |
| `without-header` | `withoutHeader` | `boolean` | `false` | Hides the header. Set `label` anyway, so the dialog keeps an accessible name. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Opens the dialog. |
| `hide()` | Closes the dialog, without firing `uf-request-close`. |
| `requestClose(source?: DialogCloseSource)` | Asks to close, as a user action would. Listeners can cancel it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-show` | `Event` | The dialog opened. |
| `uf-hide` | `Event` | The dialog closed. |
| `uf-request-close` | `CustomEvent<DialogRequestCloseDetail>` | The user tried to close the dialog. Call `preventDefault()` to keep it open. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The dialog content. |
| `label` | The title, when you need markup. Overrides `label`. |
| `header-actions` | Extra buttons next to the close button. |
| `footer` | Actions at the bottom, usually buttons. |

#### CSS parts

| Part | Description |
|---|---|
| `dialog` | The native `<dialog>`. |
| `header` | The header with title and close button. |
| `title` | The title. |
| `close-button` | The close button. |
| `body` | The content area. |
| `footer` | The footer. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-dialog-bg` | Background of the dialog. |
| `--uf-dialog-width` | Width of the dialog. Defaults to `32rem`. |
| `--uf-dialog-padding` | Padding of header, body and footer. |
| `--uf-dialog-radius` | Corner radius. |
| `--uf-dialog-backdrop` | Backdrop color. |

## Drawer

A panel that slides in from an edge of the screen, for navigation, filters or
details. It is a modal dialog, so it behaves like `<uf-dialog>`: it traps
focus, makes the page inert, closes with Escape, and returns focus to the
opener. Any element inside with `data-dialog="close"` closes it.

Tags: `<uf-drawer>`. Import: `import '@unframed/core/drawer';` (or `npx @unframed/cli add drawer` to copy the source).

### Filters

A modal panel from the end edge. Escape, the close button and any element with `data-dialog="close"` close it.

```html
<uf-button variant="outline" onclick="this.nextElementSibling.show()">Filters</uf-button>
<uf-drawer label="Filters" light-dismiss>
  <uf-checkbox-group label="Status">
    <uf-checkbox value="open">Open</uf-checkbox>
    <uf-checkbox value="closed">Closed</uf-checkbox>
  </uf-checkbox-group>
  <uf-button slot="footer" variant="ghost" data-dialog="close">Cancel</uf-button>
  <uf-button slot="footer" data-dialog="close">Apply</uf-button>
</uf-drawer>
```

- It is a modal dialog: focus stays inside, the page behind is inert and does not scroll, and focus returns to the button on close.

### Placement

`start`, `end` (the default), `top` or `bottom`. Start and end follow the page direction. `--uf-drawer-size` sets the width, or the height for top and bottom.

```html
<uf-drawer label="Menu" placement="start">…</uf-drawer>
<uf-drawer label="Cart" placement="end" style="--uf-drawer-size: 28rem">…</uf-drawer>
<uf-drawer label="Cookies" placement="bottom">…</uf-drawer>
```

### `<uf-drawer>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `placement` |  | `DrawerPlacement` | `'end'` | The edge it slides in from: `start` (left, in left-to-right pages), `end`, `top` or `bottom`. |
| `open` |  | `boolean` | `false` | Whether the dialog is open. |
| `label` |  | `string \| undefined` |  | Title of the dialog, also its accessible name. |
| `light-dismiss` | `lightDismiss` | `boolean` | `false` | Closes the dialog when the backdrop is clicked. |
| `without-header` | `withoutHeader` | `boolean` | `false` | Hides the header. Set `label` anyway, so the dialog keeps an accessible name. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Opens the dialog. |
| `hide()` | Closes the dialog, without firing `uf-request-close`. |
| `requestClose(source?: DialogCloseSource)` | Asks to close, as a user action would. Listeners can cancel it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-show` | `Event` | The drawer opened. |
| `uf-hide` | `Event` | The drawer closed. |
| `uf-request-close` | `CustomEvent<DialogRequestCloseDetail>` | The user tried to close the drawer. Call `preventDefault()` to keep it open. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The drawer content. |
| `label` | The title, when you need markup. Overrides `label`. |
| `header-actions` | Extra buttons next to the close button. |
| `footer` | Actions at the bottom, usually buttons. |

#### CSS parts

| Part | Description |
|---|---|
| `dialog` | The native `<dialog>`. |
| `header` | The header with title and close button. |
| `title` | The title. |
| `close-button` | The close button. |
| `body` | The content area. |
| `footer` | The footer. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-drawer-size` | Width of a side drawer, or height of a top or bottom one. Defaults to `24rem`. |
| `--uf-drawer-radius` | Corner radius of the corners on the open side; the side against the screen edge stays square. |
| `--uf-dialog-bg` | Background of the drawer. |
| `--uf-dialog-padding` | Padding of header, body and footer. |
| `--uf-dialog-backdrop` | Backdrop color. |
| `--uf-dialog-width` | Width of the dialog. Defaults to `32rem`. |
| `--uf-dialog-radius` | Corner radius. |

## Dropdown menu

A button that opens a `<uf-menu>`, following the WAI-ARIA menu button
pattern: Enter, Space or Down open it on the first item, Up on the last;
choosing an item or pressing Escape closes it and returns focus to the button.

Tags: `<uf-dropdown>`, `<uf-menu>`, `<uf-menu-item>`. Import: `import '@unframed/core/dropdown';`, `import '@unframed/core/menu';` (or `npx @unframed/cli add dropdown menu` to copy the source).

### Menu button

Arrow keys move, typing a letter jumps to an item, Escape closes.

```html
<uf-dropdown>
  <uf-button slot="trigger" variant="secondary">Actions</uf-button>
  <uf-menu label="Project actions">
    <uf-menu-item value="edit">Edit<span slot="suffix">⌘E</span></uf-menu-item>
    <uf-menu-item value="duplicate">Duplicate</uf-menu-item>
    <hr />
    <uf-menu-item value="pin" type="checkbox" checked>Pinned</uf-menu-item>
  </uf-menu>
</uf-dropdown>
```

### `<uf-dropdown>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` |  | `boolean` | `false` | Whether the popover is open. |
| `placement` |  | `Placement` | `'bottom-start'` | Preferred side. Flips when there is no room. |
| `distance` |  | `number` | `6` | Gap between trigger and panel, in pixels. |
| `label` |  | `string \| undefined` |  | Accessible name of the panel. Defaults to the trigger's text. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Opens the popover. |
| `hide()` | Closes the popover. |
| `toggle()` | Opens the popover if closed, closes it if open. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-select` | `CustomEvent<MenuSelectDetail>` | An item was chosen (bubbles up from the menu). |
| `uf-show` | `Event` | The menu opened. |
| `uf-hide` |  | The menu closed. |

#### Slots

| Slot | Description |
|---|---|
| `trigger` | The button that opens the menu. |
| (default) | A `<uf-menu>`. |

#### CSS parts

| Part | Description |
|---|---|
| `panel` | The floating panel around the menu. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-popover-padding` | Padding of the panel. |
| `--uf-popover-width` | Width of the panel. Defaults to its content. |

### `<uf-menu>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` |  | `string \| undefined` |  | Accessible name of the menu. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `items` | `UfMenuItem[]` | Read-only. Enabled items that belong to this menu (not to a nested one). |

#### Methods

| Method | Description |
|---|---|
| `focusFirst()` | Focuses the first enabled item. |
| `focusLast()` | Focuses the last enabled item. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-select` | `CustomEvent<MenuSelectDetail>` | An item was chosen. Cancel it to keep a dropdown open. |

#### Slots

| Slot | Description |
|---|---|
| (default) | `<uf-menu-item>` elements and `<hr>` separators. |

### `<uf-menu-item>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` |  | `string` | `''` | Identifies the item in the menu's `uf-select` event. |
| `type` |  | `'normal' \| 'checkbox'` | `'normal'` | `checkbox` items toggle `checked` when selected. |
| `checked` |  | `boolean` | `false` | Whether a checkbox item is on. |
| `disabled` |  | `boolean` | `false` | Disables the item. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The label. |
| `prefix` | An icon before the label. |
| `suffix` | Trailing content, e.g. a keyboard shortcut. |

#### CSS parts

| Part | Description |
|---|---|
| `checkmark` | The check shown for checked checkbox items. |
| `label` | The label wrapper. |

## File upload

Picks files to send with a form: from a button, or by dragging them onto the
drop zone. The chosen files are listed with their size and a remove button.
Files that don't match `accept` or are larger than `max-size` are refused,
with a message saying why. It submits like a native `<input type="file">`.

Tags: `<uf-file-upload>`. Import: `import '@unframed/core/file-upload';` (or `npx @unframed/cli add file-upload` to copy the source).

### Basic

A button and a drop zone. The chosen files are listed with their size and a remove button.

```html
<uf-file-upload name="attachments" label="Attachments" hint="PDF or images, up to 5 MB each" multiple accept=".pdf, image/*" max-size="5000000"></uf-file-upload>
```

- Files that `accept` rules out, or larger than `max-size` (in bytes), are refused, with a message saying why.
- It submits with its form like a native file input: `new FormData(form).getAll("attachments")` returns the files.

### One file, required

Without `multiple`, a new pick replaces the file. `required` makes the form ask for one.

```html
<form>
  <uf-file-upload name="cv" label="Your CV" accept=".pdf" required></uf-file-upload>
  <uf-button type="submit">Apply</uf-button>
</form>
```

### `<uf-file-upload>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` |  | `string \| undefined` |  | Visible label. |
| `hint` |  | `string \| undefined` |  | Help text, e.g. the accepted types and size. |
| `accept` |  | `string \| undefined` |  | Accepted files, as in a native file input: extensions (`.pdf`), MIME types (`image/png`) or wildcards (`image/*`), comma-separated. |
| `multiple` |  | `boolean` | `false` | Lets users choose more than one file. |
| `max-size` | `maxSize` | `number \| undefined` |  | Largest accepted file, in bytes, e.g. `5000000` for 5 MB. |
| `size` |  | `FieldSize` | `'md'` | Size of the drop zone: `sm`, `md` or `lg`. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `files` | `File[]` | The chosen files. Set it to `[]` to clear them. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `showPicker()` | Opens the file picker. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` | `Event` | Fired when files are added or removed. |
| `change` | `Event` | Fired when files are added or removed. |

#### Slots

| Slot | Description |
|---|---|
| `label` | The label, when you need markup. Overrides `label`. |
| `hint` | Help text below the label. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `field` | The wrapper around label, drop zone, files, hint and error. |
| `form-label` | The label. |
| `dropzone` | The area files can be dropped on. |
| `button` | The button that opens the file picker. |
| `files` | The list of chosen files. |
| `file` | A chosen file. |
| `remove-button` | A file's remove button. |
| `rejected` | Why files were refused. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-file-upload-border-color` | Border color of the drop zone. |
| `--uf-file-upload-bg` | Background of the drop zone. |
| `--uf-file-upload-radius` | Corner radius of the drop zone. Defaults to the theme's control radius. |
| `--uf-file-upload-active-color` | Border and background tint while files are dragged over. |

## Icon

An icon from the built-in set, or one added with `registerIcons()`.
Icons are decorative unless you give them a `label`.

Tags: `<uf-icon>`. Import: `import '@unframed/core/icon';` (or `npx @unframed/cli add icon` to copy the source).

### Built-in set

Icons are decorative unless you give them a `label`. Add your own with `registerIcons()`.

```html
<uf-icon name="check-circle" label="Done"></uf-icon>
```

### Your own icons

```html
<script type="module">
  import { registerIcons } from '@unframed/core/icon';

  registerIcons({
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">…</svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor">…</svg>',
  });
</script>

<uf-icon name="heart" label="Favorite"></uf-icon>
<uf-button><uf-icon slot="prefix" name="heart"></uf-icon>Save</uf-button>
```

- Use `currentColor` for strokes and fills, so the icon takes the text color around it (set `color` to change it).
- Keep a `viewBox` and leave out `width`/`height`: the icon is `1em` square, so it follows the font size. Change it with `--uf-icon-size`.
- Registering a built-in name (e.g. `x`) replaces that icon everywhere, including inside components like the dialog's close button.
- Icons already on the page update when you register their name, so registration order doesn't matter.
- The markup is inserted as-is: only register SVG from your own code or files, never from user input.

### `<uf-icon>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `name` |  | `BuiltInIconName \| (string & {})` | `''` | Icon name: a built-in icon or one added with `registerIcons()`. |
| `label` |  | `string \| undefined` |  | Accessible label. Without it the icon is hidden from assistive tech. |

#### CSS parts

| Part | Description |
|---|---|
| `svg` | The `<svg>` element. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-icon-size` | Width and height. Defaults to `1em`, so it follows the font size. |
| `--uf-icon-stroke-width` | Stroke width of built-in icons. |

## Input

A single-line text field with a built-in label, hint and validation message.

Tags: `<uf-input>`. Import: `import '@unframed/core/input';` (or `npx @unframed/cli add input` to copy the source).

### With label, hint and validation

Errors appear after the user edits the field or tries to submit.

```html
<form>
  <uf-input name="email" type="email" label="Email" hint="We never share it." required>
    <uf-icon slot="prefix" name="info"></uf-icon>
  </uf-input>
  <uf-button type="submit">Subscribe</uf-button>
</form>
```

### `<uf-input>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `type` |  | `InputType` | `'text'` | Input type. |
| `value` | `defaultValue` | `string` | `''` | Initial value, restored on form reset. Set with the `value` attribute. |
| `label` |  | `string \| undefined` |  | Visible label. |
| `hint` |  | `string \| undefined` |  | Help text below the field. |
| `placeholder` |  | `string \| undefined` |  | Placeholder text. |
| `size` |  | `FieldSize` | `'md'` | Size of the field. |
| `readonly` |  | `boolean` | `false` | Makes the field read-only. |
| `autocomplete` |  | `AutoFill \| undefined` |  | Native `autocomplete` hint. |
| `inputmode` |  | `string \| undefined` |  | Native `inputmode` hint for virtual keyboards. |
| `pattern` |  | `string \| undefined` |  | Regex the value must match. |
| `min` |  | `string \| undefined` |  | Minimum value, for number and date types. |
| `max` |  | `string \| undefined` |  | Maximum value, for number and date types. |
| `step` |  | `string \| undefined` |  | Step, for number and date types. |
| `minlength` |  | `number \| undefined` |  | Minimum length. |
| `maxlength` |  | `number \| undefined` |  | Maximum length. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `value` | `string` | Current value. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `select()` | Selects all text in the field. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` |  | Fired on every keystroke. |
| `change` | `Event` | Fired when the value is committed (blur or Enter). |

#### Slots

| Slot | Description |
|---|---|
| `label` | The label, when you need markup. Overrides `label`. |
| `hint` | Help text below the field. Overrides `hint`. |
| `prefix` | An icon or text before the input. |
| `suffix` | An icon or text after the input. |

#### CSS parts

| Part | Description |
|---|---|
| `field` | The wrapper around label, control, hint and error. |
| `form-label` | The label. |
| `box` | The bordered box around the input. |
| `input` | The native `<input>`. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-field-bg` | Background of the box. |
| `--uf-field-border-color` | Border color of the box. |
| `--uf-field-radius` | Corner radius of the box. |

## Pagination

Navigation between the pages of a list or table. Set `pages` and `page`; the
user changes `page`, and `uf-page-change` tells you which page to show.

It's a navigation landmark: when a page has more than one, give each a
different `label`.

Tags: `<uf-pagination>`. Import: `import '@unframed/core/pagination';` (or `npx @unframed/cli add pagination` to copy the source).

### Pages

Long ranges collapse around the current page; the number of buttons stays the same from page to page.

```html
<uf-pagination pages="20" page="6"></uf-pagination>

<script type="module">
  document.querySelector('uf-pagination').addEventListener('uf-page-change', (event) => {
    loadPage(event.detail.page);
  });
</script>
```

### Siblings and size

```html
<uf-pagination pages="30" page="15" siblings="2"></uf-pagination>
<uf-pagination pages="30" page="15" size="sm"></uf-pagination>
```

- Each pagination is a navigation landmark: when a page has more than one, give each a different `label`.

### `<uf-pagination>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `page` |  | `number` | `1` | The current page, from 1. |
| `pages` |  | `number` | `1` | How many pages there are. |
| `siblings` |  | `number` | `1` | How many pages to show on each side of the current one. |
| `label` |  | `string \| undefined` |  | Accessible name of the navigation, e.g. "Search results pages". Defaults to "Pagination", or its translation. |
| `size` |  | `PaginationSize` | `'md'` | Size: `sm`, `md` or `lg`. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-page-change` | `CustomEvent<PageChangeDetail>` | The user chose another page. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The `<nav>`. |
| `list` | The list of buttons. |
| `button` | Every button: pages, previous and next. |
| `current` | The current page's button. |
| `previous` | The previous button. |
| `next` | The next button. |
| `ellipsis` | The "…" between pages. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-pagination-gap` | Space between the buttons. |

## Popover

A panel anchored to a trigger, built on the Popover API: it renders in the
top layer and closes on Escape or a click outside. Use it for menus of
actions, filters or small forms; use a dialog for anything that blocks the page.

Tags: `<uf-popover>`. Import: `import '@unframed/core/popover';` (or `npx @unframed/cli add popover` to copy the source).

### Floating panel

```html
<uf-popover>
  <uf-button slot="trigger" variant="outline">Filters</uf-button>
  <uf-checkbox checked>Open issues</uf-checkbox>
  <uf-checkbox>Closed issues</uf-checkbox>
</uf-popover>
```

### `<uf-popover>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `open` |  | `boolean` | `false` | Whether the popover is open. |
| `placement` |  | `Placement` | `'bottom-start'` | Preferred side. Flips when there is no room. |
| `distance` |  | `number` | `6` | Gap between trigger and panel, in pixels. |
| `label` |  | `string \| undefined` |  | Accessible name of the panel. Defaults to the trigger's text. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Opens the popover. |
| `hide()` | Closes the popover. |
| `toggle()` | Opens the popover if closed, closes it if open. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-show` | `Event` | The popover opened. |
| `uf-hide` |  | The popover closed. |

#### Slots

| Slot | Description |
|---|---|
| `trigger` | The element that toggles the popover, usually a button. |
| (default) | The popover content. |

#### CSS parts

| Part | Description |
|---|---|
| `panel` | The floating panel. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-popover-padding` | Padding of the panel. |
| `--uf-popover-width` | Width of the panel. Defaults to its content. |

## Progress

A bar that shows how far a task has got. Without a `value` it's
indeterminate: an animated bar for work whose length isn't known, like a
native `<progress>`.

Tags: `<uf-progress>`. Import: `import '@unframed/core/progress';` (or `npx @unframed/cli add progress` to copy the source).

### Value

`value` out of `max` (100 by default). `show-value` adds the percentage.

```html
<uf-progress label="Uploading report.pdf" value="45" show-value></uf-progress>
<uf-progress label="Storage" value="92" variant="warning" show-value></uf-progress>
<uf-progress label="Profile complete" value="5" max="5" variant="success" size="sm"></uf-progress>
```

- Screen readers announce it as a progress bar with its label and percentage. Without a `label`, it is named "Progress" (translatable).

### Indeterminate

Leave out `value` when the length of the work is not known.

```html
<uf-progress label="Preparing your export"></uf-progress>
```

### `<uf-progress>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` |  | `number \| undefined` |  | Progress so far, from 0 to `max`. Leave it out for an indeterminate bar. |
| `max` |  | `number` | `100` | The value that means done. |
| `label` |  | `string \| undefined` |  | Visible label, also the bar's accessible name. Without one, it's named "Progress". |
| `show-value` | `showValue` | `boolean` | `false` | Shows the percentage next to the label. |
| `variant` |  | `ProgressVariant` | `'accent'` | Color, by meaning: `accent`, `success`, `warning` or `danger`. |
| `size` |  | `ProgressSize` | `'md'` | Height of the bar: `sm`, `md` or `lg`. |

#### Slots

| Slot | Description |
|---|---|
| `label` | The label, when you need markup. Overrides `label`. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The wrapper around label and bar. |
| `label` | The label. |
| `value` | The percentage, when `show-value` is set. |
| `track` | The bar's background. |
| `indicator` | The filled part of the bar. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-progress-height` | Height of the bar. |
| `--uf-progress-radius` | Corner radius of the bar. Use `999px` for a pill. |
| `--uf-progress-track-color` | Color of the bar's background. |
| `--uf-progress-indicator-color` | Color of the filled part. |

## Radio group

A group of `<uf-radio>` options with one selected value. Arrow keys move
the selection, and only the selected option is in the tab order.

Tags: `<uf-radio-group>`, `<uf-radio>`. Import: `import '@unframed/core/radio-group';`, `import '@unframed/core/radio';` (or `npx @unframed/cli add radio-group radio` to copy the source).

### Pick one

Arrow keys move the selection; only the selected radio is in the tab order.

```html
<uf-radio-group label="Plan" value="pro" orientation="horizontal">
  <uf-radio value="free">Free</uf-radio>
  <uf-radio value="pro">Pro</uf-radio>
  <uf-radio value="team">Team</uf-radio>
  <uf-radio value="enterprise" disabled>Enterprise</uf-radio>
</uf-radio-group>
```

### `<uf-radio-group>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `defaultValue` | `string` | `''` | Initially selected value, restored on form reset. Set with the `value` attribute. |
| `label` |  | `string \| undefined` |  | Visible group label. |
| `hint` |  | `string \| undefined` |  | Help text below the options. |
| `orientation` |  | `'vertical' \| 'horizontal'` | `'vertical'` | Lays the options out in a column or a row. |
| `size` |  | `FieldSize` | `'md'` | Size of the radios and their labels: `sm`, `md` or `lg`. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `value` | `string` | The selected radio's value, or an empty string. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `focus(options: FocusOptions)` | Moves focus to the selected radio, or the first enabled one. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` | `Event` | Fired when the selection changes. |
| `change` | `Event` | Fired when the selection changes. |

#### Slots

| Slot | Description |
|---|---|
| (default) | `<uf-radio>` elements. |
| `label` | The group label, when you need markup. Overrides `label`. |
| `hint` | Help text below the options. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The element with `role="radiogroup"`. |
| `form-label` | The group label. |
| `options` | The wrapper around the radios. |
| `hint` | The hint text. |
| `error` | The validation message. |

### `<uf-radio>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` |  | `string` | `''` | Value the group takes when this radio is selected. |
| `checked` |  | `boolean` | `false` | Whether this radio is selected. Set by the group. |
| `disabled` |  | `boolean` | `false` | Disables this option. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The label. |

#### CSS parts

| Part | Description |
|---|---|
| `control` | The circle. |
| `label` | The label text. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-radio-size` | Size of the circle. |
| `--uf-radio-checked-bg` | Color of the circle when checked. |

## Select

A dropdown built on the native `<select>`, so it gets the platform's
keyboard support, screen reader support and mobile pickers for free.
Write options as plain `<option>` and `<optgroup>` children.

Tags: `<uf-select>`. Import: `import '@unframed/core/select';` (or `npx @unframed/cli add select` to copy the source).

### Native options

Built on the native `<select>`: write plain `<option>` and `<optgroup>` children.

```html
<uf-select label="Country" placeholder="Choose a country">
  <option value="it">Italy</option>
  <option value="fr">France</option>
  <optgroup label="Elsewhere">
    <option value="jp">Japan</option>
    <option value="us">United States</option>
  </optgroup>
</uf-select>
```

### `<uf-select>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `defaultValue` | `string \| undefined` |  | Initially selected value, restored on form reset. Set with the `value` attribute. |
| `label` |  | `string \| undefined` |  | Visible label. |
| `hint` |  | `string \| undefined` |  | Help text below the field. |
| `placeholder` |  | `string \| undefined` |  | Text shown while nothing is selected. |
| `size` |  | `FieldSize` | `'md'` | Size of the field. |
| `autocomplete` |  | `AutoFill \| undefined` |  | Native `autocomplete` hint. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `value` | `string` | The selected option's value. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` |  | Fired when the selection changes. |
| `change` | `Event` | Fired when the selection changes. |

#### Slots

| Slot | Description |
|---|---|
| (default) | `<option>` and `<optgroup>` elements. They are mirrored into the native select. |
| `label` | The label, when you need markup. Overrides `label`. |
| `hint` | Help text below the field. Overrides `hint`. |
| `prefix` | An icon before the selected value. |

#### CSS parts

| Part | Description |
|---|---|
| `field` | The wrapper around label, control, hint and error. |
| `form-label` | The label. |
| `box` | The bordered box. |
| `select` | The native `<select>`. |
| `chevron` | The dropdown arrow. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-field-bg` | Background of the box. |
| `--uf-field-border-color` | Border color of the box. |
| `--uf-field-radius` | Corner radius of the box. |

## Slider

Picks a number in a range by dragging a handle, or with the arrow keys. Built
on the native range input, so keyboard, touch and screen readers work as
they do everywhere; it submits its value with the form.

Tags: `<uf-slider>`. Import: `import '@unframed/core/slider';` (or `npx @unframed/cli add slider` to copy the source).

### Basic

A native range input underneath: arrow keys, Page Up/Down, Home and End, touch, and screen readers work as everywhere.

```html
<uf-slider name="volume" label="Volume" hint="Applies to every device" value="40" show-value></uf-slider>
```

- The value is a number. It submits with its form, and `input` fires while dragging, `change` when the user lets go.

### Range and step

`min`, `max` and `step`. The value always lands on a step within the range.

```html
<uf-slider label="Maximum price (€)" min="0" max="500" step="10" value="250" show-value></uf-slider>
<uf-slider label="Rating" min="1" max="5" value="4" show-value disabled></uf-slider>
```

### `<uf-slider>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `defaultValue` | `number \| undefined` |  | Initial value, restored on form reset. Set with the `value` attribute. Defaults to the middle of the range, like a native slider. |
| `min` |  | `number` | `0` | Lowest value. |
| `max` |  | `number` | `100` | Highest value. |
| `step` |  | `number` | `1` | Granularity: the value moves in steps of this size. |
| `label` |  | `string \| undefined` |  | Visible label, also the slider's accessible name. |
| `hint` |  | `string \| undefined` |  | Help text below the slider. |
| `show-value` | `showValue` | `boolean` | `false` | Shows the current value next to the label. |
| `size` |  | `FieldSize` | `'md'` | Size of the track and handle: `sm`, `md` or `lg`. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `value` | `number` | Current value. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` |  | Fired while the handle moves. |
| `change` | `Event` | Fired when the user lets go, or after a key press. |

#### Slots

| Slot | Description |
|---|---|
| `label` | The label, when you need markup. Overrides `label`. |
| `hint` | Help text below the slider. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `field` | The wrapper around label, slider, hint and error. |
| `form-label` | The label. |
| `value` | The current value, when `show-value` is set. |
| `input` | The native range `<input>`. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-slider-track-height` | Height of the track. |
| `--uf-slider-track-color` | Color of the track's empty part. |
| `--uf-slider-indicator-color` | Color of the track up to the handle. |
| `--uf-slider-thumb-size` | Diameter of the handle. |

## Spinner

A spinning circle for work in progress whose length isn't known. Screen
readers announce it as "Loading" (translatable), or as its `label`.

Tags: `<uf-spinner>`. Import: `import '@unframed/core/spinner';` (or `npx @unframed/cli add spinner` to copy the source).

### Sizes

`sm`, `md` (the default) or `lg`, or any size with `--uf-spinner-size`.

```html
<uf-spinner size="sm"></uf-spinner>
<uf-spinner></uf-spinner>
<uf-spinner size="lg"></uf-spinner>
<uf-spinner style="--uf-spinner-size: 3.5rem"></uf-spinner>
```

### Label and color

Screen readers announce "Loading" (translatable), or `label`. Colors come from the theme, or `--uf-spinner-indicator-color`.

```html
<uf-spinner label="Loading John Smith's orders"></uf-spinner>
<uf-spinner label="Saving" style="--uf-spinner-indicator-color: var(--uf-color-success)"></uf-spinner>
```

- For a button that is busy, use the button's `loading` instead: it keeps the button focusable and its label for screen readers.

### `<uf-spinner>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `label` |  | `string \| undefined` |  | Accessible name. Defaults to "Loading", in the page's language. |
| `size` |  | `SpinnerSize` | `'md'` | Size: `sm`, `md` or `lg`. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The spinner. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-spinner-size` | Diameter. Overrides `size`. |
| `--uf-spinner-track-color` | Color of the circle. |
| `--uf-spinner-indicator-color` | Color of the moving arc. |

## Switch

An on/off switch with its label as content. Use it for settings that apply
immediately; use a checkbox for choices submitted later with a form.

Tags: `<uf-switch>`. Import: `import '@unframed/core/switch';` (or `npx @unframed/cli add switch` to copy the source).

### Settings that apply immediately

```html
<uf-switch checked>Notifications</uf-switch>
```

### `<uf-switch>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `hint` |  | `string \| undefined` |  | Help text below the label. |
| `checked` | `defaultChecked` | `boolean` | `false` | Initial state, restored on form reset. Set with the `checked` attribute. |
| `value` |  | `string` | `'on'` | Value submitted with the form when checked. |
| `size` |  | `FieldSize` | `'md'` | Size of the control and its label: `sm`, `md` or `lg`. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `checked` | `boolean` | Whether the control is on. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `toggle()` | Toggles the control, as if the user clicked it. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` |  | Fired when the state changes. |
| `change` | `Event` | Fired when the state changes. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The label. |
| `hint` | Help text below the label. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The `<label>` wrapping control and label. |
| `control` | The track. |
| `thumb` | The moving knob. |
| `label` | The label text. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-switch-width` | Width of the track. |
| `--uf-switch-height` | Height of the track. |
| `--uf-switch-checked-bg` | Track color when on. |
| `--uf-switch-radius` | Corner radius of track and thumb. Use `999px` for a pill. |

## Table

A table of data, from `columns` and `rows`. Users can sort by the columns
marked `sortable`. Rendered as a native `<table>`, so assistive tech reads
headers and cells as usual.

Set `columns` and `rows` as properties, or as JSON attributes in plain HTML.
The table sorts `rows` itself; with `manual-sort` it only shows the order
and tells you, so you can sort on the server. Combine it with
`<uf-pagination>` for long lists.

Tags: `<uf-table>`. Import: `import '@unframed/core/table';` (or `npx @unframed/cli add table` to copy the source).

### Columns, rows and sorting

Describe the columns and pass the rows. Columns marked `sortable` sort on click.

```html
<uf-table
  label="Team"
  columns='[{"key": "name", "label": "Name", "sortable": true},
            {"key": "role", "label": "Role"},
            {"key": "commits", "label": "Commits", "sortable": true, "align": "end"}]'
  rows='[{"name": "John Smith", "role": "Product designer", "commits": 412},
         {"name": "Jane Doe", "role": "Engineer", "commits": 1290}]'
></uf-table>
```

- In plain HTML, `columns` and `rows` can be JSON attributes. From JavaScript, set them as properties.
- Give the table a `label`: it names the table for screen readers.

### Formatting, and pages

`format` turns a value into text or a DOM node, like a badge. Sorting still uses the raw values.

```html
<uf-table id="invoices" label="Invoices" row-key="id"></uf-table>
<uf-pagination id="pages" label="Invoice pages"></uf-pagination>

<script type="module">
  const table = document.querySelector('#invoices');
  const pages = document.querySelector('#pages');
  const pageSize = 8;

  table.columns = [
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, align: 'end',
      format: (value) => euro.format(value) },
  ];
  pages.pages = Math.ceil(invoices.length / pageSize);

  const show = (page) => (table.rows = invoices.slice((page - 1) * pageSize, page * pageSize));
  pages.addEventListener('uf-page-change', (event) => show(event.detail.page));
  show(1);
</script>
```

- To sort on the server, add `manual-sort`: the table shows the sort and fires `uf-sort`, and you load the rows in that order.
- Set `--uf-table-max-height` to scroll long tables under a sticky header.

### `<uf-table>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `columns` |  | `TableColumn[]` | `[]` | The columns, in order. As an attribute, JSON: `[{"key": "name", "label": "Name"}]`. |
| `rows` |  | `TableRow[]` | `[]` | The data, one object per row. As an attribute, JSON: `[{"name": "John"}]`. |
| `label` |  | `string \| undefined` |  | Accessible name of the table, e.g. "Invoices". |
| `sort-key` | `sortKey` | `string \| undefined` |  | Key of the column the rows are sorted by. |
| `sort-direction` | `sortDirection` | `SortDirection` | `'ascending'` | Sort order: `ascending` or `descending`. |
| `manual-sort` | `manualSort` | `boolean` | `false` | Doesn't sort the rows: only shows the sort and fires `uf-sort`, for sorting on the server. |
| `row-key` | `rowKey` | `string \| undefined` |  | Row property that identifies each row, so rows keep their DOM when the data changes. Defaults to the index. |
| `striped` |  | `boolean` | `false` | Shades every other row. |
| `density` |  | `TableDensity` | `'comfortable'` | Row spacing: `comfortable` or `compact`. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-sort` | `CustomEvent<TableSortDetail>` | The user sorted by a column. |

#### Slots

| Slot | Description |
|---|---|
| `empty` | Shown when there are no rows. Defaults to "No data", or its translation. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The scroll container around the table. |
| `table` | The `<table>`. |
| `header-cell` | Every header cell (`<th>`). |
| `sort-button` | The button in a sortable header. |
| `row` | Every body row. |
| `cell` | Every body cell. |
| `empty` | The cell shown when there are no rows. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-table-max-height` | Height after which the body scrolls under a sticky header. |
| `--uf-table-border-color` | Border color between rows. |
| `--uf-table-header-bg` | Background of the header row. |
| `--uf-table-stripe-bg` | Background of every other row, with `striped`. |
| `--uf-table-hover-bg` | Background of the row under the pointer. |

## Tabs

Tabs that switch between panels. Arrow keys move between tabs, Home and End
jump to the ends, and only the selected tab is in the tab order.

Tags: `<uf-tabs>`, `<uf-tab>`, `<uf-tab-panel>`. Import: `import '@unframed/core/tabs';` (or `npx @unframed/cli add tabs` to copy the source).

### Tabs and panels

```html
<uf-tabs label="Project settings">
  <uf-tab panel="general">General</uf-tab>
  <uf-tab panel="members">Members</uf-tab>
  <uf-tab-panel name="general">General settings for the project.</uf-tab-panel>
  <uf-tab-panel name="members">Invite people and manage roles.</uf-tab-panel>
</uf-tabs>
```

### `<uf-tabs>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` |  | `string` | `''` | Name of the selected panel. Defaults to the first enabled tab. |
| `activation` |  | `'auto' \| 'manual'` | `'auto'` | `auto` selects a tab as soon as it gets focus; `manual` waits for Enter or Space. |
| `orientation` |  | `'horizontal' \| 'vertical'` | `'horizontal'` | Lays the tab list out horizontally or vertically. |
| `label` |  | `string \| undefined` |  | Accessible name for the tab list. |

#### Methods

| Method | Description |
|---|---|
| `select(name: string)` | Selects the tab for the given panel name. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-tab-change` | `CustomEvent<TabChangeDetail>` | The selected tab changed. |

#### Slots

| Slot | Description |
|---|---|
| (default) | `<uf-tab>` and `<uf-tab-panel>` elements. Tabs are moved into the tab list automatically. |
| `nav` | The tab list. You don't need to set this yourself. |

#### CSS parts

| Part | Description |
|---|---|
| `tablist` | The element with `role="tablist"`. |
| `panels` | The wrapper around the panels. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-tabs-indicator-color` | Color of the selected tab's underline. |

### `<uf-tab>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `panel` |  | `string` | `''` | Name of the `<uf-tab-panel>` this tab shows. |
| `disabled` |  | `boolean` | `false` | Disables the tab. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The tab label. |

#### CSS parts

| Part | Description |
|---|---|
| `base` | The tab's inner wrapper. |

### `<uf-tab-panel>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `name` |  | `string` | `''` | Name the matching tab refers to with `panel`. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The panel content. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-tab-panel-padding` | Padding around the content. |

## Textarea

A multi-line text field with a built-in label, hint and validation message.

Tags: `<uf-textarea>`. Import: `import '@unframed/core/textarea';` (or `npx @unframed/cli add textarea` to copy the source).

### Grows with its content

```html
<uf-textarea label="Bio" resize="auto" rows="2" maxlength="280" hint="Up to 280 characters."></uf-textarea>
```

### `<uf-textarea>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `value` | `defaultValue` | `string` | `''` | Initial value, restored on form reset. Set with the `value` attribute. |
| `label` |  | `string \| undefined` |  | Visible label. |
| `hint` |  | `string \| undefined` |  | Help text below the field. |
| `placeholder` |  | `string \| undefined` |  | Placeholder text. |
| `rows` |  | `number` | `4` | Visible number of lines. |
| `resize` |  | `TextareaResize` | `'vertical'` | How the user can resize the field. `auto` grows with the content. |
| `size` |  | `FieldSize` | `'md'` | Size of the field. |
| `readonly` |  | `boolean` | `false` | Makes the field read-only. |
| `autocomplete` |  | `AutoFill \| undefined` |  | Native `autocomplete` hint. |
| `minlength` |  | `number \| undefined` |  | Minimum length. |
| `maxlength` |  | `number \| undefined` |  | Maximum length. |
| `name` |  | `string` | `''` | Name submitted with the form. |
| `disabled` |  | `boolean` | `false` | Disables the control. |
| `required` |  | `boolean` | `false` | Makes the control required for form submission. |

#### Properties only

| Property | Type | Description |
|---|---|---|
| `value` | `string` | Current value. |
| `form` | `HTMLFormElement \| null` | Read-only. The form this control belongs to, if any. |
| `validity` | `ValidityState` | Read-only. The control's validity state, like a native input's. |
| `validationMessage` | `string` | Read-only. The error message shown when the value is invalid. |
| `willValidate` | `boolean` | Read-only. Whether the control takes part in form validation. |

#### Methods

| Method | Description |
|---|---|
| `select()` | Selects all text in the field. |
| `checkValidity()` | Returns whether the value is valid, without showing an error. |
| `reportValidity()` | Returns whether the value is valid, and shows the error if not. |
| `setCustomValidity(message: string)` | Sets a custom error message. Pass an empty string to clear it. |

#### Events

| Event | Type | Description |
|---|---|---|
| `input` |  | Fired on every keystroke. |
| `change` | `Event` | Fired when the value is committed (blur). |

#### Slots

| Slot | Description |
|---|---|
| `label` | The label, when you need markup. Overrides `label`. |
| `hint` | Help text below the field. Overrides `hint`. |

#### CSS parts

| Part | Description |
|---|---|
| `field` | The wrapper around label, control, hint and error. |
| `form-label` | The label. |
| `box` | The bordered box around the textarea. |
| `textarea` | The native `<textarea>`. |
| `hint` | The hint text. |
| `error` | The validation message. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-field-bg` | Background of the box. |
| `--uf-field-border-color` | Border color of the box. |
| `--uf-field-radius` | Corner radius of the box. |

## Toast

The region that shows toasts. You rarely need to add it yourself: `toast()`
creates one on first use. Add it to choose a placement, or to hold
toasts in a specific place in the DOM.

Tags: `<uf-toaster>`. Import: `import '@unframed/core/toast';` (or `npx @unframed/cli add toast` to copy the source).

### Variants

Call `toast()` from anywhere; the toaster is created on first use.

```html
<script type="module">
  import { toast } from '@unframed/core/toast';
  toast('Changes published.', { variant: 'success' });
</script>
```

### `<uf-toaster>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `placement` |  | `ToasterPlacement` | `'bottom-end'` | Corner or edge of the viewport where toasts appear. |
| `label` |  | `string \| undefined` |  | Accessible name of the notification region. Defaults to "Notifications", or its translation. |

#### Methods

| Method | Description |
|---|---|
| `add(message: string, options?: ToastOptions)` | Shows a toast in this region. Prefer the `toast()` function. |
| `dismiss(id: number)` | Hides a toast by id. |

#### CSS parts

| Part | Description |
|---|---|
| `region` | The list holding the toasts. |
| `toast` | Each toast. |
| `title` | A toast's title. |
| `message` | A toast's message. |
| `close-button` | A toast's dismiss button. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-toast-width` | Width of each toast. |
| `--uf-toaster-offset` | Distance from the viewport edges. |

## Tooltip

A short label that appears on hover and keyboard focus. Wrap the element it
describes. The text is also set as the trigger's `aria-description` (unless it
repeats the trigger's own label), so screen reader users get it too. Don't put
interactive content in a tooltip.

Tags: `<uf-tooltip>`. Import: `import '@unframed/core/tooltip';` (or `npx @unframed/cli add tooltip` to copy the source).

### On hover and focus

```html
<uf-tooltip content="Saves without publishing">
  <uf-button variant="outline">Save draft</uf-button>
</uf-tooltip>
```

### `<uf-tooltip>` API

#### Attributes and properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `content` |  | `string` | `''` | The tooltip text. |
| `placement` |  | `Placement` | `'top'` | Preferred side. Flips when there is no room. |
| `disabled` |  | `boolean` | `false` | Turns the tooltip off. |
| `delay` |  | `number` | `300` | Milliseconds to wait on hover before showing. Focus shows it immediately. |
| `open` |  | `boolean` | `false` | Whether the tooltip is showing. |

#### Methods

| Method | Description |
|---|---|
| `show()` | Shows the tooltip, unless it's disabled. |
| `hide()` | Hides the tooltip. |

#### Events

| Event | Type | Description |
|---|---|---|
| `uf-show` | `Event` | The tooltip opened. |
| `uf-hide` | `Event` | The tooltip closed. |

#### Slots

| Slot | Description |
|---|---|
| (default) | The element the tooltip describes. |

#### CSS parts

| Part | Description |
|---|---|
| `body` | The tooltip bubble. |

#### CSS custom properties

| Property | Description |
|---|---|
| `--uf-tooltip-bg` | Background color. |
| `--uf-tooltip-color` | Text color. |
| `--uf-tooltip-max-width` | Maximum width. |
| `--uf-tooltip-radius` | Corner radius. Square by default. |
