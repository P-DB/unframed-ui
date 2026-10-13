---
'@unframed/core': patch
---

Form controls update their form value and validity as soon as `value`, `checked`, `required` or a constraint is set from code. Before, `field.value = 'x'; form.requestSubmit()` could be blocked by the old validity, and `new FormData(form)` could miss the new value.
