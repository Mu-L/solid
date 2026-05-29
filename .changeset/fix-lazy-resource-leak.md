---
"solid-js": patch
---

Fix memory leak with nested `lazy()` components. `lazy()` cached its `createResource` accessor in a module-scoped variable and `createResource` never released its Suspense contexts on disposal, so a disposed component tree (and its detached DOM) stayed reachable across navigations when `lazy()` boundaries were nested. The module-pinned accessor is now released on cleanup, and the resource clears its Suspense contexts and pending promise on disposal.
