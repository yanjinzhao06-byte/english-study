/* ============================================================
   全真模考：按河南专升本公共英语 8 部分组卷，满分 150，
   倒计时 + 答题卡 + 自动批改(选择/填空/改错) + 自评(翻译/写作)
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED, Eng = g.Eng;
  var esc = Eng.esc;

  var M = { mode: 'start', items: [], pos: 0, timer: null, leftMs: 0, totalMs: 0, report: null };

  var SECS = [
    { k: 'A', name: 'Ⅰ 阅读理解', pts: 2, count: 20 },
    { k: 'B', name: 'Ⅱ 完形填空', pts: 1, count: 20 },
    { k: 'C', name: 'Ⅲ 判断正误', pts: 2, count: 5 },
    { k: 'D', name: 'Ⅳ 英译汉选择', pts: 2, count: 5 },
    { k: 'E', name: 'Ⅴ 选词填空', pts: 3, count: 5 },
    { k: 'F', name: 'Ⅵ 汉译英翻译', pts: 3, count: 5, self: true },
    { k: 'G', name: 'Ⅶ 改错', pts: 2, count: 10 },
    { k: 'H', name: 'Ⅷ 写作', pts: 20, count: 1, self: true }
  ];

  function buildItems() {
    var items = [];
    // A 阅读 4 篇
    var rds = E.pick(ED.bank.reading, 4);
    rds.forEach(function (ps) {
      ps.qs.forEach(function (q, qi) {
        var sc = E.shufChoices(q.o, q.a);
        items.push({ sec: 'A', ty: 'mcq', pts: 2, q: q.q, o: sc.os, ai: sc.ai, e: q.e, ctx: { k: 'read', tx: ps.tx, t: ps.t }, qn: qi + 1, chosen: null });
      });
    });
    // B 完形
    var cl = E.pick(ED.bank.cloze, 1)[0];
    cl.opts.forEach(function (op, i) {
      var sc = E.shufChoices(op, cl.ans[i]);
      items.push({ sec: 'B', ty: 'cloze', pts: 1, blank: i + 1, o: sc.os, ai: sc.ai, e: '结合语境与语法判断', ctx: { k: 'cloze', data: cl }, chosen: null });
    });
    // C 判断
    var tf = E.pick(ED.bank2.tf, 1)[0];
    tf.items.forEach(function (it) {
      items.push({ sec: 'C', ty: 'mcq', pts: 2, q: it.s, o: ['正确（True）', '错误（False）'], ai: it.v ? 0 : 1, e: it.v ? '与短文相符 → True' : '与短文不符 → False', ctx: { k: 'tf', tx: tf.tx, t: tf.t }, chosen: null });
    });
    // D 英译汉
    E.pick(ED.bank2.ec, 5).forEach(function (q) {
      var sc = E.shufChoices(q.o, q.a);
      items.push({ sec: 'D', ty: 'mcq', pts: 2, q: q.en, o: sc.os, ai: sc.ai, e: q.e, chosen: null });
    });
    // E 选词
    var wf = E.pick(ED.bank2.wf, 1)[0];
    [1, 2, 3, 4, 5].forEach(function (n) {
      items.push({ sec: 'E', ty: 'wf', pts: 3, n: n, ans: wf.key[n - 1], ctx: { k: 'wf', data: wf }, chosen: null, val: '' });
    });
    // F 汉译英（自评 3/2/0）
    E.pick(ED.bank2.ce, 5).forEach(function (q) {
      items.push({ sec: 'F', ty: 'ce', pts: 3, zh: q.zh, ref: q.ref, note: q.note, chosen: null, val: '' });
    });
    // G 改错 10
    E.pick(ED.bank2.ef, 10).forEach(function (q) {
      items.push({ sec: 'G', ty: 'ef', pts: 2, s: q.s, bad: q.bad, good: q.good, e: q.e, chosen: null, lock: false });
    });
    // H 写作
    var es = E.pick(ED.bank2.essays, 1)[0];
    items.push({ sec: 'H', ty: 'essay', pts: 20, topic: es.t, req: es.req, sample: es.sample, chosen: null, val: '' });
    return items;
  }

  function secOf(k) { for (var i = 0; i < SECS.length; i++) if (SECS[i].k === k) return SECS[i]; return null; }

  Eng.registerView('mock', function () {
    if (M.mode === 'run') return examPage();
    if (M.mode === 'report' && M.report) return reportPage(M.report);
    return startPage();
  });

  /* ---------------- 开始页 ---------------- */
  function startPage() {
    var mocks = Eng.S.mocks;
    var best = 0; mocks.forEach(function (m) { if (m.total > best) best = m.total; });
    var history = mocks.length ? '<div class="sect"><h3>模考记录</h3></div><div class="grid g-auto">' +
      mocks.slice(-8).reverse().map(function (m) {
        return '<div class="stat-card"><div class="k">' + new Date(m.at).toLocaleDateString('zh-CN') + '</div><div class="v" style="color:' + (m.total >= 120 ? 'var(--ok)' : m.total >= 90 ? 'var(--warn)' : 'var(--bad)') + '">' + m.total + '<small> / 150</small></div>' +
          '<div class="tiny muted">自动 ' + m.auto + ' · 自评 ' + m.self + ' · 用时 ' + Math.round((m.secs || 0) / 60) + ' 分</div></div>';
      }).join('') + '</div>' : '';
    return '' +
      '<div class="hero" style="background:linear-gradient(135deg,#e5484d,#7c3aed)">' +
        '<div class="checkin-hero">' +
          '<span class="flame">📝</span>' +
          '<div class="grow"><h1>全真模拟考试</h1><p>智能组卷 · 河南专升本公共英语真题结构 · 满分 150 分 · 建议用时 150 分钟</p></div>' +
          (mocks.length ? '<div style="text-align:center"><div class="ring sm" style="--p:' + Math.round(best / 150 * 100) + '"><div class="ring-txt"><b style="font-size:18px">' + best + '</b><div class="tiny" style="opacity:.85">历史最佳</div></div></div></div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="grid g2 mt16"><div class="card pad">' +
        '<div class="row wrap"><b>📋 试卷结构</b><span class="chip brand">总分 150</span></div>' +
        '<table class="tbl mt8"><tr><th>部分</th><th>题量</th><th>分值</th></tr>' +
        SECS.map(function (s) { return '<tr><td>' + s.name + '</td><td>' + s.count + '</td><td>' + (s.k === 'H' ? '1 篇 20' : s.pts + ' 分×' + s.count + ' = ' + (s.pts * s.count)) + '</td></tr>'; }).join('') +
        '</table>' +
        '<div class="muted tiny mt8">* Ⅵ 汉译英与 Ⅷ 写作按“参考译文/范文自评”计分（模考结束后评分）。</div>' +
      '</div><div style="display:flex;flex-direction:column;gap:14px">' +
        '<div class="card pad"><b>🎯 使用建议</b><ul class="small muted" style="margin:8px 0 0;padding-left:18px;line-height:2">' +
          '<li>连续 150 分钟，模拟真实考场节奏</li>' +
          '<li>先做阅读/完形等客观题，写作留足 25 分钟</li>' +
          '<li>不确定的题先标记，答完再回头检查</li>' +
          '<li>模考分数是预估分的最强证据</li></ul></div>' +
        '<div class="card pad"><b>⏱ 考试时长</b>' +
          '<div class="row mt12 wrap" style="gap:8px">' +
            [150, 120, 90].map(function (t) {
              return '<button class="btn ' + (Eng.S.set.mockMin === t ? 'soft' : 'ghost') + ' xs" data-act="mk-time" data-t="' + t + '">' + t + ' 分钟</button>';
            }).join('') +
          '</div></div>' +
        '<button class="btn block" data-act="mk-start" style="min-height:54px;font-size:17px">🚀 开始模考</button>' +
        (mocks.length ? '<div class="center"><button class="btn plain xs" data-go="me">查看完整成绩趋势 →</button></div>' : '') +
      '</div></div>' + history;
  }

  /* ---------------- 考试 ---------------- */
  function examPage() {
    var it = M.items[M.pos];
    if (!it) { submit(false); return reportPage(M.report); }
    var all = M.items.length;
    var doneCnt = M.items.filter(function (x) { return x.chosen !== null; }).length;

    // 题号答题卡
    var dots = M.items.map(function (x, i) {
      var cls = 'sdot';
      if (i === M.pos) cls += ' cur';
      if (x.chosen !== null) cls += ' ans';
      return '<button class="' + cls + '" data-act="mk-jump" data-i="' + i + '" title="第 ' + (i + 1) + ' 题">' + (i + 1) + '</button>';
    }).join('');

    var ctxHtml = '';
    if (it.ctx) {
      if (it.ctx.k === 'read') ctxHtml = '<div class="reading-pane mb16"><div class="row mb8 wrap" style="gap:6px"><span class="chip">📖 ' + esc(it.ctx.t) + '</span><span class="chip">阅读 · 每题 2 分</span></div><div class="article"><p>' + esc(it.ctx.tx) + '</p></div></div>';
      if (it.ctx.k === 'tf') ctxHtml = '<div class="reading-pane mb16"><div class="row mb8 wrap" style="gap:6px"><span class="chip">⚖️ ' + esc(it.ctx.t) + '</span></div><div class="article"><p>' + esc(it.ctx.tx) + '</p></div></div>';
      if (it.ctx.k === 'cloze') ctxHtml = clozeText(it);
      if (it.ctx.k === 'wf') ctxHtml = wfText(it);
    }

    var bodyHtml = itemBody(it);
    var escInfo = it.sec === 'A' ? 'Q' + it.qn + ' · ' : it.sec === 'B' ? '第 ' + it.blank + ' 空 · ' : it.sec === 'E' ? '第 ' + it.n + ' 空 · ' : '';

    return '' +
      '<div class="mock-quiz">' +
      '<div class="row wrap mb12" style="gap:8px"><button class="icon-btn" data-act="mk-exit" style="width:34px;height:34px" title="退出模考">✕</button>' +
        '<span class="sec-tag">' + (secOf(it.sec) ? secOf(it.sec).name : '') + '</span>' +
        '<span class="chip">第 ' + (M.pos + 1) + ' / ' + all + ' 题</span>' +
        '<div class="grow"></div>' +
        '<span class="chip warn clock" id="mkClock">⏱ 2:29:59</span>' +
        '<button class="btn sm" data-act="mk-submit">交卷</button></div>' +
      '<div class="card pad">' +
        '<div class="qz-stem small muted" style="font-weight:600">' + escInfo + '</div>' +
        ctxHtml + bodyHtml +
      '</div>' +
      '<div class="answer-sheet"><span class="small muted" style="font-weight:700">答题卡</span>' +
        '<div class="sheet-dots">' + dots + '</div>' +
        '<div class="row" style="flex:0 0 auto;gap:6px"><button class="btn xs ghost" data-act="mk-prev"' + (M.pos === 0 ? ' disabled' : '') + '>‹ 上一题</button>' +
        '<button class="btn xs" data-act="mk-next">' + (M.pos + 1 >= all ? '最后一题' : '下一题 ›') + '</button></div></div>' +
      '<div class="tiny muted center mt8">已作答 ' + doneCnt + ' / ' + all + ' · 写作请预留 25 分钟</div>' +
      '</div>';
  }

  function itemBody(it) {
    if (it.ty === 'mcq') {
      return '<div class="qz-stem">' + esc(it.q) + '</div><div class="grid mt16" style="gap:10px">' +
        it.o.map(function (o, i) {
          var cls = 'qz-option' + (it.chosen === i ? ' sel' : '');
          return '<button class="' + cls + '" data-act="mk-ans" data-i="' + i + '"><span class="letter let-' + 'ABCD'[i] + '">' + 'ABCD'[i] + '</span><span>' + esc(o) + '</span></button>';
        }).join('') + '</div>';
    }
    if (it.ty === 'cloze') {
      return '<div class="qz-stem">请选择第 ' + it.blank + ' 空的正确选项</div><div class="grid mt16" style="gap:10px">' +
        it.o.map(function (o, i) {
          var cls = 'qz-option' + (it.chosen === i ? ' sel' : '');
          return '<button class="' + cls + '" data-act="mk-ans" data-i="' + i + '"><span class="letter let-' + 'ABCD'[i] + '">' + 'ABCD'[i] + '</span><span>' + esc(o) + '</span></button>';
        }).join('') + '</div>';
    }
    if (it.ty === 'wf') {
      return '<div class="qz-stem">为第 ' + it.n + ' 空选择合适单词（每词限一次，可回看修改）</div>' +
        (it.chosen !== null ? '<div class="chip ok mt8">已选：' + esc(it.val) + '</div>' : '') +
        '<div class="mt16" style="display:flex;gap:8px;flex-wrap:wrap">' + it.ctx.data.box.map(function (w) {
          var used = M.items.some(function (x) { return x.sec === 'E' && x !== it && x.val === w; });
          return '<button class="word-sel ' + (used ? 'used' : '') + '" data-act="mk-wf" data-w="' + esc(w) + '"' + (used ? ' disabled' : '') + '>' + esc(w) + '</button>';
        }).join('') + '</div>';
    }
    if (it.ty === 'ce') {
      return '<div class="qz-stem">' + esc(it.zh) + '</div>' +
        '<div class="mt12"><textarea class="inp" id="mkCeInp" rows="3" placeholder="写出你的英文翻译…">' + esc(it.val) + '</textarea></div>' +
        '<div class="row mt12 wrap" style="gap:8px"><span class="small muted">翻译自评（满分 3 分）：</span>' +
          ['完全正确', '基本正确', '未译出/错误'].map(function (t, i) {
            var pt = [3, 2, 0][i];
            return '<button class="btn xs ' + (it.chosen === i ? '' : 'ghost') + (it.chosen === i && pt === 3 ? ' ok' : it.chosen === i && pt === 2 ? ' warn' : it.chosen === i && pt === 0 ? ' bad' : '') + '" data-act="mk-self" data-k="ce" data-g="' + i + '">' + t + ' ' + pt + '分</button>';
          }).join('') +
        '</div>' +
        (it.chosen !== null ? '<div class="chip ok mt8">自评已存：' + ['完全正确','基本正确','未译出/错误'][it.chosen] + '</div>' : '') +
        '<div class="muted tiny mt8">对照自己译文点选档位，系统按 3/2/0 计分</div>';
    }
    if (it.ty === 'essay') {
      return '<div class="row wrap mb12" style="gap:6px"><span class="sec-tag">📄 写作 · 20 分</span></div>' +
        '<div class="qz-stem" style="font-size:15px;font-weight:600">' + esc(it.req) + '</div>' +
        '<div class="mt12"><textarea class="inp" id="mkEssayInp" rows="12" style="font-size:15px;line-height:1.9" placeholder="在这里写作文…">' + esc(it.val) + '</textarea></div>' +
        '<div class="row mt12 wrap" style="gap:8px"><span class="small muted">对照范文自评档位：</span>' +
          [0, 4, 8, 12, 16, 20].map(function (pt, i) {
            return '<button class="btn xs ' + (it.chosen === i ? '' : 'ghost') + (it.chosen === i ? ' soft' : '') + '" data-act="mk-self" data-k="es" data-g="' + i + '">' + pt + '</button>';
          }).join('') +
        '</div>' +
        '<div class="muted tiny mt8">按：内容 7 / 语言 7 / 结构 6 分档自评，交卷后可对照参考范文。</div>';
    }
    if (it.ty === 'ef') {
      var toks = it.s.split(' ');
      var selected = it.chosen;
      return '<div class="qz-stem">请点击句中错误所在词</div>' +
        '<div class="reading-pane center mt16" style="display:flex;gap:7px;flex-wrap:wrap;justify-content:center;line-height:2.7">' +
        toks.map(function (t, i) {
          var clean = t.replace(/[^A-Za-z'’-]/g, '').toLowerCase();
          var cls = 'word-sel';
          if (selected !== null && selected === clean) cls += ' used';
          return '<button class="' + cls + '" data-act="mk-ef" data-i="' + i + '"' + (selected !== null ? ' disabled' : '') + '>' + esc(t) + '</button>';
        }).join('') + '</div>' +
        (selected !== null ? '<div class="chip ok mt8">已标记：' + esc(selected) + '</div>' : '') +
        '<div class="muted tiny mt8">点击一次即锁定该词（2 分）；选错或跳过记 0 分</div>';
    }
    return '';
  }
  function clozeText(it) {
    var cl = it.ctx.data;
    var paras = cl.body.map(function (para) {
      var out = para.replace(/__\((\d+)\)__/g, function (_, n) {
        var i = +n - 1;
        var filled = M.items.filter(function (x) { return x.sec === 'B' && x.blank === i + 1 && x.chosen !== null; })[0];
        if (filled) return '<span class="blank filled">' + esc(filled.o[filled.chosen]) + '</span>';
        if (i + 1 === it.blank) return '<span class="blank sel-box">(' + n + ')</span>';
        return '<span class="blank">(' + n + ')</span>';
      });
      return '<p class="blanks-sent">' + out + '</p>';
    }).join('');
    return '<div class="gram-box mb16 small" style="border-left-color:#0ea56a"><b>提示：</b>' + esc(cl.zh) + '</div><div class="reading-pane mb16"><div class="article">' + paras + '</div></div>';
  }
  function wfText(it) {
    var wf = it.ctx.data;
    var text = wf.text.replace(/__\((\d+)\)__/g, function (_, n) {
      var i = +n - 1;
      var filled = M.items.filter(function (x) { return x.sec === 'E' && x.n === i + 1 && x.chosen !== null; })[0];
      return filled ? '<span class="blank filled">' + esc(filled.val) + '</span>' : '<span class="blank">(' + n + ')</span>';
    });
    return '<div class="reading-pane mb16"><div class="article"><div class="blanks-sent" style="line-height:2.4">' + text + '</div></div></div>';
  }

  /* ---------------- 动作：考试内 ---------------- */
  Eng.actions['mk-time'] = function (el, d) { Eng.S.set.mockMin = +d.t; Eng.save(); Eng.go('mock'); };
  Eng.actions['mk-start'] = function () {
    M.items = buildItems();
    M.pos = 0;
    M.mode = 'run';
    var totalSec = (Eng.S.set.mockMin || 150) * 60;
    M.totalMs = totalSec * 1000;
    M.started = Date.now();
    if (M.timer) clearInterval(M.timer);
    M.timer = setInterval(tick, 1000);
    Eng.go('mock');
    toastClock();
  };
  function tick() {
    var el = document.getElementById('mkClock');
    var left = M.totalMs - (Date.now() - M.started);
    M.leftMs = Math.max(0, left);
    if (el) el.textContent = '⏱ ' + Eng.fmtClock(Math.round(left / 1000));
    if (left <= 0) { clearInterval(M.timer); M.timer = null; submit(false); }
  }
  function toastClock() { tick(); }

  Eng.actions['mk-ans'] = function (el, d) {
    var it = M.items[M.pos];
    it.chosen = +d.i; // 允许回看修改
    Eng.go('mock');
  };
  Eng.actions['mk-wf'] = function (el, d) {
    var it = M.items[M.pos];
    var used = M.items.some(function (x) { return x.sec === 'E' && x !== it && x.val === d.w; });
    if (used) return;
    it.val = d.w; it.chosen = 0;
    Eng.go('mock');
  };
  Eng.actions['mk-ef'] = function (el, d) {
    var it = M.items[M.pos];
    var i = +d.i;
    it.chosen = it.s.split(' ')[i].replace(/[^A-Za-z'’-]/g, '').toLowerCase();
    it.lock = true;
    Eng.go('mock');
  };
  Eng.actions['mk-self'] = function (el, d) {
    var it = M.items[M.pos];
    if (!it) return;
    saveInputs();
    it.chosen = +d.g; // ce: 0..2（3/2/0 分）; essay: 0..5（×4 分）
    Eng.go('mock');
  };
  Eng.actions['mk-jump'] = function (el, d) {
    var i = +d.i;
    if (i < 0 || i >= M.items.length) return;
    saveInputs();
    M.pos = i;
    Eng.go('mock');
  };
  Eng.actions['mk-prev'] = function () { saveInputs(); if (M.pos > 0) { M.pos--; Eng.go('mock'); } };
  Eng.actions['mk-next'] = function () { saveInputs(); if (M.pos < M.items.length - 1) { M.pos++; Eng.go('mock'); } };

  function saveInputs() {
    var it = M.items[M.pos];
    if (!it) return;
    var ce = document.getElementById('mkCeInp');
    if (it.ty === 'ce' && ce) it.val = ce.value;
    var es = document.getElementById('mkEssayInp');
    if (it.ty === 'essay' && es) it.val = es.value;
  }
  Eng.actions['mk-exit'] = function () {
    Eng.modal(
      '<p class="muted small mt8">本次模考已作答 ' + M.items.filter(function (x) { return x.chosen !== null; }).length + ' / ' + M.items.length + ' 题。退出将放弃本次成绩。</p>' +
      '<div class="row mt16" style="gap:10px"><button class="btn soft grow" data-close>继续答题</button>' +
      '<button class="btn bad grow" data-act="mk-abandon">放弃并退出</button></div>',
      { title: '确认退出模考？' }
    );
  };
  Eng.actions['mk-abandon'] = function () {
    Eng.closeModal();
    if (M.timer) clearInterval(M.timer); M.timer = null;
    M.mode = 'start'; M.items = []; M.report = null;
    Eng.go('mock');
  };
  Eng.actions['mk-submit'] = function () {
    saveInputs();
    var undone = M.items.filter(function (x) { return x.chosen === null; }).length;
    var msg = undone > 0
      ? '<p class="muted small mt8">还有 <b>' + undone + '</b> 题未作答（含需自评的翻译/写作）。未答客观题计 0 分。</p>'
      : '<p class="muted small mt8">全部作答完成，确认交卷并核算成绩？</p>';
    Eng.modal(
      msg +
      '<div class="row mt16" style="gap:10px"><button class="btn ghost grow" data-close>再检查一下</button>' +
      '<button class="btn ok grow" data-act="mk-confirm">确认交卷</button></div>',
      { title: '📝 交卷确认' }
    );
  };
  Eng.actions['mk-confirm'] = function () { Eng.closeModal(); submit(true); };

  function submit(auto) {
    if (M.timer) clearInterval(M.timer); M.timer = null;
    var leftMs = Math.max(0, M.totalMs - (Date.now() - M.started));
    var usedSec = Math.round((M.totalMs - leftMs) / 1000);
    var auto = 0, self = 0;
    var secScore = {}; SECS.forEach(function (s) { secScore[s.k] = { pts: 0, ok: 0, n: 0 }; });
    var wrong = [];
    var selfItems = [];

    M.items.forEach(function (it, i) {
      var sc = secScore[it.sec]; sc.n++;
      var correct = false, got = 0, max = it.pts;
      if (it.ty === 'mcq' || it.ty === 'cloze') {
        correct = it.chosen === it.ai;
        got = correct ? it.pts : 0;
        if (!correct && it.chosen !== null) wrong.push({ i: i, it: it });
        else if (it.chosen === null) wrong.push({ i: i, it: it });
      } else if (it.ty === 'wf') {
        correct = it.val === it.ans;
        got = correct ? it.pts : 0;
        if (!correct) wrong.push({ i: i, it: it });
      } else if (it.ty === 'ef') {
        var badToks = it.bad.toLowerCase().split(' ');
        correct = it.chosen !== null && badToks.indexOf(it.chosen) >= 0;
        got = correct ? it.pts : 0;
        if (!correct) wrong.push({ i: i, it: it });
      } else if (it.ty === 'ce') {
        var g = it.chosen; // 0 完全 1 基本 2 不会
        if (g === null || g === undefined) g = 2;
        got = [3, 2, 0][g];
        self += got; selfItems.push({ it: it, got: got, max: 3, g: g });
        sc.pts += got; sc.ok += got === 3 ? 1 : 0;
        return;
      } else if (it.ty === 'essay') {
        var b = it.chosen; // 0..5 档 ×4
        if (b === null || b === undefined) b = 0;
        got = b * 4; self += got; selfItems.push({ it: it, got: got, max: 20 });
        sc.pts += got; return;
      }
      auto += got;
      sc.pts += got;
      if (correct) sc.ok++;
    });

    var total = Math.min(150, auto + self);
    // 保存自评结果供展示
    M.items.forEach(function (it) {
      if (it.ty === 'ce' && (it.chosen === null || it.chosen === undefined)) it.chosen = 2;
      if (it.ty === 'essay' && (it.chosen === null || it.chosen === undefined)) it.chosen = 0;
    });

    Eng.S.mocks = Eng.S.mocks || [];
    Eng.S.mocks.push({ at: Date.now(), total: total, auto: auto, self: self, secs: usedSec, type: '全真模考' });
    Eng.save();
    Eng.record({ mock: 1, act: '📝 全真模考 ' + total + '/150（自动 ' + auto + ' + 自评 ' + self + '）' });
    var est = E.estimate(Eng.S);
    Eng.toast(total >= 120 ? '🎉 模考 ' + total + ' 分，冲刺满分！' : '📝 模考 ' + total + ' 分，预估分 ' + est, 2600);

    M.report = { total: total, auto: auto, self: self, usedSec: usedSec, secScore: secScore, wrong: wrong, selfItems: selfItems };
    M.mode = 'report';
    M.items = [];
    Eng.go('mock');
  }

  /* ---------------- 成绩单 ---------------- */
  function reportPage(r) {
    var pct = Math.round(r.total / 150 * 100);
    var grade = r.total >= 140 ? '🏆 满分选手候选' : r.total >= 120 ? '🎯 优秀（可冲满分）' : r.total >= 100 ? '💪 良好（继续专项）' : r.total >= 80 ? '🌱 及格（回补基础）' : '📖 还需打牢基础';
    var rows = SECS.map(function (s) {
      var d = r.secScore[s.k];
      if (!d) return '';
      var allMax = s.pts * s.count;
      return '<tr><td>' + s.name + '</td><td>' + d.ok + '/' + d.n + '</td><td><b>' + d.pts + '</b> / ' + allMax + '</td></tr>';
    }).join('');

    var wrongHtml = '';
    if (r.wrong.length) {
      wrongHtml = '<div class="sect"><h3>错题回看</h3></div><div class="card pad" style="text-align:left">' + r.wrong.map(function (w) {
        var it = w.it;
        var why;
        if (it.ty === 'cloze' || it.ty === 'mcq') why = '正确答案：' + it.o[it.ai] + '。<br>' + (it.e || '');
        else if (it.ty === 'wf') why = '正确答案：' + it.ans + '。';
        else if (it.ty === 'ef') why = '错误 ' + it.bad + ' → 应改为 ' + it.good + '。<br>' + it.e;
        else why = '';
        var qtxt = it.ty === 'ef' ? it.s : it.q || ('选词第 ' + it.n + ' 空');
        return '<div class="li-item"><span class="li-ico" style="background:var(--bad-soft)">✗</span><div><div class="li-txt">' + esc(qtxt) + '</div><div class="li-sub">' + why + '</div></div></div>';
      }).join('') + '</div>';
    }

    var selfHtml = '';
    if (r.selfItems && r.selfItems.length) {
      selfHtml = '<div class="sect"><h3>翻译与作文自评</h3></div><div class="card pad" style="text-align:left">' + r.selfItems.map(function (sx) {
        var it = sx.it;
        if (it.ty === 'ce') return '<div class="li-item"><span class="li-ico" style="background:' + (sx.got === 3 ? 'var(--ok-soft)' : 'var(--warn-soft)') + '">' + sx.got + '</span>' +
          '<div><div class="li-txt">' + esc(it.zh) + '</div><div class="li-sub">参考译文：' + esc(it.ref) + '</div></div></div>';
        return '<div class="li-item"><span class="li-ico" style="background:var(--brand-soft)">' + sx.got + '</span><div><div class="li-txt">作文《' + esc(it.topic) + '》</div>' +
          '<div class="li-sub">范文参考：' + esc(it.sample.slice(0, 120)) + '…（范文全文见“专项-写作范文库”）</div></div></div>';
      }).join('') + '</div>';
    }

    return '' +
      '<div style="max-width:720px;margin:0 auto">' +
      '<div class="result-hero"><div class="tiny" style="opacity:.85">河南专升本英语 · 全真模考成绩</div>' +
        '<div class="big-num">' + r.total + '<span style="font-size:20px"> / 150</span></div>' +
        '<div class="mt8">' + grade + '</div>' +
        '<div class="row mt16 center" style="justify-content:center;gap:10px">' +
          '<div class="chip" style="background:rgba(255,255,255,.18);color:#fff">自动作答 ' + r.auto + ' 分</div>' +
          '<div class="chip" style="background:rgba(255,255,255,.18);color:#fff">自评 ' + r.self + ' 分</div>' +
          '<div class="chip" style="background:rgba(255,255,255,.18);color:#fff">用时 ' + Math.round(r.usedSec / 60) + ' 分钟</div>' +
        '</div></div>' +
      '<div class="card pad mt16" style="text-align:left"><div style="font-weight:800" class="mb8">分项得分</div><table class="tbl"><tr><th>部分</th><th>正确</th><th>得分</th></tr>' + rows + '</table></div>' +
      wrongHtml + selfHtml +
      '<div class="row mt20" style="gap:10px">' +
        '<button class="btn grow" data-act="mk-start">再考一套</button>' +
        '<button class="btn ghost grow" data-go="home">返回首页</button>' +
      '</div>' +
      '<div class="card pad mt16 small muted">📌 建议：模考 <b>100 分以下</b> → 词汇/语法回炉；<b>100-120</b> → 专项刷题 + 错题复盘；<b>120+</b> → 限时训练 + 作文润色冲刺满分。</div>' +
      '</div>';
  }
})(window);
