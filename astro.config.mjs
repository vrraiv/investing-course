import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { callouts } from './src/lib/callouts.mjs';

export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [mdx()],
  markdown: { processor: unified({ remarkPlugins: [callouts] }) },
});
