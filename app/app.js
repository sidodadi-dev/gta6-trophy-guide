// Leonida Nights — GTA VI trophy guide & tracker.
// Plain static script: loads data/trophies.json, renders the checklist, a per-trophy
// guide panel and the five-stage roadmap. Progress lives in localStorage; the ?shot=
// demo scenes seed an in-memory state only and never read or write saved progress.
(function () {
  'use strict';

  var KEY = 'leonida-nights-progress-v1';
  var params = new URLSearchParams(location.search);
  var shot = params.get('shot');
  var inShot = !!shot;

  var doc = null;
  var byId = {};
  var state = { earned: new Set(), counts: {} };
  var filters = { search: '', kind: 'all', grade: 'all', hideEarned: false, spoiler: false };
  var selectedId = null;
  var view = 'tracker';

  var els = {};
  ['earned-count', 'bar-fill', 'grade-counts', 'platinum-note', 'list', 'detail', 'showing',
   'search', 'grade', 'hide-earned', 'spoiler', 'kind-chips', 'tab-tracker', 'tab-roadmap',
   'tracker-view', 'roadmap-view', 'roadmap', 'export', 'import', 'reset']
    .forEach(function (id) { els[id] = document.getElementById(id); });

  function fmt(n) { return n.toLocaleString('en-US'); }
  function countText(t, v) {
    var pre = t.countPrefix || '', suf = t.countSuffix || '';
    return pre + fmt(v) + suf + ' / ' + pre + fmt(t.count) + suf;
  }
  function isHidden(t) {
    return filters.spoiler && t.kind === 'story' && !state.earned.has(t.id);
  }

  // ---------- persistence ----------
  function loadSaved() {
    if (inShot) return; // demo scenes never touch the visitor's saved progress
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      (data.earned || []).forEach(function (id) { state.earned.add(id); });
      state.counts = data.counts || {};
    } catch (e) { /* corrupted save: start fresh */ }
  }
  function save() {
    if (inShot) return;
    localStorage.setItem(KEY, JSON.stringify({
      earned: Array.from(state.earned), counts: state.counts
    }));
  }

  // ---------- demo scenes (in-memory only) ----------
  function seedShot() {
    if (shot === 'checklist') {
      [2, 3, 4, 5, 8, 16, 21, 44].forEach(function (id) { state.earned.add(id); });
      state.counts = { 17: 30, 31: 45, 15: 120 };
      selectedId = 17;
    } else if (shot === 'roadmap') {
      [2, 3, 4, 5, 8, 37, 22, 16].forEach(function (id) { state.earned.add(id); });
      state.counts = { 31: 45 };
      view = 'roadmap';
    } else if (shot === 'missable') {
      [2, 3].forEach(function (id) { state.earned.add(id); });
      filters.kind = 'missable';
      selectedId = 37;
    } else if (shot === 'spoiler') {
      [2, 3].forEach(function (id) { state.earned.add(id); });
      filters.spoiler = true;
      selectedId = 5;
    }
  }

  // ---------- state changes ----------
  function setEarned(id, on) {
    if (on) state.earned.add(id); else state.earned.delete(id);
    save(); render();
  }
  function bumpCount(t, delta) {
    var cur = state.counts[t.id] || 0;
    var next = Math.max(0, Math.min(t.count, cur + delta));
    state.counts[t.id] = next;
    if (next >= t.count) state.earned.add(t.id); // auto-check at the target
    save(); render();
  }

  // ---------- rendering ----------
  function gradeChip(t) {
    return '<span class="grade-chip grade-' + t.grade + '">' + t.grade + '</span>';
  }
  function counterHtml(t, big) {
    var v = state.counts[t.id] || 0;
    return '<span class="counter" data-counter="' + t.id + '">' +
      '<button type="button" data-bump="-1" aria-label="Decrease">−</button>' +
      '<span class="count-val">' + countText(t, v) + '</span>' +
      '<button type="button" data-bump="1" aria-label="Increase">+</button></span>';
  }
  function visible(t) {
    if (filters.kind === 'missable' && !t.missable) return false;
    if (filters.kind !== 'all' && filters.kind !== 'missable' && t.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.hideEarned && state.earned.has(t.id)) return false;
    if (filters.search) {
      var q = filters.search.toLowerCase();
      var hay = (t.name + ' ' + t.description + ' ' + t.kind).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function renderList() {
    var html = '';
    var shown = 0;
    doc.trophies.forEach(function (t) {
      if (!visible(t)) return;
      shown++;
      var hidden = isHidden(t);
      var earned = state.earned.has(t.id);
      html += '<li class="trophy' + (earned ? ' earned' : '') +
        (t.id === selectedId ? ' selected' : '') + '" data-open="' + t.id + '">' +
        '<input type="checkbox" data-earn="' + t.id + '"' + (earned ? ' checked' : '') +
        ' aria-label="Mark earned">' + gradeChip(t) +
        '<div class="body"><div class="name">' +
        (hidden ? 'Hidden story trophy' : escapeHtml(t.name)) + '</div>' +
        '<div class="desc">' +
        (hidden ? 'Spoiler shield is on — earn this trophy to reveal it.' : escapeHtml(t.description)) +
        '</div><div class="tags">' +
        '<span class="tag kind">' + t.kind + '</span>' +
        '<span class="tag stage">Stage ' + t.stage + '</span>' +
        (t.missable ? '<span class="tag missable">Missable</span>' : '') +
        (t.count ? counterHtml(t) : '') +
        '</div></div></li>';
    });
    els.list.innerHTML = html || '<li class="empty">No trophies match these filters.</li>';
    els.showing.textContent = 'Showing ' + shown + ' of ' + doc.trophies.length +
      ' trophies · ' + state.earned.size + ' earned overall';
  }

  function renderDetail() {
    var t = byId[selectedId] || doc.trophies[0];
    if (!t) { els.detail.innerHTML = ''; return; }
    var hidden = isHidden(t);
    var earned = state.earned.has(t.id);
    var html = gradeChip(t) +
      '<h2>' + (hidden ? 'Hidden story trophy' : escapeHtml(t.name)) + '</h2>' +
      '<p class="d-desc">' + (hidden ? 'The spoiler shield hides this story trophy until you earn it.' : escapeHtml(t.description)) + '</p>' +
      '<div class="tags">' +
      '<span class="tag kind">' + t.kind + '</span>' +
      '<span class="tag stage">Roadmap stage ' + t.stage + '</span>' +
      (t.missable ? '<span class="tag missable">Missable</span>' : '') + '</div>';
    if (t.missable && t.missable_note) {
      html += '<h3>Missable — read first</h3><p class="missable-note">' + escapeHtml(t.missable_note) + '</p>';
    }
    html += '<h3>Guide</h3><p>' +
      (hidden ? 'Guide hidden by the spoiler shield — it would give the story away.' : escapeHtml(t.guide)) + '</p>';
    html += '<p class="sources"><strong>Sources:</strong> ' + escapeHtml(t.sources || '') + '</p>';
    if (t.count) {
      html += '<h3>Progress counter</h3>' + counterHtml(t, true) +
        '<p class="d-desc">Reaching the target ticks the trophy off automatically.</p>';
    }
    html += '<button type="button" class="earn-btn' + (earned ? ' is-earned' : '') +
      '" data-toggle-earn="' + t.id + '">' + (earned ? '✓ Earned — tap to undo' : 'Mark as earned') + '</button>';
    els.detail.innerHTML = html;
  }

  function renderProgress() {
    var total = doc.trophies.length;
    els['earned-count'].textContent = state.earned.size;
    els['bar-fill'].style.width = (100 * state.earned.size / total) + '%';
    var grades = ['platinum', 'gold', 'silver', 'bronze'];
    els['grade-counts'].textContent = grades.map(function (g) {
      var all = doc.trophies.filter(function (t) { return t.grade === g; }).length;
      var got = doc.trophies.filter(function (t) { return t.grade === g && state.earned.has(t.id); }).length;
      return g[0].toUpperCase() + g.slice(1) + ' ' + got + '/' + all;
    }).join(' · ');
    var others = total - 1;
    var gotOthers = doc.trophies.filter(function (t) { return t.id !== 1 && state.earned.has(t.id); }).length;
    els['platinum-note'].textContent = state.earned.has(1)
      ? '🏆 Platinum earned — Leonida Legend!'
      : 'Platinum: “Vice Got a Price!” unlocks when the other 54 are earned (' + gotOthers + '/' + others + ').';
  }

  function renderRoadmap() {
    var html = '';
    (doc.roadmap || []).forEach(function (s) {
      var ids = s.trophies;
      var done = ids.filter(function (id) { return state.earned.has(id); }).length;
      html += '<article class="stage-card"><div class="stage-head">' +
        '<span class="stage-num">Stage ' + s.stage + '</span><h2>' + escapeHtml(s.title) + '</h2>' +
        '<span class="stage-progress">' + done + ' / ' + ids.length + ' earned</span></div>' +
        '<p class="advice">' + escapeHtml(s.advice) + '</p><div class="stage-trophies">';
      ids.forEach(function (id) {
        var t = byId[id];
        if (!t) return;
        html += '<button type="button" class="stage-trophy' +
          (state.earned.has(id) ? ' done' : '') + '" data-open="' + id + '">' +
          '<span class="dot dot-' + t.grade + '"></span>' + escapeHtml(t.name) + '</button>';
      });
      html += '</div></article>';
    });
    els.roadmap.innerHTML = html;
  }

  function render() {
    renderProgress();
    if (view === 'tracker') {
      els['tracker-view'].hidden = false;
      els['roadmap-view'].hidden = true;
      renderList(); renderDetail();
    } else {
      els['tracker-view'].hidden = true;
      els['roadmap-view'].hidden = false;
      renderRoadmap();
    }
    els['tab-tracker'].classList.toggle('active', view === 'tracker');
    els['tab-roadmap'].classList.toggle('active', view === 'roadmap');
    syncControls();
  }

  function syncControls() {
    els.search.value = filters.search;
    els.grade.value = filters.grade;
    els['hide-earned'].checked = filters.hideEarned;
    els.spoiler.checked = filters.spoiler;
    Array.prototype.forEach.call(els['kind-chips'].children, function (chip) {
      chip.classList.toggle('active', chip.getAttribute('data-kind') === filters.kind);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- events ----------
  document.addEventListener('click', function (ev) {
    var bump = ev.target.closest('[data-bump]');
    if (bump) {
      ev.stopPropagation();
      var wrap = bump.closest('[data-counter]');
      var t = byId[Number(wrap.getAttribute('data-counter'))];
      bumpCount(t, Number(bump.getAttribute('data-bump')) * (t.countStep || 1));
      return;
    }
    var toggle = ev.target.closest('[data-toggle-earn]');
    if (toggle) {
      var id = Number(toggle.getAttribute('data-toggle-earn'));
      setEarned(id, !state.earned.has(id));
      return;
    }
    var open = ev.target.closest('[data-open]');
    if (open && !ev.target.closest('[data-counter]')) {
      selectedId = Number(open.getAttribute('data-open'));
      view = 'tracker';
      render();
    }
  });
  document.addEventListener('change', function (ev) {
    var box = ev.target.closest('[data-earn]');
    if (box) setEarned(Number(box.getAttribute('data-earn')), box.checked);
  });
  els.search.addEventListener('input', function () { filters.search = els.search.value; renderList(); });
  els.grade.addEventListener('change', function () { filters.grade = els.grade.value; renderList(); });
  els['hide-earned'].addEventListener('change', function () { filters.hideEarned = els['hide-earned'].checked; renderList(); });
  els.spoiler.addEventListener('change', function () { filters.spoiler = els.spoiler.checked; render(); });
  els['kind-chips'].addEventListener('click', function (ev) {
    var chip = ev.target.closest('[data-kind]');
    if (!chip) return;
    filters.kind = chip.getAttribute('data-kind');
    render();
  });
  els['tab-tracker'].addEventListener('click', function () { view = 'tracker'; render(); });
  els['tab-roadmap'].addEventListener('click', function () { view = 'roadmap'; render(); });

  els.export.addEventListener('click', function () {
    var payload = JSON.stringify({ earned: Array.from(state.earned), counts: state.counts }, null, 2);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    a.download = 'leonida-nights-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  els.import.addEventListener('change', function () {
    var file = els.import.files[0];
    if (!file) return;
    file.text().then(function (text) {
      try {
        var data = JSON.parse(text);
        state.earned.clear();
        if (Array.isArray(data)) {
          // starter format: an array of trophy names
          data.forEach(function (name) {
            doc.trophies.forEach(function (t) { if (t.name === name) state.earned.add(t.id); });
          });
          state.counts = {};
        } else {
          (data.earned || []).forEach(function (id) { state.earned.add(Number(id)); });
          state.counts = data.counts || {};
        }
        save(); render();
      } catch (e) { alert('That file is not valid progress JSON.'); }
      els.import.value = '';
    });
  });
  els.reset.addEventListener('click', function () {
    if (!confirm('Reset all trophy progress and counters saved in this browser?')) return;
    state.earned.clear(); state.counts = {};
    save(); render();
  });

  // ---------- boot ----------
  fetch('data/trophies.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      doc = data;
      doc.trophies.forEach(function (t) { byId[t.id] = t; });
      loadSaved();
      seedShot();
      if (!selectedId) selectedId = doc.trophies[0].id;
      render();
      window.__shotReady = true;
    })
    .catch(function (err) {
      els.list.innerHTML = '<li class="empty">Could not load data/trophies.json — serve this folder over HTTP (node serve.ts) rather than opening the file directly.</li>';
      window.__shotReady = true;
    });
})();
