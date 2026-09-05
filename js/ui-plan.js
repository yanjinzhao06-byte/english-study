/* ============================================================
   学习计划：从「高考 50 分」到「专升本英语 150 分」的个性化进阶规划
   根据起点分 + 每日时长自动生成 阶段/周计划/起止日期，并与已学内容联动
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED, Eng = g.Eng;
  var esc = Eng.esc;

  var STAGE_DEF = [
    { name: 'P1 基础重建', from: 50, to: 80, color: '#0ea5e9', weeks: 4,
      head: '认清结构：词法 + 基础时态 + 基础词汇',
      daily: ['背单词：每天 20 个新词 + 复习到期词(words) ', '语法：每天 1 节 A 级课(隔天一节随堂测验)', '专项：每天 10 题(阅读 / 完形交替) '],
      weekly: ['周一/周三/周五：阅读理解 1 篇', '周二/周四：完形填空 1 段(10 空)', '周六：词义测验 20 题', '周日：本周复习 + 学习复盘'],
      mid: '两周做 1 次“不计时”完整模考，熟悉题型结构',
      tasks: [
        '完成 Tier1「基础重建」词书一轮去重记忆',
        '学完 A1-A6 六节语法课并全部通过测验',
        '阅读理解累计 6 篇 + 完形 6 段',
        '通关 A 级随堂测验(≥60%)',
        '完成 1~2 次全真模考(先不追求时长)',
        '打卡≥20 天，形成学习习惯'
      ] },
    { name: 'P2 核心突破', from: 80, to: 110, color: '#0ea56a', weeks: 5,
      head: '把从句与完成时打通 + 阅读量起来',
      daily: ['单词：tier2 每天 20 新词 + 复习', '语法：每天 1 节 B 级课', '专项：每天 12 题(阅读+判断正误混练)'],
      weekly: ['周一至周五：每天 1 篇阅读或判断', '周三：完形 1 段(目标 75%+)', '周六：语法闯关 10 题', '周日：错题复盘 + 复习'],
      mid: '每 10 天 1 次全真模考，目标 90→105 分',
      tasks: [
        'Tier2「高中核心词」掌握到 80% 以上',
        '学完 B1-B6 并全部通过测验',
        '阅读累计 15 篇 / 判断正误 5 篇',
        '完形正确率稳定 ≥75%',
        '模考 2 次，分数进入 90~105 区间'
      ] },
    { name: 'P3 进阶强化', from: 110, to: 135, color: '#f59e0b', weeks: 5,
      head: '按真题八题型专项，补齐弱项',
      daily: ['单词：tier3 每天 20 新词 + 复习', '专项：每天 15 题(翻译/改错重点) ', '写作：每周背 1 篇范文结构'],
      weekly: ['周一/三/五：英译汉选择 + 选词填空', '周二/四：汉译英 6 句 + 改错 6 题', '周六：阅读+完形一套计时', '周日：作文仿写 1 篇'],
      mid: '每两周 1 次全真模考(120 分钟)，目标 115→130',
      tasks: [
        'Tier3「专升本高频词」完成一轮',
        '学完 C1-C6 拔高语法课',
        '汉译英 / 改错专项正确率 ≥85%',
        '选词填空 / 英译汉选择稳定满分',
        '作文仿写 5 篇 + 复盘 2 次模考'
      ] },
    { name: 'P4 满分冲刺', from: 135, to: 150, color: '#e5484d', weeks: 4,
      head: '错题清零 + 限时节奏 + 作文亮点句',
      daily: ['单词：滚动复习把到期清零', '错题：改写昨天所有错题', '作文：背 2 个亮点句型'],
      weekly: ['周一/三/五：分块计时训练(阅读/完形/填空)', '周二/四：翻译+改错限时', '周六：全真模考 150 分钟', '周日：错题全清 + 范文回顾'],
      mid: '保证 3 次以上 150 分钟全真模考，冲刺 140+',
      tasks: [
        '全部词书滚动复习到期清零',
        '薄弱语法点按错题驱动重学',
        '模考 ≥3 次，2 次达到 140+',
        '作文 5 篇成稿，语法错误率 <5%',
        '限时节奏：150 分钟分配稳定'
      ] }
  ];

  function plan() { return Eng.S.plan; }

  function buildPlan() {
    var diag = (Eng.S.diag && Eng.S.diag.score) || 50;
    var dailyMin = Eng.S.set.goalMin || 30;
    var factor = dailyMin < 30 ? 1.4 : (dailyMin <= 45 ? 1 : 0.82);
    var stages = STAGE_DEF.map(function (s) {
      return { name: s.name, from: s.from, to: s.to, color: s.color, weeks: Math.max(2, Math.round(s.weeks * factor)),
        head: s.head, daily: s.daily.slice(), weekly: s.weekly.slice(), mid: s.mid, tasks: s.tasks.slice() };
    });
    // 计算起止日期
    var start = new Date();
    var cum = 0;
    stages.forEach(function (s) {
      s.startKey = E.dateKey(E.addDays(start, cum * 7));
      s.endKey = E.dateKey(E.addDays(start, (cum + s.weeks) * 7 - 1));
      cum += s.weeks;
    });
    Eng.S.plan = { created: E.dateKey(), diagScore: diag, dailyMin: dailyMin, totalWeeks: cum, stages: stages, done: {} };
    Eng.save();
    return Eng.S.plan;
  }
  function ensurePlan() {
    if (!Eng.S.plan || !Eng.S.plan.stages || Eng.S.plan.stages.length !== STAGE_DEF.length) buildPlan();
    return Eng.S.plan;
  }

  /* ---------- 自动进度(基于真实学习数据) ---------- */
  function wsOf() {
    var list = ED.vocab.list, lv = [0, 0, 0, 0], kn = [0, 0, 0, 0];
    list.forEach(function (w, i) {
      lv[w.lv]++; if (E.wordKnown(Eng.S.vocab[i])) kn[w.lv]++;
    });
    return { lv: lv, kn: kn, all: list.length, known: kn[1] + kn[2] + kn[3] };
  }
  function lessonsDone(lv) { return ED.course.list.filter(function (l) { return l.lv === lv && Eng.S.lessons[l.id] && Eng.S.lessons[l.id].done; }).length; }
  function lessonsOf(lv) { return ED.course.list.filter(function (l) { return l.lv === lv; }).length; }
  function mstatN(ids) { var n = 0; ids.forEach(function (id) { var s = (Eng.S.mstats || {})[id]; if (s) n += s.n; }); return n; }
  function mockBest() { var b = 0; (Eng.S.mocks || []).forEach(function (m) { if (m.total > b) b = m.total; }); return b; }

  function stageProgress(i) {
    var ws = wsOf();
    if (i === 0) {
      var t1 = ws.lv[1] || 1;
      return Math.round((ws.kn[1] / t1) * 40 + (lessonsDone(1) / Math.max(1, lessonsOf(1))) * 30 + Math.min(1, mstatN(['read']) / 12) * 30);
    }
    if (i === 1) {
      var t2 = ws.lv[2] || 1;
      return Math.round((ws.kn[2] / t2) * 40 + (lessonsDone(2) / Math.max(1, lessonsOf(2))) * 30 + Math.min(1, (mstatN(['read', 'tf', 'cloze']) - 8) / 25) * 30);
    }
    if (i === 2) {
      var t3 = ws.lv[3] || 1;
      return Math.round((ws.kn[3] / t3) * 40 + (lessonsDone(3) / Math.max(1, lessonsOf(3))) * 30 + Math.min(1, mstatN(['ec', 'wf', 'ce', 'ef']) / 30) * 30);
    }
    // P4：整体检验
    var best = mockBest();
    return Math.round(Math.min(1, ws.known / 1500) * 30 + Math.min(1, lessonsDone(1) + lessonsDone(2) + lessonsDone(3) / Math.max(1, ED.course.list.length)) * 20 + Math.min(1, best / 150) * 50);
  }

  /* ---------- 视图 ---------- */
  Eng.registerView('plan', function () {
    var p = ensurePlan();
    var est = E.estimate(Eng.S);
    var ws = wsOf();
    var curStage = E.phaseOf(est);

    var overallPct = Math.round(Math.max(0, Math.min(1, (est - p.stages[0].from) / (150 - p.stages[0].from))) * 100);

    var stageCards = p.stages.map(function (s, i) {
      var prog = stageProgress(i);
      var isCur = i === curStage;
      var cls = isCur ? '' : '';
      var tasksHtml = s.tasks.map(function (t, j) {
        var key = 's' + i + 't' + j;
        var done = !!(p.done && p.done[key]);
        return '<label class="li-item" style="cursor:pointer">' +
          '<input type="checkbox" data-act="plan-toggle" data-key="' + key + '" ' + (done ? 'checked' : '') + ' style="width:18px;height:18px;accent-color:' + s.color + '">' +
          '<div class="li-txt ' + (done ? 'muted" style="text-decoration:line-through' : '') + '">' + esc(t) + '</div></label>';
      }).join('');
      var dailyHtml = s.daily.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('');
      var weeklyHtml = s.weekly.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('');

      return '<div class="card pad" style="border-top:5px solid ' + s.color + '">' +
        '<div class="row wrap">' +
          '<span class="chip" style="background:' + s.color + '22;color:' + s.color + ';font-weight:800">' + s.name + '</span>' +
          '<span class="chip">' + s.from + ' → ' + s.to + ' 分</span>' +
          '<span class="chip">约 ' + s.weeks + ' 周</span>' +
          (isCur ? '<span class="chip warn" style="margin-left:auto">📍 当前阶段</span>' : '') +
        '</div>' +
        '<p class="small muted mt8">' + esc(s.head) + '</p>' +
        '<div class="row mt8"><span class="small muted">阶段进度</span><div class="pbar grow"><i style="width:' + prog + '%;background:' + s.color + '"></i></div><b class="small">' + prog + '%</b></div>' +
        '<div class="grid g2 mt12" style="gap:10px">' +
          '<div class="gram-box" style="border-left-color:' + s.color + '"><b style="font-size:13px">📌 每日安排</b><ul class="small" style="margin:8px 0 0;padding-left:18px;line-height:2">' + dailyHtml + '</ul>' +
            '<div class="tiny muted mt8">' + esc(s.mid) + '</div></div>' +
          '<div class="gram-box"><b style="font-size:13px">🗓 每周规划</b><ul class="small" style="margin:8px 0 0;padding-left:18px;line-height:2">' + weeklyHtml + '</ul></div>' +
        '</div>' +
        '<div class="hr"></div>' +
        '<b style="font-size:13.5px">✅ 阶段关键任务(点勾完成)</b>' +
        '<div>' + tasksHtml + '</div>' +
      '</div>';
    }).join('');

    // 时间轴
    var tl = p.stages.map(function (s, i) {
      var state = i < curStage ? 'pass' : (i === curStage ? 'on' : '');
      return '<div class="p-node"><div class="' + (state ? 'p-dot ' + state : 'p-dot') + '">' + (state === 'pass' ? '✓' : (i + 1)) + '</div>' +
        '<div class="p-name">' + s.name + '</div><div class="p-goal">' + s.from + '→' + s.to + '</div>' +
        '<div class="tiny muted">' + s.startKey.slice(5) + ' ~ ' + s.endKey.slice(5) + '</div></div>';
    }).join('');

    return '' +
      '<div class="hero" style="background:linear-gradient(135deg,#4f46e5,#0ea5e9)">' +
        '<div class="checkin-hero">' +
          '<span class="flame">🧭</span>' +
          '<div class="grow"><h1>你的进阶路线 · 高考 50 → 专升本 150</h1>' +
          '<p>起点分 ' + (p.diagScore || 50) + ' · 当前预估 ' + est + ' 分 · 每天 ' + p.dailyMin + ' 分钟 · 预计 ' + p.totalWeeks + ' 周完成</p></div>' +
          '<button class="btn xs" data-act="plan-rebuild" style="background:rgba(255,255,255,.18)">↻ 重新定制</button>' +
        '</div>' +
        '<div class="pbar mt16" style="background:rgba(255,255,255,.25)"><i style="width:' + overallPct + '%;background:#fff"></i></div>' +
      '</div>' +

      '<div class="card pad mt16"><div class="phase mt8">' + tl + '</div></div>' +

      '<div class="sect"><h3>阶段分解 · 从 50 一步步到 150</h3>' +
        '<span class="muted small">每个阶段的“阶段进度”由你的实际学习数据自动更新</span></div>' +
      '<div class="grid g1" style="gap:16px">' + stageCards + '</div>' +

      '<div class="sect"><h3>总学习账本</h3></div>' +
      '<div class="grid g4">' +
        '<div class="card stat-card"><div class="k">📖 累计词汇</div><div class="v">' + ws.known + '<small>/' + ws.all + '</small></div></div>' +
        '<div class="card stat-card"><div class="k">✏️ 语法课</div><div class="v">' + (lessonsDone(1) + lessonsDone(2) + lessonsDone(3)) + '<small>/' + ED.course.list.length + '</small></div></div>' +
        '<div class="card stat-card"><div class="k">🎯 刷题</div><div class="v">' + (Eng.S.stats.qn || 0) + '<small>题</small></div></div>' +
        '<div class="card stat-card"><div class="k">📝 模考最佳</div><div class="v">' + mockBest() + '<small>/150</small></div></div>' +
      '</div>' +

      '<div class="card pad mt16 small muted">' +
        '<b>计划会自动调整吗？</b> 会的。每当你完成词书、语法课、专项或模考，“阶段进度”与“当前预估分”都会变化；建议每周六看一次“我的”页热力图与模考趋势，若某阶段连续 2 周 <60%，把该阶段的“每日背新词”减半、多留时间复习与错题。' +
      '</div>';
  });

  Eng.actions['plan-toggle'] = function (el, d) {
    var p = ensurePlan();
    p.done = p.done || {};
    p.done[d.key] = !!(el.checked);
    Eng.save();
    if (el.checked) Eng.toast('✅ 完成一项，继续加油！');
  };
  Eng.actions['plan-rebuild'] = function () {
    Eng.modal(
      '<p class="muted small mt8">重新定制将按你当前的起点分与每日时长重排阶段/周计划，已勾选的任务状态会保留。</p>' +
      '<div class="row mt16" style="gap:10px"><button class="btn ghost grow" data-close>取消</button>' +
      '<button class="btn ok grow" data-act="plan-rebuild-yes">重新生成</button></div>',
      { title: '🔄 重新定制学习计划' });
  };
  Eng.actions['plan-rebuild-yes'] = function () {
    Eng.closeModal();
    buildPlan();
    Eng.go('plan');
    Eng.toast('✅ 已按你的进度重新定制计划');
  };
})(window);
