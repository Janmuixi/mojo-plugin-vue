# Vite Library Build Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace pkgroll with Vite library mode to build an ESM bundle at `dist/vue.js` that supports Vue SFC imports.

**Architecture:** Use Vite’s library mode as the bundler entry point (`src/vue.ts`) and the Vue plugin to compile `.vue` files. Externalize runtime dependencies so consumers provide them, preserving the current runtime contract.

**Tech Stack:** Vite, @vitejs/plugin-vue, Rollup (via Vite).

### Task 1: Add Vite build configuration

**Files:**
- Create: `vite.config.ts`

**Step 1: Write a minimal config (no tests yet)**

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/vue.ts',
      formats: ['es'],
      fileName: () => 'vue.js'
    },
    rollupOptions: {
      external: ['vue', '@mojojs/core', '@mojojs/path']
    }
  }
});
```

**Step 2: Sanity check config with build command (expected fail until deps/scripts updated)**

Run: `npm run build`
Expected: Fail because Vite is not installed and script not updated.

### Task 2: Update build script and dev dependencies

**Files:**
- Modify: `package.json`

**Step 1: Update scripts and dev dependencies**

```json
{
  "scripts": {
    "build": "vite build",
    "test": "tap --disable-coverage --allow-empty-coverage test/*.js",
    "build:test": "npm run build && npm run test",
    "publish:minor": "npm version minor && npm publish",
    "publish:patch": "npm version patch && npm publish"
  },
  "devDependencies": {
    "@types/node": "^25.0.3",
    "tap": "^18.7.0",
    "tsx": "^4.21.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0"
  }
}
```

**Step 2: Install deps**

Run: `npm install`
Expected: Vite and plugin installed.

**Step 3: Run build**

Run: `npm run build`
Expected: `dist/vue.js` created without Rollup parse errors.

### Task 3: Move example SFC into src and update import

**Files:**
- Move: `test/button-with-prop.vue` -> `src/components/ButtonWithProp.vue`
- Modify: `src/vue.ts`

**Step 1: Move the file**

Run: `mkdir -p src/components && mv test/button-with-prop.vue src/components/ButtonWithProp.vue`
Expected: file moved.

**Step 2: Update import path in `src/vue.ts`**

```ts
import ButtonWithProp from './components/ButtonWithProp.vue';
```

**Step 3: Run build**

Run: `npm run build`
Expected: `dist/vue.js` created and includes SFC compilation.

### Task 4: Validate build output and exports

**Files:**
- Verify: `dist/vue.js`
- Verify: `package.json`

**Step 1: Confirm output exists**

Run: `ls dist/vue.js`
Expected: File exists.

**Step 2: Confirm exports path remains valid**

Check: `package.json#exports` still points to `./dist/vue.js`.

**Step 3: Optional smoke test**

Run: `node -e "import('./dist/vue.js').then(m=>console.log(Object.keys(m)))"`
Expected: Module loads without syntax errors.

### Task 5: Commit

**Step 1: Stage changes**

```bash
git add vite.config.ts package.json src/vue.ts src/components/ButtonWithProp.vue
```

**Step 2: Commit**

```bash
git commit -m "build: switch to vite library build for SFCs"
```

---

**Notes:**
- If TypeScript types output is required later, add a separate `tsc` build step or a dts plugin.
- If you want sourcemaps, add `build.sourcemap: true` to `vite.config.ts`.
