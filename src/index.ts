
import { transformAsync, BabelFileResult } from '@babel/core';
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
      if (!(/\.ts[x]?$/i.test(id))) {
        return null;
      }

      id = id.replace(/\?.+$/, '');

      const result = await transformAsync(source, {
        filename: id,
        sourceFileName: id,
        presets: [],
        plugins: [velto, ['@babel/plugin-transform-typescript', { isTSX: true, allowExtensions: true }]],
        sourceMaps: needSourceMap,
      });

      return { code: result?.code || '', map: result?.map };
    },
  };
}
