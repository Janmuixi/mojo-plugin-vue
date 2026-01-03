import type { MojoApp, MojoContext, MojoRenderOptions } from '@mojojs/core';
import Path from '@mojojs/path';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer'

export default function (app: MojoApp, options: { name?: string } = {}) {
    const name = options.name ?? 'vue';
    app.renderer.addEngine(name, new VueEngine(new VueLoader(app)))
}

class VueEngine {
    loader: VueLoader;

    constructor(loader: VueLoader) {
        this.loader = loader;
    }

    async render(ctx: MojoContext, options: MojoRenderOptions) {
        const template = await new Path(options.viewPath).readFile('utf-8');
        
        const vueApp = createSSRApp({
            data: () => (ctx.stash),
            template
        })

        const result = await renderToString(vueApp);

        return Buffer.from(`
            <!DOCTYPE html>
            <html>
                <body>
                    <div id="app">${result}</div>
                </body>
            </html>
            `);
    }
}

class VueLoader {
    app: MojoApp;

    constructor(app: MojoApp) {
        this.app = app;
    }

    getSource(name: string): { src: string, path: string } {
        const suggestion = this.app.renderer.findView({ view: name });
        if (suggestion === null) return { src: 'Template not found', path: 'unknown' };
        const path = suggestion.path;
        return { src: new Path(path).readFileSync().toString(), path };
    }
}