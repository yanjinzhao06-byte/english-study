/* ============================================================
   纯逻辑引擎：打卡/连击 / SRS 记忆 / 随机组卷 / 预估分 / 成长路径
   不依赖 DOM，可在 Node 中单测
   ============================================================ */
(function (g) {
  'use strict';
  var E = {};

  /* ---------- 日期工具 ---------- */
  E.pad = function (n) { return (n < 10 ? '0' : '') + n; };
  E.dateKey = function (d) {
    d = d || new Date();
    return d.getFullYear() + '-' + E.pad(d.getMonth() + 1) + '-' + E.pad(d.getDate());
  };
  E.parseKey = function (k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  E.addDays = function (d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; };
  E.dayKey = function (offset) { return E.dateKey(E.addDays(new Date(), offset)); };
  E.diffDays = function (a, b) {
    var ms = E.parseKey(a).getTime() - E.parseKey(b).getTime();
    return Math.round(ms / 86400000);
  };

  /* 连续打卡：今天有记录则含今天；否则从昨天向前数 */
  E.streak = function (days, today) {
    today = today || E.dateKey();
    var total = 0, off = days[today] ? 0 : -1;
    for (var k = 0; k < 4000; k++) {
      if (!days[E.dayKey(off)]) break;
      total++;
      off = off - 1;
    }
    return total;
  };

  /* ---------- 随机 ---------- */
  E.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  E.pick = function (arr, n) { return E.shuffle(arr).slice(0, n); };
  /* 随机打乱选择题选项，返回 { os: 打乱后选项, ai: 正确项新下标 } */
  E.shufChoices = function (o, a) {
    var idx = o.map(function (_, i) { return i; });
    var s = E.shuffle(idx);
    var os = s.map(function (i) { return o[i]; });
    var ai = s.indexOf(a);
    return { os: os, ai: ai };
  };
  E.clamp = function (x, lo, hi) { return Math.max(lo, Math.min(hi, x)); };

  /* ---------- SRS（简化版 SM-2） ----------
     word = { b: 记忆盒 0-6, due: 到期毫秒时间戳, ok: 正确次数, ng: 忘记次数 }
     grade: 2 认识 / 1 模糊 / 0 忘记   */
  E.SRS_INTERVALS = [1, 2, 4, 7, 15, 30, 45]; // 对应盒子 0-6 成功后间隔天数
  E.srsApply = function (word, grade) {
    var w = { b: word.b || 0, due: word.due || 0, ok: word.ok || 0, ng: word.ng || 0 };
    var now = Date.now(), day = 86400000;
    if (grade === 2) { // 认识
      var oldB = Math.min(6, w.b || 0);
      w.b = Math.min(6, w.b + 1); w.ok++;
      if (w.b === 0) w.b = 1; // 首次认识升到盒子1
      w.due = now + E.SRS_INTERVALS[oldB] * day; // 用“本次认识前所在的盒子”取间隔：0→1天、1→2天……
    } else if (grade === 1) { // 模糊：盒位不变，次日再见
      w.ng++;
      if (w.b === 0) { w.b = 0; }
      w.due = now + 1 * day;
    } else { // 忘记：回到盒 0，明天复习
      w.b = 0; w.ng++; w.due = now + 1 * day;
    }
    return w;
  };
  E.wordKnown = function (w) { return w && w.b >= 1; };
  E.wordDue = function (w, now) { return w && w.due && w.due <= (now || Date.now()); };

  /* ---------- 预估分模型（0-150，向 150 收敛） ---------- */
  E.estimate = function (S) {
    var V = S.vocab || {}, totalWords = (g.ED && g.ED.vocab && g.ED.vocab.total) || 430;
    var known = 0, due = 0;
    Object.keys(V).forEach(function (id) {
      var w = V[id];
      if (E.wordKnown(w)) known++;
      if (w.b > 0 && E.wordDue(w)) due++;
    });
    var lessons = (g.ED && g.ED.course && g.ED.course.list) || [];
    var doneL = Object.keys(S.lessons || {}).filter(function (k) { return S.lessons[k].done; }).length;
    var stat = S.stats || {};
    var attempts = stat.qn || 0, okQ = stat.qk || 0;
    var acc = attempts ? okQ / attempts : 0;

    // 词汇(掌握度→40，按专升本现实目标约 1600 词封顶)、语法(完成度→20)、练习(量×正确率→30)
    var wordDen = Math.min(totalWords, 1600);
    var wordP = E.clamp(known / wordDen, 0, 1) * 40;
    var gramP = lessons.length ? (doneL / lessons.length) * 20 : 0;
    var pracVol = E.clamp(attempts / 240, 0, 1);
    var pracP = acc * pracVol * 30;
    var base = wordP + gramP + pracP;

    // 摸底测诊断基线：预估分不低于诊断起点，学习证据(词汇/语法/练习)超过则取更高
    var diag = S.diag ? S.diag.score : 40;
    var score = Math.max(diag, base);

    // 模考直接证据（权重最高）
    var mocks = S.mocks || [];
    if (mocks.length) {
      var best = 0, sum = 0;
      mocks.forEach(function (m) { best = Math.max(best, m.total); sum += m.total; });
      var avg = sum / mocks.length;
      var evid = Math.max(avg * 0.65 + best * 0.35, best * 0.8);
      score = Math.max(score, evid);
    }
    return Math.round(E.clamp(score, 0, 150));
  };

  /* ---------- 成长路径 ---------- */
  E.PHASES = [
    { i: 0, name: 'P1 基础重建', range: '50 → 80', color: '#0ea5e9',
      goal: '打牢词法与基础词汇',
      focus: '冠词·代词·时态入门 · 基础 1200 词 · 每天 20 新词',
      tasks: ['完成 Tier1「基础重建」词书一轮', '学完 A 系列 6 节语法课', '掌握一般现在/过去/将来/进行时', '每日打卡 ≥ 20 天', '第一次完整模考 ≥ 90 分'] },
    { i: 1, name: 'P2 核心突破', range: '80 → 110', color: '#0ea56a',
      goal: '高中核心语法 + 题型入门',
      focus: '完成时·被动·从句 · 高中核心词 · 阅读精练',
      tasks: ['Tier2 高中核心词达到 80% 掌握', '学完 B 系列 6 节语法课', '阅读精练 30 篇+', '完形/判断正误正确率 ≥ 75%', '模考稳定 100+'] },
    { i: 2, name: 'P3 进阶强化', range: '110 → 135', color: '#f59e0b',
      goal: '专升本结构全题型专项',
      focus: '虚拟·倒装·非谓语 · 高频词 · 翻译改错专项',
      tasks: ['Tier3 高频词一轮', '学完 C 系列 6 节拔高课', '汉译英/改错专项 ≥ 85%', '选词填空 / 英译汉专项', '全真模考 2 次+，目标 120+'] },
    { i: 3, name: 'P4 满分冲刺', range: '135 → 150', color: '#e5484d',
      goal: '查漏补缺 · 冲击满分',
      focus: '错题复盘 · 作文亮点句 · 全真模考节奏',
      tasks: ['全部词书滚动复习到期清零', '薄弱语法点重学(错题驱动)', '作文 5 篇+ 亮点句运用', '模考 ≥ 3 次目标 140+', '限时训练：150 分钟节奏感'] }
  ];
  E.phaseOf = function (score) {
    if (score < 80) return 0;
    if (score < 110) return 1;
    if (score < 135) return 2;
    return 3;
  };

  /* ---------- 热力图数据：最近 20 周 ---------- */
  E.heatmap = function (days) {
    var today = E.dateKey();
    var weeks = [];
    // 从周日开始的当前周
    var d = new Date();
    var dow = (d.getDay() + 6) % 7; // 周一为 0
    var start = E.addDays(d, -dow - 6 * 19); // 往前推 19 周+本周
    for (var w = 0; w < 20; w++) {
      var col = [];
      for (var i = 0; i < 7; i++) {
        var k = E.dateKey(E.addDays(start, w * 7 + i));
        var v = days[k];
        var lvl = 0;
        if (v) {
          var act = (v.w || 0) + ((v.sec || 0) / 60) + (v.qn || 0) + (v.tasks || 0);
          if (v.manual) act = Math.max(act, 1);
          if (act > 0) lvl = 1;
          if (act >= 3) lvl = 2;
          if (act >= 8) lvl = 3;
          if (act >= 15) lvl = 4;
        }
        if (k > today) lvl = -1; // 未来
        col.push({ k: k, lvl: lvl, today: k === today });
      }
      weeks.push(col);
    }
    return weeks;
  };

  g.Engine = E;
})(typeof window !== 'undefined' ? window : globalThis);
