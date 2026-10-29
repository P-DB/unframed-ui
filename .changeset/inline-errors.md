---
'@unframed/core': patch
---

Form controls show their validation error only inline: a blocked submission or `reportValidity()` no longer opens the browser's bubble on top of it, which repeated the message. The first invalid control of a submission still gets focus, as with native fields.
