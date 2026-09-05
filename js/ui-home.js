/* ============================================================
   首页：问候 + 打卡 + 今日概览 + 快捷入口 + 成长路径
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED, Eng = g.Eng;
  var esc = Eng.esc;

  var WEEK = ['日', '一', '二', '三', '四', '五', '六'];

  function greeting() {
    var h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 9) return '早上好';
    if (h < 12) return '上午好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    return '晚上好';
  }

  function recentActs() {
    var out = [];
    var days = Eng.S.days;
    var keys = Object.keys(days).sort();
    for (var i = keys.length - 1; i >= 0 && out.length < 9; i--) {
      var acts = days[keys[i]].acts || [];
      for (var j = 0; j < acts.length && out.length < 9; j++) {
        out.push({ k: keys[i], t: acts[j].t, at: acts[j].at });
      }
    }
    return out;
  }

  function actDot(dk) {
    if (dk === Eng.today()) return '';
    var d = new Date(), y = d.getFullYear(), m = d.getMonth(), dd = d.getDate();
    var wk = new Date(y, m, dd).getDay();
    var names = ['日', '一', '二', '三', '四', '五', '六'];
    return '<span class="tiny muted">周' + names[wk] + '</span>';
  }

  Eng.registerView('home', function () {
    var S = Eng.S, dk = Eng.today();
    var today = Eng.todayRec();
    var streak = E.streak(S.days);
    var ws = Eng.wordState();
    var est = E.estimate(S);
    var phIdx = E.phaseOf(est);
    var ph = E.PHASES[phIdx];
    var startP = 50, spanP = 100; // 50 → 150
    var pct = Math.max(0, Math.min(1, (est - startP) / spanP));
    var mins = Math.round(((today && today.sec) || 0) / 60);
    var goalMin = S.set.goalMin || 30, goalW = S.set.goalW || 20, goalQ = S.set.goalQ || 20;
    var nw = (today && today.w) || 0, nq = (today && today.qn) || 0;
    var rv = (today && today.r) || 0;
    var checked = !!today;

    var d = new Date();
    var bounds = [80, 110, 135, 151];
    var nodes = E.PHASES.map(function (p, i) {
      var cls = 'p-dot';
      if (est >= bounds[i]) cls += ' pass';
      else if (i === phIdx) cls += ' on';
      return '<div class="p-node"><div class="p-line" style="display:' + (i === 0 ? 'none' : 'block') + '"></div>' +
        '<div class="' + cls + '">' + (est >= bounds[i] ? '✓' : (i + 1)) + '</div>' +
        '<div class="p-name">' + p.name + '</div><div class="p-goal">' + p.range + '</div></div>';
    }).join('');

    var recents = recentActs();
    var actsHtml = recents.length ? recents.map(function (a) {
      var ago = '';
      if (a.k === dk) ago = '今天';
      else {
        var diff = E.diffDays(dk, a.k);
        ago = diff === 1 ? '昨天' : diff + ' 天前';
      }
      return '<div class="li-item"><span class="li-ico">📌</span><div class="grow"><div class="li-txt">' + esc(a.t) + '</div><div class="li-sub">' + ago + '</div></div></div>';
    }).join('') : '<div class="empty" style="padding:18px"><div class="big">🌱</div>还没有学习动态，完成一个任务开始吧</div>';

    // 当周 7 天迷你热力
    var weekDots = '';
    for (var i = 6; i >= 0; i--) {
      var kd = E.dayKey(-i);
      var has = !!S.days[kd];
      var isT = kd === dk;
      weekDots += '<div class="center" style="flex:1">' + (has ? '🔥' : '·') + '<div class="tiny muted">' + (isT ? '今天' : '周' + WEEK[E.parseKey(kd).getDay()]) + '</div></div>';
    }

    var heroCta = checked
      ? '<button class="checkin-btn done" title="今日已打卡" data-act="ci" style="cursor:default">✓</button>'
      : '<button class="checkin-btn" title="点击打卡" data-act="ci">✔</button>';

    return '' +
      '<div class="hero">' +
        '<div class="checkin-hero">' +
          heroCta +
          '<div class="grow"><h1>' + greeting() + '，' + esc(S.user.name || '同学') + ' 🌟</h1>' +
          '<p>' + d.getFullYear() + ' 年 ' + (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日 · 周' + WEEK[d.getDay()] + ' · 已坚持 ' + streak + ' 天</p></div>' +
          '<div class="ring sm" style="--p:' + Math.round(pct * 100) + '"><div class="ring-txt"><b style="font-size:19px">' + est + '</b><div class="tiny" style="opacity:.85">目标 150</div></div></div>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">' +
          '<div class="stat-card" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:10px 14px;min-width:110px"><div class="k" style="color:rgba(255,255,255,.85)">🔥 连续打卡</div><div class="v" style="font-size:22px">' + streak + '<small> 天</small></div></div>' +
          '<div class="stat-card" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:10px 14px;min-width:110px"><div class="k" style="color:rgba(255,255,255,.85)">📚 已学词汇</div><div class="v" style="font-size:22px">' + ws.known + '<small> / ' + ws.total + '</small></div></div>' +
          '<div class="stat-card" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:10px 14px;min-width:110px"><div class="k" style="color:rgba(255,255,255,.85)">⏱ 今日学习</div><div class="v" style="font-size:22px">' + mins + '<small> 分钟</small></div></div>' +
          '<div class="stat-card" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:10px 14px;min-width:110px"><div class="k" style="color:rgba(255,255,255,.85)">✅ 语法完成</div><div class="v" style="font-size:22px">' + Object.keys(S.lessons).filter(function (k) { return S.lessons[k].done; }).length + '<small> / ' + ED.course.list.length + '</small></div></div>' +
        '</div>' +
        '<div class="row wrap mt16" style="gap:6px">' +
          '<button class="btn" data-act="planGo" style="background:rgba(255,255,255,.95);color:var(--brand);box-shadow:0 6px 16px rgba(0,0,0,.18)">🧭 我的学习计划</button>' +
          '<button class="btn xs" data-go="vocab" data-m="review" style="background:rgba(255,255,255,.2)">📖 立即开始学习</button>' +
          (ws.due > 0 ? '<button class="btn xs" style="background:rgba(255,255,255,.2)" data-act="goReview">⏰ 复习到期 ' + ws.due + ' 词</button>' : '') +
          '<button class="btn xs" data-act="diagStart" style="background:rgba(255,255,255,.2)">🧭 入学水平测评</button>' +
        '</div>' +
      '</div>' +

      '<div class="sect"><h3>今日任务</h3></div>' +
      '<div class="grid g-auto2">' +
        taskCard('🆕', '学新词', nw + ' / ' + goalW + ' 个', nw >= goalW, 'data-act="goNew"') +
        taskCard('📚', '复习单词', rv + ' 次' + (ws.due ? ' · 到期 ' + ws.due : ''), false, 'data-act="goReview"') +
        taskCard('🎯', '专项练习', nq + ' / ' + goalQ + ' 题', nq >= goalQ, 'data-act="goPractice"') +
        taskCard('⏱', '学习时长', mins + ' / ' + goalMin + ' 分钟', mins >= goalMin, 'data-act="goAny"') +
      '</div>' +

      '<div class="sect"><h3>快捷入口</h3></div>' +
      '<div class="grid g-auto">' +
        actCard('🧭', '学习计划', '从 50 到 150 的完整进阶路线', 'plan') +
        actCard('📖', '背单词', ws.due ? '复习 ' + ws.due + ' 个 + 学新词' : '按记忆曲线学新词', 'vocab') +
        actCard('✏️', '语法课', '18 节系统语法 + 随堂测验', 'grammar') +
        actCard('🎯', '专项训练', '八类真题题型任意刷', 'practice') +
        actCard('📝', '全真模考', '河南专升本题型 · 150 分', 'mock') +
      '</div>' +

      '<div class="sect"><h3>成长路径 · 从 50 到 150</h3></div>' +
      '<div class="card pad">' +
        '<div class="phase mt8">' + nodes + '</div>' +
        '<div class="pbar mt20"><i style="width:' + Math.round(pct * 100) + '%"></i></div>' +
        '<div class="row mt8 wrap"><span class="chip brand">当前阶段：' + ph.name + '</span><span class="chip">' + ph.focus + '</span></div>' +
        '<div class="mt12 grid g2">' +
          '<button class="btn ghost sm" data-act="phaseAction" data-p="' + phIdx + '">查看本阶段任务清单</button>' +
          '<button class="btn sm" data-go="mock">做一套模考验证水平 →</button>' +
        '</div>' +
      '</div>' +

      '<div class="sect"><h3>本周打卡</h3></div>' +
      '<div class="card pad"><div style="display:flex;gap:4px">' + weekDots + '</div></div>' +

      '<div class="sect"><h3>最近动态</h3></div>' +
      '<div class="card pad">' + actsHtml + '</div>';
  });

  function taskCard(ico, t, sub, done, action) {
    return '<div class="act-card" ' + action + '>' +
      '<span class="ico ' + (done ? '' : 'g1') + '" style="' + (done ? 'background:var(--ok-soft)' : '') + '">' + (done ? '✅' : ico) + '</span>' +
      '<div class="grow"><b>' + t + '</b><p>' + sub + '</p></div>' +
      '<span class="arrow">›</span></div>';
  }
  function actCard(ico, t, sub, go) {
    return '<div class="act-card" data-go="' + go + '"><span class="ico g2">' + ico + '</span><div class="grow"><b>' + t + '</b><p>' + sub + '</p></div><span class="arrow">›</span></div>';
  }

  function badge(name) {
    if (Eng.badges && !Eng.badges[name]) { Eng.badges = Eng.badges || {}; }
  }

  Eng.actions.goNew = function () { if (Eng.actions['vw-new']) Eng.actions['vw-new'](); else Eng.go('vocab', { mode: 'new' }); };
  Eng.actions.goReview = function () { if (Eng.actions['vw-review']) Eng.actions['vw-review'](); else Eng.go('vocab', { mode: 'review' }); };
  Eng.actions.goPractice = function () { Eng.go('practice'); };
  Eng.actions.goAny = function () { Eng.go('vocab'); };
  Eng.actions.planGo = function () { Eng.go('plan'); };
  Eng.actions.diagStart = function () { Eng.go('practice', { d: 'diag' }); };

  Eng.actions.ci = function (el) {
    var st = Eng.manualCheckin();
    Eng.toast('🔥 打卡成功！连续 ' + st + ' 天', 2000);
    Eng.go('home');
  };
  Eng.actions.phaseAction = function (el, d) {
    var p = E.PHASES[+d.p];
    Eng.modal(
      '<div class="mt12"><div class="row wrap" style="gap:6px"><span class="chip brand">' + p.name + '</span><span class="chip">' + p.range + ' 分</span></div>' +
      '<p class="muted small mt8">' + p.goal + ' · ' + p.focus + '</p>' +
      '<div class="hr"></div><div style="font-weight:800;margin-bottom:6px">阶段任务清单</div>' +
      p.tasks.map(function (t, i) { return '<div class="li-item"><span class="li-ico" style="background:var(--brand-soft)">' + (i + 1) + '</span><div class="li-txt">' + esc(t) + '</div></div>'; }).join('') +
      '<button class="btn block mt16" data-close>知道了，开始行动</button></div>',
      { title: '📋 ' + p.name + ' · 任务清单' }
    );
  };
})(window);
