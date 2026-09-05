/* ============================================================
   应用核心：状态、路由、打卡、学习计时、全局事件  window.Eng
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED;
  var KEY = 'fullscore-english-v1';
  var $ = function (s, r) { return (r || document).querySelector(s); };

  var Eng = {
    S: null, views: {}, mounts: {}, actions: {},
    screen: 'home', params: null, timerOn: false, secTick: 0,
    learningScreens: { vocab: 1, grammar: 1, practice: 1 }
  };

  Eng.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  Eng.fmtClock = function (sec) {
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return (h ? p(h) + ':' : '') + p(m) + ':' + p(s);
  };
  Eng.fmtDateCn = function (k) {
    var p = k.split('-');
    return p[0] + '年' + (+p[1]) + '月' + (+p[2]) + '日';
  };

  /* ---------------- 状态 ---------------- */
  function defaults() {
    return {
      v: 1, created: E.dateKey(),
      user: { name: '同学' },
      set: { goalW: 20, goalMin: 30, goalQ: 20, mockMin: 150 },
      days: {},       // 'YYYY-MM-DD': {sec,w,r,qn,qk,tasks,mocks,manual,acts:[{t,d}]}
      vocab: {},      // wordIdx: {b,due,ok,ng}
      lessons: {},    // lessonId: {done,best,at}
      stats: { wNew: 0, reviews: 0, qn: 0, qk: 0, tasks: 0, mocksDone: 0 },
      mocks: [],      // {at, auto, total, max, type}
      diag: null,     // {score, at}
      badges: {}      // id: at
    };
  }
  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (raw) {
      try { var o = JSON.parse(raw); if (o && o.v === 1) return o; } catch (e) { /* 损坏则重建 */ }
    }
    return defaults();
  }
  Eng.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(Eng.S)); } catch (e) { /* 空间不足忽略 */ }
  };
  Eng.exportData = function () { return JSON.stringify(Eng.S); };
  Eng.importData = function (txt) {
    var o = JSON.parse(txt);
    if (!o || o.v !== 1) throw new Error('文件格式不正确');
    Eng.S = o; Eng.save();
    return true;
  };
  Eng.resetAll = function () { Eng.S = defaults(); Eng.save(); };

  /* ---------------- 今日记录 ---------------- */
  Eng.today = function () { return E.dateKey(); };
  Eng.record = function (o) {
    var dk = Eng.today();
    var d = Eng.S.days[dk] || (Eng.S.days[dk] = { sec: 0, w: 0, r: 0, qn: 0, qk: 0, tasks: 0, mocks: 0, acts: [] });
    var first = !d._t;
    d._t = true;
    if (o.sec) d.sec += o.sec;
    if (o.w) { d.w += o.w; Eng.S.stats.wNew += o.w; }
    if (o.r) { d.r += o.r; Eng.S.stats.reviews += o.r; }
    if (o.qn) { d.qn += o.qn; d.qk += o.qk || 0; Eng.S.stats.qn += o.qn; Eng.S.stats.qk += o.qk || 0; }
    if (o.tasks) d.tasks += o.tasks;
    if (o.mock) { d.mocks += o.mock; Eng.S.stats.mocksDone += o.mock; }
    if (o.manual) d.manual = true;
    if (o.act && d.acts.length < 60) d.acts.unshift({ t: o.act, at: Date.now() });
    Eng.save();
    return { first: first, streak: E.streak(Eng.S.days) };
  };
  Eng.manualCheckin = function () {
    var dk = Eng.today();
    if (!Eng.S.days[dk]) Eng.S.days[dk] = { sec: 0, w: 0, r: 0, qn: 0, qk: 0, tasks: 0, mocks: 0, acts: [] };
    Eng.S.days[dk].manual = true;
    Eng.save();
    return E.streak(Eng.S.days);
  };
  Eng.todayRec = function () { return Eng.S.days[Eng.today()]; };

  /* 学习计时（vocab/grammar/practice 界面活跃时累计） */
  Eng.startTimer = function () { if (!Eng.timerOn) { Eng.timerOn = true; Eng.t0 = Date.now(); } };
  Eng.stopTimer = function () {
    if (!Eng.timerOn) return;
    Eng.timerOn = false;
    var sec = Math.floor((Date.now() - Eng.t0) / 1000);
    if (sec > 0) { Eng.record({ sec: sec }); }
  };

  /* ---------------- 词汇快捷统计 ---------------- */
  Eng.wordState = function () {
    var now = Date.now(), total = 0, known = 0, due = 0, learning = 0, unseen = 0;
    var list = ED.vocab.list;
    for (var i = 0; i < list.length; i++) {
      var w = Eng.S.vocab[i];
      if (!w) unseen++;
      else {
        learning++;
        if (w.b >= 1) { known++; if (w.due <= now) due++; }
      }
    }
    return { total: list.length, seen: learning, known: known, due: due, unseen: unseen };
  };
  Eng.dueWords = function () {
    var now = Date.now(), ids = [];
    var list = ED.vocab.list;
    for (var i = 0; i < list.length; i++) {
      var w = Eng.S.vocab[i];
      if (w && w.b >= 1 && w.due && w.due <= now) ids.push(i);
    }
    return ids;
  };
  Eng.newWords = function (n) {
    var ids = [];
    for (var i = 0; i < ED.vocab.list.length && ids.length < n; i++) {
      if (!Eng.S.vocab[i]) ids.push(i);
    }
    return ids;
  };
  /* 供闯关用：按层级取可复习词（含已见过） */
  Eng.wordPool = function (lv) {
    var out = [];
    ED.vocab.list.forEach(function (w, i) {
      if (w.lv === lv && Eng.S.vocab[i]) out.push(i);
    });
    return out;
  };

  /* ---------------- 导航与视图 ---------------- */
  var NAV = [
    { id: 'home', ico: '🏠', t: '首页' },
    { id: 'review', ico: '⏰', t: '复习' },
    { id: 'plan', ico: '🧭', t: '计划' },
    { id: 'vocab', ico: '📚', t: '单词' },
    { id: 'grammar', ico: '✏️', t: '语法' },
    { id: 'practice', ico: '🎯', t: '专项' },
    { id: 'mock', ico: '📝', t: '模考' },
    { id: 'me', ico: '👤', t: '我的' }
  ];
  var CRUMB = { home: '学习首页', review: '艾宾浩斯复习 · 每日打卡', plan: '学习计划 · 50→150', vocab: '单词记忆', grammar: '语法系统课', practice: '真题专项训练', mock: '全真模拟考试', me: '我的 · 统计与记录' };

  Eng.navHTML = function () {
    return NAV.map(function (n) {
      var badge = n.id === 'vocab' ? Eng.dueWords().length : 0;
      return '<a class="nav-item" data-go="' + n.id + '" href="javascript:void(0)"><span class="n-ico">' + n.ico + '</span>' + n.t +
        (badge > 0 ? '<span class="n-badge">' + badge + '</span>' : '') + '</a>';
    }).join('');
  };
  Eng.bottomHTML = function () {
    return NAV.map(function (n) {
      return '<a class="b-item" data-go="' + n.id + '" href="javascript:void(0)"><span class="bi">' + n.ico + '</span><span>' + n.t + '</span></a>';
    }).join('');
  };
  Eng.registerView = function (id, render, mount) { Eng.views[id] = render; if (mount) Eng.mounts[id] = mount; };
  Eng.cur = function () { return Eng.screen; };

  Eng.go = function (screen, params) {
    Eng.stopTimer();
    Eng.screen = screen; Eng.params = params || null;
    var fn = Eng.views[screen];
    if (!fn) screen = 'home';
    var html = fn(params || null);
    var el = $('#screen');
    el.innerHTML = '<div class="screen-anim">' + html + '</div>';
    el.scrollTop = 0;
    if (window.scrollTo) window.scrollTo(0, 0);
    // 激活导航
    var items = document.querySelectorAll('.nav-item, .b-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.toggle('active', items[i].getAttribute('data-go') === screen);
    }
    var crumb = $('#crumb'); if (crumb) crumb.textContent = CRUMB[screen] || '';
    if (Eng.learningScreens[screen]) Eng.startTimer(); else Eng.stopTimer();
    if (Eng.mounts[screen]) { try { Eng.mounts[screen](); } catch (e) { console.error(e); } }
    Eng.updateChrome();
    Eng.closeMenu();
  };
  Eng.closeMenu = function () { };

  Eng.updateChrome = function () {
    var pill = $('#topScore');
    if (pill) {
      var est = E.estimate(Eng.S);
      var pct = Math.round(est / 150 * 100);
      pill.innerHTML = '🎯 <b>' + est + '</b><small>/150 · 预估 ' + pct + '%</small>';
    }
    var sb = $('#sideStreak');
    if (sb) {
      var st = E.streak(Eng.S.days);
      var today = Eng.todayRec();
      var mins = Math.round(((today && today.sec) || 0) / 60);
      sb.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><span>🔥 连续 ' + st + ' 天</span><span class="chip ok" style="font-size:11px">' + (today ? '今日已打卡' : '今日未打卡') + '</span></div>' +
        '<div class="pbar thin mt8"><i style="width:' + Math.min(100, (today ? (today.sec || 0) / 60 : 0) / (Eng.S.set.goalMin || 30) * 100) + '%"></i></div>' +
        '<div class="muted mt8" style="font-size:11px">今日学习 ' + mins + ' 分钟 / 目标 ' + (Eng.S.set.goalMin || 30) + ' 分钟</div>';
    }
    // 更新侧栏/底栏的待复习角标
    var due = Eng.dueWords().length;
    var badges = document.querySelectorAll('.nav-item[data-go="vocab"] .n-badge');
    for (var i = 0; i < badges.length; i++) {
      if (due > 0) { badges[i].style.display = ''; badges[i].textContent = due; }
      else badges[i].style.display = 'none';
    }
  };

  /* ---------------- 轻提示 / 弹层 ---------------- */
  Eng.toast = function (msg, ms) {
    var w = $('#toastWrap');
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    w.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, (ms || 1600));
    setTimeout(function () { t.remove(); }, (ms || 1600) + 350);
  };
  Eng.modal = function (html, opt) {
    var mask = $('#modalMask'), box = $('#modalBox');
    opt = opt || {};
    box.innerHTML = '<div style="display:flex;align-items:flex-start;gap:10px"><div class="grow" style="font-weight:800;font-size:17px">' + (opt.title || '') + '</div>' +
      (opt.noClose ? '' : '<button class="icon-btn" data-close style="width:30px;height:30px;font-size:14px">✕</button></div>') +
      html;
    mask.hidden = false;
    Eng.modalOpen = true;
    Eng.updateModalBtn();
    return box;
  };
  Eng.updateModalBtn = function () { };
  Eng.closeModal = function () {
    $('#modalMask').hidden = true;
    Eng.modalOpen = false;
  };

  /* ---------------- 全局事件 ---------------- */
  function bind() {
    document.addEventListener('click', function (ev) {
      var el = ev.target.closest ? ev.target.closest('[data-go],[data-act],[data-close],[data-nav]') : null;
      if (!el) return;
      if (el.hasAttribute('data-close')) { Eng.closeModal(); return; }
      var nav = el.getAttribute('data-nav');
      if (nav) { Eng.go(nav); return; }
      var go = el.getAttribute('data-go');
      if (go) { Eng.go(go); return; }
      var act = el.getAttribute('data-act');
      if (act) {
        var fn = Eng.actions[act];
        if (fn) { ev.preventDefault(); fn(el, el.dataset); }
      }
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && Eng.modalOpen) Eng.closeModal();
    });
    document.addEventListener('click', function (ev) {
      if (ev.target && ev.target.id === 'modalMask') Eng.closeModal();
    });
    window.addEventListener('beforeunload', function () { Eng.stopTimer(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) Eng.stopTimer();
    });
  }

  /* 顶部按钮：备份（跳转“我的”） */
  function bindChrome() {
    var sync = $('#syncBtn');
    if (sync) sync.addEventListener('click', function () { Eng.go('me'); });
    var menu = $('#menuBtn');
    if (menu) menu.addEventListener('click', function () {
      var sb = $('#sidebar');
      if (sb.style.display === 'flex') { sb.style.display = ''; }
      else {
        sb.style.position = 'fixed'; sb.style.display = 'flex'; sb.style.zIndex = '60';
        sb.style.width = '250px'; sb.style.top = '0'; sb.style.bottom = '0';
      }
    });
    document.addEventListener('click', function (ev) {
      var sb = $('#sidebar');
      if (sb && sb.style.display === 'flex' && !sb.contains(ev.target) && !ev.target.closest('#menuBtn')) {
        sb.style.display = '';
        sb.style.position = ''; sb.style.width = ''; sb.style.top = ''; sb.style.bottom = '';
      }
    });
  }

  /* ---------------- 启动 ---------------- */
  Eng.start = function () {
    Eng.S = load();
    // 确保弹层蒙版默认隐藏（防止空的白色弹层框常驻屏幕）
    var maskEl = document.getElementById('modalMask');
    if (maskEl) maskEl.hidden = true;
    $('#sideNav').innerHTML = Eng.navHTML();
    $('#bottomNav').innerHTML = Eng.bottomHTML();
    bind();
    bindChrome();
    Eng.go('home');
    // 词典/课程标题点击回首页
    var brand = $('.brand'); if (brand) brand.addEventListener('click', function () { Eng.go('home'); });
  };

  g.Eng = Eng;
})(window);
