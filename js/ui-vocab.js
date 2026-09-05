/* ============================================================
   单词：词书总览 + 学新词(SRS卡片) + 到期复习 + 词汇测验
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED, Eng = g.Eng;
  var esc = Eng.esc;

  /* 会话状态 */
  var V = {
    mode: null,      // 'new' | 'review' | 'quiz' | null
    ids: [], pos: 0, showDef: false, req: 0, res: { w: 0, r: 0, g2: 0, g1: 0, g0: 0 },
    quiz: null, qpos: 0, chosen: -1, qres: []
  };

  function curWord() { return ED.vocab.list[V.ids[V.pos]]; }
  function knownOf(lv) {
    var n = 0;
    ED.vocab.list.forEach(function (w, i) {
      if (w.lv === lv && E.wordKnown(Eng.S.vocab[i])) n++;
    });
    return n;
  }
  function dueOf(lv) {
    var n = 0, now = Date.now();
    ED.vocab.list.forEach(function (w, i) {
      if (w.lv === lv) { var v = Eng.S.vocab[i]; if (v && v.b >= 1 && v.due <= now) n++; }
    });
    return n;
  }

  Eng.registerView('vocab', function (params) {
    if (!V.mode) return overview();
    if (V.mode === 'new' || V.mode === 'review') return flashSession();
    return quizSession();
  });

  /* ---------------- 总览 ---------------- */
  function overview() {
    var ws = Eng.wordState();
    var tierCards = ED.vocab.tiers.map(function (t) {
      var total = ED.vocab.list.filter(function (w) { return w.lv === t.id; }).length;
      var kn = knownOf(t.id), due = dueOf(t.id);
      var pct = total ? Math.round(kn / total * 100) : 0;
      return '<div class="card pad" style="border-top:4px solid ' + t.color + '">' +
        '<div class="row"><b>' + t.name + '</b><span class="chip" style="margin-left:auto">' + total + ' 词</span></div>' +
        '<p class="small muted mt8" style="min-height:34px">' + t.desc + '</p>' +
        '<div class="row mt8"><span class="small muted">已掌握</span><div class="pbar grow"><i style="width:' + pct + '%;background:' + t.color + '"></i></div><b class="small">' + kn + '</b></div>' +
        '<div class="row mt12 wrap" style="gap:6px">' +
          '<button class="btn xs soft" data-act="vw-quiz" data-lv="' + t.id + '">测验' + total + '</button>' +
          (due > 0 ? '<button class="btn xs" style="background:' + t.color + '" data-act="vw-review">复习 ' + due + '</button>' : '') +
          '<button class="btn xs ghost" data-act="vw-sel" data-lv="' + t.id + '">只看本层</button>' +
        '</div></div>';
    }).join('');

    return '' +
      '<div class="hero" style="background:linear-gradient(135deg,#0ea5e9,#6366f1)">' +
        '<div class="checkin-hero">' +
          '<span class="flame">📚</span>' +
          '<div class="grow"><h1>单词记忆舱</h1><p>分级词书 · 记忆曲线自动安排复习 · 先学到期词再学新词</p></div>' +
          '<div class="ring sm" style="--p:' + Math.round(ws.known / ws.total * 100) + '"><div class="ring-txt"><b style="font-size:19px">' + ws.known + '</b><div class="tiny" style="opacity:.85">已掌握</div></div></div>' +
        '</div>' +
      '</div>' +

      '<div class="grid g3 mt16">' +
        '<button class="act-card" data-act="vw-review"><span class="ico g3">⏰</span><div class="grow"><b>到期复习</b><p>' + (ws.due ? ws.due + ' 个词今天到期，快清空' : '今天没有到期词，太棒了') + '</p></div><span class="arrow">›</span></button>' +
        '<button class="act-card" data-act="vw-new"><span class="ico g1">🆕</span><div class="grow"><b>学新词</b><p>按每日目标学习新词，进入记忆曲线</p></div><span class="arrow">›</span></button>' +
        '<button class="act-card" data-act="vw-quiz" data-lv="0"><span class="ico g2">🎯</span><div class="grow"><b>随机测验</b><p>混合抽测，检验真实掌握度</p></div><span class="arrow">›</span></button>' +
      '</div>' +

      '<div class="sect"><h3>分级词书</h3><span class="muted small">累计已学 ' + ws.seen + ' / ' + ws.total + '</span></div>' +
      '<div class="grid g3">' + tierCards + '</div>' +

      '<div class="sect"><h3>记忆原理</h3></div>' +
      '<div class="card pad small muted">' +
        '新词按 1-2-4-7-15-30-45 天间隔进入复习队列；' +
        '标记“认识”向后推进复习间隔，“模糊”明天再见，“忘记”回到起点重学。' +
        '先复习到期词、再学新词，遗忘率最低。单词本库 ' + ws.total + ' 词：覆盖专升本公共英语高频词汇，后续可导入扩充（我的 → 数据）。' +
      '</div>';
  }

  /* ---------------- 卡片会话 ---------------- */
  function flashSession() {
    if (V.pos >= V.ids.length) return flashDone();
    var w = curWord();
    var idx = V.ids[V.pos];
    var rec = Eng.S.vocab[idx];
    var isReview = V.mode === 'review';
    var box = rec ? rec.b : 0;
    var total = V.ids.length;

    var bar = V.pos / total * 100;

    return '' +
      '<div style="max-width:640px;margin:0 auto">' +
      '<div class="progress-line mb16"><button class="btn plain xs" data-act="vw-exit">← 退出</button>' +
        '<div class="pbar grow"><i style="width:' + bar + '%"></i></div>' +
        '<span class="qlabel">' + (V.pos + 1) + ' / ' + total + '</span></div>' +
      (isReview ? '<div class="row mb12 wrap" style="gap:6px"><span class="sec-tag">到期复习</span><span class="chip warn">📦 记忆盒 ' + box + '</span></div>' :
        '<div class="row mb12 wrap" style="gap:6px"><span class="sec-tag">学新词</span></div>') +
      '<div class="word-card">' +
        '<div class="w-meta">' + esc(w.p) + (isReview ? ' · 盒子 ' + box : ' · 新词') + '</div>' +
        '<div class="w-en">' + esc(w.w) + '</div>' +
        (V.showDef
          ? '<div class="w-def">' + esc(w.m) + '</div>' +
            '<div class="muted small mt8">“' + esc(w.m) + '”</div>'
          : '<button class="btn ghost sm mt12" data-act="vw-flip">👀 显示释义</button>') +
      '</div>' +
      (V.showDef ? '' : '<div class="muted center small mt8">先回忆，再看答案，记忆更深</div>') +
      '<div class="flash-actions mt20">' +
        (V.showDef
          ? '<button class="btn bad" data-act="vw-grade" data-g="0">😵 忘了</button>' +
            '<button class="btn warn" data-act="vw-grade" data-g="1">🤔 模糊</button>' +
            '<button class="btn ok" data-act="vw-grade" data-g="2">😄 认识</button>'
          : '') +
      '</div>' +
      '<div class="center tiny muted mt16">每日目标新词 ' + (Eng.S.set.goalW || 20) + ' 个 · 全部学完自动打卡</div>' +
      '</div>';
  }
  function flashDone() {
    var r = V.res;
    var t = V.mode === 'review' ? '复习完成' : '新词学习完成';
    var known = r.g2;
    return '<div style="max-width:560px;margin:30px auto" class="center">' +
      '<div class="card pad" style="padding:34px">' +
        '<div style="font-size:52px">' + (r.g0 === 0 ? '🎉' : '🌱') + '</div>' +
        '<h2 class="mt8">' + t + '！</h2>' +
        '<p class="muted">本轮 ' + V.ids.length + ' 个 · 认识 ' + r.g2 + ' · 模糊 ' + r.g1 + ' · 忘记 ' + r.g0 + '</p>' +
        '<div class="grid g3 mt20">' +
          '<div class="stat-card"><div class="k">😄 认识</div><div class="v">' + r.g2 + '</div></div>' +
          '<div class="stat-card"><div class="k">🤔 模糊</div><div class="v">' + r.g1 + '</div></div>' +
          '<div class="stat-card"><div class="k">😵 忘记</div><div class="v">' + r.g0 + '</div></div>' +
        '</div>' +
        '<div class="row mt20 center" style="justify-content:center;gap:10px;flex-wrap:wrap">' +
          '<button class="btn soft" data-act="vw-new">再学一组新词</button>' +
          '<button class="btn ghost" data-act="vw-review">复习到期词</button>' +
          '<button class="btn" data-go="home">返回首页</button>' +
        '</div>' +
      '</div></div>';
  }

  /* ---------------- 测验 ---------------- */
  function quizSession() {
    if (!V.quiz) return overview();
    var st = V.quiz;
    if (st.items.length === 0) return '<div class="empty"><div class="big">📭</div>本层还没有已学单词，先背一些再来测验</div>';
    if (V.qpos >= st.items.length) return quizDone();
    var it = st.items[V.qpos];
    var w = ED.vocab.list[it.id];

    var opts = it.os.map(function (o, i) {
      var cls = 'qz-option';
      var letter = 'ABCD'[i];
      if (V.chosen >= 0) {
        if (i === it.ai) cls += ' right';
        else if (i === V.chosen) cls += ' wrong';
        cls += ' disabled';
      }
      return '<button class="' + cls + '" data-act="vw-ans" data-i="' + i + '" ' + (V.chosen >= 0 ? 'disabled' : '') + '>' +
        '<span class="letter let-' + letter + '">' + letter + '</span><span>' + esc(o) + '</span></button>';
    }).join('');

    return '' +
      '<div style="max-width:620px;margin:0 auto">' +
      '<div class="progress-line mb16"><button class="btn plain xs" data-act="vw-exit">← 退出</button>' +
        '<div class="pbar grow"><i style="width:' + (V.qpos / st.items.length * 100) + '%"></i></div>' +
        '<span class="qlabel">' + (V.qpos + 1) + ' / ' + st.items.length + '</span></div>' +
      '<div class="card pad"><div class="row wrap mb16" style="gap:8px"><span class="sec-tag">词义测验</span><span class="chip">已答对 ' + V.qres.filter(function (x) { return x; }).length + '</span></div>' +
        '<div class="qz-stem center" style="font-size:30px;letter-spacing:.5px">' + esc(w.w) + '</div>' +
        '<div class="center muted small mb16">' + esc(w.p) + ' · 选出正确释义</div>' +
        '<div class="grid" style="gap:10px">' + opts + '</div>' +
        (V.chosen >= 0 ? '<div class="qz-exp mt12">' + esc(w.m) + (V.chosen === it.ai ? ' ✓ 回答正确' : ' — 你选错了，正确答案已标绿') + '</div>' +
          '<button class="btn block mt16" data-act="vw-next">' + (V.qpos + 1 >= st.items.length ? '查看结果' : '下一题 →') + '</button>' : '') +
      '</div></div>';
  }
  function quizDone() {
    var ok = V.qres.filter(function (x) { return x; }).length;
    var total = V.qres.length;
    var pct = total ? Math.round(ok / total * 100) : 0;
    var list = V.quiz.items.map(function (it, i) {
      var w = ED.vocab.list[it.id];
      return '<div class="li-item"><span class="li-ico" style="' + (V.qres[i] ? 'background:var(--ok-soft)' : 'background:var(--bad-soft)') + '">' + (V.qres[i] ? '✓' : '✗') + '</span>' +
        '<div><div class="li-txt">' + esc(w.w) + ' <span class="chip">' + esc(w.p) + '</span></div><div class="li-sub">' + esc(w.m) + '</div></div></div>';
    }).join('');
    return '<div style="max-width:640px;margin:0 auto" class="center">' +
      '<div class="card pad" style="padding:30px">' +
        '<div style="font-size:50px">' + (pct >= 80 ? '🏆' : pct >= 60 ? '💪' : '📖') + '</div>' +
        '<h2>' + ok + ' / ' + total + ' 正确</h2>' +
        '<div class="pbar mt12"><i style="width:' + pct + '%;background:' + (pct >= 80 ? 'var(--ok)' : pct >= 60 ? 'var(--warn)' : 'var(--bad)') + '"></i></div>' +
        (pct < 60 ? '<p class="muted mt12 small">正确率偏低，建议把本层词重学一轮再来测验</p>' : pct < 80 ? '<p class="muted mt12 small">不错！再把错词复习一下就能更好</p>' : '<p class="muted mt12 small">掌握扎实，继续保持！</p>') +
      '</div>' +
      '<div class="card pad mt16" style="text-align:left">' + (list || '<div class="empty">本轮无错题</div>') + '</div>' +
      '<div class="row mt16 center" style="justify-content:center;gap:10px"><button class="btn soft" data-act="vw-quiz" data-lv="0">再测一组</button><button class="btn ghost" data-act="vw-review">复习单词</button><button class="btn" data-go="home">返回首页</button></div>' +
    '</div>';
  }

  /* ---------------- 动作 ---------------- */
  function resetSession() {
    V.pos = 0; V.showDef = false; V.req = 0;
    V.res = { w: 0, r: 0, g2: 0, g1: 0, g0: 0 };
    V.quiz = null; V.qpos = 0; V.chosen = -1; V.qres = [];
  }

  Eng.actions['vw-exit'] = function () { V.mode = null; resetSession(); Eng.go('vocab'); };

  Eng.actions['vw-new'] = function () {
    var n = Math.max(5, Eng.S.set.goalW || 20);
    var ids = Eng.newWords(n);
    if (!ids.length) { Eng.toast('词库已全部学过，进入复习模式吧'); V.mode = null; resetSession(); Eng.go('vocab'); return; }
    resetSession(); V.mode = 'new'; V.ids = ids;
    Eng.go('vocab', { mode: 'new' });
  };
  Eng.actions['vw-review'] = function () {
    var ids = E.shuffle(Eng.dueWords());
    if (!ids.length) { Eng.toast('🎉 今日到期词已清零'); Eng.go('vocab'); return; }
    resetSession(); V.mode = 'review'; V.ids = ids;
    Eng.go('vocab', { mode: 'review' });
  };
  Eng.actions['vw-sel'] = function (el, d) {
    Eng.toast('本层专属入口：在“我的-词书设置”中管理'); Eng.go('vocab');
  };
  Eng.actions['vw-flip'] = function () { V.showDef = true; Eng.go('vocab', { mode: V.mode }); };

  Eng.actions['vw-grade'] = function (el, d) {
    var gl = +d.g;
    var id = V.ids[V.pos];
    var st = Eng.S.vocab[id] || {};
    st = E.srsApply(st, gl);
    Eng.S.vocab[id] = st;
    if (gl === 2) V.res.g2++; else if (gl === 1) V.res.g1++; else { V.res.g0++; if (V.req < 4) { V.ids.push(id); V.req++; } }
    // 记录(首见计入当日新词，复习计入复习次数)
    var ever = (st.ok + st.ng) > 0;
    var rec = { w: 0, r: 0 };
    if (V.mode === 'new' && !ever) { rec.w = 1; V.res.w++; } else { rec.r = 1; V.res.r++; }
    V.pos++;
    if (V.pos >= V.ids.length) {
      var res = Eng.record({ w: rec.w, r: rec.r, act: (V.mode === 'review' ? '📖 完成到期词复习 ' : '📖 学习新词 ') + V.ids.length + ' 个' });
      if (res.first) Eng.toast('🔥 今日打卡成功！连续 ' + res.streak + ' 天', 2400);
      Eng.save();
      Eng.go('vocab', { mode: V.mode });
    } else {
      Eng.record({ w: rec.w, r: rec.r });
      V.showDef = false;
      Eng.save();
      Eng.go('vocab', { mode: V.mode });
    }
  };

  Eng.actions['vw-quiz'] = function (el, d) {
    var lv = +d.lv;
    var pool = [];
    ED.vocab.list.forEach(function (w, i) {
      if ((lv === 0 || w.lv === lv) && Eng.S.vocab[i] && E.wordKnown(Eng.S.vocab[i])) pool.push(i);
    });
    if (pool.length < 4) { Eng.toast('可测单词不足（' + pool.length + ' 个），先多学一些'); Eng.go('vocab'); return; }
    var picked = E.pick(pool, Math.min(20, pool.length));
    var items = picked.map(function (id) {
      var w = ED.vocab.list[id];
      var wrong = E.pick(ED.vocab.list.filter(function (x) { return x.lv === w.lv && x !== w && x.m !== w.m; }), 3).map(function (x) { return x.m; });
      var o = [w.m].concat(wrong);
      var sc = E.shufChoices(o, 0);
      return { id: id, os: sc.os, ai: sc.ai };
    });
    resetSession(); V.mode = 'quiz'; V.quiz = { items: items };
    Eng.go('vocab', { mode: 'quiz' });
  };
  Eng.actions['vw-ans'] = function (el, d) {
    if (V.chosen >= 0) return;
    var i = +d.i;
    V.chosen = i;
    V.qres.push(i === V.quiz.items[V.qpos].ai);
    Eng.go('vocab', { mode: 'quiz' });
  };
  Eng.actions['vw-next'] = function () {
    if (V.chosen < 0) return;
    if (V.qpos + 1 >= V.quiz.items.length) {
      var ok = V.qres.filter(function (x) { return x; }).length;
      var res = Eng.record({ qn: V.qres.length, qk: ok, act: '🎯 词义测验 ' + ok + '/' + V.qres.length + ' 正确' });
      if (res.first) Eng.toast('🔥 今日打卡成功！连续 ' + res.streak + ' 天', 2400);
      V.qpos++;
      Eng.save();
      Eng.go('vocab', { mode: 'quiz' });
    } else {
      V.qpos++; V.chosen = -1;
      Eng.go('vocab', { mode: 'quiz' });
    }
  };
})(window);
