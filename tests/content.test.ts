import test from 'node:test';
import assert from 'node:assert/strict';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { callouts } from '../src/lib/callouts.mjs';

test('all custom callouts retain content and accessible labels', async () => {
  const renderer = await createMarkdownProcessor({ remarkPlugins: [callouts] });
  for (const label of ['CONCEPT', 'PM QUESTION', 'EXERCISE', 'DELIVERABLE', 'WARNING']) {
    const result = await renderer.render(`> [!${label}]\n> A **specific** concept.`);
    assert.match(result.code, new RegExp(`data-label="${label}"`));
    assert.ok(result.code.includes('<strong>specific</strong>'));
    assert.ok(!result.code.includes(`[!${label}]`));
  }
});
