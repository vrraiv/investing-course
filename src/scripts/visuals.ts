import { escape } from './store';

export function lineChart(points: { x: string; y: number }[], title: string, format = (n: number) => n.toFixed(2)) {
  if (!points.length) return '';
  const lo = Math.min(...points.map(p => p.y)); const hi = Math.max(...points.map(p => p.y));
  const padding = (hi - lo) * 0.12 || Math.abs(hi) * 0.01 || 1;
  const min = lo - padding; const max = hi + padding;
  const x = (i: number) => points.length === 1 ? 300 : 70 + i / (points.length - 1) * 490;
  const y = (v: number) => 175 - (v - min) / (max - min) * 140;
  return `<svg class="chart" viewBox="0 0 600 220" role="img" aria-label="${escape(title)}"><title>${escape(title)}</title>${[min, (min + max) / 2, max].map(v => `<line class="chart-grid" x1="70" x2="560" y1="${y(v)}" y2="${y(v)}"/><text x="60" y="${y(v) + 4}" text-anchor="end">${escape(format(v))}</text>`).join('')}<polyline class="chart-line" points="${points.map((p, i) => `${x(i)},${y(p.y)}`).join(' ')}"/>${points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.y)}" r="3" fill="var(--accent)"><title>${escape(p.x)}: ${escape(format(p.y))}</title></circle>`).join('')}<text x="70" y="205">${escape(points[0].x)}</text>${points.length > 1 ? `<text x="560" y="205" text-anchor="end">${escape(points.at(-1)!.x)}</text>` : ''}</svg>`;
}
