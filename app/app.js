// Leonida Trophy Guide — checklist, roadmap and missable tracker for GTA VI.
// All data comes from data/trophies.json (same origin, fetched at load; the app
// makes no other request). Progress lives in localStorage and can be exported
// to a file and imported back. Spoiler mode hides story trophies' names and
// descriptions until they are earned.
const STORE_KEY = 'gta6-trophy-guide-v1';
const PREF_KEY = 'gta6-trophy-guide-prefs-v1';

const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const spoilersEl = document.getElementById('spoilers');
const earnedOnlyEl = document.getElementById('earnedOnly');
const hideEarnedEl = document.getElementById('hideEarned');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resultCount = document.getElementById('resultCount');
const missableCount = document.getElementById('missableCount');

const STAGES = [
  { n: 1, title: 'Story — Chapters 1–2', time: 'first ~20 hours', blurb: 'Play the opening missions in order. Do the one thing that may be missable here: Lucia’s balcony meditation in Chapter 1 (Positive Mental Attitude). Both protagonists become playable in Chapter 2, which opens up partner play and most side activities.', ids: [2, 3, 4, 8, 28] },
  { n: 2, title: 'Story — Chapters 3–5 and the finale', time: 'to ~60–80 hours', blurb: 'Finish the story, including the named missions with their own trophies and the two partner trophies that need Jason and Lucia together. Keep a manual save before the final mission: there is no mission replay.', ids: [5, 6, 7, 9, 10, 11, 12, 13, 33, 34] },
  { n: 3, title: 'Side characters and strangers', time: 'alongside the story', blurb: 'Five side characters (Andy, Kenton, Billy, Randy, Tyrone) each have a mission strand ending in a final mission with its own trophy, plus Bret’s hunt. Start every chain as soon as it unlocks. Eight finished stranger strands in total earn the silver Strangers & Freaks.', ids: [22, 23, 24, 25, 26, 27, 29, 37] },
  { n: 4, title: 'Activities, combat and robberies', time: 'cleanup, any order', blurb: 'The skill and robbery trophies: 250 stunts, gold in all 42 Shooting Range challenges, drone races at 14 locations, 20 race wins, 50 challenges, bank vaults, armored trucks and one illegal operation per gang. All stay open in free roam.', ids: [15, 16, 17, 18, 19, 20, 21, 32, 36, 38, 39, 40, 41, 43, 45, 46, 51] },
  { n: 5, title: 'Collectibles and exploration', time: 'cleanup, any order', blurb: 'The slow sweeps: 100 WAiNK locations, 3 card sets, 100 vehicles scanned, all 52 areas of Leonida unfogged, the garages, the money trophies and the cryptic one-offs. Work them district by district so nothing is left behind.', ids: [30, 31, 35, 42, 44, 47, 49, 50, 52, 53, 54, 55] },
  { n: 6, title: 'The long grind and the platinum', time: 'to ~200 hours', blurb: 'Finish the 100% completion checklist (A Long Road, gold) — its thresholds are lenient, about 60% of true completion, and most of it is already done by the earlier stages. The 500 Criminal Profile choices (Actions Speak Louder) climb across the whole run. The platinum pops when the other 54 are earned.', ids: [14, 48, 1] },
];

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

let earned = new Set(loadJSON(STORE_KEY, []));
let prefs = Object.assign({ spoilers: true }, loadJSON(PREF_KEY, {}));
spoilersEl.checked = prefs.spoilers !== false;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const byName = new Map(trophies.map((t) => [t.name, t]));

function saveProgress() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned]));
}
function savePrefs() {
  localStorage.setItem(PREF_KEY, JSON.stringify({ spoilers: spoilersEl.checked }));
}

function isSpoilerHidden(t) {
  return spoilersEl.checked && t.hidden && t.kind === 'story' && !earned.has(t.name);
}
function displayName(t) {
  return isSpoilerHidden(t) ? 'Hidden story trophy' : t.name;
}
function displayDesc(t) {
  return isSpoilerHidden(t)
    ? 'Hidden until earned — PlayStation hides this story trophy’s name and description until you earn it.'
    : t.description;
}
function gradeLabel(t) {
  return t.grade[0].toUpperCase() + t.grade.slice(1);
}
function countLabel(t) {
  if (t.count == null) return '';
  if (t.id === 52 || t.id === 53) return 'Target: $' + t.count.toLocaleString('en-US');
  return 'Target: ' + t.count;
}

