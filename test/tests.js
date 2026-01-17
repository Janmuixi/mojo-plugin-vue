import t from 'tap';
import mojo from '@mojojs/core';
import vuePlugin from '../dist/vue.js';
import Path from '@mojojs/path';

t.test('vuePlugin', async t => {
    const app = mojo({ mode: 'testing' });
    app.plugin(vuePlugin);

    // Checking if the new engine is added to the list of engines
    t.ok('vue' in app.renderer.engines);

    app.renderer.viewPaths.push(Path.currentFile().sibling('templates').toString());
    await app.renderer.warmup();
    
    app.get('/', async ctx => {
        await ctx.render({ view: 'hello-world' }, { text: 'Hello World' })
    });
    app.get('/page-with-button', async ctx => {
        await ctx.render({ view: 'page-with-button' }, { text: 'Hello World' })
    });

    await t.test('Plain template', async () => {
        const ctx = app.newMockContext({ url: '/' });
        const result = await ctx.renderToString({ view: 'hello-world' }, { text: 'Hello World' });
        t.ok(result && /Hello World/.test(result));
    });
    await t.test('Template with component', async () => {
        const ctx = app.newMockContext({ url: '/page-with-button' });
        const result = await ctx.renderToString({ view: 'page-with-button' }, { text: 'Hello World' });
        t.ok(result && /<button>\s*Hello World\s*<\/button>/.test(result));
    });
    
    t.end();
})
