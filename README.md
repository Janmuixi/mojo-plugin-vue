A mojo.js plugin that adds support for [vue](https://vuejs.org/) templates.

```js
import mojo from '@mojojs/core';
import vuePlugin from 'mojo-plugin-vue';

const app = mojo();
app.plugin(vuePlugin);

// Render template "views/index.html.vue"
app.get('/template', async ctx => {
  await ctx.render({view: 'index'});
});

// Render a template with content inside brackets (vue-style), Example: <div>Hello {{ greeting }}</div>
app.get('/template-with-data', async ctx => {
  await ctx.render({view: 'index'}, {greeting: 'World'});
});

app.start();
```

To change the default engine for inline templates you can also set `app.renderer.defaultEngine` to `vue`. Or you can
register the template engine with a completely different name.

```js
app.plugin(vuePlugin, {name: 'foo'});
app.renderer.defaultEngine = 'foo';
```