function renderProgress() {
  const n = earned.size;
  const pct = Math.round((n / trophies.length) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = n + ' of ' + trophies.length + ' earned · ' + pct + '% · ' + (trophies.length - n) + ' to go';
  missableCount.textContent = String(trophies.filter((t) => t.missable).length);
}

function badge(text, cls) {
  const s = document.createElement('span');
  s.className = 'badge ' + cls;
  s.textContent = text;
  return s;
}

function trophyCard(t) {
  const li = document.createElement('li');
  li.className = 'trophy' + (earned.has(t.name) ? ' earned' : '');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', 'Mark ' + t.name + ' earned');
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    saveProgress();
    renderAll();
  });
  const body = document.createElement('div');
  const name = document.createElement('p');
  name.className = 'name';
  name.textContent = displayName(t);
  name.addEventListener('click', () => openDetail(t));
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = displayDesc(t);
  body.append(name, desc);
  if (!isSpoilerHidden(t)) {
    const snippet = document.createElement('p');
    snippet.className = 'guide-snippet';
    snippet.textContent = t.guide;
    body.append(snippet);
  } else {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'Guide hidden until earned — turn spoiler hiding off to read it, or tick the trophy once you have it.';
    body.append(note);
  }
  const meta = document.createElement('p');
  meta.className = 'meta';
  meta.append(badge(gradeLabel(t), t.grade));
  meta.append(badge(t.kind, 'kind'));
  if (t.hidden) meta.append(badge('Hidden', 'hidden'));
  if (t.missable) meta.append(badge('Missable', 'missable'));
  if (t.count != null) meta.append(badge(countLabel(t), 'count'));
  body.append(meta);
  const open = document.createElement('button');
  open.type = 'button';
  open.className = 'open';
  open.textContent = 'Guide & sources';
  open.addEventListener('click', () => openDetail(t));
  li.append(box, body, open);
  return li;
}

