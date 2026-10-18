/* ============================================================
 *  study.js — 学习中心逻辑
 *  三个模块：中医基础理论（卡片背诵）/ 英语语法卡片 / 改错找错练习
 *  纯原生 JS，无依赖，全部离线可用
 *
 *  中医背诵功能：
 *   · 自测模式（先遮答案，点开再对）
 *   · 「我背下来了」标记 + 章节进度 + 首页总进度
 *   · 随机抽卡 / 原文专项 / 只背没背过的
 * ============================================================ */
(function () {
  'use strict';

  var TCM = window.TCM_DATA || { chapters: [] };
  var GR = window.GRAMMAR_DATA || { chapters: [] };
  var ER = window.ERROR_DATA || { chapters: [] };

  var $ = function (s) { return document.querySelector(s); };
  var state = { tab: null, chap: null, qi: 0, answered: false, ctx: null, view: 'chapter' };

  /* ---------------- 本地存储 ---------------- */
  var MKEY = 'study.tcm.memo.v1';     // 背诵标记
  var SKEY = 'study.selftest.v1';     // 自测模式开关

  var memo = {};
  try { memo = JSON.parse(localStorage.getItem(MKEY)) || {}; } catch (e) { memo = {}; }
  function saveMemo() { try { localStorage.setItem(MKEY, JSON.stringify(memo)); } catch (e) {} }

  var selfTest = false;
  try { selfTest = localStorage.getItem(SKEY) === '1'; } catch (e) { selfTest = false; }
  function saveSelfTest() { try { localStorage.setItem(SKEY, selfTest ? '1' : '0'); } catch (e) {} }

  /* ---------------- 练习次数统计 ---------------- */
  var STKEY = 'study.stats.v1';
  var stats = {
    tcm:  { t: 0, n: 0 },          // t=练习次数   n=累计看过的张数
    gram: { t: 0, n: 0 },          // t=练习次数   n=累计看过的条数
    err:  { t: 0, n: 0, ok: 0 },   // t=答完的题数 n=同上  ok=答对
    since: 0
  };
  try {
    var s0 = JSON.parse(localStorage.getItem(STKEY));
    if (s0 && typeof s0 === 'object') {
      ['tcm', 'gram', 'err'].forEach(function (k) {
        if (s0[k]) {
          stats[k].t = s0[k].t | 0;
          stats[k].n = s0[k].n | 0;
          if (k === 'err') stats[k].ok = s0[k].ok | 0;
        }
      });
      stats.since = s0.since | 0;
    }
  } catch (e) { /* 忽略 */ }

  function saveStats() { try { localStorage.setItem(STKEY, JSON.stringify(stats)); } catch (e) {} }

  /* 一次「练习」＝ 打开一组内容且看到至少 1 张 / 答完 1 题 */
  var sess = null;
  function beginSession(mod) {
    commitSession();
    sess = { mod: mod, max: 0 };
  }
  function noteSeen(i) {
    if (sess && i > sess.max) sess.max = i;
  }
  function commitSession() {
    if (!sess) return;
    if (sess.max > 0 && stats[sess.mod]) {
      stats[sess.mod].t += 1;
      stats[sess.mod].n += sess.max;
      if (!stats.since) stats.since = Date.now();
      saveStats();
    }
    sess = null;
  }

  /* ---------------- 工具 ---------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function buzz(kind) {
    if (!navigator.vibrate) return;
    try {
      if (kind === 'ok') navigator.vibrate([18, 45, 70]);
      else if (kind === 'bad') navigator.vibrate([14, 30, 14]);
      else navigator.vibrate(10);
    } catch (e) { /* 忽略 */ }
  }
  function show(id) {
    var scr = document.querySelectorAll('.screen');
    for (var i = 0; i < scr.length; i++) scr[i].classList.remove('active');
    var el = document.getElementById(id);
    if (el) { el.classList.add('active'); el.scrollTop = 0; }
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------------- 中医卡片索引 ---------------- */
  function cardKey(chapId, secIdx, ci) { return chapId + '/' + secIdx + '/' + ci; }

  function allTcmCards() {
    var out = [];
    TCM.chapters.forEach(function (chap) {
      chap.sections.forEach(function (sec, si) {
        sec.cards.forEach(function (cd, ci) {
          out.push({
            key: cardKey(chap.id, si, ci),
            badge: cd.t, q: cd.q, a: cd.a,
            secTitle: sec.title, chapTitle: chap.title
          });
        });
      });
    });
    return out;
  }
  function totalTcm() { return allTcmCards().length; }
  function memoCount() {
    var n = 0;
    for (var k in memo) if (memo[k]) n++;
    return n;
  }

  /* ---------------- 首页 ---------------- */
  function initHome() {
    var t = totalTcm(), m = memoCount();
    $('#cnt-tcm').textContent = TCM.chapters.length + ' 章 · ' + t + ' 张卡 · 已背 ' +
      m + '（' + Math.round(m / t * 100) + '%）';
    $('#cnt-gram').textContent = GR.chapters.length + ' 章 · ' +
      GR.chapters.reduce(function (a, c) { return a + c.items.length; }, 0) + ' 条规则';
    $('#cnt-err').textContent = ER.chapters.length + ' 类考点 · ' +
      ER.chapters.reduce(function (a, c) { return a + c.items.length; }, 0) + ' 道题';

    var e = TCM.meta && TCM.meta.edition;
    var cf = TCM.meta && TCM.meta.confirmed;
    if (e) {
      $('#edition-note').innerHTML =
        (cf ? '<b style="color:#c0568f">✅ ' + esc(cf) + '</b><br><br>' : '') +
        '<b>' + esc(e.main) + '</b><br>' + esc(e.mainNote) +
        '<br><br>' + esc(e.undergrad) +
        '<br>' + esc(e.next) +
        '<br><br>⚠ ' + esc(e.warn);
    }
  }

  /* 各模块自己页面里的练习统计条 */
  function renderModStats(tab) {
    var box = $('#list-stats');
    if (!box) return;
    if (!tab) { box.hidden = true; box.innerHTML = ''; return; }

    var html = '';
    if (tab === 'tcm') {
      html = '<span class="ms-sub">累计 ' + stats.tcm.n + ' 张 · 已背 ' + memoCount() + '/' + totalTcm() + '</span>';
    } else if (tab === 'gram') {
      html = '<span class="ms-sub">累计 ' + stats.gram.n + ' 条</span>';
    } else {
      var r = stats.err.t > 0 ? Math.round(stats.err.ok / stats.err.t * 100) : 0;
      html = '<span class="ms-sub">答对 ' + stats.err.ok + ' 题（正确率 ' + r + '%）</span>';
    }
    html += '<button class="ms-reset" data-reset="mod" data-mod="' + tab + '">清零</button>';
    box.innerHTML = html;
    box.hidden = false;
  }

  /* ---------------- 目录页 ---------------- */
  function openList(tab) {
    commitSession();
    state.tab = tab;
    var title = '', sub = '', searchable = false, tools = false;

    if (tab === 'tcm') {
      title = '🀄 中医基础理论';
      sub = '陈建章第三版';
      searchable = true;
      tools = true;
    } else if (tab === 'gram') {
      title = '📐 英语语法卡片';
      sub = '河南改错 12 类考点';
    } else {
      title = '🔍 改错找错练习';
      sub = '改错 20 分 · 10 题';
    }

    $('#list-title').textContent = title;
    $('#list-sub').textContent = sub;
    $('#list-search-wrap').hidden = !searchable;
    $('#search-input').value = '';
    $('#btnSelfTest').hidden = (tab !== 'tcm');
    renderBadge(tab);
    renderModStats(tab);
    renderTools(tools);
    renderList('');
    show('scr-list');
  }

  /* 页头右侧：醒目的累计练习次数徽标 */
  function renderBadge(tab) {
    var box = $('#list-badge');
    if (!box) return;
    if (!tab) { box.hidden = true; box.innerHTML = ''; return; }
    var lab = '累计练习', num = 0, unit = '次';
    if (tab === 'tcm') { num = stats.tcm.t; }
    else if (tab === 'gram') { num = stats.gram.t; }
    else { lab = '累计答题'; num = stats.err.t; unit = '题'; }
    box.innerHTML =
      '<span class="hb-lab">' + lab + '</span>' +
      '<b class="hb-num">' + num + '</b>' +
      '<span class="hb-unit">' + unit + '</span>';
    box.hidden = false;
  }

  function renderTools(on) {
    var box = $('#list-tools');
    if (!on) { box.hidden = true; box.innerHTML = ''; return; }
    var rest = totalTcm() - memoCount();
    box.hidden = false;
    box.innerHTML =
      '<button class="tool-btn" data-tool="random">🎲 随机抽 20 张</button>' +
      '<button class="tool-btn" data-tool="todo">🔁 只背没背的（' + rest + '）</button>' +
      '<button class="tool-btn" data-tool="yuanwen">📜 必背原文（' + yuanwenCount() + '）</button>' +
      '<button class="tool-btn" data-tool="reset">♻ 清空进度</button>';
  }

  function yuanwenCount() {
    return allTcmCards().filter(function (c) { return c.badge === '原文'; }).length;
  }

  function renderList(keyword) {
    var body = $('#list-body');
    var kw = (keyword || '').trim().toLowerCase();

    /* 搜索模式：中医跨章检索 */
    if (kw && state.tab === 'tcm') {
      var hits = [];
      TCM.chapters.forEach(function (c) {
        c.sections.forEach(function (sec) {
          sec.cards.forEach(function (cd) {
            var hay = (cd.q + ' ' + cd.a).toLowerCase();
            if (hay.indexOf(kw) >= 0) hits.push({ chap: c.title, sec: sec.title, cd: cd });
          });
        });
      });
      if (!hits.length) { body.innerHTML = '<div class="empty">没有找到「' + esc(keyword) + '」，换个词试试</div>'; return; }
      body.innerHTML = hits.map(function (h) {
        return '<div class="hit">' +
          '<div class="hit-src">' + esc(h.chap) + ' · ' + esc(h.sec) + ' · ' + esc(h.cd.t) + '</div>' +
          '<div class="hit-q">' + esc(h.cd.q) + '</div>' +
          '<div class="hit-a">' + esc(h.cd.a) + '</div>' +
          '</div>';
      }).join('');
      body.scrollTop = 0;
      return;
    }

    var list = state.tab === 'tcm' ? TCM.chapters : (state.tab === 'gram' ? GR.chapters : ER.chapters);
    body.innerHTML = list.map(function (c, i) {
      var html, n, unit;

      if (state.tab === 'tcm') {
        var cards = [];
        c.sections.forEach(function (sec, si) {
          sec.cards.forEach(function (cd, ci) { cards.push(cardKey(c.id, si, ci)); });
        });
        n = cards.length;
        var done = cards.filter(function (k) { return memo[k]; }).length;
        var pct = n ? Math.round(done / n * 100) : 0;
        html = '<div class="chap" data-idx="' + i + '">' +
          '<div class="chap-t">' + esc(c.title) +
          (c.ver ? '<div class="chap-ver">' + esc(c.ver) + '</div>' : '') +
          '<div class="chap-bar"><span style="width:' + pct + '%"></span></div>' +
          '</div>' +
          '<div class="chap-n">' + done + '/' + n + '</div>' +
          '<div class="chap-arrow">›</div>' +
          '</div>';
      } else {
        n = c.items.length;
        unit = state.tab === 'err' ? ' 题' : ' 条';
        html = '<div class="chap" data-idx="' + i + '">' +
          '<div class="chap-t">' + esc(c.title) + '</div>' +
          '<div class="chap-n">' + n + unit + '</div>' +
          '<div class="chap-arrow">›</div>' +
          '</div>';
      }
      return html;
    }).join('');
    body.scrollTop = 0;
  }

  /* ---------------- 卡片渲染（中医 / 语法共用） ---------------- */
  var _io = null;

  function openCards(chapIdx) {
    var isTcm = state.tab === 'tcm';
    var chap = isTcm ? TCM.chapters[chapIdx] : GR.chapters[chapIdx];
    state.chap = chapIdx;
    state.view = 'chapter';
    $('#cards-title').textContent = chap.title;
    $('#btnSelfTest').hidden = !isTcm;

    if (isTcm) {
      var items = [];
      chap.sections.forEach(function (sec, si) {
        sec.cards.forEach(function (cd, ci) {
          items.push({
            key: cardKey(chap.id, si, ci),
            badge: cd.t, q: cd.q, a: cd.a, secTitle: sec.title
          });
        });
      });
      renderTcmCards(items);
    } else {
      beginSession('gram');
      renderGramCards(chap);
    }
    show('scr-cards');
  }

  function renderTcmCards(items) {
    beginSession('tcm');
    var body = $('#cards-body');
    if (!items.length) {
      body.innerHTML = '<div class="empty">这里没有卡片</div>';
      $('#card-pos').textContent = '0 / 0';
      $('#card-memo').textContent = '';
      sess = null;
      return;
    }
    body.innerHTML = items.map(function (it, i) {
      var masked = selfTest ? ' masked' : '';
      var known = memo[it.key] ? ' known' : '';
      return '<div class="card' + masked + known + '" data-card="' + (i + 1) + '" data-key="' + esc(it.key) + '">' +
        '<div class="card-top">' +
        '<span class="card-badge t-' + esc(it.badge) + '">' + esc(it.badge) + '</span>' +
        '<button class="memo-btn" data-memo="' + esc(it.key) + '">' + (memo[it.key] ? '✅ 已背' : '☐ 我背下来了') + '</button>' +
        '</div>' +
        '<div class="card-q">' + esc(it.q) + '</div>' +
        '<div class="card-ans-wrap">' +
        '<div class="card-a">' + esc(it.a) + '</div>' +
        '<div class="reveal-hint">👆 点一下看答案</div>' +
        '</div>' +
        '</div>';
    }).join('');
    body.scrollTop = 0;
    updateMemoStat(items);
    observeCards();
  }

  function renderGramCards(chap) {
    var body = $('#cards-body');
    var items = chap.items.map(function (it, i) {
      return '<div class="card" data-card="' + (i + 1) + '">' +
        '<span class="card-badge">' + esc(it.t || '规则') + '</span>' +
        (it.rule ? '<div class="gram-rule">' + esc(it.rule) + '</div>' : '') +
        (it.list && it.list.length
          ? '<ul class="gram-list">' + it.list.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'
          : '') +
        (it.trick ? '<div class="gram-trick">' + esc(it.trick) + '</div>' : '') +
        '</div>';
    }).join('');
    body.innerHTML = items;
    body.scrollTop = 0;
    $('#card-memo').textContent = chap.items.length + ' 张';
    observeCards();
  }

  function updateMemoStat(items) {
    var done = 0;
    for (var i = 0; i < items.length; i++) if (memo[items[i].key]) done++;
    $('#card-memo').textContent = '已背 ' + done + ' / ' + items.length;
  }

  function observeCards() {
    var body = $('#cards-body');
    var cards = body.querySelectorAll('.card[data-card]');
    if (!cards.length) { $('#card-pos').textContent = '0 / 0'; return; }
    $('#card-pos').textContent = '1 / ' + cards.length;
    noteSeen(1);
    if (_io) { try { _io.disconnect(); } catch (e) {} _io = null; }
    if (!('IntersectionObserver' in window)) { noteSeen(cards.length); return; }

    _io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var idx = +en.target.getAttribute('data-card');
          $('#card-pos').textContent = idx + ' / ' + cards.length;
          noteSeen(idx);
        }
      });
    }, { root: body, threshold: 0.6 });
    cards.forEach(function (c) { _io.observe(c); });
  }

  /* ---------------- 虚拟卡片集（随机 / 原文 / 未背） ---------------- */
  function openVirtual(kind) {
    var all = allTcmCards();
    var list, title;
    if (kind === 'random') {
      list = shuffle(all.slice()).slice(0, 20);
      title = '🎲 随机抽查（20 张）';
    } else if (kind === 'yuanwen') {
      list = all.filter(function (c) { return c.badge === '原文'; });
      title = '📜 必背原文（' + list.length + ' 张）';
    } else {
      list = all.filter(function (c) { return !memo[c.key]; });
      title = '🔁 还没背下来的（' + list.length + ' 张）';
    }
    state.view = kind;
    $('#cards-title').textContent = title;
    $('#btnSelfTest').hidden = false;
    if (!list.length) {
      $('#cards-body').innerHTML =
        '<div class="empty">' + (kind === 'todo' ? '🎉 全部 237 张都背过了，去随机抽查巩固吧' : '这里没有卡片') + '</div>';
      $('#card-pos').textContent = '0 / 0';
      $('#card-memo').textContent = '';
      show('scr-cards');
      return;
    }
    renderTcmCards(list);
    show('scr-cards');
  }

  /* ---------------- 改错答题 ---------------- */
  function openQuiz(chapIdx) {
    state.chap = chapIdx;
    state.qi = 0;
    $('#quiz-title').textContent = ER.chapters[chapIdx].title;
    renderQuiz();
    show('scr-quiz');
  }

  function tokenize(s) {
    var out = [], re = /\S+/g, m;
    while ((m = re.exec(s))) out.push({ text: m[0], start: m.index, end: m.index + m[0].length });
    return out;
  }

  function renderQuiz() {
    var chap = ER.chapters[state.chap];
    var it = chap.items[state.qi];
    state.answered = false;

    $('#quiz-pos').textContent = (state.qi + 1) + ' / ' + chap.items.length;
    $('#quiz-answer').hidden = true;
    $('#btn-next').hidden = true;
    $('#btn-noerror').disabled = false;
    $('#btn-skip').disabled = false;

    var s = it.s;
    var hasError = it.at !== '（无需改动）' && s.indexOf(it.at) >= 0;
    var spanStart = hasError ? s.indexOf(it.at) : -1;
    var spanEnd = hasError ? spanStart + it.at.length : -1;

    var toks = tokenize(s);
    state.ctx = { it: it, hasError: hasError, spanStart: spanStart, spanEnd: spanEnd };

    var html = '';
    toks.forEach(function (t, idx) {
      html += '<span class="word" data-idx="' + idx + '" data-start="' + t.start + '">' + esc(t.text) + '</span>';
      if (idx < toks.length - 1) html += ' ';
    });
    $('#quiz-sentence').innerHTML = html;
  }

  function markSpanWords(cls) {
    var ctx = state.ctx;
    if (!ctx.hasError) return;
    var els = $('#quiz-sentence').querySelectorAll('.word');
    for (var i = 0; i < els.length; i++) {
      var st = +els[i].getAttribute('data-start');
      if (st >= ctx.spanStart && st < ctx.spanEnd) els[i].classList.add(cls);
    }
  }

  function chapTitle() {
    var c = ER.chapters[state.chap];
    return c ? c.title : '';
  }

  function recordErr(ok) {
    stats.err.t += 1;
    stats.err.n += 1;
    if (ok) stats.err.ok += 1;
    if (!stats.since) stats.since = Date.now();
    saveStats();
  }

  function judge(clickedStart) {
    if (state.answered) return;
    var ctx = state.ctx;
    var it = ctx.it;
    var ok;

    if (clickedStart === null) ok = !ctx.hasError;
    else ok = ctx.hasError && clickedStart >= ctx.spanStart && clickedStart < ctx.spanEnd;

    state.answered = true;
    $('#btn-noerror').disabled = true;
    $('#btn-skip').disabled = true;

    var panel = $('#quiz-answer');
    panel.hidden = false;

    if (ok) {
      buzz('ok');
      recordErr(true);
      if (ctx.hasError) {
        var els = $('#quiz-sentence').querySelectorAll('.word');
        for (var i = 0; i < els.length; i++) {
          if (+els[i].getAttribute('data-start') === clickedStart) els[i].classList.add('hit');
        }
        markSpanWords('reveal');
      }
      panel.className = 'answer';
      panel.innerHTML =
        '<div class="ans-line"><span class="ans-key">✅ 找对了</span></div>' +
        (ctx.hasError
          ? '<div class="ans-line">错误：<span class="ans-key">' + esc(it.at) + '</span> → 改为：<span class="ans-ok">' + esc(it.to) + '</span></div>'
          : '<div class="ans-line"><span class="ans-ok">这一句确实没有错误</span></div>') +
        '<div class="ans-why">' + esc(it.why) + '</div>';
    } else {
      buzz('bad');
      var els2 = $('#quiz-sentence').querySelectorAll('.word');
      if (clickedStart !== null) {
        for (var j = 0; j < els2.length; j++) {
          if (+els2[j].getAttribute('data-start') === clickedStart) {
            els2[j].classList.add('miss');
            setTimeout((function (el) { return function () { el.classList.remove('miss'); }; })(els2[j]), 340);
          }
        }
      }
      panel.className = 'answer bad';
      panel.innerHTML =
        '<div class="ans-line"><span class="ans-key">❌ 不对</span> 再想想，或者点「跳过」看答案</div>' +
        '<div class="ans-why">提示：本题考点是「' + esc(chapTitle()) + '」</div>';
      state.answered = false;
      $('#btn-noerror').disabled = false;
      $('#btn-skip').disabled = false;
      return;
    }
    $('#btn-next').hidden = false;
  }

  /* ---------------- 事件绑定 ---------------- */
  function bind() {
    document.addEventListener('click', function (ev) {
      /* 返回 / 首页入口 */
      var go = ev.target.closest('[data-go]');
      if (go) {
        var to = go.getAttribute('data-go');
        buzz('tap');
        commitSession();
        if (to === 'home') { initHome(); show('scr-home'); return; }
        if (to === 'list') { openList(state.tab || 'tcm'); return; }
        if (to === 'back') { location.href = 'index.html'; return; }
        openList(to);
        return;
      }

      /* 模块页：清零本模块统计 */
      var rst = ev.target.closest('[data-reset="mod"]');
      if (rst) {
        buzz('tap');
        var mod = rst.getAttribute('data-mod');
        if (rst.getAttribute('data-confirm') === '1') {
          if (mod === 'err') stats.err = { t: 0, n: 0, ok: 0 };
          else if (stats[mod]) stats[mod] = { t: 0, n: 0 };
          saveStats();
          openList(state.tab || 'tcm');
        } else {
          rst.setAttribute('data-confirm', '1');
          rst.textContent = '再点确认';
          setTimeout(function () {
            if (rst.getAttribute('data-confirm') === '1') {
              rst.removeAttribute('data-confirm');
              rst.textContent = '清零';
            }
          }, 3000);
        }
        return;
      }

      /* 目录工具按钮 */
      var tool = ev.target.closest('[data-tool]');
      if (tool) {
        var k = tool.getAttribute('data-tool');
        buzz('tap');
        if (k === 'reset') {
          if (tool.getAttribute('data-confirm') === '1') {
            memo = {}; saveMemo();
            tool.textContent = '♻ 清空进度';
            tool.removeAttribute('data-confirm');
            openList('tcm');
          } else {
            tool.setAttribute('data-confirm', '1');
            tool.textContent = '⚠ 再点一次确认清空';
            setTimeout(function () {
              if (tool.getAttribute('data-confirm') === '1') {
                tool.removeAttribute('data-confirm');
                tool.textContent = '♻ 清空进度';
              }
            }, 3000);
          }
          return;
        }
        openVirtual(k);
        return;
      }

      /* 「我背下来了」按钮 */
      var mb = ev.target.closest('[data-memo]');
      if (mb) {
        ev.stopPropagation();
        var key = mb.getAttribute('data-memo');
        if (memo[key]) { delete memo[key]; mb.textContent = '☐ 我背下来了'; mb.closest('.card').classList.remove('known'); }
        else { memo[key] = 1; mb.textContent = '✅ 已背'; mb.closest('.card').classList.add('known'); buzz('ok'); }
        saveMemo();
        updateMemoStat(currentItems());
        return;
      }

      /* 自测模式：点卡片翻开答案 */
      var card = ev.target.closest('#cards-body .card');
      if (card && card.classList.contains('masked')) {
        card.classList.remove('masked');
        buzz('tap');
        return;
      }

      /* 章节点开 */
      var chap = ev.target.closest('.chap');
      if (chap && state.tab) {
        var idx = +chap.getAttribute('data-idx');
        buzz('tap');
        if (state.tab === 'err') openQuiz(idx);
        else openCards(idx);
        return;
      }

      /* 改错：点单词 */
      var w = ev.target.closest('#quiz-sentence .word');
      if (w) { judge(+w.getAttribute('data-start')); return; }
    });

    /* 自测模式开关 */
    $('#btnSelfTest').addEventListener('click', function () {
      selfTest = !selfTest;
      saveSelfTest();
      syncSelfTestBtn();
      var cards = $('#cards-body').querySelectorAll('.card[data-key]');
      for (var i = 0; i < cards.length; i++) {
        if (selfTest) cards[i].classList.add('masked');
        else cards[i].classList.remove('masked');
      }
      buzz('tap');
    });

    /* 这行没错 */
    $('#btn-noerror').addEventListener('click', function () { judge(null); });

    /* 跳过 */
    $('#btn-skip').addEventListener('click', function () {
      if (state.answered) return;
      var ctx = state.ctx;
      state.answered = true;
      $('#btn-noerror').disabled = true;
      $('#btn-skip').disabled = true;
      markSpanWords('reveal');
      buzz('bad');
      recordErr(false);
      var panel = $('#quiz-answer');
      panel.hidden = false;
      panel.className = 'answer bad';
      panel.innerHTML =
        '<div class="ans-line"><span class="ans-key">已跳过</span></div>' +
        (ctx.hasError
          ? '<div class="ans-line">错误：<span class="ans-key">' + esc(ctx.it.at) + '</span> → 改为：<span class="ans-ok">' + esc(ctx.it.to) + '</span></div>'
          : '<div class="ans-line"><span class="ans-ok">这一句没有错误</span></div>') +
        '<div class="ans-why">' + esc(ctx.it.why) + '</div>';
      $('#btn-next').hidden = false;
    });

    /* 下一题 */
    $('#btn-next').addEventListener('click', function () {
      var chap = ER.chapters[state.chap];
      if (state.qi + 1 < chap.items.length) {
        state.qi++;
        renderQuiz();
        $('#scr-quiz').scrollTop = 0;
      } else {
        var panel = $('#quiz-answer');
        panel.hidden = false;
        panel.className = 'answer';
        panel.innerHTML = '<div class="ans-line"><span class="ans-ok">🎉 这一章做完了（' + chap.items.length + ' 题）</span></div>' +
          '<div class="ans-why">回到目录换一类，或者重做一次。改错 20 分靠重复，不是靠一次看懂。</div>';
        $('#btn-next').hidden = true;
      }
    });

    /* 搜索 */
    var timer = null;
    $('#search-input').addEventListener('input', function (ev) {
      var v = ev.target.value;
      clearTimeout(timer);
      timer = setTimeout(function () { renderList(v); }, 120);
    });
  }

  /* 统计卡片集（当前屏幕上的） */
  function currentItems() {
    var cards = $('#cards-body').querySelectorAll('.card[data-key]');
    var out = [];
    for (var i = 0; i < cards.length; i++) out.push({ key: cards[i].getAttribute('data-key') });
    return out;
  }

  function syncSelfTestBtn() {
    var b = $('#btnSelfTest');
    b.textContent = selfTest ? '👁 已开自测' : '🙈 自测';
    b.classList.toggle('on', selfTest);
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    initHome();
    syncSelfTestBtn();
    bind();

    /* 切到后台 / 关页面 时也把本次练习记下来 */
    window.addEventListener('pagehide', commitSession);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') commitSession();
    });
    show('scr-home');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
