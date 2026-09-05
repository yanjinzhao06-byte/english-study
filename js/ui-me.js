/* ============================================================
   我的：统计总览 · 打卡热力图 · 成绩趋势 · 成就 · 目标设置 · 数据
   ============================================================ */
(function (g) {
  'use strict';
  var E = g.Engine, ED = g.ED, Eng = g.Eng;
  var esc = Eng.esc;

  Eng.registerView('me', function () { return meView(); });

  function totals() {
    var S = Eng.S, days = S.days;
    var sec = 0, totalQn = 0, totalQk = 0, tasks = 0, daysN = Object.keys(days).length;
    var longest = 0, run = 0, prev = null;
    var keys = Object.keys(days).sort();
    keys.forEach(function (k) {
      var d = days[k];
      sec += d.sec || 0; totalQn += d.qn || 0; totalQk += d.qk || 0; tasks += d.tasks || 0;
      if (prev === null || E.diffDays(k, prev) === 1) { run++; } else { run = 1; }
      if (run > longest) longest = run;
      prev = k;
    });
    return { sec: sec, totalQn: totalQn, totalQk: totalQk, tasks: tasks, daysN: daysN, longest: longest };
  }

  function achievements() {
    var S = Eng.S, t = totals(), ws = Eng.wordState(), lessonsDone = ED.course.list.filter(function (l) { var s = S.lessons[l.id]; return s && s.done; }).length;
    var mockBest = 0; (S.mocks || []).forEach(function (m) { if (m.total > mockBest) mockBest = m.total; });
    var defs = [
      { id: 's1', ico: '🌱', name: '初次打卡', cond: function () { return t.daysN >= 1; } },
      { id: 's7', ico: '🔥', name: '连续 7 天', cond: function () { return t.longest >= 7; } },
      { id: 's30', ico: '⚡', name: '连续 30 天', cond: function () { return t.longest >= 30; } },
      { id: 'w50', ico: '📖', name: '掌握 50 词', cond: function () { return ws.known >= 50; } },
      { id: 'w200', ico: '📚', name: '掌握 200 词', cond: function () { return ws.known >= 200; } },
      { id: 'wall', ico: '🏆', name: '全词书掌握', cond: function () { return ws.known >= ws.total - 1; } },
      { id: 'l6', ico: '✏️', name: '语法 6 课', cond: function () { return lessonsDone >= 6; } },
      { id: 'l12', ico: '✒️', name: '语法 12 课', cond: function () { return lessonsDone >= 12; } },
      { id: 'lall', ico: '🎓', name: '语法全通关', cond: function () { return lessonsDone >= ED.course.list.length; } },
      { id: 'm1', ico: '📝', name: '首套模考', cond: function () { return (S.mocks || []).length >= 1; } },
      { id: 'm120', ico: '🎯', name: '模考 120+', cond: function () { return mockBest >= 120; } },
      { id: 'm140', ico: '🚀', name: '模考 140+', cond: function () { return mockBest >= 140; } },
      { id: 'diag', ico: '🧭', name: '完成入学测评', cond: function () { return !!S.diag; } },
      { id: 'q500', ico: '🛡️', name: '刷题 500 道', cond: function () { return S.stats.qn >= 500; } }
    ];
    S.badges = S.badges || {};
    defs.forEach(function (b) {
      if (b.cond() && !S.badges[b.id]) S.badges[b.id] = Date.now();
    });
    var unlocked = defs.filter(function (b) { return S.badges[b.id]; }).length;
    Eng.save();
    return { defs: defs, unlocked: unlocked };
  }

  function heatHTML() {
    var hm = E.heatmap(Eng.S.days);
    var prevM = -1;
    var cols = hm.map(function (col, ci) {
      var d0 = col[0];
      var mk = +d0.k.split('-')[1];
      var label = '';
      if (mk !== prevM) { label = '<div class="tiny muted" style="height:14px">' + mk + '月</div>'; prevM = mk; }
      var cells = col.map(function (c) {
        if (c.lvl < 0) return '<div class="cell" style="opacity:0"></div>';
        var cls = c.lvl > 0 ? ' l' + c.lvl : '';
        return '<div class="cell' + cls + (c.today ? ' today' : '') + '" title="' + c.k + '"></div>';
      }).join('');
      return '<div class="col">' + label + cells + '</div>';
    }).join('');
    return '<div class="heat">' + cols + '</div>';
  }

  function meView() {
    var S = Eng.S, t = totals();
    var ws = Eng.wordState(), est = E.estimate(S);
    var st = E.streak(S.days);
    var ach = achievements();
    var lessonsDone = ED.course.list.filter(function (l) { var s = S.lessons[l.id]; return s && s.done; }).length;
    var acc = t.totalQn ? Math.round(t.totalQk / t.totalQn * 100) : 0;
    var mockBest = 0; (S.mocks || []).forEach(function (m) { if (m.total > mockBest) mockBest = m.total; });

    // 7 日柱状
    var bars = '';
    for (var i = 6; i >= 0; i--) {
      var d = Eng.S.days[E.dayKey(-i)];
      var val = ((d && d.sec) || 0) / 60;
      var hgt = Math.min(100, val / (S.set.goalMin || 30) * 100);
      bars += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">' +
        '<div style="width:14px;border-radius:5px;background:linear-gradient(180deg,#4f46e5,#a5b0f6);height:' + Math.max(2, hgt) + 'px"></div>' +
        '<span class="tiny muted">' + (i === 0 ? '今' : ['日', '一', '二', '三', '四', '五', '六'][E.parseKey(E.dayKey(-i)).getDay()]) + '</span></div>';
    }

    // 模考趋势
    var trendHtml = '';
    var mocks = S.mocks || [];
    if (mocks.length) {
      var mx = 150;
      var pts = mocks.map(function (m) {
        var x = 8, y = 96 - Math.round(m.total / mx * 80);
        return { x: x, y: y, v: m.total };
      });
      // 简单 SVG 折线
      var path = pts.map(function (p, i) { return (i ? ' L' : 'M') + (20 + i * 46) + ' ' + p.y; }).join('');
      var labels = pts.map(function (p, i) {
        return '<text x="' + (20 + i * 46) + '" y="112" font-size="9" fill="#8a8fa8" text-anchor="middle">' + p.v + '</text>';
      }).join('');
      var circs = pts.map(function (p, i) {
        return '<circle cx="' + (20 + i * 46) + '" cy="' + p.y + '" r="4" fill="#4f46e5"><title>' + p.v + '/150</title></circle>';
      }).join('');
      var W = Math.max(120, 20 + (pts.length - 1) * 46 + 20);
      trendHtml = '<div class="card pad"><div style="font-weight:800" class="mb8">模考成绩趋势（' + mocks.length + ' 次）</div>' +
        '<svg viewBox="0 0 ' + W + ' 120" style="width:100%;max-width:560px;height:auto"><line x1="10" y1="96" x2="' + (W - 8) + '" y2="96" stroke="#eceef7" stroke-width="2"/>' +
        '<path d="' + path + '" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"/>' + circs + labels + '</svg>' +
        '<div class="tiny muted">最新一次：' + mocks[mocks.length - 1].total + '/150</div></div>';
    }

    var badgesHtml = ach.defs.map(function (b) {
      var on = !!S.badges[b.id];
      return '<div class="badge-item ' + (on ? '' : 'locked') + '"><div class="b-ico">' + (on ? b.ico : '🔒') + '</div><b>' + b.name + '</b></div>';
    }).join('');

    return '' +
      '<div class="hero" style="background:linear-gradient(135deg,#334155,#0f172a)">' +
        '<div class="checkin-hero">' +
          '<div style="width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,#f59e0b,#f43f5e);display:flex;align-items:center;justify-content:center;font-size:30px;flex:0 0 64px;box-shadow:0 8px 20px rgba(0,0,0,.25)">' + esc((S.user.name || '同')[0]) + '</div>' +
          '<div class="grow"><h1>' + esc(S.user.name || '同学') + ' 的学习档案</h1>' +
          '<p>连续 ' + st + ' 天 · 累计打卡 ' + t.daysN + ' 天 · 最长连击 ' + t.longest + ' 天</p></div>' +
          '<button class="btn xs" data-act="me-name" style="background:rgba(255,255,255,.16)">✏️ 改名</button>' +
        '</div>' +
      '</div>' +

      '<div class="grid g4 mt16">' +
        stat('📖', '已掌握词汇', ws.known, '/ ' + ws.total, 'est' in {} ? 0 : 0) +
        stat('⏱', '累计学习', Math.round(t.sec / 3600 * 10) / 10, '小时', 0) +
        stat('🎯', '题目正确率', acc, '%（' + t.totalQn + ' 题）', 0) +
        stat('📝', '预估分', est, '/ 150', 0) +
      '</div>' +

      '<div class="card pad mt16"><div class="row wrap"><b>🎯 向满分进发</b><span class="chip brand" style="margin-left:auto">' + est + ' / 150</span></div>' +
        '<div class="pbar mt12"><i style="width:' + Math.round(est / 150 * 100) + '%"></i></div>' +
        '<div class="row mt8 tiny muted">起步 50 分 → 每掌握一层词汇、通关一组语法、刷完一轮专项、多做一次模考，预估分都会上移。</div></div>' +

      '<div class="sect"><h3>打卡日历</h3><span class="chip">🔥 ' + st + ' 连击</span></div>' +
      '<div class="card pad">' + heatHTML() +
        '<div class="heat-legend mt8">少 <span class="cell l1"></span><span class="cell l2"></span><span class="cell l3"></span><span class="cell l4"></span> 多' +
        '<span style="margin-left:auto">今日 <span class="cell today"></span></span></div>' +
        '<div class="hr"></div><div class="row wrap"><b class="small">最近 7 天学习时长（分钟/天）</b></div>' +
        '<div class="row mt12" style="align-items:flex-end;height:110px">' + bars + '</div>' +
      '</div>' +

      '<div class="sect"><h3>学习总览</h3></div>' +
      '<div class="grid g2">' +
        '<div class="card pad"><div class="k muted small" style="font-weight:700">📊 各维度进度</div>' +
          oneBar('词汇掌握', ws.known, ws.total, '#0ea5e9') +
          oneBar('语法课程', lessonsDone, ED.course.list.length, '#7c3aed') +
          oneBar('练习正确率', acc, 100, '#0ea56a') +
          '<div class="muted tiny mt8">新学词 ' + S.stats.wNew + ' · 复习卡 ' + S.stats.reviews + ' · 模考 ' + (S.mocks || []).length + ' 次</div></div>' +
        '<div class="card pad"><div class="k muted small" style="font-weight:700">🏅 成就 · ' + ach.unlocked + '/' + ach.defs.length + '</div>' +
          '<div class="grid g3 mt8">' + badgesHtml + '</div></div>' +
      '</div>' + trendHtml +

      '<div class="sect"><h3>目标设置</h3></div>' +
      '<div class="card pad">' +
        '<div class="row wrap" style="gap:8px">' +
          goalCtl('每日新词', S.set.goalW, [10, 20, 30, 40, 60], 'me-gw') +
          goalCtl('每日题量', S.set.goalQ, [10, 20, 30, 50], 'me-gq') +
          goalCtl('每日时长', S.set.goalMin, [15, 30, 45, 60, 90], 'me-gm') +
        '</div>' +
        '<div class="tiny muted mt12">学习目标影响首页“今日任务”进度条，保持“跳一跳够得着”的量最有动力。</div>' +
      '</div>' +

      '<div class="sect"><h3>数据与备份</h3></div>' +
      '<div class="card pad">' +
        '<p class="small muted">所有学习数据保存在本机浏览器（localStorage）。清理 Safari 数据前请先导出备份；换 iPad / 手机可用导入继续学习。</p>' +
        '<div class="row mt12 wrap" style="gap:8px">' +
          '<button class="btn soft sm" data-act="me-export">⬇️ 导出备份</button>' +
          '<button class="btn ghost sm" data-act="me-import">⬆️ 导入备份</button>' +
          '<button class="btn bad sm" data-act="me-reset">🗑 清空重置</button>' +
        '</div>' +
        '<input type="file" id="meFile" accept=".json,application/json" style="display:none">' +
      '</div>' +

      '<div class="sect"><h3>关于</h3></div>' +
      '<div class="card pad small muted">' +
        '<p><b>满分英语 · 河南专升本版</b> v1.0 —— 从高考 50 分到专升本英语 150 分的完整学习路径。</p>' +
        '<p>试卷结构参考近年河南专升本公共英语真题（阅读 40 / 完形 20 / 判断 10 / 英译汉 10 / 选词 15 / 汉译英 15 / 改错 20 / 写作 20）。本应用题库为学习型模拟内容，用于日常训练。</p>' +
        '<p>提示：iPad 上点「分享 → 添加到主屏幕」即可全屏使用；应用支持离线打开（需先在线打开过一次）。</p>' +
      '</div>';
  }

  function stat(ico, k, v, unit, _) {
    return '<div class="card stat-card"><div class="k">' + ico + ' ' + k + '</div><div class="v">' + v + '<small> ' + unit + '</small></div></div>';
  }
  function oneBar(name, v, max, color) {
    var pct = Math.min(100, max ? Math.round(v / max * 100) : 0);
    return '<div class="mt12"><div class="row"><span class="small muted">' + name + '</span><span class="small" style="margin-left:auto;font-weight:700">' + v + '/' + max + '</span></div>' +
      '<div class="pbar thin mt4"><i style="width:' + pct + '%;background:' + color + '"></i></div></div>';
  }
  function goalCtl(name, val, opts, act) {
    return '<div style="flex:1;min-width:140px"><div class="small muted" style="font-weight:700">' + name + '</div>' +
      '<div class="row mt8 wrap" style="gap:6px">' + opts.map(function (o) {
        return '<button class="btn xs ' + (val === o ? 'soft' : 'ghost') + '" data-act="' + act + '" data-v="' + o + '">' + o + '</button>';
      }).join('') + '</div></div>';
  }

  /* ---------- 动作 ---------- */
  Eng.actions['me-name'] = function () {
    Eng.modal(
      '<div class="mt12"><input class="inp" id="meNameInp" maxlength="12" placeholder="你的称呼" value="' + esc(Eng.S.user.name || '') + '"></div>' +
      '<button class="btn block mt16" data-act="me-name-save">保存</button>', { title: '✏️ 修改称呼' });
    setTimeout(function () { var el = document.getElementById('meNameInp'); if (el) el.focus(); }, 60);
  };
  Eng.actions['me-name-save'] = function () {
    var el = document.getElementById('meNameInp');
    if (el && el.value.trim()) Eng.S.user.name = el.value.trim();
    Eng.closeModal(); Eng.save(); Eng.go('me');
  };
  Eng.actions['me-gw'] = function (el, d) { Eng.S.set.goalW = +d.v; Eng.save(); Eng.go('me'); };
  Eng.actions['me-gq'] = function (el, d) { Eng.S.set.goalQ = +d.v; Eng.save(); Eng.go('me'); };
  Eng.actions['me-gm'] = function (el, d) { Eng.S.set.goalMin = +d.v; Eng.save(); Eng.go('me'); };

  Eng.actions['me-export'] = function () {
    var blob = new Blob([Eng.exportData()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '满分英语-备份-' + E.dateKey() + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 300);
    Eng.toast('✅ 备份已导出');
  };
  Eng.actions['me-import'] = function () {
    document.getElementById('meFile').click();
    var f = document.getElementById('meFile');
    f.onchange = function () {
      var file = f.files[0];
      if (!file) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          Eng.importData(rd.result);
          Eng.toast('✅ 备份导入成功');
          Eng.go('me');
        } catch (err) {
          Eng.toast('⚠️ 文件格式不正确');
        }
      };
      rd.readAsText(file);
    };
  };
  Eng.actions['me-reset'] = function () {
    Eng.modal(
      '<p class="small muted mt8">将清空本机全部学习记录、词汇进度与成绩，且不可恢复（建议先导出备份）。</p>' +
      '<div class="row mt16" style="gap:10px"><button class="btn ghost grow" data-close>取消</button>' +
      '<button class="btn bad grow" data-act="me-reset-yes">确认清空</button></div>',
      { title: '⚠️ 清空所有数据？' });
  };
  Eng.actions['me-reset-yes'] = function () {
    Eng.closeModal();
    Eng.resetAll();
    // 重置模块内存态
    try { g.Eng && g.Eng.go && g.Eng.go('me'); } catch (e) { location.reload(); }
    Eng.toast('已重置，重新开始吧 🌱');
  };
})(window);
