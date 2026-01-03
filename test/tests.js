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
    
    app.get('/', async ctx => {
        await ctx.render({ view: 'hello-world' }, { text: 'Hello World' })
    });
    const ua = await app.newTestUserAgent({tap: t});

    await t.test('Plain template', async () => {
        (await ua.getOk('/')).statusIs(200).bodyLike(/Hello World/);
    });
    await ua.stop();
    
    t.end();
})