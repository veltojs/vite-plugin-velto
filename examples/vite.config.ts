import { defineConfig } from 'vite';
import vitePluginLite from '../dist';

export default defineConfig({
  plugins: [vitePluginLite()],
})
