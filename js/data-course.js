/* ============================================================
   语法系统课 + 随堂测验题库  window.ED.course
   课: { id, lv, title, est, blocks:[{k:'p'|'eg'|'tip', ...}], qs:[{q,o,a,e}] }
   ============================================================ */
(function (g) {
  var C = { levels: [
    { lv: 1, name: 'A · 基础语法重建', desc: '对应 50→80 分阶段', color: '#0ea5e9' },
    { lv: 2, name: 'B · 高中核心语法', desc: '对应 80→110 分阶段', color: '#0ea56a' },
    { lv: 3, name: 'C · 专升本拔高语法', desc: '对应 110→150 分阶段', color: '#7c3aed' }
  ], list: [] };
  function lesson(o){ C.list.push(o); return o; }

  /* ============ A 基础 ============ */
  lesson({
    id: 'A1', lv: 1, title: '名词：可数与不可数', est: '12 分钟',
    blocks: [
      { k: 'p', x: '专升本考点中名词主要考三点：①可数/不可数；②单复数变化；③名词所有格。先把最常见的“永远不可数”名词背下来：advice、information、news、homework、furniture、equipment、progress、knowledge、weather、traffic。它们不能直接加 a/an 或 -s，要表达数量用 a piece of … 等量词。' },
      { k: 'p', x: '②常考不规则复数：man→men，woman→women，child→children，tooth→teeth，foot→feet，mouse→mice。外来词复数：analysis→analyses（分析），crisis→crises（危机），phenomenon→phenomena（现象），medium→media（媒体），datum→data（数据）。' },
      { k: 'eg', en: 'Can you give me some advice on how to learn English?', zh: '你能给我一些学英语的建议吗？（advice 不可数，无复数）' },
      { k: 'eg', en: 'Many women teachers attended the meeting.', zh: '许多女教师参加了会议。（man/woman 修饰复数名词时也变复数）' },
      { k: 'tip', x: '看到选项里出现 informations / advices / furnitures 直接排除——考试最爱用“假复数”做干扰项。' }
    ],
    qs: [
      { q: 'Would you like some ___ about the trip?', o: ['advices', 'advice', 'an advice', 'the advices'], a: 1, e: 'advice 不可数，不能加 -s，也不能加 a/an。' },
      { q: 'All the ___ in our school will have a meeting tomorrow.', o: ['woman teachers', 'women teachers', 'women teacher', 'woman teacher'], a: 1, e: 'man / woman 作定语修饰复数名词时，本身也要变复数。' },
      { q: 'Two ___ and three ___ visited our school last week.', o: ['Germans; Japanese', 'German; Japanese', 'Germans; Japaneses', 'German; Japaneses'], a: 0, e: 'German 的复数是 Germans；Japanese 单复数同形。' },
      { q: 'He has collected a great deal of ___ about the accident.', o: ['informations', 'information', 'an information', 'information pieces'], a: 1, e: 'information 不可数；表示“一条信息”用 a piece of information。' }
    ]
  });
  lesson({
    id: 'A2', lv: 1, title: '冠词 a / an / the', est: '12 分钟',
    blocks: [
      { k: 'p', x: '① a / an 用于泛指单数可数名词：a 后接辅音音素开头，an 后接元音音素开头。注意是“音素”不是字母：an hour（h 不发音）、an honest boy；a university / a useful book（u 读 /ju:/ 为辅音开头）。' },
      { k: 'p', x: '② the 用于特指：上文提到过的人或物、独一无二的事物（the sun）、江河湖海山脉（the Yellow River）、乐器前（play the piano）、形容词最高级与序数词前（the best、the first）。' },
      { k: 'p', x: '③ 零冠词：三餐（have breakfast）、球类/棋类运动（play basketball）、by+交通工具（by bus）、学科、语言前一般不加 the。但若有后置定语特指时又要加 the，如 the breakfast today。' },
      { k: 'eg', en: 'He is an honest boy and the tallest student in his class.', zh: '他是个诚实的男孩，也是班里最高的学生。（honest 的 h 不发音，用 an）' },
      { k: 'tip', x: '判断口诀：泛指单数看“音素”，特指唯一用 the，三餐球类学科语言不用冠词。' }
    ],
    qs: [
      { q: 'He is ___ honest boy and ___ best student in our class.', o: ['a; the', 'an; the', 'an; a', 'the; a'], a: 1, e: 'honest 以元音音素开头用 an；最高级前加 the。' },
      { q: '___ Changjiang River is one of ___ longest rivers in the world.', o: ['The; the', '/; the', 'The; /', '/; /'], a: 0, e: '江河名称前加 the；最高级前加 the。' },
      { q: 'I usually have ___ breakfast at home, but ___ breakfast today was special.', o: ['/; the', 'the; the', 'a; the', '/; a'], a: 0, e: '泛指三餐不加冠词；后有 today 特指，加 the。' },
      { q: 'She plays ___ piano well but dislikes playing ___ basketball.', o: ['the; /', 'the; the', '/; the', '/; /'], a: 0, e: '乐器前加 the，球类运动前不加冠词。' }
    ]
  });
  lesson({
    id: 'A3', lv: 1, title: '代词：人称·物主·反身·不定', est: '14 分钟',
    blocks: [
      { k: 'p', x: '① 人称代词：作主语用主格（I/he/she），作宾语用宾格（me/him/her）。② 物主代词：my/mine 的区别——my 后必须跟名词（my book），mine 独立使用（This book is mine）。' },
      { k: 'p', x: '③ 反身代词 myself/yourself/himself…：用于 by oneself（独自）、enjoy oneself（玩得开心）、help oneself to（随便吃）、dress oneself 等固定搭配。④ 不定代词：some/any——some 用于肯定句与“请求建议”的疑问句；any 用于否定和一般疑问句。' },
      { k: 'p', x: '⑤ 比较句中的替代：The weather here is warmer than that of Beijing.（that 代替不可数/单数名词，those 代替复数名词。）' },
      { k: 'eg', en: 'Help yourself to some fish, please.', zh: '请随便吃点鱼。（help oneself to 固定搭配）' },
      { k: 'eg', en: 'The population of China is larger than that of Japan.', zh: '中国的人口比日本的多。（that 代替 the population）' },
      { k: 'tip', x: '一句话内出现两个相同名词时，第二个用 that/those/one 代替；不可数与单数用 that，复数用 those。' }
    ],
    qs: [
      { q: 'My phone is broken. May I use ___?', o: ['your', 'yours', 'you', 'yourself'], a: 1, e: '空格后无名词，用名词性物主代词 yours。' },
      { q: 'I can’t carry the box by ___, so I asked Tom for help.', o: ['me', 'my', 'myself', 'mine'], a: 2, e: 'by oneself 独自、靠自己。' },
      { q: 'Would you like ___ to drink?', o: ['something', 'anything', 'everything', 'nothing'], a: 0, e: '表示请求、建议并希望得到肯定答复时用 something。' },
      { q: 'The weather in Zhengzhou is colder than ___ in Guangzhou in winter.', o: ['it', 'that', 'one', 'those'], a: 1, e: 'that 代替前面提到的不可数名词 the weather。' }
    ]
  });
  lesson({
    id: 'A4', lv: 1, title: '形容词与副词：比较级', est: '14 分钟',
    blocks: [
      { k: 'p', x: '① 规则变化：单音节与部分双音节加 -er/-est；多音节与 -ly 副词前加 more/most（important→more important）。② 不规则：good/well→better→best；bad/badly→worse→worst；many/much→more→most；little→less→least；far→farther/further。' },
      { k: 'p', x: '③ 常见句型：A is + 比较级 + than B；The + 比较级, the + 比较级（越…越…）；比较级 + and + 比较级（越来越…）；one of the + 最高级 + 复数名词；比较级前可用 much / even / a lot / a little 修饰，不能用 very 或 more 叠用。' },
      { k: 'eg', en: 'The harder you work, the greater progress you will make.', zh: '你越努力，取得的进步就越大。' },
      { k: 'eg', en: 'This problem is much more difficult than that one.', zh: '这道题比那道难得多。（much 修饰比较级）' },
      { k: 'tip', x: '看到 more better、more easier 这类“双重比较”直接排除。' }
    ],
    qs: [
      { q: 'Of the two shirts, this one is the ___ of the two.', o: ['cheapest', 'cheaper', 'more cheap', 'most cheap'], a: 1, e: '两者比较用比较级，且“the + 比较级 + of the two”是固定表达。' },
      { q: 'She sings ___ than any other student in her class.', o: ['much well', 'much better', 'more better', 'very better'], a: 1, e: 'much 修饰比较级；more better 双重比较是错的。' },
      { q: 'The ___ you work, the ___ progress you will make.', o: ['harder; more', 'more hard; more', 'harder; greater', 'more harder; greater'], a: 0, e: 'the + 比较级，the + 比较级 表示“越…越…”。' },
      { q: 'He was ___ tired ___ he couldn’t walk on.', o: ['so; that', 'such; that', 'too; to', 'enough; to'], a: 0, e: 'so…that… 如此…以至于…，后接从句。' }
    ]
  });
  lesson({
    id: 'A5', lv: 1, title: '介词与连词', est: '14 分钟',
    blocks: [
      { k: 'p', x: '介词主要考固定搭配，先掌握最常考的：be popular with（受欢迎）、be strict with sb / in sth、be good at、be proud of、be afraid of、be interested in、be busy with、worry about、believe in、depend on、look forward to、take part in、pay attention to、be familiar with / be familiar to。' },
      { k: 'p', x: '连词按逻辑关系记忆：并列 and/or/but；因果 so/because（because 后接从句，because of 后接名词）；转折 but/however；时间 when/while/as soon as/until/since；条件 if/unless；让步 although/though（不能和 but 连用）。' },
      { k: 'eg', en: 'She is popular with her classmates because she is kind.', zh: '她在同学中很受欢迎，因为她很善良。（注意 because 与 because of 的搭配）' },
      { k: 'eg', en: 'Although it rained heavily, they went on working.', zh: '尽管雨下得很大，他们仍然继续工作。（although 不与 but 连用）' },
      { k: 'tip', x: 'although/though 与 but、because 与 so 不能在同一句同时出现，这是改错题高频考点。' }
    ],
    qs: [
      { q: 'The young teacher is very popular ___ her students.', o: ['to', 'with', 'for', 'at'], a: 1, e: 'be popular with 受…欢迎。' },
      { q: 'We go to school ___ bus every day.', o: ['on', 'by', 'in', 'with'], a: 1, e: 'by bus 乘公交车，中间不加冠词。' },
      { q: 'Don’t worry ___ your exam. I believe ___ you.', o: ['about; in', 'for; on', 'with; of', 'at; for'], a: 0, e: 'worry about 担心；believe in 信任。' },
      { q: '___ he is very young, ___ he knows a lot about computers.', o: ['Although; but', 'Although; /', 'Because; so', 'If; then'], a: 1, e: 'although 与 but 不能连用，只能用一个。' }
    ]
  });
  lesson({
    id: 'A6', lv: 1, title: '基础时态：现在·过去·将来·进行', est: '16 分钟',
    blocks: [
      { k: 'p', x: '① 一般现在时：表习惯/真理/经常性动作，主语三单谓语加 -s；常与 always, usually, often, sometimes, every day 连用。② 一般过去时：表过去发生的动作，用动词过去式，时间标志 yesterday, last week, ... ago, just now。' },
      { k: 'p', x: '③ 一般将来时：will + 动词原形；be going to + 动词原形。④ 现在进行时：am/is/are + doing，标志词 look, listen, now, at present；⑤ 过去进行时：was/were + doing，常与 at 8 o’clock yesterday, when/while 引导的时间状语连用。' },
      { k: 'eg', en: 'Listen! Someone is singing in the next room.', zh: '听！有人在隔壁唱歌。（listen/look 常配现在进行时）' },
      { k: 'eg', en: 'I was doing my homework at eight o’clock last night.', zh: '昨晚八点我正在做作业。' },
      { k: 'tip', x: '主将从现：主句用将来时，时间/条件状语从句用一般现在时——as soon as / if / when / until 引导的从句中不用 will。' }
    ],
    qs: [
      { q: 'Look! The children ___ football on the playground.', o: ['play', 'played', 'are playing', 'have played'], a: 2, e: 'look 提示动作正在进行，用现在进行时。' },
      { q: 'She ___ to Beijing next week with her parents.', o: ['flies', 'will fly', 'flew', 'has flown'], a: 1, e: 'next week 表将来，用一般将来时。' },
      { q: 'He ___ his homework at eight o’clock yesterday evening.', o: ['did', 'does', 'was doing', 'has done'], a: 2, e: '过去某一时刻正在做的事用过去进行时。' },
      { q: 'I will tell him the news as soon as he ___ back.', o: ['comes', 'came', 'will come', 'is coming'], a: 0, e: '主将从现：as soon as 从句中用一般现在时表将来。' }
    ]
  });

  /* ============ B 高中核心 ============ */
  lesson({
    id: 'B1', lv: 2, title: '完成时态：现在完成·过去完成', est: '18 分钟',
    blocks: [
      { k: 'p', x: '① 现在完成时 have/has + done：表示“过去动作对现在的影响”或“从过去持续到现在的动作”。标志词：already, yet, ever, never, just, so far, recently, in the past few years, since + 过去时间点, for + 时间段。' },
      { k: 'p', x: '② 短暂性动词（come, go, leave, buy, borrow, begin, die, join）不能与 for + 时间段连用，须换成延续性动词：buy→have had；borrow→have kept；come→have been here；die→have been dead；join→have been in/a member of；begin→have been on。' },
      { k: 'p', x: '③ have gone to 去了未回；have been to 去过已回；have been in 一直在某地。④ 过去完成时 had + done：表示“过去的过去”，常用于 by the time / when 引导的从句中，或 said/thought/knew 后。' },
      { k: 'eg', en: 'The film had been on for ten minutes when I arrived.', zh: '我到的时候电影已经开始十分钟了。（begin 短暂 → 用 be on 延续）' },
      { k: 'eg', en: 'She has been to Shanghai twice; she knows it well.', zh: '她去过上海两次，很熟悉那里。' },
      { k: 'tip', x: '见到 for+时段/since+过去点 与短暂动词搭配，第一步就要想到换延续性动词。' }
    ],
    qs: [
      { q: 'She ___ English since she was five years old.', o: ['learns', 'learned', 'has learned', 'is learning'], a: 2, e: 'since + 过去时间点，主句用现在完成时。' },
      { q: 'By the time he arrived, the film ___ for ten minutes.', o: ['began', 'has begun', 'had begun', 'had been on'], a: 3, e: '过去完成时 + 延续性动词 be on 才能接 for 时间段。' },
      { q: '— Where is Tom? — He ___ to Shanghai. He ___ there twice.', o: ['has gone; has been', 'has been; has gone', 'went; has gone', 'has gone; went'], a: 0, e: '去了未归用 has gone to；去过已归用 has been to。' },
      { q: 'I ___ my keys and can’t find them anywhere.', o: ['lost', 'have lost', 'lose', 'had lost'], a: 1, e: '过去动作对现在的影响（找不到），用现在完成时。' }
    ]
  });
  lesson({
    id: 'B2', lv: 2, title: '被动语态', est: '16 分钟',
    blocks: [
      { k: 'p', x: '被动语态 = be + 过去分词，时态体现在 be 上：一般现在 is/are done；一般过去 was/were done；一般将来 will be done；现在完成 has/have been done；含情态动词 must/can… be done。' },
      { k: 'p', x: '使用被动的情形：①动作执行者不明或不必说出；②强调动作承受者。带双宾语的动词变被动有两种：give sb sth → sb be given sth / sth be given to sb。使役与感官动词 make/see/hear sb do → sb be made/seen/heard to do（主动省 to，被动还原 to）。' },
      { k: 'eg', en: 'The bridge was built in 1980 and is still in good condition.', zh: '这座桥建于 1980 年，至今状况良好。' },
      { k: 'eg', en: 'He was seen to enter the building last night.', zh: '昨晚有人看见他进了大楼。（感官动词被动要加 to）' },
      { k: 'tip', x: '判断主被动：主语与动词之间是“被…的关系”且句中没有明显动作执行者，就用被动语态。' }
    ],
    qs: [
      { q: 'This bridge ___ in 1980 by the local government.', o: ['built', 'was built', 'has built', 'is built'], a: 1, e: '桥是“被建造”，1980 表过去，用一般过去时的被动。' },
      { q: 'English ___ in many countries all over the world.', o: ['speaks', 'is spoken', 'spoke', 'has spoken'], a: 1, e: '英语被说，一般现在时被动 is spoken。' },
      { q: 'The trees must ___ in spring every year.', o: ['plant', 'be planted', 'be planting', 'planted'], a: 1, e: '情态动词被动：must be done。' },
      { q: 'The old man was heard ___ an English song last night.', o: ['sing', 'to sing', 'sang', 'singing'], a: 1, e: '感官动词被动语态中 to 要还原：be heard to do。' }
    ]
  });
  lesson({
    id: 'B3', lv: 2, title: '情态动词', est: '16 分钟',
    blocks: [
      { k: 'p', x: '① 基本用法：can 能力/许可；may 许可/可能；must 必须；need 需要；should 应该。否定与回答要点：must 的否定回答用 needn’t（不必）或 don’t have to，不用 mustn’t（禁止）；mustn’t 表“禁止”。' },
      { k: 'p', x: '② 表推测：肯定推测——must be 一定是（有把握）；may/might be 可能是；否定推测——can’t be 不可能是；不用 mustn’t be 表推测。对过去推测：must/can’t/may + have done。' },
      { k: 'eg', en: 'You needn’t finish the work today; tomorrow is also fine.', zh: '你不必今天完成工作，明天也可以。' },
      { k: 'eg', en: 'The light is on, so she must be in the room now.', zh: '灯亮着，所以她一定在房间里。' },
      { k: 'tip', x: '“Must I…?” 否定回答：“No, you needn’t.”；“can’t be”表示有把握的否定推测，是阅读题高频语义。' }
    ],
    qs: [
      { q: 'You ___ hand in your homework today; tomorrow is also OK.', o: ['mustn’t', 'needn’t', 'can’t', 'may not'], a: 1, e: '不必做用 needn’t；mustn’t 表禁止。' },
      { q: '— Must I finish the report now? — No, you ___.', o: ['mustn’t', 'needn’t', 'can’t', 'shouldn’t'], a: 1, e: 'must 问句的否定回答用 needn’t（不必）。' },
      { q: 'He ___ be at home now, for I saw him in the office just now.', o: ['can’t', 'mustn’t', 'needn’t', 'shouldn’t'], a: 0, e: '有把握的否定推测用 can’t be，不用 mustn’t。' },
      { q: 'The door is open. Who ___ it be? It ___ be Tom—he left yesterday.', o: ['can; mustn’t', 'must; can’t', 'can; can’t', 'may; mustn’t'], a: 2, e: '疑问推测用 can；有把握否定推测用 can’t。' }
    ]
  });
  lesson({
    id: 'B4', lv: 2, title: '非谓语动词总览', est: '18 分钟',
    blocks: [
      { k: 'p', x: '一句话只能有一个谓语，其他动词要用非谓语（to do / doing / done）。区分口诀：表目的、将来、一次用 to do；表习惯、进行、主动用 doing；表被动、完成用 done。' },
      { k: 'p', x: '常接 to do 的动词：want, hope, decide, plan, refuse, agree, manage, fail, learn, offer, pretend, promise。常接 doing 的动词：enjoy, finish, avoid, mind, practice, keep, suggest, consider, imagine, admit, miss, risk。' },
      { k: 'p', x: '固定句型：It’s + adj. + to do；find/make it + adj. + to do；spend time (in) doing；be busy doing；look forward to doing（to 是介词）；can’t help doing（忍不住）。' },
      { k: 'eg', en: 'It is very important to learn English well.', zh: '学好英语非常重要。（It + be + adj. + to do）' },
      { k: 'eg', en: 'He went out to buy some books.', zh: '他出去买书了。（不定式表目的）' },
      { k: 'tip', x: 'look forward to / pay attention to / be used to / devote oneself to 后面全接 doing，考试必考。' }
    ],
    qs: [
      { q: 'It is important ___ English well before the exam.', o: ['learn', 'to learn', 'learning', 'learned'], a: 1, e: 'It is + adj. + to do sth 固定句式。' },
      { q: 'I enjoy ___ to light music when I am free.', o: ['listen', 'to listen', 'listening', 'listened'], a: 2, e: 'enjoy doing sth 喜欢做某事。' },
      { q: 'The boy ___ under the tree is my brother.', o: ['sits', 'sitting', 'sat', 'to sit'], a: 1, e: '现在分词作定语表主动进行：正在树下坐着的男孩。' },
      { q: 'We are looking forward to ___ you soon.', o: ['see', 'seeing', 'saw', 'seen'], a: 1, e: 'look forward to 中 to 是介词，后接 doing。' },
      { q: 'He spent the whole afternoon ___ his homework.', o: ['to do', 'doing', 'do', 'done'], a: 1, e: 'spend time (in) doing sth 花时间做某事。' }
    ]
  });
  lesson({
    id: 'B5', lv: 2, title: '定语从句', est: '18 分钟',
    blocks: [
      { k: 'p', x: '定语从句修饰先行词（名词/代词）。关系词选择：先行词指人——主语用 who/that，宾语用 who/whom/that，定语用 whose；先行词指物——主语/宾语用 which/that，定语用 whose；先行词表时间用 when、表地点用 where、表原因用 why。' },
      { k: 'p', x: '① that 与 which：介词后只能用 which/whom（in which 等）；先行词为不定代词 all, everything, nothing, much 或含 the only/the very/the first/最高级 时只能用 that。② which 引导非限定性定语从句可指代前面整句话。' },
      { k: 'eg', en: 'This is the school where I studied three years ago.', zh: '这就是我三年前读书的学校。（先行词表地点，从句缺状语 → where）' },
      { k: 'eg', en: 'I will never forget the days when we worked together.', zh: '我永远不会忘记我们一起工作的日子。' },
      { k: 'tip', x: '判断用关系代词还是关系副词：把先行词放回从句，若缺主语或宾语用 which/that/who，若从句结构完整只缺状语则用 where/when/why。' }
    ],
    qs: [
      { q: 'The man ___ is standing over there is our new teacher.', o: ['which', 'whom', 'who', 'whose'], a: 2, e: '先行词指人且在从句中作主语，用 who。' },
      { q: 'This is the school ___ I studied three years ago.', o: ['where', 'which', 'that', 'who'], a: 0, e: 'study 是不及物动词，从句结构完整，缺地点状语用 where。' },
      { q: 'I like the house ___ windows face south.', o: ['which', 'that', 'whose', 'where'], a: 2, e: 'windows 与 house 是所属关系，用 whose。' },
      { q: 'That is the reason ___ he was late for class.', o: ['why', 'which', 'what', 'how'], a: 0, e: '先行词 the reason，从句缺原因状语用 why。' },
      { q: 'He lives in the room, the windows ___ face south.', o: ['of which', 'which', 'whose', 'that'], a: 0, e: '介词 + which 结构：the windows of which 指“房间的窗户”。' }
    ]
  });
  lesson({
    id: 'B6', lv: 2, title: '名词性从句', est: '18 分钟',
    blocks: [
      { k: 'p', x: '名词性从句分四类：主语从句、宾语从句、表语从句、同位语从句。连接词：① that 陈述句（无意义，不省略的场合：主语从句句首、表语从句中）；② whether/if 一般疑问句（whether 可引导所有名词性从句，if 只能引导动词后的宾语从句）；③ 疑问词 what/which/who/where/when/why/how 引导特殊疑问句。' },
      { k: 'p', x: '关键区分 what 与 that：what = “…的东西/事情”，在从句中作成分（主语/宾语）；that 不充当任何成分。What he said is true.（what 作 said 的宾语）That he said so surprised me.（that 不充当成分）。' },
      { k: 'eg', en: 'What surprised me most was that he passed the exam.', zh: '最让我惊讶的是他通过了考试。（what 作主语，that 引导表语从句不充当成分）' },
      { k: 'eg', en: 'It is known to all that the earth goes around the sun.', zh: '众所周知，地球绕太阳转。（it 作形式主语）' },
      { k: 'tip', x: '见到 it + be + adj./n. + that 从句，多为形式主语 it，真主语是 that 从句，that 不省略。' }
    ],
    qs: [
      { q: '___ he said at the meeting surprised everyone.', o: ['That', 'What', 'Which', 'If'], a: 1, e: 'said 后缺宾语，用 what 表示“他说的话”。' },
      { q: 'The question is ___ we can finish the task on time.', o: ['that', 'whether', 'what', 'if'], a: 1, e: '表语从句表“是否”用 whether，不用 if。' },
      { q: 'It is known ___ all that the earth goes around the sun.', o: ['to', 'for', 'by', 'with'], a: 0, e: 'be known to all 为众所周知。' },
      { q: 'That is ___ I want to say to you.', o: ['what', 'that', 'which', 'why'], a: 0, e: 'say 后缺宾语，用 what。' },
      { q: '___ he will come or not doesn’t matter much.', o: ['If', 'Whether', 'That', 'What'], a: 1, e: '主语从句中表“是否”只能用 whether，不能用 if。' }
    ]
  });

  /* ============ C 专升本拔高 ============ */
  lesson({
    id: 'C1', lv: 3, title: '状语从句全解', est: '18 分钟',
    blocks: [
      { k: 'p', x: '状语从句九大类：时间（when/while/as/before/after/since/till/until/as soon as）、条件（if/unless/as long as/once/in case）、原因（because/since/as）、目的（so that/in order that）、结果（so…that/such…that）、让步（though/although/even if/whether…or not/whatever…）、比较（than/as…as）、方式（as/as if）、地点（where）。' },
      { k: 'p', x: '易混辨析：① while 后接延续性动词，when 后接瞬时或延续均可；② until 与延续动词同用表“一直到”，与短暂动词否定连用 not…until 表“直到…才”；③ as soon as / the moment 表“一…就”；④ so that 后接目的从句（常有 can/could），结果状语从句与主句间常有逗号。' },
      { k: 'eg', en: 'You will fail the exam unless you work hard.', zh: '除非你努力学习，否则考试会不及格。（unless = if…not）' },
      { k: 'eg', en: 'Take an umbrella in case it rains.', zh: '带把伞，以防下雨。' },
      { k: 'tip', x: '“直到…才”用 not…until；“还没…就”用 before。主将从现同样适用于 until / unless / in case。' }
    ],
    qs: [
      { q: 'You won’t pass the exam ___ you work harder.', o: ['if', 'unless', 'though', 'because'], a: 1, e: 'unless = if…not，意为“除非”。' },
      { q: '___ it was raining hard, they still went on working in the field.', o: ['Because', 'Although', 'If', 'Since'], a: 1, e: '“虽然…但是还…”用 although 引导让步状语从句。' },
      { q: 'I was reading a book ___ my mother came back.', o: ['while', 'when', 'as soon as', 'since'], a: 1, e: 'came back 是瞬时动作，用 when 引导时间状语从句。' },
      { q: 'She has lived in this city ___ she came here in 2015.', o: ['since', 'for', 'until', 'before'], a: 0, e: '主句完成时 + since + 过去时间点。' },
      { q: 'Speak louder ___ everyone can hear you clearly.', o: ['in case', 'so that', 'even if', 'now that'], a: 1, e: 'so that 表目的，“以便”。' }
    ]
  });
  lesson({
    id: 'C2', lv: 3, title: '虚拟语气', est: '20 分钟',
    blocks: [
      { k: 'p', x: '① 与现在事实相反：If + 主语 + did/were…, 主语 + would/could/should/might + 动词原形。② 与过去事实相反：If + 主语 + had done…, 主语 + would/could + have done。③ 与将来事实相反：If + were to do / should do, 主语 + would + do。' },
      { k: 'p', x: '④ 特殊句型：wish 后的宾语从句（现在 did/were，过去 had done，将来 would/could do）；as if 同 wish；suggest/advise/order/require/request/insist/demand + that 从句用 (should) + 动词原形；It’s (high) time that + 过去式 / should do；If only…“要是…就好了”。' },
      { k: 'eg', en: 'If I were you, I would take the opportunity.', zh: '如果我是你，我会抓住这个机会。（与现在相反，be 动词一律用 were）' },
      { k: 'eg', en: 'If she had worked harder, she would have passed the exam last year.', zh: '如果她去年更努力，她本可以通过考试。' },
      { k: 'tip', x: '见到 suggest/advise/order 等“建议命令请求”动词 + that 从句，从句用 (should) do，且 do 不能随主语变三单——高频改错考点。' }
    ],
    qs: [
      { q: 'If I ___ you, I would accept the job offer.', o: ['am', 'were', 'was', 'be'], a: 1, e: '与现在事实相反的虚拟条件句，be 用 were。' },
      { q: 'If she had studied harder, she ___ the exam last year.', o: ['passed', 'would pass', 'would have passed', 'had passed'], a: 2, e: '与过去事实相反，主句用 would have done。' },
      { q: 'I wish I ___ fly to the moon one day.', o: ['can', 'could', 'will', 'shall'], a: 1, e: 'wish 后表将来的愿望用 could。' },
      { q: 'The doctor suggested that she ___ more exercise.', o: ['takes', 'take', 'took', 'has taken'], a: 1, e: 'suggest + that 从句用 (should) + 动词原形。' },
      { q: 'It is high time that we ___ measures to protect the environment.', o: ['take', 'took', 'will take', 'have taken'], a: 1, e: 'It is (high) time that 后用过去式（虚拟）。' }
    ]
  });
  lesson({
    id: 'C3', lv: 3, title: '倒装句与强调句', est: '18 分钟',
    blocks: [
      { k: 'p', x: '① 部分倒装（助动词/情态动词提前）的四类开头词：否定词 Never, Hardly, Seldom, Little, Not only…, No sooner…；Only + 状语；So/Neither/Nor 开头（我也一样）；as/though 引导的让步从句（表语提前）。' },
      { k: 'p', x: '② 固定结构：Hardly/No sooner + had + 主语 + done + when/than + 主语 + did…（一…就…）。③ 强调句 It is/was + 被强调部分 + that/who + 其余部分：去掉 It is…that 后句子依然完整即强调句。' },
      { k: 'eg', en: 'Not until he came back did we know the truth.', zh: '直到他回来我们才知道真相。（not until 提前，主句部分倒装）' },
      { k: 'eg', en: 'It was in the park that I met her yesterday.', zh: '昨天我是在公园遇到她的。（强调地点状语，用 that）' },
      { k: 'tip', x: '强调句判定法：把 It is/was 与 that/who 删掉，若句子仍然完整通顺，就是强调句；否则可能是主语从句。' }
    ],
    qs: [
      { q: 'Not until he came back ___ the truth.', o: ['did we know', 'we knew', 'we did know', 'knew we'], a: 0, e: 'Not until 置于句首，主句部分倒装。' },
      { q: 'Only in this way ___ improve your spoken English.', o: ['you can', 'can you', 'you will', 'you must'], a: 1, e: 'Only + 状语 置于句首，主句倒装。' },
      { q: 'Hardly had I got home ___ it began to rain.', o: ['when', 'than', 'then', 'that'], a: 0, e: 'Hardly…when… 一…就…，固定搭配。' },
      { q: 'It was in the library ___ I met her yesterday.', o: ['that', 'where', 'which', 'who'], a: 0, e: '强调句型 It was…that…，去掉后句子完整。' },
      { q: 'Never ___ such a wonderful place before.', o: ['I have seen', 'have I seen', 'I saw', 'saw I'], a: 1, e: 'Never 置于句首，用部分倒装 have I seen。' }
    ]
  });
  lesson({
    id: 'C4', lv: 3, title: '主谓一致', est: '16 分钟',
    blocks: [
      { k: 'p', x: '核心原则：谓语动词的形式由主语决定，而非离动词最近的词。常考易错：① the number of + 复数名词 → 谓语用单数（…的数目）；a number of + 复数名词 → 谓语用复数（许多）。' },
      { k: 'p', x: '② either…or / neither…nor / not only…but also 连接主语 → 就近原则。③ with / together with / along with / as well as / rather than 连接 → 谓语随前面主语。④ 集体名词：police 通常作复数；family/class/team 视整体或成员而定；表示时间、金钱、距离的复数名词作主语 → 单数。' },
      { k: 'eg', en: 'The number of the students in our school is about 3,000.', zh: '我们学校的学生数约 3000。（the number of + 复数 → 单数谓语）' },
      { k: 'eg', en: 'Either you or he is to blame for the mistake.', zh: '要么你要么他应对这个错误负责。（就近原则）' },
      { k: 'tip', x: 'the number of（单数）与 a number of（复数）是改错题“钉子户”。' }
    ],
    qs: [
      { q: 'The number of students in our school ___ about three thousand.', o: ['is', 'are', 'were', 'have been'], a: 0, e: 'the number of… 意为“…的数目”，谓语用单数。' },
      { q: 'A number of students ___ playing basketball on the playground now.', o: ['is', 'are', 'was', 'has been'], a: 1, e: 'a number of = 许多，谓语用复数。' },
      { q: 'Either you or he ___ to clean the classroom today.', o: ['are', 'is', 'have', 'were'], a: 1, e: 'either…or 就近原则，靠近谓语的主语 he 为三单。' },
      { q: 'The police ___ looking for the lost child now.', o: ['is', 'are', 'was', 'has been'], a: 1, e: 'police 为集体名词，谓语用复数。' },
      { q: 'Three years ___ a long time for him to wait.', o: ['is', 'are', 'were', 'have been'], a: 0, e: '时间、距离、金钱作主语表整体时，谓语用单数。' }
    ]
  });
  lesson({
    id: 'C5', lv: 3, title: '非谓语难点：分词与固定句式', est: '18 分钟',
    blocks: [
      { k: 'p', x: '① 分词作状语：逻辑主语 = 句子主语。表主动进行用 doing；表被动完成用 done。The girl sat there, reading a novel.（女孩主动读）Seen from the hill, the city looks beautiful.（城市被看）' },
      { k: 'p', x: '② 不定式表目的/将来：The problem to be discussed tomorrow 明天将要讨论的问题。③ 感官动词 see/hear/watch/notice + 宾语 + do（全过程）或 + doing（正在进行）。④ make/let/have sb do；have sth done 让别人做。' },
      { k: 'p', x: '⑤ 重要固定句式：It is no use doing；There is no doing；be worth doing；be busy doing；have difficulty/trouble (in) doing。' },
      { k: 'eg', en: 'Seen from the top of the hill, the city looks even more beautiful.', zh: '从山顶看，这座城市更美了。（city 与 see 是被动关系，用 seen）' },
      { k: 'eg', en: 'I heard her singing in the next room when I passed by.', zh: '我路过时听到她在隔壁唱歌。（进行中的动作用 doing）' },
      { k: 'tip', x: '分词作状语先找逻辑主语，主语不一致 → 考查独立主格或改用从句。' }
    ],
    qs: [
      { q: '___ from the top of the hill, the city looks more beautiful.', o: ['Seeing', 'Seen', 'See', 'To see'], a: 1, e: '城市与 see 是被动关系，用过去分词 Seen 作状语。' },
      { q: 'I heard her ___ an English song in the next room just now.', o: ['sing', 'to sing', 'sang', 'sings'], a: 0, e: '感官动词 hear sb do sth 表示听见全过程。' },
      { q: 'The problem ___ at tomorrow’s meeting is very important.', o: ['discussed', 'to be discussed', 'discussing', 'being discussed'], a: 1, e: 'tomorrow 表将来 + 被动 → 用不定式被动 to be discussed。' },
      { q: '___ more time, we could have done the work better.', o: ['Given', 'Giving', 'Give', 'To give'], a: 0, e: 'we 与 give 是被动关系（被给更多时间），用 Given。' },
      { q: 'We have great difficulty ___ the problem by ourselves.', o: ['to solve', 'solving', 'solve', 'solved'], a: 1, e: 'have difficulty (in) doing sth 做某事有困难。' }
    ]
  });
  lesson({
    id: 'C6', lv: 3, title: '高分技巧：翻译·改错·写作', est: '16 分钟',
    blocks: [
      { k: 'p', x: '汉译英三步法：① 找主干（主谓宾）→ ② 定时态语态 → ③ 补从句/非谓语/固定搭配。宁可写简单正确的句子，不写复杂错误的句子。改错五查：查时态、查主谓一致、查固定搭配、查连词（although/but 混用）、查名词单复数。' },
      { k: 'p', x: '写作结构（20 分作文）：三段式——开头点题（2-3 句）+ 主体论证（给 2-3 个理由/例子，用 First…, Besides…, Finally… 串联）+ 结尾总结。注意：语法错误率要低于 5%，多用高频连接词与从句，字迹清晰。' },
      { k: 'eg', en: 'Although he was very tired, he went on working.', zh: '尽管他很累，他还是继续工作。（although…不能接 but）' },
      { k: 'eg', en: 'I look forward to hearing from you soon.', zh: '我期待尽快收到你的来信。（写作结尾常用句）' },
      { k: 'tip', x: '作文里 “亮点句”比“长难句”更重要：倒装、虚拟、非谓语各准备两句背熟，考场上稳定输出即可拿高分。' }
    ],
    qs: [
      { q: '“尽管他很累，他仍然继续工作。”的正确翻译是：', o: ['Although he was tired, he went on working.', 'Although he was tired, but he went on working.', 'Though he was tired, but he went on working.', 'Because he was tired, he went on working.'], a: 0, e: 'although 与 but 不能同时出现。' },
      { q: '下列句子中无语法错误的是：', o: ['I look forward to hear from you.', 'I look forward to hearing from you.', 'I look forward hearing from you.', 'I look forward to heard from you.'], a: 1, e: 'look forward to 后接 doing。' },
      { q: 'He failed the exam. ___, he had worked very hard before it.', o: ['However', 'Therefore', 'Besides', 'Moreover'], a: 0, e: '前后为转折关系，用 However。' },
      { q: '句子 “The number of books in the library are increasing.” 中的错误部分是：', o: ['The number', 'books', 'are', 'increasing'], a: 2, e: 'the number of… 作主语谓语用单数，are 应为 is。' }
    ]
  });

  // 全部随堂测验题按课组织；同时拍平一份总题库供“语法闯关”使用
  C.quiz = [];
  C.list.forEach(function (L) {
    L.qs.forEach(function (q) {
      q.lesson = L.id; q.lv = L.lv; C.quiz.push(q);
    });
  });
  g.ED = g.ED || {}; g.ED.course = C;
})(window);
