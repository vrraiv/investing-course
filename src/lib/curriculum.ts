import { getCollection, render } from 'astro:content';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';
import type { RootContent } from 'mdast';

export const navigation = [
  ['01-roadmap', '24-Week Roadmap', 'route'],
  ['02-fixed-income-rates', 'Rates', 'chart-no-axes-combined'],
  ['03-fx-cross-asset', 'FX & Cross-Asset', 'arrow-left-right'],
  ['04-portfolio-risk', 'Portfolio & Risk', 'shield-check'],
  ['05-investment-process', 'Investment Process', 'workflow'],
  ['06-quant-labs', 'Quant Labs', 'flask-conical'],
  ['07-shadow-portfolio', 'Shadow Portfolio', 'briefcase-business'],
  ['08-case-studies', 'Case Studies', 'files'],
  ['09-assessments', 'Assessments', 'clipboard-check'],
  ['10-resources', 'Resources', 'library'],
  ['11-capstone', 'Capstone', 'graduation-cap'],
];

function section(nodes: RootContent[], name: string) {
  const start = nodes.findIndex(n => n.type === 'heading' && toString(n) === name);
  if (start < 0) return [];
  const depth = (nodes[start] as { depth: number }).depth;
  const end = nodes.findIndex((n, i) => i > start && n.type === 'heading' && n.depth <= depth);
  return nodes.slice(start + 1, end < 0 ? undefined : end);
}

export async function getCurriculum() {
  const entries = (await getCollection('curriculum')).sort((a, b) => a.id.localeCompare(b.id));
  const docs = await Promise.all(entries.map(async entry => {
    const { headings } = await render(entry);
    return { id: entry.id, title: entry.data.title ?? headings[0]?.text ?? entry.id, headings, data: entry.data };
  }));
  const nodesFor = (prefix: string) => unified().use(remarkParse).parse(entries.find(e => e.id.startsWith(prefix))?.body ?? '').children;
  const roadmap = nodesFor('01-');
  let phase = '';
  const weeks = roadmap.flatMap((node, i) => {
    if (node.type === 'heading' && node.depth === 2) phase = toString(node);
    if (node.type !== 'heading' || !/^Week \d+/.test(toString(node))) return [];
    const title = toString(node);
    const week = Number(title.match(/^Week (\d+)/)?.[1]);
    const end = roadmap.findIndex((n, j) => j > i && n.type === 'heading');
    const body = roadmap.slice(i + 1, end < 0 ? undefined : end);
    const descriptions = body.map(n => toString(n));
    const index = ['Deliverable:', 'Gate:', 'Submit:', 'Lab:', 'Exercise:']
      .map(label => descriptions.findIndex(t => t.startsWith(label)))
      .find(index => index >= 0);
    const item = index === undefined ? '' : descriptions[index];
    const deliverable = item.endsWith(':') && index !== undefined
      ? `${item} ${descriptions[index + 1]?.split('\n')[0] ?? ''}`
      : item;
    const heading = docs.find(d => d.id.startsWith('01-'))?.headings.find(h => h.text === title);
    return [{ week, title, phase, deliverable: deliverable.split('\n')[0], slug: heading?.slug ?? '' }];
  });
  const assessments = nodesFor('09-');
  const weeklyNodes = section(assessments, 'Weekly Self-Test');
  const weeklyQuestions = weeklyNodes.find(n => n.type === 'list' && n.ordered);
  const interviewNodes = section(assessments, 'Interview Question Bank');
  const interviews = interviewNodes.find(n => n.type === 'list');
  const memoNodes = section(nodesFor('05-'), 'Trade Memo Template');
  const memoFields = memoNodes.flatMap((n, i) => n.type === 'heading' ? [{ name: toString(n), hint: toString(memoNodes[i + 1] ?? n) }] : []);
  const rubric = weeklyNodes.filter(n => n.type === 'list' && !n.ordered).map(n => toString(n)).join('\n');
  return {
    docs, weeks, memoFields, rubric,
    weeklyQuestions: weeklyQuestions?.type === 'list' ? weeklyQuestions.children.map(n => toString(n)) : [],
    interviews: interviews?.type === 'list' ? interviews.children.map(n => toString(n)) : [],
  };
}

export type Curriculum = Awaited<ReturnType<typeof getCurriculum>>;
