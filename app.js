/* ===========================================================
 *  英语连连看 · 逻辑
 *  词库来自 words.js（window.WORD_BANK，源文件：桌面 144 文件夹的 3 个 PDF）
 * =========================================================== */
(function () {
  'use strict';

  /* ---------------- 小工具 ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rnd = n => Math.floor(Math.random() * n);
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const canVibrate = typeof navigator.vibrate === 'function';

  /* ---------------- 设置持久化 ---------------- */
  const LS_KEY = 'enMatch.settings.v1';
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; }
  }
  const settings = Object.assign({
    unit: 'U1', size: 6, mode: 'random',
    haptics: true, sound: true, speak: true, pos: true
  }, loadSettings());
  function saveSettings() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(settings)); } catch (e) { /* 忽略 */ }
  }

  /* ===========================================================
   *  📖 顺序模式（按书顺序）读到哪儿了
   *  orderPos[词库] = 下一轮从第几个词开始（从 0 数）
   *  位置存在本地，所以第二天打开会接着上次的位置往下走，
   *  不用把前面的词全部做完才轮到昨天练到的地方。
   * =========================================================== */
  const OKEY = 'enMatch.order.v1';
  function loadOrderPos() {
    try {
      const o = JSON.parse(localStorage.getItem(OKEY));
      return (o && typeof o === 'object') ? o : {};
    } catch (e) { return {}; }
  }
  const orderPos = loadOrderPos();
  function saveOrderPos() { try { localStorage.setItem(OKEY, JSON.stringify(orderPos)); } catch (e) { /* 忽略 */ } }

  /* ===========================================================
   *  学习记录：错题本 ❌ / 生词本 ⭐
   *  key 形如 "U1#12"，和 words.js 里的顺序一一对应
   * =========================================================== */
  const PKEY = 'enMatch.progress.v1';
  function loadProgress() {
    try {
      const p = JSON.parse(localStorage.getItem(PKEY)) || {};
      return { wrong: p.wrong || {}, star: p.star || {} };
    } catch (e) { return { wrong: {}, star: {} }; }
  }
  const progress = loadProgress();
  function saveProgress() { try { localStorage.setItem(PKEY, JSON.stringify(progress)); } catch (e) {} }

  const wrongCount = key => (progress.wrong[key] ? progress.wrong[key].n || 1 : 0);
  const isStarred = key => !!progress.star[key];
  const wrongTotal = () => Object.keys(progress.wrong).length;
  const starTotal = () => Object.keys(progress.star).length;
  const bookTotal = () => bookKeysOf('all').length;

  function markWrong(key) {
    const e = progress.wrong[key] || { n: 0, t: 0 };
    e.n = Math.min((e.n || 0) + 1, 9);
    e.t = Date.now();
    progress.wrong[key] = e;
    saveProgress(); syncCounts();
  }
  /** 答对了：错题次数 -1，减到 0 就表示掌握了，自动移出错题本 */
  function markRight(key) {
    const e = progress.wrong[key];
    if (!e) return false;
    e.n = (e.n || 1) - 1;
    if (e.n <= 0) { delete progress.wrong[key]; saveProgress(); syncCounts(); return true; }
    saveProgress(); syncCounts();
    return false;
  }
  function toggleStar(key) {
    let on;
    if (progress.star[key]) { delete progress.star[key]; on = false; }
    else { progress.star[key] = Date.now(); on = true; }
    saveProgress(); syncCounts();
    return on;
  }
  function removeFromBook(key) {
    delete progress.wrong[key];
    delete progress.star[key];
    saveProgress(); syncCounts();
  }
  function syncCounts() {
    const w = wrongTotal(), s = starTotal(), all = bookTotal();
    const set = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
    set('#cntWrong', w); set('#cntStar', s); set('#cntBook', all);
    set('#tabAllCnt', all); set('#tabWrongCnt', w); set('#tabStarCnt', s);
  }

  /* ===========================================================
   *  打卡（每天完成 1 轮就算打卡成功）
   * =========================================================== */
  const CKEY = 'enMatch.checkin.v1';
  function loadCheckin() {
    try {
      const c = JSON.parse(localStorage.getItem(CKEY)) || {};
      const days = c.days || {};
      let total = c.total;
      if (!total) {   // 老数据没有 total 就从 days 里补算一次
        total = { rounds: 0, words: 0, secs: 0 };
        Object.keys(days).forEach(k => {
          total.rounds += days[k].rounds || 0;
          total.words += days[k].words || 0;
          total.secs += days[k].secs || 0;
        });
      }
      return { days: days, total: total };
    } catch (e) { return { days: {}, total: { rounds: 0, words: 0, secs: 0 } }; }
  }
  const checkin = loadCheckin();
  function saveCheckin() { try { localStorage.setItem(CKEY, JSON.stringify(checkin)); } catch (e) {} }

  const dayKey = dt => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
  const todayKey = () => dayKey(new Date());
  function shiftDay(key, delta) {
    const [y, m, d] = key.split('-').map(Number);
    return dayKey(new Date(y, m - 1, d + delta));
  }
  /** 连续天数：今天还没打卡就从昨天往前算（今天没结束，连续不断） */
  function streakNow() {
    let cur = todayKey(), s = 0;
    if (!checkin.days[cur]) cur = shiftDay(cur, -1);
    while (checkin.days[cur]) { s++; cur = shiftDay(cur, -1); }
    return s;
  }
  /** 历史上最长的一次连续 */
  function bestStreak() {
    const keys = Object.keys(checkin.days).sort();
    let best = 0, run = 0, prev = null;
    for (const k of keys) {
      run = (prev && shiftDay(prev, 1) === k) ? run + 1 : 1;
      if (run > best) best = run;
      prev = k;
    }
    return best;
  }
  const totalDays = () => Object.keys(checkin.days).length;
  const todayRec = () => checkin.days[todayKey()] || null;

  /** 记一轮的成绩；返回 true 表示今天第一次打卡成功 */
  function recordCheckin(pairs, secs) {
    const k = todayKey();
    const first = !checkin.days[k];
    const d = checkin.days[k] || { rounds: 0, words: 0, secs: 0 };
    d.rounds++; d.words += pairs; d.secs += secs;
    checkin.days[k] = d;
    // 累计（不受下面的 730 天清理影响）
    checkin.total.rounds++;
    checkin.total.words += pairs;
    checkin.total.secs += secs;
    // 只留最近 730 天，防止本地数据无限长
    const keys = Object.keys(checkin.days).sort();
    if (keys.length > 730) keys.slice(0, keys.length - 730).forEach(x => delete checkin.days[x]);
    saveCheckin();
    syncCheckinCard();
    syncCounters();
    return first;
  }

  /** 首页的复习次数统计条 */
  function syncCounters() {
    const rec = todayRec();
    const t = checkin.total || { rounds: 0, words: 0 };
    const set = (sel, v, bump) => {
      const el = $(sel); if (!el) return;
      const old = el.textContent;
      el.textContent = v;
      if (bump && old !== String(v)) {
        const box = el.parentElement;
        box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump');
      }
    };
    set('#cTotal', t.rounds, true);
    set('#cToday', rec ? rec.rounds : 0, true);
    set('#cWords', t.words, false);
  }

  function syncCheckinCard() {
    const st = streakNow(), rec = todayRec();
    const card = $('#checkinCard');
    if (!card) return;
    card.classList.toggle('done', !!rec);
    $('#ccEmoji').textContent = rec ? '🔥' : '📅';
    $('#ccStreak').textContent = st;
    $('#ccToday').textContent = rec
      ? ('今天已打卡 · ' + rec.rounds + ' 轮 · ' + rec.words + ' 个词')
      : '今天还没打卡，玩一轮就行～';
  }

  /** 打卡日历：最近 5 周（按周排列，周日在最上面） */
  function renderCheckin() {
    const st = streakNow(), best = bestStreak(), total = totalDays(), rec = todayRec();
    $('#ckStreak').textContent = st;
    $('#ckBest').textContent = Math.max(best, st);
    $('#ckTotal').textContent = total;
    $('#ckSub').textContent = '连续 ' + st + ' 天' + (rec ? ' · 今天已打卡' : ' · 今天还没打卡');

    $('#ckToday').innerHTML = rec
      ? '🔥 今天打卡成功！练了 <b>' + rec.rounds + '</b> 次 · 配掉 <b>' + rec.words + '</b> 个词 · ' +
        Math.max(1, Math.round(rec.secs / 60)) + ' 分钟<br>累计已复习 <b>' + checkin.total.rounds + '</b> 次 · 共配掉 <b>' +
        checkin.total.words + '</b> 个词' +
        (st > 1 ? '<br>已经连着 <b>' + st + '</b> 天啦，别断哦～' : '')
      : (st > 0
        ? '今天还没打卡。已经连着打卡 <b>' + st + '</b> 天了，玩一轮就能接上 🔥<br>累计复习 <b>' + checkin.total.rounds + '</b> 次'
        : '今天还没打卡。完成 <b>1 轮</b>（把场上的词全配完）就算打卡成功～<br>累计复习 <b>' + checkin.total.rounds + '</b> 次');

    // 找到 9 周前的周日，往后铺 10 周（70 天），最后一行是本周
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() - 63);
    const cells = [];
    for (let i = 0; i < 70; i++) {
      const dt = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      const k = dayKey(dt);
      const d = checkin.days[k];
      const future = dt > today;
      const lv = !d ? 0 : d.words >= 41 ? 4 : d.words >= 21 ? 3 : d.words >= 9 ? 2 : 1;
      cells.push('<button class="ck-cell lv' + lv + (future ? ' future' : '') +
        (k === todayKey() ? ' today' : '') + '" data-day="' + k + '"' +
        (future ? ' disabled' : '') + ' aria-label="' + k + '"></button>');
    }
    $('#ckGrid').innerHTML = cells.join('');
  }

  function openCheckin() {
    renderCheckin();
    show('screen-checkin');
  }

  /* ===========================================================
   *  音效（Web Audio，无需素材文件）
   * =========================================================== */
  const Sound = {
    ctx: null,
    enabled: true,
    init() {
      if (this.ctx) return this.ctx;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { this.ctx = new AC(); } catch (e) { return null; }
      return this.ctx;
    },
    /** 唤醒音频上下文（iOS 必须在用户手势里调用） */
    unlock() {
      const c = this.init();
      if (c && c.state === 'suspended') c.resume().catch(() => {});
    },
    /** 单个音符 */
    tone(freq, dur, type = 'sine', gain = 0.08, delay = 0) {
      if (!this.enabled) return;
      const c = this.init(); if (!c) return;
      const t0 = c.currentTime + delay;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g); g.connect(c.destination);
      osc.start(t0); osc.stop(t0 + dur + 0.02);
    },
    /** 极短的低频「触感咔哒」：iOS 上没有真震动时用来代替手感 */
    thump(strength = 1) {
      if (!this.enabled) return;
      const c = this.init(); if (!c) return;
      const t0 = c.currentTime;
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(strength > 1 ? 66 : 92, t0);
      osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.06);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.13 * strength, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.075);
      osc.connect(g); g.connect(c.destination);
      osc.start(t0); osc.stop(t0 + 0.1);
    },
    tap() { this.tone(880, 0.05, 'triangle', 0.045); },
    match() { this.tone(784, 0.12, 'sine', 0.09); this.tone(988, 0.14, 'sine', 0.08, 0.07); this.tone(1319, 0.2, 'sine', 0.07, 0.14); },
    error() { this.tone(196, 0.14, 'square', 0.05); this.tone(147, 0.18, 'square', 0.045, 0.09); },
    win() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.24, 'triangle', 0.08, i * 0.11)); }
  };

  /* ===========================================================
   *  触感反馈
   *  1) 安卓 Chrome：navigator.vibrate（真实震动）
   *  2) iOS 原生壳（Capacitor / WKWebView 桥）：真实 Taptic
   *  3) 其它（iOS Safari）：低频「咔哒」+ 果冻回弹 代替
   * =========================================================== */
  const Haptics = {
    enabled: true,
    bridge: null,          // 预留：原生壳可赋值 (kind) => {...}
    patterns: {
      tap:   [10],
      soft:  [12],
      match: [18, 45, 70],  // 消除：明显更大
      error: [14, 30, 14],
      win:   [40, 55, 40, 55, 90]
    },
    fire(kind) {
      if (!this.enabled) return;
      const p = this.patterns[kind] || this.patterns.tap;

      // 1) 原生桥
      if (typeof this.bridge === 'function') { try { this.bridge(kind); return; } catch (e) {} }
      // 2) Capacitor
      try {
        const H = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
        if (H) {
          if (kind === 'match' || kind === 'win') H.impact({ style: 'HEAVY' });
          else if (kind === 'error') H.impact({ style: 'MEDIUM' });
          else H.impact({ style: 'LIGHT' });
          return;
        }
      } catch (e) {}
      // 3) Web Vibration API
      if (canVibrate) {
        try { navigator.vibrate(p); return; } catch (e) {}
      }
      // 4) 兜底：触感音
      if (settings.sound) {
        if (kind === 'match' || kind === 'win') Sound.thump(1.35);
        else if (kind === 'error') Sound.thump(0.9);
        else Sound.thump(0.6);
      }
    },
    tap()   { this.fire('tap'); },
    match() { this.fire('match'); },
    error() { this.fire('error'); },
    win()   { this.fire('win'); }
  };
  window.Haptics = Haptics;   // 方便以后接原生壳

  /* ===========================================================
   *  朗读
   * =========================================================== */
  function speak(text) {
    if (!settings.speak || !('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = 0.92; u.pitch = 1.05;
      speechSynthesis.cancel();
      setTimeout(() => { try { speechSynthesis.speak(u); } catch (e) {} }, 40);
    } catch (e) {}
  }

  /* ===========================================================
   *  词库
   * =========================================================== */
  const BANK = window.WORD_BANK || {};
  const UNITS = Object.keys(BANK);
  function unitWords(u) { return (BANK[u] && BANK[u].words) || []; }
  function totalWords() { return UNITS.reduce((n, u) => n + unitWords(u).length, 0); }

  let _allWords = null;
  function allWords() {
    if (_allWords) return _allWords;
    const list = [];
    UNITS.forEach(u => unitWords(u).forEach((w, i) =>
      list.push({ key: u + '#' + (i + 1), en: w[0], zh: w[1], unit: u, no: i + 1 })));
    return (_allWords = list);
  }
  let _wordMap = null;
  function wordMap() {
    if (_wordMap) return _wordMap;
    _wordMap = new Map(allWords().map(w => [w.key, w]));
    return _wordMap;
  }
  function wordByKey(key) { return wordMap().get(key); }

  function buildPool(unit) {
    if (unit === 'STAR') return allWords().filter(w => progress.star[w.key]);
    if (unit === 'WRONG') return allWords().filter(w => progress.wrong[w.key]);
    if (unit === 'ALL') return allWords().slice();
    return allWords().filter(w => w.unit === unit);
  }

  /** 生词本 / 错题本里的词 key 列表；tab = all | wrong | star */
  function bookKeysOf(tab) {
    const out = new Set();
    if (tab === 'all' || tab === 'star') Object.keys(progress.star).forEach(k => out.add(k));
    if (tab === 'all' || tab === 'wrong') Object.keys(progress.wrong).forEach(k => out.add(k));
    const map = wordMap();
    return [...out].filter(k => map.has(k)).sort((a, b) => {
      const A = map.get(a), B = map.get(b);
      if (A.unit !== B.unit) return A.unit < B.unit ? -1 : 1;
      return A.no - B.no;
    });
  }

  /* ===========================================================
   *  游戏状态
   * =========================================================== */
  const state = {
    pool: [],
    poolLabel: null,      // 自定义练习（生词本/错题本）时显示的名字
    forceRandom: false,   // 自定义练习时强制随机抽词
    roundWrongKeys: new Set(),  // 本轮点错过的词，用于「重练本轮错词」
    roundWords: [],
    cards: [],            // {id, pairKey, kind, text}
    selected: null,       // {card, el}
    elMap: new Map(),
    locked: false,
    matched: 0,
    totalPairs: 0,
    combo: 0,
    maxCombo: 0,
    score: 0,
    wrong: 0,
    roundIndex: 0,
    startedAt: 0,
    elapsed: 0,
    timer: null,
    seen: new Set(),      // 随机模式：已抽过的词，避免重复
    segStart: 0,          // 顺序模式：本轮第一个词的位置（从 0 数）
    segWrapped: false,    // 顺序模式：本轮是否跨过了词库末尾
    lastPair: null
  };

  /* ---------------- 出词 ---------------- */
  function pickWords(n) {
    const pool = state.pool;
    if (!state.forceRandom && settings.mode === 'order') {
      const total = pool.length;
      if (!total) return [];
      const cur = orderPosOf(settings.unit, total);
      const take = Math.min(n, total);
      const out = [];
      for (let i = 0; i < take; i++) out.push(pool[(cur + i) % total]);
      state.segStart = cur;
      state.segWrapped = (cur + take) > total;   // 这一轮跨过了末尾，下一轮就回到开头
      return out;
    }
    if (state.forceRandom) {
      // 生词本 / 错题本练习：直接在这一小撮词里随机抽
      return shuffle(pool).slice(0, Math.min(n, pool.length));
    }
    // 随机模式：优先抽没出现过的
    let avail = pool.filter(w => !state.seen.has(w.key));
    if (avail.length < n) {
      state.seen.clear();
      avail = pool.slice();
      if (pool.length > n * 2) toast('🎊 这个词库的词都过了一遍，重新开始抽～');
    }
    const picked = shuffle(avail).slice(0, n);
    picked.forEach(w => state.seen.add(w.key));
    return picked;
  }

  /* ---------------- 📖 顺序模式：位置 & 翻段 ---------------- */
  /** 词库读到哪儿了（0 基）；越界、或词库变小了，自动回到开头 */
  function orderPosOf(key, total) {
    let cur = Number(orderPos[key]);
    if (!Number.isFinite(cur) || cur < 0 || !total || cur >= total) cur = 0;
    return cur;
  }
  function orderPageSize(total) {
    return Math.max(1, Math.min(settings.size || 6, total || 1));
  }
  function unitLabel(u) {
    return u === 'ALL' ? '全部词库' : u === 'STAR' ? '⭐ 生词本' : u === 'WRONG' ? '❌ 错题本' : u;
  }
  /** 本轮做完 → 读书位置往后推进一段，下次（含第二天）自动接着往下走 */
  function advanceOrderPos() {
    if (state.forceRandom || settings.mode !== 'order') return '';
    const total = state.pool.length;
    if (!total) return '';
    const start = Number.isFinite(state.segStart) ? state.segStart : orderPosOf(settings.unit, total);
    const step = Math.min(state.totalPairs || orderPageSize(total), total);
    orderPos[settings.unit] = (start + step) % total;
    saveOrderPos();
    if (state.segWrapped) return '📖 ' + unitLabel(settings.unit) + ' 已过完一遍，下一轮从第 1 词重新开始';
    return '📖 下一轮接着从第 ' + (orderPos[settings.unit] + 1) + ' 词开始';
  }
  /** 手动翻段：delta = +1 往后翻一段，-1 往前翻一段 */
  function flipSegment(delta) {
    const total = state.pool.length;
    if (!total) { toast('这个词库没有词啦～'); return; }
    const page = orderPageSize(total);
    let cur = orderPosOf(settings.unit, total) + delta * page;
    let edge = '';
    if (cur >= total) { cur = 0; edge = '末尾'; }
    else if (cur < 0) { cur = Math.max(0, total - page); edge = '开头'; }
    orderPos[settings.unit] = cur;
    saveOrderPos();
    startRound();
    const to = Math.min(total, cur + page);
    toast(edge === '末尾' ? ('📖 已经到末尾了，从第 1 词重新开始')
      : edge === '开头' ? ('📖 已经是最前面了，从第 ' + (cur + 1) + ' 词开始')
        : (delta > 0 ? '⏭ 往后翻：第 ' + (cur + 1) + '–' + to + ' 词'
          : '⏮ 往前翻：第 ' + (cur + 1) + '–' + to + ' 词'));
  }
  /** 菜单上的位置提示 + 游戏页翻段按钮的显隐 */
  function syncOrderUI() {
    const seg = $('#segBar');
    if (seg) seg.hidden = !(settings.mode === 'order' && !state.forceRandom);
    const note = $('#orderNote');
    if (!note) return;
    if (settings.mode !== 'order') { note.hidden = true; note.innerHTML = ''; return; }
    const total = buildPool(settings.unit).length;
    const page = orderPageSize(total);
    const cur = orderPosOf(settings.unit, total);
    const to = Math.min(total, cur + page);
    note.hidden = false;
    note.innerHTML = '📖 按书顺序：<b>' + escapeHtml(unitLabel(settings.unit)) + '</b> 下次从第 <b>' +
      (total ? (cur + 1) : 0) + '</b> / ' + total + ' 词开始' +
      (total ? '（第 ' + (cur + 1) + '–' + to + ' 词）' : '') +
      (cur > 0 ? ' · <button class="linkbtn" type="button" data-act="reset">回到开头</button>' : '') +
      (total && cur + page < total ? ' · <button class="linkbtn" type="button" data-act="next">跳到下一段 ›</button>' : '');
  }

  function startRound() {
    const n = settings.size;
    state.roundWords = pickWords(n);
    if (!state.roundWords.length) {
      // 池子空了（比如错题全部掌握后）——别给一张空牌桌
      stopTimer();
      state.poolLabel = null;
      state.forceRandom = false;
      toast('这个词库没有词啦～换个词库继续吧');
      show('screen-menu');
      syncMenu();
      return;
    }
    state.roundIndex++;
    state.matched = 0;
    state.totalPairs = state.roundWords.length;
    state.combo = 0;
    state.maxCombo = 0;
    state.score = 0;
    state.wrong = 0;
    state.selected = null;
    state.locked = false;
    state.lastPair = null;
    state.roundWrongKeys = new Set();
    state.cards = [];
    state.roundWords.forEach((w, i) => {
      state.cards.push({ id: 'en-' + i, pairKey: w.key, kind: 'en', text: w.en, word: w });
      state.cards.push({ id: 'zh-' + i, pairKey: w.key, kind: 'zh', text: w.zh, word: w });
    });
    state.cards = shuffle(state.cards);
    renderBoard();
    startTimer();
    updateHud();
    syncOrderUI();
  }

  /** 用指定的一批词开一局（生词本练习 / 错题重练） */
  function startCustomRound(keys, label) {
    const map = wordMap();
    const list = keys.map(k => map.get(k)).filter(Boolean);
    if (!list.length) { toast('这里还没有词～先去玩几局吧'); return; }
    state.pool = list;
    state.poolLabel = label || '专属练习';
    state.forceRandom = true;
    state.roundIndex = 0;
    state.seen.clear();
    show('screen-game');
    startRound();
  }

  /** 主菜单开始的普通一局 */
  function startNormalRound() {
    state.pool = buildPool(settings.unit);
    state.poolLabel = null;
    state.forceRandom = false;
    if (!state.pool.length) {
      if (settings.unit === 'STAR' || settings.unit === 'WRONG') {
        toast(settings.unit === 'STAR'
          ? '⭐ 生词本还是空的：长按卡片就能收藏，或者点错几道题'
          : '❌ 错题本还是空的：先去玩几局吧～');
        bookTab = settings.unit === 'STAR' ? 'star' : 'wrong';
        renderBook(); show('screen-book');
      } else {
        toast('这个词库是空的');
      }
      return;
    }
    state.roundIndex = 0;
    state.seen.clear();
    state.segStart = 0;
    state.segWrapped = false;
    show('screen-game');
    startRound();
  }

  function restartRound() {
    // 用同一批单词重开
    state.matched = 0; state.combo = 0; state.maxCombo = 0; state.score = 0; state.wrong = 0;
    state.selected = null; state.locked = false; state.lastPair = null;
    state.cards = shuffle(state.cards.map(c => ({ ...c })));
    renderBoard(); startTimer(); updateHud();
  }

  /* ---------------- 渲染牌面 ---------------- */
  function lenClass(s) {
    const n = String(s).length;
    if (n <= 6) return '';
    if (n <= 14) return 'fs-m';
    return 'fs-s';
  }
  function highlightPos(s) {
    const safe = escapeHtml(s);
    if (!settings.pos) return safe;
    return safe.replace(/(^|[\s,;，；、])((?:n|v|vt|vi|adj|adv|prep|conj|pron|num|art|int|aux|abbr)\.)/gi,
      '$1<i class="pos">$2</i>');
  }
  function renderBoard() {
    const board = $('#board');
    board.innerHTML = '';
    state.elMap.clear();
    const frag = document.createDocumentFragment();
    state.cards.forEach(card => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'card ' + card.kind + ' ' + lenClass(card.text);
      b.dataset.id = card.id;
      b.setAttribute('aria-label', card.kind === 'en' ? ('英文 ' + card.text) : ('中文 ' + card.text));

      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = card.kind === 'en' ? 'EN' : '汉';

      const t = document.createElement('span');
      t.className = 'txt';
      t.innerHTML = card.kind === 'zh' ? highlightPos(card.text) : escapeHtml(card.text);

      const star = document.createElement('span');
      star.className = 'star-mark';
      star.textContent = '⭐';

      b.append(star, tag, t);
      if (isStarred(card.pairKey)) b.classList.add('starred');
      frag.appendChild(b);
      state.elMap.set(card.id, b);
    });
    board.appendChild(frag);
    updateHud();
  }

  /* ---------------- 果冻手感 ---------------- */
  function jelly(el) {
    el.classList.remove('jelly');
    void el.offsetWidth;          // 强制重排，让动画能重复播放
    el.classList.add('jelly');
    el.addEventListener('animationend', function h() {
      el.classList.remove('jelly');
      el.removeEventListener('animationend', h);
    });
  }

  /* ---------------- 点击逻辑 ---------------- */
  function onCardTap(el) {
    if (state.locked || el.classList.contains('gone')) return;
    if (longPressFired) { longPressFired = false; return; }   // 长按收藏后不再触发配对
    const card = state.cards.find(c => c.id === el.dataset.id);
    if (!card) return;

    Sound.unlock();

    // 再点一次自己 = 取消选择
    if (state.selected && state.selected.card.id === card.id) {
      el.classList.remove('selected');
      state.selected = null;
      Haptics.tap();
      return;
    }

    // 还没有选择：选中（中文、英文都可以先点）
    if (!state.selected) {
      state.selected = { card: card, el: el };
      el.classList.add('selected');
      Haptics.tap();                       // 轻反馈
      Sound.tap();
      if (card.kind === 'en') speak(card.text);
      return;
    }

    // 已经是同一种语言：切换选择
    if (state.selected.card.kind === card.kind) {
      state.selected.el.classList.remove('selected');
      state.selected = { card: card, el: el };
      el.classList.add('selected');
      Haptics.tap(); Sound.tap();
      if (card.kind === 'en') speak(card.text);
      return;
    }

    // 一中文 + 一英文 → 判断
    const first = state.selected;
    if (first.card.pairKey === card.pairKey) {
      doMatch(first, { card: card, el: el });
    } else {
      doMiss(first, { card: card, el: el });
    }
  }

  async function doMatch(a, b) {
    state.locked = true;
    const word = a.card.kind === 'en' ? a.card.word : b.card.word;

    state.matched++;
    state.combo++;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    state.score += 10 + Math.min(state.combo - 1, 5) * 4;
    state.lastPair = word;

    // 消除：更强的震动反馈
    Haptics.match();
    Sound.match();
    speak(word.en);

    a.el.classList.remove('selected');
    a.el.classList.add('cleared');
    b.el.classList.add('cleared');
    sparkle(a.el); sparkle(b.el);
    showLastMatch(word);
    updateHud();

    // 答对：如果是错题本里的词，错题次数 -1；减到 0 就表示掌握了。
    // 注意：同一轮里先错过、后来又配对成功的不算掌握（不然错题本一局就清空了），
    // 必须下一轮/重练时一次配对成功才会减。
    if (!state.roundWrongKeys.has(word.key)) {
      if (markRight(word.key)) toast('🎉 已掌握「' + word.en + '」，自动移出错题本');
    }

    await wait(440);
    [a.el, b.el].forEach(el => { el.classList.remove('cleared', 'selected'); el.classList.add('gone'); });
    state.selected = null;
    state.locked = false;

    if (state.matched >= state.totalPairs) completeRound();
  }

  function doMiss(a, b) {
    state.locked = true;
    state.wrong++;
    state.combo = 0;
    Haptics.error();
    Sound.error();
    // 选中的那张 + 刚点的那张，两个词都记进错题本
    const k1 = a.card.pairKey, k2 = b.card.pairKey;
    state.roundWrongKeys.add(k1);
    state.roundWrongKeys.add(k2);
    markWrong(k1);
    markWrong(k2);
    b.el.classList.add('wrong', 'selected');
    a.el.classList.add('wrong');
    updateHud();
    setTimeout(() => {
      a.el.classList.remove('wrong', 'selected');
      b.el.classList.remove('wrong', 'selected');
      state.selected = null;
      state.locked = false;
      updateHud();
    }, 420);
  }

  function sparkle(el) {
    const r = el.getBoundingClientRect();
    const colors = ['#ff9ec7', '#ffd76e', '#8fd3ff', '#8ee6a8', '#c9a7ff'];
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.style.left = (r.left + r.width / 2) + 'px';
      s.style.top = (r.top + r.height / 2) + 'px';
      s.style.background = colors[i % colors.length];
      const ang = Math.random() * Math.PI * 2, dist = 34 + Math.random() * 46;
      s.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 640);
    }
  }

  /* ---------------- 打乱 ---------------- */
  function reshuffleRemaining() {
    if (state.locked) return;
    const freeIdx = [], freeCards = [];
    state.cards.forEach((c, i) => {
      const el = state.elMap.get(c.id);
      if (el && !el.classList.contains('gone')) { freeIdx.push(i); freeCards.push(c); }
    });
    if (freeCards.length < 2) return;
    const mixed = shuffle(freeCards);
    freeIdx.forEach((idx, k) => { state.cards[idx] = mixed[k]; });
    state.selected = null;
    renderBoard();
    Haptics.tap(); Sound.tap();
    const board = $('#board');
    board.animate ? board.animate([{ opacity: .35, transform: 'scale(.97)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 260, easing: 'ease-out' }) : null;
    toast('🔀 已打乱顺序');
  }

  /* ---------------- 计时 / HUD ---------------- */
  function startTimer() {
    clearInterval(state.timer);
    state.startedAt = Date.now();
    state.elapsed = 0;
    state.timer = setInterval(() => {
      state.elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
      $('#statTime').textContent = fmtTime(state.elapsed);
    }, 500);
    $('#statTime').textContent = '0:00';
  }
  function stopTimer() {
    clearInterval(state.timer);
    state.timer = null;
    state.elapsed = Math.floor((Date.now() - state.startedAt) / 1000);
  }
  function fmtTime(s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

  function updateHud() {
    const total = state.totalPairs || 0;
    const cleared = state.matched || 0;
    const label = state.poolLabel || unitLabel(settings.unit);
    $('#tbTitle').textContent = label + ' · 第 ' + (state.roundIndex || 1) + ' 轮';
    $('#tbSub').textContent = '剩余 ' + Math.max(0, total - cleared) + ' 对（共 ' + total + ' 对）';
    $('#statCombo').textContent = '×' + state.combo;
    $('#statScore').textContent = state.score;
    const pct = total ? Math.round(cleared / total * 100) : 0;
    $('#progressBar').style.width = pct + '%';
  }
  function showLastMatch(w) {
    const el = $('#lastMatch');
    if (!el) return;
    el.innerHTML = '<span class="lm-k">刚消除</span><b class="lm-en">' + escapeHtml(w.en) + '</b><span class="lm-dash">—</span><span class="lm-zh">' + escapeHtml(w.zh) + '</span>';
    el.classList.add('show');
  }

  /* ---------------- 结算 ---------------- */
  function completeRound() {
    stopTimer();
    Haptics.win();
    Sound.win();
    const accTotal = state.matched + state.wrong;
    const acc = accTotal ? Math.round(state.matched / accTotal * 100) : 100;
    const wrongN = state.roundWrongKeys.size;
    $('#resTime').textContent = fmtTime(state.elapsed);
    $('#resCombo').textContent = '×' + state.maxCombo;
    $('#resScore').textContent = state.score;
    $('#resAcc').textContent = acc + '%';
    $('#sheetEmoji').textContent = acc === 100 ? '🌟' : (acc >= 70 ? '🎉' : '💪');
    $('#sheetTitle').textContent = acc === 100 ? '完美通关！' : '本轮完成！';
    let sub = acc === 100 ? '一个都没错，太厉害啦～' : '记不住的多点几次就记住啦～';
    if (wrongN) sub += '（本轮错过的 ' + wrongN + ' 个词已自动进错题本）';
    $('#sheetSub').textContent = sub;
    // 📖 顺序模式：位置往后推进一段（下次进来接着往下走，不用重头做）
    const orderMsg = advanceOrderPos();
    if (orderMsg) $('#sheetSub').textContent += ' · ' + orderMsg;

    const retry = $('#btnRetryWrong');
    if (retry) {
      if (wrongN) {
        retry.hidden = false;
        retry.textContent = '❌ 重练本轮的 ' + wrongN + ' 个错词';
      } else {
        retry.hidden = true;
      }
    }

    // 打卡：今天的第一轮 = 打卡成功
    const firstToday = recordCheckin(state.totalPairs, state.elapsed);
    const sc = $('#sheetCheckin');
    if (sc) {
      const st = streakNow();
      const tot = checkin.total.rounds;
      if (firstToday) {
        sc.innerHTML = '🎉 今天打卡成功！连续 <b>' + st + '</b> 天 · 累计第 <b>' + tot + '</b> 次复习' +
          (st > 1 ? '，继续保持 🔥' : '');
        sc.classList.add('show');
        setTimeout(() => { Haptics.fire('win'); Sound.tone(1568, 0.22, 'triangle', 0.07); }, 320);
      } else {
        const rec = todayRec();
        sc.innerHTML = '📅 今天已打卡 · 今天第 <b>' + (rec ? rec.rounds : 1) + '</b> 次 · 连续 <b>' + st +
          '</b> 天 · 累计第 <b>' + tot + '</b> 次';
        sc.classList.add('show');
      }
    }

    setTimeout(() => {
      if ($('#screen-game').classList.contains('is-active')) $('#overlay').classList.add('show');
    }, 260);
  }

  /* ===========================================================
   *  生词本 / 错题本页面
   * =========================================================== */
  let bookTab = 'all';
  let clearArmed = 0;

  function renderBook() {
    const keys = bookKeysOf(bookTab);
    $$('#bookTabs .chip').forEach(c => c.classList.toggle('on', c.dataset.tab === bookTab));
    syncCounts();
    $('#bookSub').textContent = '共 ' + keys.length + ' 个词';
    const btn = $('#btnPractice');
    btn.textContent = keys.length ? ('开始练习这 ' + keys.length + ' 个词') : '还没有可练习的词';
    btn.disabled = !keys.length;

    const list = $('#bookList');
    if (!keys.length) {
      const tip = bookTab === 'star'
        ? ['⭐', '生词本还是空的', '游戏里<b>长按卡片</b>就能把那个词收藏进来']
        : bookTab === 'wrong'
          ? ['❌', '错题本是空的', '玩的时候点错的词会<b>自动</b>记到这里；<br>答对一次就减一次，掌握后自动移出']
          : ['📖', '这里还空空的', '点错的词会自动进错题本；<br>长按卡片可以手动收藏进生词本'];
      list.innerHTML = '<div class="book-empty"><span class="big">' + tip[0] + '</span><b>' + tip[1] + '</b><br>' + tip[2] + '</div>';
      return;
    }

    const map = wordMap();
    list.innerHTML = keys.map(k => {
      const w = map.get(k);
      if (!w) return '';
      const n = wrongCount(k), st = isStarred(k);
      return '<div class="book-item' + (st ? ' is-star' : '') + (n ? ' is-wrong' : '') + '" data-key="' + k + '">' +
        '<div class="bi-main" data-act="speak">' +
          '<div class="bi-top"><span class="bi-en">' + escapeHtml(w.en) + '</span>' +
          '<span class="bi-no">' + w.unit + ' · ' + String(w.no).padStart(3, '0') + '</span></div>' +
          '<span class="bi-zh">' + highlightPos(w.zh) + '</span>' +
          '<div class="bi-badges">' +
            (n ? '<span class="badge wrong">错 ' + n + ' 次</span>' : '') +
            (st ? '<span class="badge star">⭐ 已收藏</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="bi-actions">' +
          '<button class="mini-btn' + (st ? ' on' : '') + '" data-act="star" aria-label="收藏">⭐</button>' +
          '<button class="mini-btn del" data-act="del" aria-label="移出">✕</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* ---------------- 轻提示 ---------------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1900);
  }

  /* ===========================================================
   *  页面切换 & 事件绑定
   * =========================================================== */
  function show(screen) {
    $$('.screen').forEach(s => s.classList.remove('is-active'));
    $('#' + screen).classList.add('is-active');
    if (screen === 'screen-game') window.scrollTo(0, 0);
  }

  function syncMenu() {
    renderUnitChips();
    syncCheckinCard();
    syncCounters();
    $$('#sizeChips .chip').forEach(c => c.classList.toggle('on', +c.dataset.size === settings.size));
    $$('#modeChips .chip').forEach(c => c.classList.toggle('on', c.dataset.mode === settings.mode));
    $('#swHaptics').checked = settings.haptics;
    $('#swSound').checked = settings.sound;
    $('#swSpeak').checked = settings.speak;
    $('#swPos').checked = settings.pos;
    const n = totalWords();
    $('#totalWords').textContent = n;
    $('#bankHint').textContent = '共 ' + n + ' 词（' + UNITS.length + ' 个单元）';
    syncCounts();
    // 选中的是生词本/错题本时，提示还有多少词
    if (settings.unit === 'STAR' || settings.unit === 'WRONG') {
      const c = buildPool(settings.unit).length;
      $('#bankHint').textContent = settings.unit === 'STAR' ? ('⭐ 生词本里有 ' + c + ' 个词') : ('❌ 错题本里有 ' + c + ' 个词');
    }
    $('#hapticNote').textContent = canVibrate
      ? '📳 当前设备支持真实震动：点词轻震，配对消除重震。'
      : (isIOS
        ? '📳 iPhone / iPad 的浏览器不开放系统震动接口，已用「低频触感音 + 果冻回弹」模拟；装到安卓或套个原生壳就有真震动。'
        : '📳 当前浏览器不支持震动接口，已用「低频触感音 + 果冻回弹」代替。');
    syncOrderUI();
  }

  /* ---------------- 菜单：单元按钮（按词库自动生成） ---------------- */
  function renderUnitChips() {
    const box = $('#unitChips');
    if (!box) return;
    box.innerHTML =
      UNITS.map(u => '<button class="chip" data-unit="' + u + '">' + u + '</button>').join('') +
      '<button class="chip" data-unit="ALL">全部</button>' +
      '<button class="chip chip-special" data-unit="WRONG">❌ 错题本 <b class="cnt" id="cntWrong">0</b></button>' +
      '<button class="chip chip-special" data-unit="STAR">⭐ 生词本 <b class="cnt" id="cntStar">0</b></button>';
    $$('#unitChips .chip').forEach(c => c.classList.toggle('on', c.dataset.unit === settings.unit));
  }

  function bind() {
    // 词库 / 对数 / 模式
    $('#unitChips').addEventListener('click', e => {
      const c = e.target.closest('.chip'); if (!c) return;
      settings.unit = c.dataset.unit; saveSettings(); syncMenu(); Haptics.tap(); Sound.tap();
    });
    $('#sizeChips').addEventListener('click', e => {
      const c = e.target.closest('.chip'); if (!c) return;
      settings.size = +c.dataset.size; saveSettings(); syncMenu(); Haptics.tap(); Sound.tap();
    });
    $('#modeChips').addEventListener('click', e => {
      const c = e.target.closest('.chip'); if (!c) return;
      settings.mode = c.dataset.mode; saveSettings(); syncMenu(); Haptics.tap(); Sound.tap();
    });

    // 📖 顺序模式：菜单上的位置提示里「回到开头 / 跳到下一段」
    if ($('#orderNote')) $('#orderNote').addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const total = buildPool(settings.unit).length;
      if (!total) { toast('这个词库是空的'); return; }
      Haptics.tap(); Sound.tap();
      if (b.dataset.act === 'reset') {
        orderPos[settings.unit] = 0;
        saveOrderPos();
        syncMenu();
        toast('📖 已回到第 1 词');
        return;
      }
      const page = orderPageSize(total);
      let cur = orderPosOf(settings.unit, total) + page;
      if (cur >= total) cur = 0;
      orderPos[settings.unit] = cur;
      saveOrderPos();
      syncMenu();
      toast('⏭ 下次从第 ' + (cur + 1) + ' 词开始');
    });

    // 开关
    $('#swHaptics').addEventListener('change', e => {
      settings.haptics = e.target.checked; Haptics.enabled = settings.haptics;
      saveSettings(); if (settings.haptics) Haptics.tap();
    });
    $('#swSound').addEventListener('change', e => {
      settings.sound = e.target.checked; Sound.enabled = settings.sound;
      saveSettings(); Sound.unlock(); if (settings.sound) Sound.tap();
    });
    $('#swSpeak').addEventListener('change', e => { settings.speak = e.target.checked; saveSettings(); });
    $('#swPos').addEventListener('change', e => { settings.pos = e.target.checked; saveSettings(); });

    // 开始
    $('#btnStart').addEventListener('click', () => {
      Sound.unlock();
      Haptics.tap();
      startNormalRound();
      maybeShowLongPressHint();
    });

    // 打卡
    if ($('#checkinCard')) {
      $('#checkinCard').addEventListener('click', () => { Haptics.tap(); Sound.unlock(); openCheckin(); });
      $('#btnCheckinBack').addEventListener('click', () => { Haptics.tap(); show('screen-menu'); syncMenu(); });
      $('#ckGrid').addEventListener('click', e => {
        const c = e.target.closest('.ck-cell'); if (!c || c.disabled) return;
        const k = c.dataset.day, d = checkin.days[k];
        Haptics.tap(); Sound.tap();
        const p = k.split('-');
        const label = Number(p[1]) + '月' + Number(p[2]) + '日';
        toast(d
          ? (label + '：' + d.rounds + ' 轮 · ' + d.words + ' 个词 · ' + Math.max(1, Math.round(d.secs / 60)) + ' 分钟')
          : (label + '：没有打卡 😴'));
      });
    }

    // 游戏页按钮
    $('#btnBack').addEventListener('click', () => { Haptics.tap(); stopTimer(); show('screen-menu'); syncMenu(); });
    $('#btnHome').addEventListener('click', () => { Haptics.tap(); stopTimer(); $('#overlay').classList.remove('show'); show('screen-menu'); syncMenu(); });
    $('#btnShuffle').addEventListener('click', reshuffleRemaining);
    $('#btnRestart').addEventListener('click', () => { Haptics.tap(); restartRound(); toast('↻ 已重开本轮'); });

    // 📖 顺序模式：往后翻 / 往前翻一段（不用把前面的词做完才能轮到后面的）
    if ($('#btnNextSeg')) $('#btnNextSeg').addEventListener('click', () => { Haptics.tap(); Sound.tap(); flipSegment(1); });
    if ($('#btnPrevSeg')) $('#btnPrevSeg').addEventListener('click', () => { Haptics.tap(); Sound.tap(); flipSegment(-1); });

    // 结算浮层
    $('#btnNext').addEventListener('click', () => { Haptics.tap(); $('#overlay').classList.remove('show'); startRound(); });
    $('#btnMenu2').addEventListener('click', () => { Haptics.tap(); $('#overlay').classList.remove('show'); stopTimer(); show('screen-menu'); syncMenu(); });
    $('#btnRetryWrong').addEventListener('click', () => {
      const keys = [...state.roundWrongKeys];
      Haptics.tap();
      $('#overlay').classList.remove('show');
      startCustomRound(keys, '❌ 错题重练');
    });

    // 生词本 / 错题本
    const openBook = (tab) => {
      if (tab) bookTab = tab;
      clearArmed = 0;
      renderBook();
      show('screen-book');
    };
    if ($('#btnBook')) $('#btnBook').addEventListener('click', () => { Haptics.tap(); openBook(); });
    $('#btnBookBack').addEventListener('click', () => { Haptics.tap(); show('screen-menu'); syncMenu(); });
    $('#bookTabs').addEventListener('click', e => {
      const c = e.target.closest('.chip'); if (!c) return;
      bookTab = c.dataset.tab; clearArmed = 0;
      Haptics.tap(); Sound.tap();
      renderBook();
    });
    $('#bookList').addEventListener('click', e => {
      const item = e.target.closest('.book-item'); if (!item) return;
      const key = item.dataset.key;
      const act = e.target.closest('[data-act]') ? e.target.closest('[data-act]').dataset.act : 'speak';
      if (act === 'star') {
        const on = toggleStar(key);
        Haptics.tap(); Sound.tap();
        renderBook();
        toast(on ? '⭐ 已收藏' : '已取消收藏');
        return;
      }
      if (act === 'del') {
        removeFromBook(key);
        Haptics.tap(); Sound.tap();
        renderBook();
        toast('已移出（当作已掌握了 👍）');
        return;
      }
      const w = wordByKey(key);
      if (w) { Haptics.tap(); Sound.tap(); speak(w.en); }
    });
    $('#btnBookClear').addEventListener('click', () => {
      const n = bookKeysOf(bookTab).length;
      if (!n) { toast('这里本来就是空的'); return; }
      const name = bookTab === 'star' ? '收藏' : bookTab === 'wrong' ? '错题记录' : '全部记录';
      if (!clearArmed) {
        clearArmed = Date.now();
        Haptics.tap();
        toast('再点一次「🗑️」就会清空' + n + '条' + name);
        return;
      }
      clearArmed = 0;
      if (bookTab === 'all') { progress.wrong = {}; progress.star = {}; }
      else if (bookTab === 'star') progress.star = {};
      else progress.wrong = {};
      saveProgress(); syncCounts(); renderBook();
      Haptics.error();
      toast('已清空' + n + '条' + name);
    });
    $('#btnPractice').addEventListener('click', () => {
      const keys = bookKeysOf(bookTab);
      Haptics.tap();
      startCustomRound(keys, bookTab === 'wrong' ? '❌ 错题重练' : bookTab === 'star' ? '⭐ 生词本练习' : '📖 生词练习');
    });

    // 牌面点击（事件委托）
    const board = $('#board');
    board.addEventListener('pointerdown', e => {
      const c = e.target.closest('.card'); if (!c) return;
      if (c.classList.contains('gone')) return;
      jelly(c);
      Sound.unlock();
      markLongPressOrigin(e);
      startLongPress(c);
    }, { passive: true });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev =>
      board.addEventListener(ev, cancelLongPress, { passive: true }));
    board.addEventListener('pointermove', cancelLongPress, { passive: true });
    board.addEventListener('click', e => {
      const c = e.target.closest('.card'); if (!c) return;
      onCardTap(c);
    });
  }

  /* ---------------- 长按收藏 ---------------- */
  let longPressTimer = null, longPressFired = false, longPressFrom = null;
  function startLongPress(el) {
    cancelLongPress();
    longPressFired = false;
    longPressFrom = null;
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      longPressFired = true;
      const card = state.cards.find(c => c.id === el.dataset.id);
      if (!card) return;
      const on = toggleStar(card.pairKey);
      el.classList.toggle('starred', on);
      Haptics.match();
      toast(on ? ('⭐ 已加入生词本：' + card.word.en) : ('已从生词本移除：' + card.word.en));
    }, 500);
  }
  function cancelLongPress(e) {
    // 手指轻微抖动不算移动，超过 12px 才取消长按
    if (e && e.type === 'pointermove' && longPressFrom) {
      const dx = e.clientX - longPressFrom.x, dy = e.clientY - longPressFrom.y;
      if (dx * dx + dy * dy < 144) return;
    }
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  function markLongPressOrigin(e) {
    longPressFrom = { x: e.clientX, y: e.clientY };
  }

  function maybeShowLongPressHint() {
    const HK = 'enMatch.hint.v1';
    try {
      if (localStorage.getItem(HK)) return;
      localStorage.setItem(HK, '1');
    } catch (e) { return; }
    setTimeout(() => toast('小提示：长按卡片可以 ⭐ 收藏进生词本'), 1600);
  }

  /* ---------------- 初始化 ---------------- */
  function init() {
    Haptics.enabled = settings.haptics;
    Sound.enabled = settings.sound;
    Haptics.bridge = window.nativeHaptics || null;
    bind();
    syncMenu();
    syncCounts();
    // 首次触摸时唤醒音频（iOS 限制）
    window.addEventListener('pointerdown', () => Sound.unlock(), { once: true });
    if (!UNITS.length) {
      $('#bankHint').textContent = '⚠️ 没读到词库，请检查 words.js';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
