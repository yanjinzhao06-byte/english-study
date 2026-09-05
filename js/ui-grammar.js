/* ============================================================
   语法：分层系统课 + 精讲 + 随堂测验 + 结课打卡
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED, Eng = g.Eng;
  var esc = Eng.esc;

  var G = { view: 'list', id: null, q: null, qpos: 0, chosen: -1, qres: [] };
  var LVCOL = { 1: '#0ea5e9', 2: '#0ea56a', 3: '#7c3aed' };
  var LVNAME = { 1: 'A 级', 2: 'B 级', 3: 'C 级' };

  function lessonById(id) {
    for (var i = 0; i < ED.course.list.length; i++) if (ED.course.list[i].id === id) return ED.course.list[i];
    return null;
  }

  Eng.registerView('grammar', function () {
    if (G.view === 'detail' && G.id) return detail(lessonById(G.id));
    if (G.view === 'quiz') return quiz();
    return listView();
  });

  /* ---------- 列表 ---------- */
  function listView() {
    var html = ED.course.levels.map(function (lv) {
      var items = ED.course.list.filter(function (l) { return l.lv === lv.lv; });
      var done = items.filter(function (l) { var s = Eng.S.lessons[l.id]; return s && s.done; }).length;
      return '<div class="card pad">' +
        '<div class="row wrap"><span style="width:12px;height:12px;border-radius:4px;background:' + lv.color + '"></span>' +
        '<b>' + lv.name + '</b><span class="chip" style="margin-left:auto">' + done + ' / ' + items.length + '</span></div>' +
        '<p class="small muted mt8">' + lv.desc + '</p>' +
        '<div class="mt12" style="display:flex;flex-direction:column;gap:6px">' +
        items.map(function (l) {
          var s = Eng.S.lessons[l.id];
          return '<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:#f8f9fd;border:1px solid var(--line)">' +
            '<span class="chip" style="background:' + lv.color + '22;color:' + lv.color + ';flex:0 0 auto">' + l.id + '</span>' +
            '<div class="grow"><b style="font-size:13.5px">' + esc(l.title) + '</b><div class="tiny muted">约 ' + l.est + ' · 随堂测验 ' + l.qs.length + ' 题</div></div>' +
            (s && s.done ? '<span class="chip ok">✅ 已学 · ' + Math.round(s.best * 100) + '%</span>' : '<span class="chip warn">未学</span>') +
            '<button class="btn xs soft" data-act="gr-open" data-id="' + l.id + '">' + (s && s.done ? '复习' : '开始') + '</button>' +
          '</div>';
        }).join('') + '</div></div>';
    }).join('');

    return '' +
      '<div class="hero" style="background:linear-gradient(135deg,#7c3aed,#4f46e5)">' +
        '<div class="checkin-hero">' +
          '<span class="flame">✏️</span>' +
          '<div class="grow"><h1>语法系统课</h1><p>A 基础重建 → B 高中核心 → C 专升本拔高，一课一测，通关结课</p></div>' +
          '<div class="ring sm" style="--p:' + donePct() + '"><div class="ring-txt"><b style="font-size:19px">' + doneCount() + '</b><div class="tiny" style="opacity:.85">/' + ED.course.list.length + ' 课</div></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="grid g1 mt16" style="gap:16px">' + html + '</div>' +
      '<div class="sect"><h3>学习建议</h3></div>' +
      '<div class="card pad small muted">先按估分进入对应层级：' +
        '<b>50-80</b> 分主攻 A 级；<b>80-110</b> 分主攻 B 级；<b>110+</b> 分主攻 C 级。<br>' +
        '每课流程：读精讲 → 看例句 → 记易错点 → 完成随堂测验（≥60% 结课）。语法不会单独考选择，但它是完形、改错、翻译与写作的地基。' +
      '</div>';
  }
  function doneCount() { return ED.course.list.filter(function (l) { var s = Eng.S.lessons[l.id]; return s && s.done; }).length; }
  function donePct() { return Math.round(doneCount() / ED.course.list.length * 100); }

  /* ---------- 详情 ---------- */
  function detail(L) {
    if (!L) { G.view = 'list'; return listView(); }
    var s = Eng.S.lessons[L.id];
    var lv = ED.course.levels.filter(function (x) { return x.lv === L.lv; })[0];
    var blocks = L.blocks.map(function (b) {
      if (b.k === 'p') return '<p>' + esc(b.x) + '</p>';
      if (b.k === 'eg') return '<div class="eg">' + esc(b.en) + '<span class="zh">' + esc(b.zh) + '</span></div>';
      if (b.k === 'tip') return '<div class="gram-box" style="border-left-color:var(--warn)"><b style="color:var(--warn)">⚡ 易错提醒：</b>' + esc(b.x) + '</div>';
      return '';
    }).join('');

    return '' +
      '<button class="btn plain xs mb16" data-act="gr-back">← 返回课程列表</button>' +
      '<div class="card pad lesson-block">' +
        '<div class="row wrap"><span class="chip" style="background:' + LVCOL[L.lv] + '22;color:' + LVCOL[L.lv] + '">' + LVNAME[L.lv] + ' · ' + lv.name + '</span>' +
        '<span class="chip">' + L.est + '</span>' +
        (s && s.done ? '<span class="chip ok" style="margin-left:auto">✅ 已结课 · 最佳 ' + Math.round(s.best * 100) + '%</span>' : '<span class="chip warn" style="margin-left:auto">未结课</span>') +
        '</div>' +
        '<h2 class="mt12" style="font-size:23px">' + esc(L.title) + '</h2>' +
        '<div class="gram-box mt16" style="line-height:1.9">' + blocks + '</div>' +
        '<div class="hr"></div>' +
        '<div class="row wrap"><b>随堂测验 · ' + L.qs.length + ' 题</b>' +
        '<span class="muted small">≥60% 正确即结课</span>' +
        '<button class="btn sm" style="margin-left:auto" data-act="gr-start" data-id="' + L.id + '">' + (s && s.done ? '重新测验' : '开始测验 →') + '</button></div>' +
      '</div>';
  }

  /* ---------- 测验 ---------- */
  function quiz() {
    var st = G.q;
    if (!st) return listView();
    if (G.qpos >= st.items.length) return quizDone(st);
    var it = st.items[G.qpos];
    var opts = it.o.map(function (o, i) {
      var cls = 'qz-option', letter = 'ABCD'[i];
      if (G.chosen >= 0) {
        if (i === it.ai) cls += ' right'; else if (i === G.chosen) cls += ' wrong';
        cls += ' disabled';
      }
      return '<button class="' + cls + '" data-act="gr-ans" data-i="' + i + '" ' + (G.chosen >= 0 ? 'disabled' : '') + '>' +
        '<span class="letter let-' + letter + '">' + letter + '</span><span>' + esc(o) + '</span></button>';
    }).join('');
    return '' +
      '<button class="btn plain xs mb16" data-act="gr-exit">← 退出测验</button>' +
      '<div class="mock-quiz">' +
      '<div class="progress-line mb16"><div class="pbar grow"><i style="width:' + (G.qpos / st.items.length * 100) + '%"></i></div>' +
        '<span class="qlabel">' + (G.qpos + 1) + ' / ' + st.items.length + '</span></div>' +
      '<div class="card pad">' +
        '<span class="sec-tag">' + esc(st.lesson.id + ' · ' + st.lesson.title) + '</span>' +
        '<div class="qz-stem mt12">' + (G.qpos + 1) + '. ' + esc(it.q) + '</div>' +
        '<div class="grid mt16" style="gap:10px">' + opts + '</div>' +
        (G.chosen >= 0 ? '<div class="qz-exp mt12">' + esc(it.e) + '</div>' +
          '<button class="btn block mt16" data-act="gr-next">' + (G.qpos + 1 >= st.items.length ? '查看结课结果' : '下一题 →') + '</button>' : '') +
      '</div></div>';
  }
  function quizDone(st) {
    var ok = G.qres.filter(function (x) { return x; }).length, total = G.qres.length;
    var pct = total ? ok / total : 0;
    var pass = pct >= 0.6;
    // 保存结课
    var prev = Eng.S.lessons[st.lesson.id];
    var best = prev && prev.best ? prev.best : 0;
    var isNew = !(prev && prev.done);
    if (pass) {
      Eng.S.lessons[st.lesson.id] = { done: true, best: Math.max(best, pct), at: Date.now() };
    } else if (prev && prev.done) {
      Eng.S.lessons[st.lesson.id] = { done: true, best: Math.max(best, pct), at: prev.at };
    }
    Eng.save();
    var wrongs = st.items.map(function (it, i) {
      var okq = G.qres[i];
      if (okq) return null;
      return '<div class="li-item"><span class="li-ico" style="background:var(--bad-soft)">✗</span>' +
        '<div><div class="li-txt">' + esc(it.q) + '</div><div class="li-sub">正确答案：' + esc(it.o[it.ai]) + ' — ' + esc(it.e) + '</div></div></div>';
    }).filter(Boolean).join('');
    return '<div style="max-width:660px;margin:0 auto" class="center">' +
      '<div class="card pad" style="padding:30px">' +
        '<div style="font-size:50px">' + (pass ? (pct >= 0.85 ? '🏆' : '🎉') : '💪') + '</div>' +
        '<h2 class="mt8">' + (pass ? '测验通过，课程已结课！' : '还差一点，再复习一次吧') + '</h2>' +
        '<p class="muted">' + esc(st.lesson.title) + ' · 正确 ' + ok + ' / ' + total + '（' + Math.round(pct * 100) + '%' + (pass ? ' ≥ 60%' : '') + '）</p>' +
        '<div class="pbar mt12"><i style="width:' + Math.round(pct * 100) + '%;background:' + (pass ? 'var(--ok)' : 'var(--warn)') + '"></i></div>' +
      '</div>' +
      (wrongs ? '<div class="card pad mt16" style="text-align:left"><div style="font-weight:800" class="mb8">错题回顾</div>' + wrongs + '</div>' : '') +
      '<div class="row mt16 center" style="justify-content:center;gap:10px">' +
        '<button class="btn soft" data-act="gr-start" data-id="' + st.lesson.id + '">再做一遍</button>' +
        '<button class="btn ghost" data-act="gr-back">返回课程</button>' +
        '<button class="btn" data-go="grammar">看下一课</button>' +
      '</div></div>';
  }

  /* ---------- actions ---------- */
  Eng.actions['gr-open'] = function (el, d) { G.view = 'detail'; G.id = d.id; G.q = null; Eng.go('grammar'); };
  Eng.actions['gr-back'] = function () { G.view = 'list'; G.id = null; G.q = null; Eng.go('grammar'); };
  Eng.actions['gr-exit'] = function () { G.view = 'list'; G.id = null; G.q = null; Eng.go('grammar'); };

  Eng.actions['gr-start'] = function (el, d) {
    var L = lessonById(d.id);
    if (!L) return;
    var items = L.qs.map(function (q) {
      var sc = E.shufChoices(q.o, q.a);
      return { q: q.q, o: sc.os, ai: sc.ai, e: q.e, a: q.a };
    });
    G.view = 'quiz'; G.q = { lesson: L, items: items }; G.qpos = 0; G.chosen = -1; G.qres = [];
    Eng.go('grammar');
  };
  Eng.actions['gr-ans'] = function (el, d) {
    if (!G.q || G.qpos >= G.q.items.length || G.chosen >= 0) return;
    G.chosen = +d.i;
    G.qres.push(G.chosen === G.q.items[G.qpos].ai);
    Eng.record({ qn: 1, qk: G.qres[G.qres.length - 1] ? 1 : 0 });
    Eng.go('grammar');
  };
  Eng.actions['gr-next'] = function () {
    if (G.chosen < 0 || !G.q) return;
    var done = G.qpos + 1 >= G.q.items.length;
    G.qpos++; G.chosen = -1;
    if (done) {
      var ok = G.qres.filter(function (x) { return x; }).length;
      Eng.record({ act: '✏️ 随堂测验：' + G.q.lesson.id + ' ' + ok + '/' + G.qres.length + ' 正确' });
      Eng.save();
    }
    Eng.go('grammar');
  };
})(window);
