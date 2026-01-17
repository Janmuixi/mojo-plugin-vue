# Vite Library Build for Vue SFC Support

## Context
The current build uses `pkgroll`, which has no SFC support. Importing a `.vue` file from `src/vue.ts` causes Rollup to parse the SFC as plain JS and throw `Expression expected` at the `<template>` tag. The goal is to keep the public entry `dist/vue.js` while enabling `.vue` imports in the library.

## Decision
Adopt Vite in library mode with `@vitejs/plugin-vue` to compile SFCs. Output remains ESM-only with a single bundle named `dist/vue.js` to preserve the existing `package.json#exports` contract.

## Design
- Add `vite.config.ts` configured for library mode:
  - `build.lib.entry`: `src/vue.ts`
  - `build.lib.formats`: `['es']`
  - `build.lib.fileName`: `() => 'vue.js'`
  - `rollupOptions.external`: `['vue', '@mojojs/core', '@mojojs/path']` (externalize runtime deps)
- Update `package.json` scripts to use `vite build` instead of `pkgroll`.
- Add dev dependencies: `vite`, `@vitejs/plugin-vue`.
- Move the example SFC from `test/button-with-prop.vue` into `src/components/ButtonWithProp.vue` and update the import in `src/vue.ts` to avoid bundling test fixtures.

## Data Flow
`src/vue.ts` remains the single entry point. At build time, Vite compiles imported `.vue` SFCs and bundles the output into `dist/vue.js`. At runtime, consumers supply `vue` and Mojo dependencies as externals.

## Error Handling
Build errors from SFCs will surface during `vite build` with file/line context from Vue’s compiler. Runtime behavior is unchanged.

## Testing
- `npm run build` should complete without Rollup parse errors.
- Existing `npm test` can remain unchanged.

## Rollout
- Update build tooling and scripts.
- Verify `dist/vue.js` is produced and `package.json#exports` remains valid.
