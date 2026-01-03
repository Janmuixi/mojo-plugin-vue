import Path from '@mojojs/path';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';

function vue(app, options = {}) {
  const name = options.name ?? "vue";
  app.renderer.addEngine(name, new VueEngine(new VueLoader(app)));
}
class VueEngine {
  loader;
  constructor(loader) {
    this.loader = loader;
  }
  async render(ctx, options) {
    const template = await new Path(options.viewPath).readFile("utf-8");
    const vueApp = createSSRApp({
      data: () => ctx.stash,
      template
    });
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
  app;
  constructor(app) {
    this.app = app;
  }
  getSource(name) {
    const suggestion = this.app.renderer.findView({ view: name });
    if (suggestion === null) return { src: "Template not found", path: "unknown" };
    const path = suggestion.path;
    return { src: new Path(path).readFileSync().toString(), path };
  }
}

export { vue as default };
