import { createIcons, LayoutDashboard, Route, ChartNoAxesCombined, ArrowLeftRight, ShieldCheck, Workflow, FlaskConical, BriefcaseBusiness, Files, ClipboardCheck, Library, GraduationCap, NotebookPen, FilePenLine, Calculator, Settings2, Menu, SunMoon, DatabaseBackup, Plus, ArrowRight, ArrowUpRight, Printer, Download, Upload, Save, Copy, Archive, Trash2, X, Camera, Shuffle, Equal, Mic, Pencil, Check } from 'lucide';
import type { Curriculum } from '../lib/curriculum';
import { today, initialState, parseBackup, STORAGE_KEY } from '../lib/state';
import { portfolio } from '../lib/finance';
import { state, update, replace, toast, escape, empty, setText, download, readJson, field } from './store';
import { initWriting } from './writing';
import { initPortfolio } from './portfolio';
import { initLabs } from './labs';
import { initWidgets } from './widgets';

export const curriculum: Curriculum = JSON.parse(document.querySelector('#curriculum-data')!.textContent!);
export const icons = () => createIcons({ icons: { LayoutDashboard, Route, ChartNoAxesCombined, ArrowLeftRight, ShieldCheck, Workflow, FlaskConical, BriefcaseBusiness, Files, ClipboardCheck, Library, GraduationCap, NotebookPen, FilePenLine, Calculator, Settings2, Menu, SunMoon, DatabaseBackup, Plus, ArrowRight, ArrowUpRight, Printer, Download, Upload, Save, Copy, Archive, Trash2, X, Camera, Shuffle, Equal, Mic, Pencil, Check } });
icons();
document.querySelector('#theme-toggle')?.addEventListener('click', () => {
  if (update(s => { s.theme = s.theme === 'light' ? 'dark' : 'light'; })) document.documentElement.dataset.theme = state.theme;
});
const menu = document.querySelector<HTMLButtonElement>('#menu-toggle')!;
menu.addEventListener('click', () => { const open = document.querySelector('#sidebar')!.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.querySelector('#sidebar')!.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
document.addEventListener('click', e => { if (!(e.target as Element).closest('#sidebar, #menu-toggle')) { document.querySelector('#sidebar')!.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
document.querySelector('#print-page')?.addEventListener('click', () => window.print());

const weekHref = (w?: { lesson?: string; slug: string }) => w ? (w.lesson ? `/course/${w.lesson}/` : `/course/01-roadmap/#${w.slug}`) : '/course/01-roadmap/';
const progressKeys = curriculum.docs.filter(d => d.id !== 'readme').flatMap(d => d.headings.map(h => `${d.id}#${h.slug}`));
function progressPercent(keys: string[]) { return keys.length ? Math.round(keys.filter(key => state.progress[key] === 'complete').length / keys.length * 100) : 0; }
function dashboard() {
  if (!document.querySelector('#dash-week')) return;
  const current = curriculum.weeks.find(w => w.week === state.week)!;
  const phase = current.phase.split(/\s[—-]\s/)[0];
  document.querySelector('#dash-week')!.innerHTML = `${String(current.week).padStart(2, '0')} <small>/ 24</small>`;
  setText('dash-phase', phase);
  document.querySelector('#dash-progress')!.innerHTML = `${progressPercent(progressKeys)}<small>%</small>`;
  (document.querySelector('#course-progress') as HTMLProgressElement).value = progressPercent(progressKeys);
  setText('dash-lessons', `${progressKeys.filter(k => state.progress[k] === 'complete').length} of ${progressKeys.length} headings complete`);
  const answers = curriculum.weeklyQuestions.map((_, i) => state.answers[`week-${current.week}-${i}`]);
  const score = answers.reduce((s, a) => s + (a?.score ?? 0), 0);
  const assessed = answers.filter(a => a?.score != null).length;
  document.querySelector('#dash-score')!.innerHTML = `${assessed ? score : '--'} <small>/ 10</small>`;
  setText('dash-gate', assessed === 5 ? (score >= 7 ? 'Gate passed' : 'Review before advancing') : `Pass mark: 7 / 10${assessed ? ` / ${assessed} scored` : ''}`);
  const fund = portfolio(state.positions);
  document.querySelector('#dash-nav')!.innerHTML = `$${(fund.nav / 1e6).toFixed(2)}<small>m</small>`;
  setText('dash-fund', `CAD / ${state.positions.filter(p => p.status === 'open').length} open positions`);
  setText('current-phase', phase.toUpperCase());
  setText('current-week-label', `WEEK ${String(current.week).padStart(2, '0')}`);
  setText('current-module', current.title.replace(/^Week \d+\s*[—-]\s*/, ''));
  setText('next-deliverable', current.deliverable || 'Complete this week\'s lab and weekly self-test.');
  document.querySelector('#continue-link')!.setAttribute('href', weekHref(current));
  document.querySelector('#week-grid')!.innerHTML = curriculum.weeks.map(w => `<a class="week-tile ${w.week === current.week ? 'current' : ''} ${state.progress[`01-roadmap#${w.slug}`] === 'complete' ? 'complete' : ''}" href="${weekHref(w)}" title="${escape(w.title)}${w.lesson ? ' — full lesson' : ''}" ${w.week === current.week ? 'aria-current="step"' : ''}>${String(w.week).padStart(2, '0')}</a>`).join('');
  setText('roadmap-phase', current.phase);
  setText('memo-count', `${state.memos.length} saved / ${state.memos.filter(m => m.status === 'open').length} open`);
  document.querySelector('#recent-journal')!.innerHTML = [...state.journal].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(j => `<div class="entry-row"><small>${escape(j.date)} / CONFIDENCE ${j.confidence}/5</small><p>${escape(j.observation.slice(0, 200))}</p></div>`).join('') || empty('A place for your market thinking', 'Your latest observations will appear here.', '/journal/', 'Write your first entry');
  document.querySelector('#assessment-record')!.innerHTML = curriculum.weeks.flatMap(w => {
    const answers = curriculum.weeklyQuestions.map((_, i) => state.answers[`week-${w.week}-${i}`]);
    if (!answers.some(a => a?.score != null)) return [];
    const score = answers.reduce((s, a) => s + (a?.score ?? 0), 0);
    return [`<div class="entry-row"><strong>Week ${w.week}</strong><p>${score} / 10 &middot; ${answers.filter(a => a?.score != null).length} / 5 scored</p></div>`];
  }).slice(-3).join('') || empty('Your assessment record starts here', 'Weekly self-tests and deliberate practice.', '/course/09-assessments/', 'Take the weekly self-test');
}
dashboard();

function lessons() {
  const article = document.querySelector<HTMLElement>('#lesson-content');
  if (!article) return;
  const id = article.dataset.doc!;
  article.querySelectorAll<HTMLElement>('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]').forEach(h => {
    const key = `${id}#${h.id}`;
    const select = document.createElement('select');
    select.className = 'lesson-progress';
    select.setAttribute('aria-label', `Progress: ${h.textContent}`);
    select.innerHTML = '<option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="complete">Complete</option>';
    select.value = state.progress[key] ?? 'not-started'; select.dataset.status = select.value;
    select.addEventListener('change', () => {
      if (update(s => { s.progress[key] = select.value as 'complete'; })) {
        select.dataset.status = select.value;
        setText('module-progress', `${progressPercent(curriculum.docs.find(d => d.id === id)!.headings.map(h => `${id}#${h.slug}`))}% COMPLETE`);
      } else select.value = state.progress[key] ?? 'not-started';
    });
    h.append(select);
  });
  setText('module-progress', `${progressPercent(curriculum.docs.find(d => d.id === id)!.headings.map(h => `${id}#${h.slug}`))}% COMPLETE`);
  if (article.dataset.case === 'true') {
    [...article.querySelectorAll<HTMLElement>('h2')].forEach(heading => {
      const nodes: Element[] = []; let next = heading.nextElementSibling;
      while (next && next.tagName !== 'H2') { nodes.push(next); next = next.nextElementSibling; }
      const key = `${id}#${heading.id}`;
      const saved = state.cases[key];
      const intro = nodes[0]?.tagName === 'P' ? nodes.shift() : null;
      const form = document.createElement('form'); form.className = 'case-commit';
      form.innerHTML = `<label>Your decision at the information cutoff<textarea rows="3" required ${saved ? 'readonly' : ''}>${escape(saved?.view ?? '')}</textarea></label><button class="button secondary" ${saved ? 'disabled' : ''}>${saved ? 'View committed' : 'Commit view'}</button>${saved ? `<small> ${escape(new Date(saved.committedAt).toLocaleString())}</small>` : ''}`;
      (intro ?? heading).after(form);
      const details = document.createElement('details'); details.className = `case-details ${saved ? '' : 'locked'}`;
      const summary = document.createElement('summary'); summary.textContent = saved ? 'Discussion prompts & subsequent material' : 'Discussion prompts / Commit a view to unlock';
      details.append(summary); nodes.forEach(n => details.append(n)); form.after(details);
      summary.addEventListener('click', e => { if (!state.cases[key]) { e.preventDefault(); toast('Commit your decision before opening the discussion prompts.'); } });
      form.addEventListener('submit', e => {
        e.preventDefault(); const view = form.querySelector('textarea')!.value.trim(); if (!view) return;
        if (update(s => { s.cases[key] = { view, committedAt: new Date().toISOString() }; })) {
          form.querySelector('textarea')!.readOnly = true; form.querySelector('button')!.disabled = true; form.querySelector('button')!.textContent = 'View committed';
          summary.textContent = 'Discussion prompts & subsequent material'; details.classList.remove('locked'); details.open = true; toast('Decision recorded.');
        }
      });
    });
  }
}
lessons();

function assessments() {
  const weekSelect = document.querySelector<HTMLSelectElement>('#assessment-week'); if (!weekSelect) return;
  weekSelect.value = String(state.week);
  const renderScore = () => {
    const values = curriculum.weeklyQuestions.map((_, i) => state.answers[`week-${weekSelect.value}-${i}`]);
    const score = values.reduce((s, a) => s + (a?.score ?? 0), 0); const count = values.filter(a => a?.score != null).length;
    setText('weekly-score', `${score} / ${curriculum.weeklyQuestions.length * 2}`);
    setText('weekly-result', count < 5 ? `${count} / 5 scored` : score >= 7 ? 'Gate passed' : 'Review before advancing');
  };
  const renderQuestions = () => {
    document.querySelector('#self-test-questions')!.innerHTML = curriculum.weeklyQuestions.map((q, i) => {
      const key = `week-${weekSelect.value}-${i}`; const a = state.answers[key];
      return `<section class="question-block" data-question="${key}"><h3>${i + 1}. ${escape(q)}</h3><label>Your answer<textarea data-answer="answer" rows="3">${escape(a?.answer ?? '')}</textarea></label><details><summary>Reveal scoring guide & reference</summary><p>These are open-response assessments. Use the weekly lesson to check the substance of your answer.</p><p style="white-space:pre-line">${escape(curriculum.rubric)}</p><a href="${weekHref(curriculum.weeks.find(w => w.week === Number(weekSelect.value)))}">Week ${weekSelect.value} reference</a></details><fieldset class="score-options"><legend>Self-score</legend>${[0, 1, 2].map(score => `<label><input type="radio" name="${key}" value="${score}" ${a?.score === score ? 'checked' : ''} />${score} / ${['Cannot do', 'Partial', 'Fluent'][score]}</label>`).join('')}</fieldset><label>Notes<textarea data-answer="notes" rows="2">${escape(a?.notes ?? '')}</textarea></label></section>`;
    }).join(''); renderScore();
  };
  renderQuestions(); weekSelect.addEventListener('change', renderQuestions);
  const saveAnswer = (e: Event) => {
    const input = e.target as HTMLInputElement; const block = input.closest<HTMLElement>('[data-question]'); if (!block) return;
    const key = block.dataset.question!;
    update(s => { const a = s.answers[key] ?? { answer: '', notes: '', score: null }; if (input.type === 'radio') a.score = Number(input.value); else if (input.dataset.answer === 'answer') a.answer = input.value; else if (input.dataset.answer === 'notes') a.notes = input.value; s.answers[key] = a; }); renderScore();
  };
  document.querySelector('#self-test-questions')!.addEventListener('input', saveAnswer);
  let timer: ReturnType<typeof setInterval> | undefined;
  let question = ''; let duration = 0; let endAt = 0;
  const drillForm = document.querySelector<HTMLFormElement>('#drill-form')!;
  const renderHistory = () => { document.querySelector('#drill-history')!.innerHTML = [...state.drills].reverse().map(d => `<details class="entry-row"><summary>${escape(d.question)} / ${d.score}/2</summary><small>${escape(new Date(d.date).toLocaleString())}</small><p>${escape(d.answer)}</p></details>`).join('') || empty('No practice sessions yet', 'Your saved responses will appear here.'); };
  renderHistory();
  document.querySelector('#drill-start')!.addEventListener('click', () => {
    if (question && field(drillForm, 'answer').value.trim() && !confirm('Discard this unsaved response and start a new question?')) return;
    clearInterval(timer); drillForm.reset();
    const available = curriculum.interviews.filter(q => q !== question); question = available[Math.floor(Math.random() * available.length)] ?? curriculum.interviews[0];
    setText('drill-question', question); duration = Number((document.querySelector('#drill-duration') as HTMLSelectElement).value);
    drillForm.querySelectorAll<HTMLInputElement>('input, textarea, button').forEach(el => { el.disabled = false; });
    endAt = Date.now() + duration * 1000;
    const tick = () => { const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000)); setText('drill-clock', left ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}` : 'Time elapsed'); if (!left) { clearInterval(timer); toast('Time elapsed. Finish and score your response.'); } };
    if (duration) { tick(); timer = setInterval(tick, 250); } else setText('drill-clock', '');
    field(drillForm, 'answer').focus();
  });
  drillForm.addEventListener('submit', e => {
    e.preventDefault(); if (!question) return;
    const data = new FormData(drillForm);
    if (update(s => s.drills.push({ id: crypto.randomUUID(), question, answer: String(data.get('answer')), score: Number(data.get('score')), date: new Date().toISOString(), duration }))) {
      clearInterval(timer); question = ''; drillForm.reset(); drillForm.querySelectorAll<HTMLInputElement>('input, textarea, button').forEach(el => { el.disabled = true; }); setText('drill-clock', 'Saved'); renderHistory(); toast('Practice response saved.');
    }
  });
}
assessments();

function settings() {
  const form = document.querySelector<HTMLFormElement>('#settings-form'); if (!form) return;
  field(form, 'week').value = String(state.week);
  form.addEventListener('submit', e => { e.preventDefault(); if (update(s => { s.week = Number(field(form, 'week').value); })) toast('Course settings saved.'); });
  setText('data-summary', `Version 1 / ${state.journal.length} journal entries / ${state.memos.length} memos / ${state.positions.length} positions`);
  document.querySelector('#export-all')!.addEventListener('click', () => {
    let raw: string | null = null; try { raw = localStorage.getItem(STORAGE_KEY); } catch {}
    download(`macro-practice-${today()}.json`, raw ?? JSON.stringify(state, null, 2));
  });
  document.querySelector('#import-all')!.addEventListener('change', async e => {
    const input = e.target as HTMLInputElement;
    try { const next = parseBackup(await readJson(input.files?.[0])); if (confirm(`Replace all local data with this backup (${next.journal.length} entries, ${next.memos.length} memos, ${next.positions.length} positions)?`)) { if (replace(next, true)) location.reload(); } }
    catch { toast('Invalid or unsupported backup. No data was changed.', true); } finally { input.value = ''; }
  });
  document.querySelector('#reset-all')!.addEventListener('click', () => { if (confirm('Permanently remove all progress, answers, journal entries, memos and portfolio records from this browser? Export a backup first.')) { if (replace(initialState(), true)) location.reload(); } });
}
settings();
initWriting(curriculum, icons);
initPortfolio(icons);
initLabs();
initWidgets();
