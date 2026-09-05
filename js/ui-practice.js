/* ============================================================
   专项训练：八类真题题型 + 入学水平测评
   河南专升本题型：阅读/完形/判断/英译汉/选词/汉译英/改错/写作
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED, Eng = g.Eng;
  var esc = Eng.esc;

  var P = { mode: null, items: [], pos: 0, chosen: null, res: [], meta: null };

  var MODES = [
    { id: 'syn', ico: '🧩', name: '语法闯关', desc: '随堂测验题库随机抽 10 题，按 A/B/C 分级', col: '#4f46e5', need: 'all' },
    { id: 'read', ico: '📖', name: '阅读理解', desc: '真题结构：每篇 5 题 × 2 分，先读后答', col: '#0ea5e9', need: 'reading' },
    { id: 'cloze', ico: '🔗', name: '完形填空', desc: '语境 + 词法语法综合，一空一分', col: '#0ea56a', need: 'cloze' },
    { id: 'tf', ico: '⚖️', name: '判断正误', desc: '短文判断 True / False，每题 2 分', col: '#f59e0b', need: 'tf' },
    { id: 'ec', ico: '🌐', name: '英译汉选择', desc: '四选一选出最佳译文，每题 2 分', col: '#e5484d', need: 'ec' },
    { id: 'wf', ico: '🧺', name: '选词填空', desc: '10 词选 5 填入短文，每空 3 分', col: '#d946ef', need: 'wf' },
    { id: 'ce', ico: '✍️', name: '汉译英', desc: '单句翻译，参考译文自评，每句 3 分', col: '#14b8a6', need: 'ce' },
    { id: 'ef', ico: '🔧', name: '改错', desc: '找出句中错误并改正，每题 2 分', col: '#8b5cf6', need: 'ef' },
    { id: 'write', ico: '📄', name: '写作范文库', desc: '提纲作文 + 高分范文学习', col: '#64748b', need: 'essays' }
  ];
  var MODE_MAP = {}; MODES.forEach(function (m) { MODE_MAP[m.id] = m; });

  function mstat(id) {
    var s = Eng.S.mstats || {};
    return s[id] || { n: 0, ok: 0 };
  }
  function pmRec(id, ok) {
    Eng.S.mstats = Eng.S.mstats || {};
    var s = Eng.S.mstats[id] || (Eng.S.mstats[id] = { n: 0, ok: 0 });
    s.n++; if (ok) s.ok++;
    Eng.save();
  }

  Eng.registerView('practice', function (params) {
    if (params && params.d === 'diag') { if (!D.active) startDiag(); return diagScreen(); }
    if (P.mode === 'write') return writeView();
    if (P.mode && P.items.length) return session();
    return landing();
  });

  /* ---------------- 入口 ---------------- */
  function landing() {
    var diag = Eng.S.diag;
    var cards = MODES.map(function (m) {
      var st = mstat(m.id);
      var acc = st.n ? Math.round(st.ok / st.n * 100) : null;
      return '<div class="act-card" data-act="pr-start" data-m="' + m.id + '">' +
        '<span class="ico" style="background:' + m.col + '22">' + m.ico + '</span>' +
        '<div class="grow"><b>' + m.name + '</b><p>' + m.desc + '</p></div>' +
        '<div class="center" style="min-width:54px"><b class="small" style="color:' + m.col + '">' + (acc != null ? acc + '%' : '—') + '</b><div class="tiny muted">' + st.n + ' 题</div></div>' +
        '<span class="arrow">›</span></div>';
    }).join('');
    return '' +
      '<div class="hero" style="background:linear-gradient(135deg,#0f172a,#334155)">' +
        '<div class="checkin-hero">' +
          '<span class="flame">🎯</span>' +
          '<div class="grow"><h1>真题专项训练</h1><p>按河南专升本公共英语题型逐项突破，每题即时批改 + 解析</p></div>' +
          (diag ? '<div style="text-align:center"><div class="ring sm" style="--p:' + Math.min(100, Math.round(diag.score / 150 * 100)) + '"><div class="ring-txt"><b style="font-size:17px">' + diag.score + '</b><div class="tiny" style="opacity:.85">基线分</div></div></div><button class="btn xs mt8" data-act="diagStart" style="background:rgba(255,255,255,.18)">重新测评</button></div>'
            : '<div style="text-align:center"><button class="btn warn sm" data-act="diagStart">🧭 入学测评</button><p class="tiny mt8" style="opacity:.85">测出你的起始分</p></div>') +
        '</div>' +
      '</div>' +
      '<div class="grid g2 mt16" style="gap:12px">' + cards + '</div>' +
      '<div class="sect"><h3>题型与分值（河南专升本公共英语 · 满分 150）</h3></div>' +
      '<div class="card pad small">' +
        '<table class="tbl"><tr><th>部分</th><th>题量</th><th>分值</th></tr>' +
        '<tr><td>Ⅰ 阅读理解</td><td>4 篇 / 20 题</td><td>2 分×20 = 40</td></tr>' +
        '<tr><td>Ⅱ 完形填空</td><td>1 篇 / 20 空</td><td>1 分×20 = 20</td></tr>' +
        '<tr><td>Ⅲ 判断正误</td><td>5 题</td><td>2 分×5 = 10</td></tr>' +
        '<tr><td>Ⅳ 英译汉选择</td><td>5 题</td><td>2 分×5 = 10</td></tr>' +
        '<tr><td>Ⅴ 选词填空</td><td>5 空</td><td>3 分×5 = 15</td></tr>' +
        '<tr><td>Ⅵ 汉译英翻译</td><td>5 句</td><td>3 分×5 = 15</td></tr>' +
        '<tr><td>Ⅶ 改错</td><td>10 题</td><td>2 分×10 = 20</td></tr>' +
        '<tr><td>Ⅷ 写作</td><td>1 篇</td><td>20 分</td></tr>' +
        '</table><p class="muted tiny mt8">题型结构以近年河南专升本公共英语真题为参考（考试时间约 150 分钟）。</p>' +
      '</div>';
  }

  /* ---------------- 模式选择与组题 ---------------- */
  Eng.actions['pr-start'] = function (el, d) {
    var m = MODE_MAP[d.m];
    if (m.id === 'write') { P.mode = 'write'; P.items = []; Eng.go('practice'); return; }
    if (m.need === 'reading') {
      var ps = E.pick(ED.bank.reading, 1)[0];
      P.meta = { passage: ps };
      P.items = ps.qs.map(function (q, i) {
        var sc = E.shufChoices(q.o, q.a);
        return { ty: 'mcq', q: q.q, o: sc.os, ai: sc.ai, e: q.e, src: i + 1 };
      });
    } else if (m.need === 'cloze') {
      var cl = E.pick(ED.bank.cloze, 1)[0];
      var idx = E.shuffle(cl.opts.map(function (_, i) { return i; })).slice(0, 20).sort(function (a, b) { return a - b; });
      P.meta = { cloze: cl };
      P.items = idx.map(function (i) {
        var sc = E.shufChoices(cl.opts[i], cl.ans[i]);
        return { ty: 'cloze', blankNo: i + 1, o: sc.os, ai: sc.ai, e: clozeExp(cl, i) };
      });
    } else if (m.need === 'tf') {
      var tf = E.pick(ED.bank2.tf, 1)[0];
      P.meta = { tf: tf };
      P.items = tf.items.map(function (it) {
        return { ty: 'mcq', q: it.s, o: ['正确（True）', '错误（False）'], ai: it.v ? 0 : 1, e: it.v ? '表述与短文内容相符 → True' : '表述与短文内容不符 → False（对照原文细节）', src: '短文' };
      });
    } else if (m.need === 'ec') {
      P.items = E.pick(ED.bank2.ec, 6).map(function (q) {
        var sc = E.shufChoices(q.o, q.a);
        return { ty: 'mcq', q: q.en, o: sc.os, ai: sc.ai, e: q.e };
      });
    } else if (m.need === 'wf') {
      var wf = E.pick(ED.bank2.wf, 1)[0];
      P.meta = { wf: wf };
      P.items = [1, 2, 3, 4, 5].map(function (n) {
        return { ty: 'wf', n: n, ans: wf.key[n - 1], exp: wf.exp };
      });
    } else if (m.need === 'ce') {
      P.items = E.pick(ED.bank2.ce, 6).map(function (q, i) {
        return { ty: 'ce', zh: q.zh, ref: q.ref, note: q.note };
      });
    } else if (m.need === 'ef') {
      P.items = E.pick(ED.bank2.ef, 6).map(function (q) {
        return { ty: 'ef', s: q.s, bad: q.bad, good: q.good, e: q.e };
      });
    } else { // syn 语法闯关
      var pool = ED.course.quiz.slice();
      P.items = E.pick(pool, Math.min(10, pool.length)).map(function (q) {
        var sc = E.shufChoices(q.o, q.a);
        return { ty: 'mcq', q: q.q, o: sc.os, ai: sc.ai, e: q.e + '（来自课程 ' + q.lesson + '）' };
      });
    }
    P.mode = m.id; P.pos = 0; P.chosen = null; P.res = [];
    Eng.go('practice');
  };
  function clozeExp(cl, i) {
    var blanks = ['时态与主谓一致', '可数与不可数', '连接词逻辑', '固定搭配', '代词指代', '非谓语', '介词', '情态动词', '冠词', '宾语从句', '短语动词', '让步/条件连词', '名词单复数', '结果状语从句', '介词', '固定搭配', '介词', '短语动词', '冠词', '序数词'];
    return '第 ' + (i + 1) + ' 空 · 考查' + (blanks[i] || '语境词义') + '（结合前后文判断）';
  }

  /* ---------------- 会话渲染 ---------------- */
  function session() {
    var m = MODE_MAP[P.mode];
    if (P.pos >= P.items.length) return result();
    var it = P.items[P.pos];
    var answered = P.chosen !== null;

    var ctx = '';
    if (P.mode === 'read') ctx = '<div class="reading-pane mb16"><div class="row mb8 wrap" style="gap:6px"><span class="sec-tag">📖 阅读理解</span><span class="chip">' + esc(P.meta.passage.t) + '</span></div><div class="article">' + P.meta.passage.tx.split('\n').map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div></div>';
    if (P.mode === 'tf') ctx = '<div class="reading-pane mb16"><div class="row mb8 wrap" style="gap:6px"><span class="sec-tag">⚖️ 判断正误</span><span class="chip">' + esc(P.meta.tf.t) + '</span></div><div class="article"><p>' + esc(P.meta.tf.tx) + '</p></div></div>';
    if (P.mode === 'cloze') ctx = clozeCtx(it);
    if (P.mode === 'wf') ctx = wfCtx(it);
    if (P.mode === 'ce') ctx = '';
    if (P.mode === 'ef') ctx = '';

    var body = '';
    if (it.ty === 'mcq') {
      var opts = it.o.map(function (o, i) {
        var cls = 'qz-option', letter = 'ABCD'[i];
        if (answered) {
          if (i === it.ai) cls += ' right'; else if (i === P.chosen) cls += ' wrong';
          cls += ' disabled';
        }
        return '<button class="' + cls + '" data-act="pr-ans" data-i="' + i + '" ' + (answered ? 'disabled' : '') + '>' +
          '<span class="letter let-' + letter + '">' + letter + '</span><span>' + esc(o) + '</span></button>';
      }).join('');
      body = '<div class="qz-stem">' + (P.mode === 'read' ? 'Q' + it.src + '. ' : '') + esc(it.q) + '</div>' +
        '<div class="grid mt16" style="gap:10px">' + opts + '</div>';
    } else if (it.ty === 'cloze') {
      var opts2 = it.o.map(function (o, i) {
        var cls = 'qz-option', letter = 'ABCD'[i];
        if (answered) {
          if (i === it.ai) cls += ' right'; else if (i === P.chosen) cls += ' wrong';
          cls += ' disabled';
        }
        return '<button class="' + cls + '" data-act="pr-ans" data-i="' + i + '" ' + (answered ? 'disabled' : '') + '>' +
          '<span class="letter let-' + letter + '">' + letter + '</span><span>' + esc(o) + '</span></button>';
      }).join('');
      body = '<div class="row wrap" style="gap:6px"><span class="sec-tag">🔗 第 ' + it.blankNo + ' 空</span><span class="chip">' + esc(P.meta.cloze.t) + '</span></div>' +
        '<div class="qz-stem mt12">选出最合适的选项填入第 ' + it.blankNo + ' 空</div>' +
        '<div class="grid mt16" style="gap:10px">' + opts2 + '</div>';
    } else if (it.ty === 'wf') {
      body = wfBody(it, answered);
    } else if (it.ty === 'ce') {
      body = ceBody(it, answered);
    } else if (it.ty === 'ef') {
      body = efBody(it, answered);
    }

    var feedback = '';
    if (answered) {
      var isOk = P.chosen === it.ai;
      if (it.ty === 'ce') isOk = P.chosen === 0;
      if (it.ty === 'ef') isOk = P.chosen === 0;
      if (it.ty === 'wf') isOk = P.chosen === 0;
      var okTxt = it.ty === 'ef' ? '找对了！' : it.ty === 'ce' ? '自评完成' : it.ty === 'wf' ? (isOk ? '填对了！' : '') : isOk ? '回答正确 ✓' : '回答错误';
      var expHtml = it.ty === 'ef' ? ('错误在 <b>' + esc(it.bad) + '</b> → 应改为 <b>' + esc(it.good) + '</b>。<br>' + esc(it.e)) :
        it.ty === 'ce' ? ('<b>参考答案：</b>' + esc(it.ref) + '<br><span class="muted">' + esc(it.note) + '</span>') :
        it.ty === 'wf' ? ('正确答案：<b>' + esc(it.ans) + '</b><br>' + esc(it.exp || '')) :
        esc(it.e);
      feedback = '<div class="qz-exp mt12"><div class="mb8">' + (isOk ? '✅ ' : '❌ ') + okTxt + '</div>' + expHtml + '</div>' +
        '<button class="btn block mt16" data-act="pr-next">' + (P.pos + 1 >= P.items.length ? '查看结果' : '下一题 →') + '</button>';
    }

    return '' +
      '<div style="max-width:760px;margin:0 auto">' +
      '<div class="progress-line mb16"><button class="btn plain xs" data-act="pr-exit">← 退出</button>' +
        '<span class="chip brand">' + m.ico + ' ' + m.name + '</span>' +
        '<div class="pbar grow"><i style="width:' + (P.pos / P.items.length * 100) + '%"></i></div>' +
        '<span class="qlabel">' + (P.pos + 1) + ' / ' + P.items.length + '</span></div>' +
      '<div class="card pad">' + ctx + body + feedback + '</div>' +
      (P.mode === 'ce' && !answered ? '<div class="muted small center mt8">写完先自查，再点“查看参考与自评”</div>' : '') +
      '</div>';
  }

  function clozeCtx(it) {
    var cl = P.meta.cloze;
    var paras = cl.body.map(function (para) {
      var out = para.replace(/__\((\d+)\)__/g, function (_, n) {
        var i = +n - 1;
        if (i + 1 === it.blankNo) return '<span class="blank sel-box">第' + n + '空</span>';
        if (i + 1 < it.blankNo) return '<span class="blank filled">✓' + n + '</span>';
        return '<span class="blank">___' + n + '</span>';
      });
      return '<p class="blanks-sent">' + out + '</p>';
    }).join('');
    return '<div class="gram-box mb16 small" style="border-left-color:#0ea56a"><b>全文语境：</b>' + esc(cl.zh) + '</div><div class="reading-pane mb16" style="max-height:30vh"><div class="article">' + paras + '</div></div>';
  }
  function wfCtx(it) {
    var wf = P.meta.wf;
    var filled = P.pos > 0 ? P.items.slice(0, P.pos) : [];
    var boxHtml = wf.box.map(function (w) {
      var used = filled.some(function (f) { return f.ans === w; });
      return '<span class="word-sel ' + (used ? 'used' : '') + '">' + esc(w) + '</span>';
    }).join(' ');
    var text = wf.text.replace(/__\((\d+)\)__/g, function (_, n) {
      var i = +n - 1;
      if (i + 1 === it.n) return '<span class="blank sel-box">请选第' + n + '空</span>';
      var usedW = filled.filter(function (f) { return f.n === i + 1; })[0];
      return '<span class="blank filled">' + (usedW ? usedW.ans : '✓') + '</span>';
    });
    return '<div class="reading-pane mb16"><div class="row mb8 wrap" style="gap:6px"><span class="sec-tag">🧺 选词填空</span><span class="chip">' + esc(wf.t) + '</span></div>' +
      '<div class="small muted mb12">' + esc(wf.intro || '') + '</div>' +
      '<div class="blanks-sent" style="line-height:2.4;margin-bottom:12px">' + text + '</div>' +
      '<div class="gram-box"><b>词库（每词限用一次）：</b><div class="mt8" style="display:flex;gap:8px;flex-wrap:wrap">' + boxHtml + '</div></div></div>';
  }
  function wfBody(it, answered) {
    return '<div class="qz-stem">从上方词库中选择适合第 ' + it.n + ' 空的词</div>' +
      (answered
        ? '<div class="muted small mt8">你的选择：<b>' + esc(P.wfWord || '') + '</b></div>'
        : '<div style="display:flex;gap:8px;flex-wrap:wrap" class="mt12">' + P.meta.wf.box.map(function (w) {
          return '<button class="word-sel" data-act="pr-wf" data-w="' + esc(w) + '">' + esc(w) + '</button>';
        }).join('') + '</div>');
  }
  function ceBody(it, answered) {
    return '<div class="sec-tag">✍️ 汉译英</div>' +
      '<div class="qz-stem mt12">' + esc(it.zh) + '</div>' +
      (answered
        ? '<div class="gram-box mt12" style="border-left-color:var(--ok)"><b>参考答案</b><br>' + esc(it.ref) + '<div class="muted small mt8">' + esc(it.note) + '</div></div>'
        : '<div class="mt12"><textarea class="inp" id="ceInp" rows="3" placeholder="在这里写出你的英文翻译…"></textarea>' +
          '<div class="row mt12 wrap" style="gap:8px">' +
          '<button class="btn ok sm" data-act="pr-ce" data-g="0">我写对了 → 记 3 分</button>' +
          '<button class="btn warn sm" data-act="pr-ce" data-g="1">基本对 → 记 2 分</button>' +
          '<button class="btn bad sm" data-act="pr-ce" data-g="2">不会 / 错 → 记 0 分</button>' +
          '</div></div>');
  }
  function efBody(it, answered) {
    var toks = it.s.split(' ');
    var chipHtml = toks.map(function (t, i) {
      var clean = t.replace(/[^A-Za-z'’-]/g, '');
      if (answered) {
        var isBad = it.bad.toLowerCase().split(' ').indexOf(clean.toLowerCase()) >= 0;
        return '<span class="word-sel" style="' + (isBad ? 'border-color:var(--bad);background:var(--bad-soft);color:var(--bad)' : 'opacity:.6') + '">' + esc(t) + '</span>';
      }
      return '<button class="word-sel" data-act="pr-ef" data-i="' + i + '">' + esc(t) + '</button>';
    }).join(' ');
    return '<div class="row wrap mb12" style="gap:6px"><span class="sec-tag">🔧 改错</span><span class="chip">点击你认为错误的词</span></div>' +
      '<div class="reading-pane center" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;line-height:2.6">' + chipHtml + '</div>' +
      (answered ? '' : '<div class="center mt12"><button class="btn ghost sm" data-act="pr-ef-skip">不会 / 直接看答案</button></div>');
  }

  /* ---------------- 结果页 ---------------- */
  function result() {
    var m = MODE_MAP[P.mode];
    var ok = P.res.filter(function (x) { return x; }).length;
    var total = P.res.length;
    var pct = total ? Math.round(ok / total * 100) : 0;
    var wrongs = P.items.map(function (it, i) {
      if (P.res[i]) return null;
      var why = '';
      if (it.ty === 'ce') why = '参考译文：' + it.ref;
      else if (it.ty === 'ef') why = '错误 ' + it.bad + ' → ' + it.good + '。' + it.e;
      else if (it.ty === 'wf') why = '正确答案：' + it.ans;
      else why = it.e || '';
      return '<div class="li-item"><span class="li-ico" style="background:var(--bad-soft)">✗</span>' +
        '<div><div class="li-txt">' + esc(it.q || (it.ty === 'ce' ? it.zh : it.ty === 'wf' ? '选词第 ' + it.n + ' 空' : it.ty === 'ef' ? it.s : '')) + '</div>' +
        '<div class="li-sub">' + esc(why) + '</div></div></div>';
    }).filter(Boolean).join('');
    var head = total === 0 ? '' : '<h2>' + ok + ' / ' + total + ' 正确（' + pct + '%）</h2>';
    return '<div style="max-width:660px;margin:0 auto" class="center">' +
      '<div class="card pad" style="padding:30px">' +
        '<div style="font-size:52px">' + (pct >= 85 ? '🏆' : pct >= 60 ? '💪' : '🌱') + '</div>' + head +
        (pct >= 85 ? '<p class="muted small">掌握优秀，可以直接挑战全真模考！</p>' : pct >= 60 ? '<p class="muted small">基础不错，把错题弄懂后再来一轮。</p>' : '<p class="muted small">错题是进步的阶梯：先看解析，再回课程重学对应知识点。</p>') +
        '<div class="pbar mt12"><i style="width:' + pct + '%;background:' + (pct >= 60 ? 'var(--ok)' : 'var(--bad)') + '"></i></div>' +
      '</div>' +
      (wrongs ? '<div class="card pad mt16" style="text-align:left"><div style="font-weight:800" class="mb8">错题 / 复习回顾</div>' + wrongs + '</div>' : '') +
      '<div class="row mt16 center" style="justify-content:center;gap:10px">' +
        '<button class="btn soft" data-act="pr-start" data-m="' + P.mode + '">再练一组</button>' +
        '<button class="btn ghost" data-go="practice">返回专项列表</button>' +
        (m && m.need === 'read' ? '' : '') +
        '<button class="btn" data-go="mock">去全真模考 →</button>' +
      '</div></div>';
  }

  /* ---------------- 作答动作 ---------------- */
  Eng.actions['pr-exit'] = function () { P.mode = null; P.items = []; Eng.go('practice'); };
  Eng.actions['pr-ans'] = function (el, d) {
    if (P.chosen !== null || !P.items.length || P.pos >= P.items.length) return;
    var it = P.items[P.pos];
    var i = +d.i;
    P.chosen = i;
    var ok = i === it.ai;
    P.res.push(ok);
    pmRec(P.mode, ok);
    Eng.record({ qn: 1, qk: ok ? 1 : 0 });
    Eng.go('practice');
  };
  Eng.actions['pr-wf'] = function (el, d) {
    if (P.chosen !== null || !P.items.length || P.pos >= P.items.length) return;
    var it = P.items[P.pos];
    P.wfWord = d.w;
    var ok = d.w === it.ans;
    P.chosen = ok ? 0 : 1;
    P.res.push(ok);
    pmRec(P.mode, ok);
    Eng.record({ qn: 1, qk: ok ? 1 : 0 });
    Eng.go('practice');
  };
  Eng.actions['pr-ce'] = function (el, d) {
    if (P.chosen !== null || !P.items.length || P.pos >= P.items.length) return;
    var g = +d.g;
    P.chosen = g;
    var ok = g <= 1;
    P.res.push(ok);
    pmRec(P.mode, ok);
    Eng.record({ qn: 1, qk: ok ? 1 : 0 });
    Eng.go('practice');
  };
  Eng.actions['pr-ef'] = function (el, d) {
    if (P.chosen !== null || !P.items.length || P.pos >= P.items.length) return;
    var it = P.items[P.pos];
    var i = +d.i;
    var word = it.s.split(' ')[i].replace(/[^A-Za-z'’-]/g, '').toLowerCase();
    var badToks = it.bad.toLowerCase().split(' ');
    var ok = badToks.indexOf(word) >= 0;
    P.chosen = ok ? 0 : 1;
    P.res.push(ok);
    pmRec(P.mode, ok);
    Eng.record({ qn: 1, qk: ok ? 1 : 0 });
    Eng.go('practice');
  };
  Eng.actions['pr-ef-skip'] = function () {
    if (P.chosen !== null || !P.items.length || P.pos >= P.items.length) return;
    P.chosen = 1; P.res.push(false);
    pmRec(P.mode, false);
    Eng.record({ qn: 1, qk: 0 });
    Eng.go('practice');
  };
  Eng.actions['pr-next'] = function () {
    if (!P.items.length) return;
    var done = P.pos + 1 >= P.items.length;
    P.pos++; P.chosen = null;
    if (done) {
      var ok = P.res.filter(function (x) { return x; }).length;
      var res = Eng.record({ act: '🎯 ' + (MODE_MAP[P.mode] ? MODE_MAP[P.mode].name : '') + ' ' + ok + '/' + P.res.length + ' 正确' });
      if (res.first) Eng.toast('🔥 今日打卡成功！连续 ' + res.streak + ' 天', 2400);
      Eng.save();
    }
    Eng.go('practice');
  };

  /* ---------------- 写作范文库 ---------------- */
  function writeView() {
    var list = ED.bank2.essays.map(function (es) {
      return '<div class="card pad">' +
        '<div class="row wrap"><span class="sec-tag">📄 写作</span><span class="chip">' + esc(es.t) + '</span></div>' +
        '<p class="small mt12 muted">' + esc(es.req) + '</p>' +
        '<div class="reading-pane mt12"><div class="article" style="white-space:pre-line">' + esc(es.sample) + '</div></div>' +
        '<div class="gram-box mt12 small"><b>💡 得分点：</b>' + esc(es.points) + '</div>' +
      '</div>';
    }).join('');
    return '<button class="btn plain xs mb16" data-act="pr-exit">← 返回</button>' +
      '<div class="hero" style="background:linear-gradient(135deg,#64748b,#0f172a)"><div class="checkin-hero"><span class="flame">📄</span>' +
      '<div class="grow"><h1>写作范文库</h1><p>专升本作文：三段式提纲议论文。先模仿结构，再背诵亮点句</p></div></div></div>' +
      '<div class="grid g1 mt16" style="gap:16px">' + list + '</div>';
  }

  /* ---------------- 入学测评 ---------------- */
  var D = { active: false, items: [], pos: 0, chosen: null, res: [] };
  function startDiag() {
    var pool = [];
    // 5 道基础词汇 + 10 道语法（A/B 级）
    var ww = E.pick(ED.vocab.list.filter(function (w) { return w.lv === 1; }), 5);
    ww.forEach(function (w) {
      var wrong = E.pick(ED.vocab.list.filter(function (x) { return x.lv === 1 && x !== w; }), 3).map(function (x) { return x.m; });
      var o = [w.m].concat(wrong);
      var sc = E.shufChoices(o, 0);
      pool.push({ ty: 'w', word: w, q: '单词 "' + w.w + '" 的意思是？', o: sc.os, ai: sc.ai, e: w.w + '：' + w.m });
    });
    var gq = E.pick(ED.course.quiz.filter(function (q) { return q.lv <= 2; }), 10);
    gq.forEach(function (q) {
      var sc = E.shufChoices(q.o, q.a);
      pool.push({ ty: 'g', q: q.q, o: sc.os, ai: sc.ai, e: q.e });
    });
    D = { active: true, items: E.shuffle(pool), pos: 0, chosen: null, res: [] };
  }
  function diagScreen() {
    if (!D.active) { return '<div class="empty"><div class="big">🧭</div><button class="btn" data-act="diagStart">开始入学测评</button></div>'; }
    if (D.pos >= D.items.length) return diagDone();
    var it = D.items[D.pos];
    var opts = it.o.map(function (o, i) {
      var cls = 'qz-option', letter = 'ABCD'[i];
      if (D.chosen !== null) {
        if (i === it.ai) cls += ' right'; else if (i === D.chosen) cls += ' wrong';
        cls += ' disabled';
      }
      return '<button class="' + cls + '" data-act="dg-ans" data-i="' + i + '" ' + (D.chosen !== null ? 'disabled' : '') + '>' +
        '<span class="letter let-' + letter + '">' + letter + '</span><span>' + esc(o) + '</span></button>';
    }).join('');
    return '<div style="max-width:620px;margin:0 auto">' +
      '<div class="progress-line mb16"><button class="btn plain xs" data-act="dg-exit">← 退出</button>' +
        '<span class="chip brand">🧭 入学测评 · ' + D.items.length + ' 题</span>' +
        '<div class="pbar grow"><i style="width:' + (D.pos / D.items.length * 100) + '%"></i></div></div>' +
      '<div class="card pad">' +
        '<div class="qz-stem">' + (D.pos + 1) + '. ' + esc(it.q) + '</div>' +
        '<div class="grid mt16" style="gap:10px">' + opts + '</div>' +
        (D.chosen !== null ? '<div class="qz-exp mt12">' + esc(it.e) + '</div>' +
          '<button class="btn block mt16" data-act="dg-next">' + (D.pos + 1 >= D.items.length ? '查看测评结果' : '下一题') + '</button>' : '') +
        '<div class="muted tiny center mt12">测评用于估算起始水平，约 2 分钟</div>' +
      '</div></div>';
  }
  function diagDone() {
    var ok = D.res.filter(function (x) { return x; }).length;
    var total = D.res.length;
    var ratio = total ? ok / total : 0;
    var score = Math.round(E.clamp(40 + ratio * 72, 40, 112));
    Eng.S.diag = { score: score, at: Date.now() };
    Eng.record({ qn: total, qk: ok, act: '🧭 入学测评：起始估分约 ' + score + ' 分' });
    Eng.save();
    var ph = E.PHASES[E.phaseOf(score)];
    D.active = false;
    return '<div style="max-width:600px;margin:0 auto" class="center">' +
      '<div class="card pad" style="padding:34px">' +
        '<div style="font-size:52px">🧭</div>' +
        '<h2 class="mt8">测评完成！</h2>' +
        '<p class="muted">正确 ' + ok + ' / ' + total + '</p>' +
        '<div style="margin:18px auto" class="ring" style="--p:' + Math.round(score / 150 * 100) + '"><div class="ring-txt"><b>' + score + '</b><div class="tiny muted">起始估分</div></div></div>' +
        '<p>建议从 <b>' + ph.name + '</b>（' + ph.range + ' 分）开始：先刷 ' + ph.focus + '。</p>' +
        '<div class="row mt20 center" style="justify-content:center;gap:10px">' +
          '<button class="btn" data-go="home">返回首页规划</button>' +
          '<button class="btn ghost" data-act="dg-again">重新测评</button>' +
        '</div></div></div>';
  }
  Eng.actions.diagStart = function () { if (!D.active) startDiag(); D.active = true; Eng.go('practice', { d: 'diag' }); };
  Eng.actions['dg-exit'] = function () { D.active = false; Eng.go('practice'); };
  Eng.actions['dg-again'] = function () { D.active = false; Eng.actions.diagStart(); };
  Eng.actions['dg-ans'] = function (el, d) {
    if (D.chosen !== null) return;
    D.chosen = +d.i;
    D.res.push(D.chosen === D.items[D.pos].ai);
    Eng.go('practice', { d: 'diag' });
  };
  Eng.actions['dg-next'] = function () {
    D.pos++; D.chosen = null;
    Eng.go('practice', { d: 'diag' });
  };
})(window);
