
import { transformAsync, PluginItem } from '@babel/core';
import velto from '@velto/babel-plugin-velto';
import { Plugin, PluginOption } from 'vite';

export default function vitePluginLite(options?: PluginOption): Plugin {
  let needSourceMap = false;
  return {
    name: 'vite-plugin-velto',
    enforce: 'pre',

    configResolved(config) {
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap
    },

    async transform(source, id) {
      if (!(/\.[jt]sx$/i.test(id))) {
        return null;
      }
      const filepath = id.replace(/\?.+$/, '');

      const plugins: PluginItem[] = [velto];

      if (id.endsWith('.tsx') || filepath.endsWith('.tsx')) {
        plugins.push([
          '@babel/plugin-transform-typescript',
          { isTSX: true, allowExtensions: true },
        ])
      }

      const result = await transformAsync(source, {
        filename: filepath,
        sourceFileName: filepath,
        presets: [],
        plugins,
        sourceMaps: needSourceMap,
      });

      return { code: result?.code || '', map: result?.map };
    },
  };
}
