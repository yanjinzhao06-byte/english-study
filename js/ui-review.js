/* ============================================================
   艾宾浩斯复习中心：到期队列 + 遗忘曲线阶段 + 每日打卡
   复习卡片复用 ui-vocab 的到期复习动作，打卡与全局数据打通
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED, Eng = g.Eng;
  var esc = Eng.esc;
  var WEEK = ['日', '一', '二', '三', '四', '五', '六'];

  Eng.registerView('review', function () { return reviewView(); });

  function weekDots() {
    var S = Eng.S, dk = Eng.today(), out = '';
    for (var i = 6; i >= 0; i--) {
      var k = E.dayKey(-i);
      var has = !!S.days[k];
      var isT = k === dk;
      out += '<div class="center" style="flex:1">' + (has ? '🔥' : '·') +
        '<div class="tiny muted">' + (isT ? '今天' : '周' + WEEK[E.parseKey(k).getDay()]) + '</div></div>';
    }
    return out;
  }

  /* 每个记忆盒当前有多少词（盒 = 已完成“认识”的次数） */
  function boxCounts() {
    var S = Eng.S.vocab || {}, c = [0, 0, 0, 0, 0, 0, 0];
    Object.keys(S).forEach(function (id) {
      var w = S[id];
      var b = w && w.b;
      if (typeof b === 'number' && b >= 0 && b <= 6) c[b]++;
    });
    return c;
  }

  function boxRows() {
    var c = boxCounts();
    var iv = E.SRS_INTERVALS || [1, 2, 4, 7, 15, 30, 45];
    var rows = '';
    rows += boxRow('盒 0 · 回炉重学', c[0], '点“忘了”的词，明天必须再见');
    for (var i = 1; i <= 6; i++) {
      rows += boxRow('盒 ' + i, c[i], '下次复习间隔：第 ' + iv[i - 1] + ' 天');
    }
    return rows;
  }
  function boxRow(name, n, sub) {
    return '<div class="row mt8"><span class="chip" style="min-width:120px">' + name + '</span>' +
      '<b style="min-width:34px">' + n + ' 词</b>' +
      '<span class="muted tiny" style="flex:1;text-align:right">' + sub + '</span></div>';
  }

  function todayActs() {
    var today = Eng.todayRec();
    if (!today || !today.acts || !today.acts.length) return '<div class="empty" style="padding:16px"><div class="big">🌱</div>今天还没有学习记录，去复习一组单词吧</div>';
    var html = '';
    for (var i = 0; i < Math.min(5, today.acts.length); i++) {
      html += '<div class="li-item"><span class="li-ico">⏰</span><div class="grow"><div class="li-txt">' + esc(today.acts[i].t) + '</div>' +
        '<div class="li-sub">' + new Date(today.acts[i].at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) + '</div></div></div>';
    }
    return html;
  }

  function reviewView() {
    var S = Eng.S, dk = Eng.today(), today = Eng.todayRec();
    var checked = !!today;
    var streak = E.streak(S.days);
    var due = Eng.dueWords().length;
    var ws = Eng.wordState();
    var rvDone = (today && today.r) || 0;
    var totalR = (S.stats && S.stats.reviews) || 0;
    var goalW = S.set.goalW || 20;

    var ciBtn = checked
      ? '<button class="checkin-btn done" title="今日已打卡" style="cursor:default">✓</button>'
      : '<button class="checkin-btn" title="点击打卡" data-act="rv-ci">✔</button>';

    var dueBtn = due
      ? '<button class="btn" data-act="goReview" style="background:rgba(255,255,255,.95);color:var(--brand);box-shadow:0 6px 16px rgba(0,0,0,.18)">⏰ 立即复习到期 ' + due + ' 词</button>'
      : '<button class="btn" data-go="vocab" style="background:rgba(255,255,255,.95);color:var(--brand)">🎉 今日到期已清零，去学新词</button>';

    var curve = (E.SRS_INTERVALS || [1, 2, 4, 7, 15, 30, 45]).map(function (d, i) {
      return '<div class="card stat-card center"><div class="k">第 ' + d + ' 天</div><div class="v" style="font-size:20px">' + (i + 1) + '<small> 次复习</small></div></div>';
    }).join('');

    return '' +
      '<div class="hero" style="background:linear-gradient(135deg,#7c3aed,#4f46e5)">' +
        '<div class="checkin-hero">' +
          ciBtn +
          '<div class="grow"><h1>艾宾浩斯复习</h1>' +
          '<p>'+ dk.replace(/-/g, '.') + ' · 连续打卡 ' + streak + ' 天 · 今日到期 ' + due + ' 词</p></div>' +
          '<button class="btn xs" data-act="rv-how" style="background:rgba(255,255,255,.18)">📈 遗忘曲线</button>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">' +
          '<div class="stat-card" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:10px 14px;min-width:104px"><div class="k" style="color:rgba(255,255,255,.85)">⏰ 今日到期</div><div class="v" style="font-size:22px">' + due + '<small> 词</small></div></div>' +
          '<div class="stat-card" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:10px 14px;min-width:104px"><div class="k" style="color:rgba(255,255,255,.85)">✅ 今日已复习</div><div class="v" style="font-size:22px">' + rvDone + '<small> 词</small></div></div>' +
          '<div class="stat-card" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:10px 14px;min-width:104px"><div class="k" style="color:rgba(255,255,255,.85)">📚 累计复习</div><div class="v" style="font-size:22px">' + totalR + '<small> 次</small></div></div>' +
          '<div class="stat-card" style="background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);padding:10px 14px;min-width:104px"><div class="k" style="color:rgba(255,255,255,.85)">🔥 连续打卡</div><div class="v" style="font-size:22px">' + streak + '<small> 天</small></div></div>' +
        '</div>' +
        '<div class="row wrap mt16" style="gap:8px">' + dueBtn +
          '<button class="btn xs" style="background:rgba(255,255,255,.2)" data-act="goNew">🆕 学新词 ' + goalW + ' 个</button>' +
          (checked ? '' : '<button class="btn xs" style="background:rgba(255,255,255,.2)" data-act="rv-ci">✔ 补一个今日打卡</button>') +
        '</div>' +
      '</div>' +

      '<div class="sect"><h3>今日动作</h3></div>' +
      '<div class="grid g-auto">' +
        '<button class="act-card" data-act="goReview"><span class="ico g3">⏰</span><div class="grow"><b>复习到期词</b><p>' + (due ? '先清空今天到期的 ' + due + ' 个词' : '今天没有到期词') + '</p></div><span class="arrow">›</span></button>' +
        '<button class="act-card" data-act="goNew"><span class="ico g1">🆕</span><div class="grow"><b>学习新词并预约复习</b><p>新词自动排进 1-2-4-7-15-30-45 天队列</p></div><span class="arrow">›</span></button>' +
      '</div>' +

      '<div class="sect"><h3>记忆盒分布</h3><span class="muted small">已见词 ' + ws.seen + ' / ' + ws.total + '</span></div>' +
      '<div class="card pad">' + boxRows() +
        '<div class="hr"></div><div class="muted tiny">“认识”进入下一盒并按遗忘曲线延长间隔；“模糊”明天再见；“忘了”回炉，明天重学。到期词请先复习再学新词。</div>' +
      '</div>' +

      '<div class="sect"><h3>复习节奏 · 7 个复习点</h3></div>' +
      '<div class="grid g-auto2">' + curve + '</div>' +
      '<div class="card pad small muted mt16">遗忘曲线建议：学完后分别在 <b>第 1、2、4、7、15、30、45 天</b> 各复习一次，记忆最牢固。本功能自动为你安排到“单词”页的到期队列，打开应用即可看到角标。</div>' +

      '<div class="sect"><h3>每日打卡</h3><span class="chip">🔥 ' + streak + ' 连击</span></div>' +
      '<div class="card pad">' +
        '<div class="row wrap" style="gap:8px">' +
          (checked
            ? '<button class="btn ok" style="cursor:default">✓ 今天已打卡</button>'
            : '<button class="btn" data-act="rv-ci">🔥 今日打卡</button>') +
          '<span class="muted small">完成任意学习任务会自动打卡；也可以手动补一次今日打卡。</span>' +
        '</div>' +
        '<div class="hr"></div>' +
        '<div style="display:flex;gap:4px">' + weekDots() + '</div>' +
        '<div class="tiny muted mt8">最近 7 天 · 🔥 = 已学习/已打卡</div>' +
      '</div>' +

      '<div class="sect"><h3>今日记录</h3></div>' +
      '<div class="card pad">' + todayActs() + '</div>';
  }

  Eng.actions['rv-ci'] = function () {
    var dk = Eng.today();
    if (Eng.S.days[dk]) {
      Eng.toast('今天已经打过卡啦，明天继续 ✊', 1800);
      Eng.go('review');
      return;
    }
    var st = Eng.manualCheckin();
    Eng.toast('🔥 打卡成功！连续 ' + st + ' 天', 2200);
    Eng.go('review');
  };

  Eng.actions['rv-how'] = function () {
    Eng.modal(
      '<div class="mt12">' +
      '<p class="muted small">德国心理学家艾宾浩斯发现：刚学的内容遗忘最快，随后逐渐变慢。因此在遗忘发生前主动复习，能花最少时间记住最牢。</p>' +
      '<div class="card stat-card mt12"><div class="k">本应用使用的复习间隔</div>' +
      '<div class="row mt8 wrap" style="gap:6px">' +
        (E.SRS_INTERVALS || [1, 2, 4, 7, 15, 30, 45]).map(function (d) {
          return '<span class="chip brand">第 ' + d + ' 天</span>';
        }).join('') +
      '</div></div>' +
      '<div class="li-item mt12"><span class="li-ico" style="background:var(--ok-soft)">😄</span><div class="li-txt">认识 → 进入下一盒，间隔拉长</div></div>' +
      '<div class="li-item"><span class="li-ico" style="background:var(--warn-soft)">🤔</span><div class="li-txt">模糊 → 明天再见</div></div>' +
      '<div class="li-item"><span class="li-ico" style="background:var(--bad-soft)">😵</span><div class="li-txt">忘了 → 回炉，明天重学</div></div>' +
      '<button class="btn block mt16" data-close>开始复习 →</button></div>',
      { title: '📈 艾宾浩斯遗忘曲线' }
    );
  };
})(window);
