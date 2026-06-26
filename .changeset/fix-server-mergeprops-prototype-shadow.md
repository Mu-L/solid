---
"solid-js": patch
---

Fix server `mergeProps` silently dropping properties that shadow `Object.prototype` methods.

`mergeProps` on the server (used during SSR) used `key in target` to skip already-seen keys.
Because `in` walks the prototype chain, keys such as `toString`, `valueOf`, and `hasOwnProperty`
were always found on the empty result object via `Object.prototype`, causing those source
properties to be silently ignored. The merged result then returned the inherited
`Object.prototype` method instead of the supplied value.

The fix replaces the `in` check with `Object.prototype.hasOwnProperty.call(target, key)` and
adds explicit guards for `"__proto__"` and `"constructor"` to match the client-side behaviour.