function renderList() {
  const q = searchEl.value.trim().toLowerCase();
  const shown = trophies.filter((t) => {
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
    if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
    if (hideEarnedEl.checked && earned.has(t.name)) return false;
    if (q) {
      const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.kind).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  listEl.replaceChildren(...shown.map(trophyCard));
  resultCount.textContent = shown.length === trophies.length
    ? 'Showing all ' + trophies.length + ' trophies.'
    : 'Showing ' + shown.length + ' of ' + trophies.length + ' trophies.';
}

function renderRoadmap() {
  const host = document.getElementById('roadmap');
  host.replaceChildren();
  for (const stage of STAGES) {
    const div = document.createElement('div');
    div.className = 'stage';
    const h = document.createElement('h3');
    h.textContent = 'Stage ' + stage.n + ' — ' + stage.title + ' ';
    const time = document.createElement('span');
    time.className = 'stage-time';
    time.textContent = '(' + stage.time + ')';
    h.append(time);
    const p = document.createElement('p');
    p.textContent = stage.blurb;
    const ul = document.createElement('ul');
    for (const id of stage.ids) {
      const t = byId.get(id);
      if (!t) continue;
      const li = document.createElement('li');
      if (earned.has(t.name)) li.className = 'done';
      li.textContent = (earned.has(t.name) ? '✓ ' : '☐ ') + t.name + ' — ' + t.description + ' (' + gradeLabel(t) + ')';
      ul.append(li);
    }
    div.append(h, p, ul);
    host.append(div);
  }
}

function renderMissable() {
  const host = document.getElementById('missableList');
  host.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const div = document.createElement('div');
    div.className = 'missable-card';
    const h = document.createElement('h3');
    h.textContent = '⚠ ' + t.name + ' — ' + gradeLabel(t) + ' (potentially missable)';
    const d = document.createElement('p');
    d.textContent = 'Official description: “' + t.description + '”';
    const g = document.createElement('p');
    g.textContent = t.guide;
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'open';
    open.textContent = 'Open guide & sources';
    open.addEventListener('click', () => openDetail(t));
    div.append(h, d, g, open);
    host.append(div);
  }
  const ok = document.createElement('p');
  ok.textContent = 'Every other trophy is safe to leave for free roam after the story. That includes all five side-character strands, the stranger strands, every activity, collectible and robbery trophy, and the whole 100% completion checklist.';
  host.append(ok);
}

function renderAll() {
  renderProgress();
  renderList();
  renderRoadmap();
  renderMissable();
}

// Detail view: official description, this guide's own-words guide, cited sources.
const detail = document.getElementById('detail');
const detailEarned = document.getElementById('detailEarned');
let detailTrophy = null;

function openDetail(t) {
  detailTrophy = t;
  const hidden = isSpoilerHidden(t);
  document.getElementById('detailBadges').replaceChildren(
    badge(gradeLabel(t), t.grade),
    badge(t.kind, 'kind'),
    ...(t.hidden ? [badge('Hidden', 'hidden')] : []),
    ...(t.missable ? [badge('Missable', 'missable')] : []),
    ...(t.count != null ? [badge(countLabel(t), 'count')] : []),
  );
  document.getElementById('detailName').textContent = hidden ? 'Hidden story trophy' : t.name;
  document.getElementById('detailDesc').textContent = hidden
    ? 'Hidden until earned — turn spoiler hiding off, or earn this trophy, to see its official name and description.'
    : 'Official description: “' + t.description + '”';
  document.getElementById('detailGuide').textContent = hidden
    ? 'Guide hidden until earned. Untick “Hide story spoilers” above if you want to read story guides before playing.'
    : t.guide;
  const sources = document.getElementById('detailSources');
  sources.replaceChildren();
  if (hidden) {
    const li = document.createElement('li');
    li.textContent = 'Sources hidden with the guide.';
    sources.append(li);
  } else {
    for (const s of t.sources || []) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = s.url;
      a.textContent = s.name;
      a.target = '_blank';
      a.rel = 'noopener';
      li.append(a);
      sources.append(li);
    }
  }
  detailEarned.checked = earned.has(t.name);
  detail.hidden = false;
  location.hash = '#/trophy/' + t.id;
}
function closeDetail() {
  detail.hidden = true;
  detailTrophy = null;
  if (location.hash.startsWith('#/trophy/')) history.replaceState(null, '', '#/checklist');
}
document.getElementById('detailClose').addEventListener('click', closeDetail);
detail.addEventListener('click', (e) => { if (e.target === detail) closeDetail(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDetail(); });
detailEarned.addEventListener('change', () => {
  if (!detailTrophy) return;
  if (detailEarned.checked) earned.add(detailTrophy.name);
  else earned.delete(detailTrophy.name);
  saveProgress();
  renderAll();
});

// Tabs and hash routing, so each view has a linkable address.
const tabs = [...document.querySelectorAll('.tabs button')];
function showTab(name) {
  for (const b of tabs) {
    const active = b.dataset.tab === name;
    b.classList.toggle('active', active);
    if (active) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  }
  for (const page of document.querySelectorAll('.tab-page')) {
    page.hidden = page.id !== 'tab-' + name;
  }
  if (name !== 'roadmap' && name !== 'missable') name = 'checklist';
  if (!location.hash.startsWith('#/trophy/')) history.replaceState(null, '', '#/' + name);
}
for (const b of tabs) b.addEventListener('click', () => showTab(b.dataset.tab));

function routeFromHash() {
  const hash = location.hash || '#/checklist';
  const m = hash.match(/^#\/trophy\/(\d+)$/);
  if (m && byId.get(Number(m[1]))) {
    showTab('checklist');
    openDetail(byId.get(Number(m[1])));
    return;
  }
  if (hash === '#/roadmap') showTab('roadmap');
  else if (hash === '#/missable') showTab('missable');
  else showTab('checklist');
}
window.addEventListener('hashchange', routeFromHash);

// Export / import / reset.
document.getElementById('export').addEventListener('click', () => {
  const data = { game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: [...earned] };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const valid = names.filter((n) => byName.has(n));
    earned = new Set(valid);
    saveProgress();
    renderAll();
    resultCount.textContent = 'Imported ' + valid.length + ' earned trophies' + (names.length - valid.length ? ' (' + (names.length - valid.length) + ' unknown names ignored).' : '.');
  } catch {
    resultCount.textContent = 'Import failed: that file is not a trophy-progress export from this guide.';
  }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (!window.confirm('Clear all earned ticks in this browser?')) return;
  earned = new Set();
  saveProgress();
  renderAll();
});

for (const el of [searchEl, gradeEl, kindEl, earnedOnlyEl, hideEarnedEl]) {
  el.addEventListener('input', renderList);
  el.addEventListener('change', renderList);
}
spoilersEl.addEventListener('change', () => { savePrefs(); renderAll(); });

renderAll();
routeFromHash();
window.__guideReady = true;
