/* ============================================================
 *  data-grammar.js — 河南专升本英语 · 语法讲解卡片
 *  面向：基础差、看得懂中文就能学
 *  用法：手机上一卡一屏，点开就能看；和改错题一一对应
 *  signals = 看到这些特征就要警觉
 * ============================================================ */
window.GRAMMAR_DATA = {
  meta: {
    title: '专升本英语语法',
    sub: '按河南改错 12 类考点组织 · 零基础可读',
    order: '先看第 0 章地基，再看 1–12 章考点。地基不牢，考点记不住。'
  },

  chapters: [
    /* ================= 第 0 章 地基 ================= */
    {
      id: 'g0', title: '第 0 章 · 地基（基础差必看）',
      items: [
        {
          t: '词性', rule: '英文单词分 10 类，做题第一步是判断"这个词在这里当什么词性用"。',
          list: [
            '名词 n. —— 人、事、物。可数（book/books）/ 不可数（water, advice, information）',
            '动词 v. —— 动作或状态。分为实义动词、系动词（be, look, feel）、助动词（do, have, will）、情态动词（can, must）',
            '形容词 adj. —— 修饰名词，"……的"。good, happy',
            '副词 adv. —— 修饰动词/形容词/整句，"……地"。quickly, very',
            '代词 pron. —— 代替名词。I/me/my/mine, he/him/his',
            '数词 num. —— one, first',
            '冠词 art. —— a / an / the',
            '介词 prep. —— in, on, at, of, for, with',
            '连词 conj. —— and, but, because, although',
            '感叹词 int. —— oh, wow'
          ],
          trick: '选词填空 15 分全靠这个：先看空前后缺什么词性，再从词库里挑。'
        },
        {
          t: '句子成分', rule: '一句话 = 主语 + 谓语（+ 宾语/表语/定语/状语/补语）。找错前先找主干。',
          list: [
            '主语：谁/什么。通常是名词、代词、doing、to do、从句',
            '谓语：干什么/是什么。必须是**动词**，一个句子只能有一个谓语动词（这是改错题的核心考点）',
            '宾语：动词的对象。及物动词后面必须有',
            '表语：系动词后面的部分，说明主语是什么/怎么样',
            '定语：修饰名词，"……的"。短的在名词前，长的（介词短语/从句）在名词后',
            '状语：修饰动词/句子，说明时间、地点、原因、方式',
            '补语：补充说明宾语或主语（make him happy / he is called Tom）'
          ],
          trick: '考场上一个句子读三遍：①找谓语动词 ②找主语 ③看剩下的部分有没有多动词。'
        },
        {
          t: '五种基本句型', rule: '所有英文句子都是这五种之一。认得出句型，就认得出缺什么。',
          list: [
            '主 + 谓（不及物）：He runs.',
            '主 + 谓 + 宾：I like apples.',
            '主 + 系 + 表：She is a teacher. / The soup smells good.',
            '主 + 谓 + 双宾：He gave me a book.（me=间接宾语，a book=直接宾语）',
            '主 + 谓 + 宾 + 宾补：We made him happy.（happy 是 him 的补语）'
          ],
          trick: '改错题里最常见的错：把不及物动词当及物用（happen / arrive / listen 后面不能直接加宾语，要加 to/at）。'
        },
        {
          t: '时态总表', rule: '时态 = 时间（现在/过去/将来/过去将来）× 状态（一般/进行/完成/完成进行）。专升本只需熟练 8 种。',
          list: [
            '一般现在：do/does —— 经常性动作、客观真理',
            '一般过去：did —— 过去某时发生，已结束',
            '一般将来：will do / be going to do',
            '现在进行：am/is/are doing —— 此刻正在',
            '过去进行：was/were doing —— 过去某刻正在',
            '现在完成：have/has done —— 过去发生，影响现在；常配 already/yet/ever/never/just/since/for',
            '过去完成：had done —— 过去的过去',
            '过去将来：would do'
          ],
          trick: '改错题看到时间状语就先怀疑时态：yesterday/ago/last→过去；since/for/already/yet→现在完成；now/look/listen→现在进行；every day/usually→一般现在。'
        },
        {
          t: '非谓语总表', rule: '一个句子只能有一个谓语动词。多出来的动词必须"降级"成非谓语：to do / doing / done。',
          list: [
            'to do —— 表目的、将来、具体一次性动作。（I want to go.）',
            'doing —— 表主动、进行、习惯性。（He enjoys reading.）',
            'done —— 表被动、完成。（The book written by him）',
            '三种都能作：主语、宾语、表语、定语、状语、补语'
          ],
          trick: '判断用哪个，只问两句：①这个动作是主动还是被动？被动→done。②这个动作和谓语比，是同时/之前/之后？之后→to do。'
        },
        {
          t: '从句总表', rule: '从句 = 一个小句子当成分用。关键是看它"当什么"来定名字。',
          list: [
            '定语从句：修饰名词。先行词 + who/which/that/whose/where/when/why',
            '宾语从句：当宾语。that/if/whether/疑问词引导，注意**陈述语序**（不能倒装）',
            '状语从句：时间/地点/原因/条件/让步/结果/目的/比较',
            '主语从句 / 表语从句 / 同位语从句'
          ],
          trick: '宾语从句最常见的错：把疑问句语序照搬进去。错：I don\'t know where is he. 对：I don\'t know where he is.'
        }
      ]
    },

    /* ================= 1 冠词 ================= */
    {
      id: 'g1', title: '① 冠词 a / an / the',
      items: [
        {
          t: '规则', rule: 'a/an 表泛指"一个"，the 表特指"这个/那个"。可数名词单数前**必须有**冠词；不可数名词和复数名词表泛指时**不加**冠词。',
          list: [
            'a 用在辅音**音素**开头的词前：a book, a university（u 发 /juː/ 是辅音）, a one-way street',
            'an 用在元音**音素**开头的词前：an hour（h 不发音）, an honest boy, an umbrella, an old man',
            '特指、上文提过、独一无二、最高级/序数词前 → the：the sun, the earth, the first, the best',
            '乐器前加 the（play the piano）；球类、三餐、学科前不加（play football, have breakfast）',
            '固定搭配：in the morning / at night / go to school / go to the school（去学校办事）'
          ],
          signals: ['可数名词单数前光秃秃没冠词', 'a 后面跟元音开头的词', 'an 后面跟辅音开头的词', 'advice / information / furniture / news / luggage 前面加了 a/an'],
          trick: '看发音不看字母。university 开头是字母 u 但读 /juː/ 用 a；hour 开头是 h 但不发音用 an。'
        }
      ]
    },

    /* ================= 2 名词 ================= */
    {
      id: 'g2', title: '② 名词单复数与可数性',
      items: [
        {
          t: '规则', rule: '可数名词有单复数，不可数名词永远单数、不能加 a/an、不能加 s。',
          list: [
            '永远不可数（高频考点）：advice, information, news, furniture, luggage, equipment, homework, work, money, water, bread, paper（作"纸"时）, progress, knowledge',
            '单复数同形：sheep, deer, fish, means, series, species, Chinese, Japanese',
            '不规则复数：child→children, man→men, woman→women, foot→feet, tooth→teeth, mouse→mice',
            '以 -s 结尾但作单数（学科/病名/游戏）：physics, mathematics, economics, politics, news, measles（麻疹）',
            '合成名词变复数：looker-on→lookers-on, mother-in-law→mothers-in-law',
            'hundred / thousand / million / billion：前面有具体数字时**用单数**（two hundred students），表泛指时加 s（hundreds of students）'
          ],
          signals: ['many / a few / several + 不可数名词', 'much / little + 可数名词复数', 'two hundred**s** books', 'informations / advices / furnitures', 'police / people / cattle 后面用 is']
        }
      ]
    },

    /* ================= 3 主谓一致 ================= */
    {
      id: 'g3', title: '③ 主谓一致',
      items: [
        {
          t: '规则', rule: '谓语的单复数由主语决定。找准主语是第一步——中间插入的介词短语不算。',
          list: [
            '主语 + with / along with / together with / as well as / besides / except / including + 其他 → 谓语跟**前面**的主语一致。例：The teacher with his students **is** here.',
            'either...or / neither...nor / not only...but also / or → **就近原则**，跟最近的主语一致。例：Neither he nor I **am** right.',
            'there be 句型 → 就近原则。例：There **is** a pen and two books.',
            'each / every / everyone / somebody / nobody / either / neither / one → **单数**。例：Each of the students **has** a book.',
            'both / few / many / several / a number of → **复数**；the number of → **单数**',
            'the + 形容词 = 一类人 → 复数。例：The old **need** care.',
            '时间、金钱、距离作整体 → 单数。例：Ten years **is** a long time.',
            '不定式 / 动名词 / 从句作主语 → 单数。例：Reading books **is** helpful.',
            'police / people / cattle / youth → 复数'
          ],
          signals: ['主语后面跟 with / as well as / together with', 'either...or 后面谓语用了复数', 'each / every 后面谓语用了复数', 'the number of 后面谓语用了复数', 'the + adj. 后面谓语用了单数']
        }
      ]
    },

    /* ================= 4 时态 ================= */
    {
      id: 'g4', title: '④ 时态',
      items: [
        {
          t: '规则', rule: '时态错 = 时间状语和动词形式打架。找到时间词，再看动词。',
          list: [
            'yesterday / last week / in 1990 / ago / just now → **一般过去**（不是现在完成！）',
            'since / for + 时间段 / already / yet / ever / never / so far / recently / in the past few years → **现在完成**（have/has done）',
            'by the time + 过去时间 / before + 过去动作 → **过去完成**（had done）',
            'now / at the moment / look! / listen! → **现在进行**',
            'every day / usually / always / often / sometimes → **一般现在**（注意第三人称单数加 s）',
            '客观真理、自然规律 → 永远用**一般现在**（The sun rises in the east.）',
            '主将从现：if / when / as soon as / until 引导的时间条件状语从句，主句将来时，从句用**一般现在**'
          ],
          signals: ['yesterday 配 has done', 'since 配一般过去', 'by last year 配一般过去', '客观真理用了过去时', 'if 从句里用了 will']
        }
      ]
    },

    /* ================= 5 语态 ================= */
    {
      id: 'g5', title: '⑤ 语态（主动 / 被动）',
      items: [
        {
          t: '规则', rule: '主语是动作的**承受者**就用被动：be + 过去分词。判断方法：把主语放到动词后面，读得通吗？',
          list: [
            '被动语态结构：be + done。时态通过 be 体现：is done / was done / has been done / will be done / is being done',
            '不及物动词**没有被动**：happen, occur, appear, arrive, belong, die, rise, last, come true',
            '系动词不用被动：look, sound, smell, taste, feel, seem',
            'sell / read / write / wash / open 说明主语特性时用主动表被动：This book **sells** well.',
            'need / want / require + doing = need to be done：The room needs **cleaning**.',
            '常见被动搭配：be made of/from, be known for/as, be used to do（被用来做）/ be used to doing（习惯于）'
          ],
          signals: ['happen / occur / appear 出现在被动式里', 'by + 人 出现了但谓语是主动', 'The book wrote by him', 'need doing 写成 need to clean']
        }
      ]
    },

    /* ================= 6 非谓语 ================= */
    {
      id: 'g6', title: '⑥ 非谓语动词（河南最爱考）',
      items: [
        {
          t: '规则', rule: '一句话只有一个谓语动词。第二个动词必须变成 to do / doing / done。',
          list: [
            '**介词后面的 to 是介词，接 doing**：look forward to doing / be used to doing / object to doing / devote oneself to doing / pay attention to doing',
            '固定接 doing：enjoy, mind, avoid, finish, suggest, practice, consider, imagine, admit, deny, risk, keep, give up, can\'t help, be worth, It\'s no use/good',
            '固定接 to do：decide, hope, want, plan, agree, refuse, manage, offer, promise, afford, expect, learn',
            '接 doing 和 to do 意思不同：remember/forget/stop/go on + doing（已做/正在做）vs + to do（要去做）',
            '感官动词 + 宾语 + do（全过程）/ doing（正在）：see/hear/watch/notice/find sb do / doing',
            '使役动词 + 宾语 + do（省 to）：make/let/have sb do；但被动式要还原 to：be made **to** do',
            '分词作定语：doing 表主动（the boy standing there），done 表被动（the book written by him）',
            '分词作状语：逻辑主语必须和主句主语一致。错：Walking down the street, the tree caught my eye. 对：Walking down the street, **I** caught sight of the tree.'
          ],
          signals: ['look forward to hear（应 hearing）', 'be used to 后面接 do', 'The book writing by him', '分词状语的逻辑主语和主句主语不一致（悬垂分词）', 'make sb to do']
        }
      ]
    },

    /* ================= 7 代词 ================= */
    {
      id: 'g7', title: '⑦ 代词',
      items: [
        {
          t: '规则', rule: '代词的错有两种：①格用错（主格/宾格/物主代词/反身代词）②指代的人或数对不上。',
          list: [
            '主格（作主语）：I, you, he, she, it, we, they',
            '宾格（作宾语）：me, you, him, her, it, us, them',
            '形容词性物主代词（后必须跟名词）：my, your, his, her, its, our, their',
            '名词性物主代词（后不跟名词）：mine, yours, his, hers, its, ours, theirs',
            '反身代词：myself, yourself, himself, herself, itself, ourselves, yourselves, themselves',
            'everyone / everybody / someone / nobody 指人的时候用 **they/their** 回指（现代英语）',
            'one...the other（两个中另一个）/ one...another（不定数目中的另一个）/ some...others',
            'its（它的）vs it\'s（it is）'
          ],
          signals: ['between you and I（应 me）', 'myself 单独作主语', 'their 指代单数名词', 'its 和 it\'s 混用', 'everyone ... their（现在算对，但考试里多判错）']
        }
      ]
    },

    /* ================= 8 形容词副词 ================= */
    {
      id: 'g8', title: '⑧ 形容词与副词',
      items: [
        {
          t: '规则', rule: '形容词修饰**名词**和**系动词后的表语**；副词修饰**动词、形容词、副词、整句**。',
          list: [
            '系动词（be, look, sound, feel, taste, smell, seem, become, get, turn, grow, remain, stay）后面用**形容词**：The soup tastes **good**.（不是 well）',
            '实义动词后用**副词**：He sings **well**.',
            'hard（努力地/困难的）vs hardly（几乎不）；late（迟的）vs lately（最近）；near（近的）vs nearly（几乎）；high（高的）vs highly（高度地）',
            '形容词修饰 something / anything / nothing / everything 时要**后置**：something **important**',
            'enough 修饰形容词/副词时要**后置**：good **enough**；修饰名词时前置：enough money',
            'too...to（太……而不能）/ so...that（如此……以致）/ such...that（such + 名词短语）'
          ],
          signals: ['tastes well / smells nicely', 'He works hardly', 'something important 写成 important something', 'enough good 写成 good enough', 'so + 形容词 + 名词']
        }
      ]
    },

    /* ================= 9 比较级 ================= */
    {
      id: 'g9', title: '⑨ 比较级与最高级',
      items: [
        {
          t: '规则', rule: '两者比较用比较级（than），三者及以上用最高级（the + est）。',
          list: [
            '比较级前可加 much / far / a lot / a little / even / still 修饰，**不能加 very**',
            '同级比较：as + 原级 + as；否定 not as/so + 原级 + as',
            '比较级 + than any other + 单数名词 = 最高级含义（He is taller than any other student.）',
            'the + 比较级, the + 比较级（越……越……）：The more you read, the more you know.',
            '比较级 + and + 比较级（越来越……）：better and better',
            '最高级前必须加 the（副词最高级可省略）',
            'than 后面接代词：主格/宾格都行，但 than **I**（正式）比 than me（口语）更保险',
            '自身不能和自己比：错 My English is better than **me**. 对 My English is better than **his**.'
          ],
          signals: ['very better（应 much better）', 'more taller（重复）', '三者比较用比较级', '最高级前缺 the', 'My English is better than me']
        }
      ]
    },

    /* ================= 10 介词 ================= */
    {
      id: 'g10', title: '⑩ 介词与固定搭配',
      items: [
        {
          t: '规则', rule: '介词错基本就是固定搭配背错。这类题**没有技巧，只能记**。',
          list: [
            'in / on / at 时间：in 年/月/季节/世纪；on 具体某天/星期/某天的上下午；at 时刻/周末/夜晚（at night, at noon）',
            'in / on / at 地点：in 大地方（城市/国家）；on 面（on the table, on the wall）；at 小地点（at the bus stop）',
            '动词 + 介词：depend **on**, rely **on**, insist **on**, consist **of**, result **in**（导致）/ **from**（由……引起）, belong **to**, account **for**, look **into**, deal **with**, be engaged **in**, be interested **in**, be good **at**, be proud **of**, be afraid **of**, be responsible **for**',
            '形容词 + 介词：similar **to**, different **from**, familiar **with**（人）/ **to**（物）, superior **to**, inferior **to**, equal **to**',
            '注意 to 后面接 doing 的固定搭配（同第⑥章）'
          ],
          signals: ['depend of / insist in', 'interested on', 'different than（考试多判错，用 from）', 'superior than（应 to）']
        }
      ]
    },

    /* ================= 11 连词 ================= */
    {
      id: 'g11', title: '⑪ 连词与逻辑关系',
      items: [
        {
          t: '规则', rule: '连词错 = 逻辑关系反了，或者两个连词重复用。',
          list: [
            '**although / though 不能和 but 连用**；**because 不能和 so 连用**（中文习惯是"虽然…但是""因为…所以"，英文只能留一个）',
            '转折：but, yet, however, whereas, while',
            '因果：because, since, as, for（连词）/ so, therefore, thus（副词）',
            '条件：if, unless（= if not）, as long as, in case',
            '让步：although, though, even if, even though, no matter how, whatever',
            '并列/递进：and, or, not only...but also, both...and, neither...nor, either...or',
            '目的：so that, in order that；结果：so...that, such...that'
          ],
          signals: ['Although ... , but ...', 'Because ... , so ...', '两个连词连用', 'not only 后面缺 but also', 'neither...or（应 nor）']
        }
      ]
    },

    /* ================= 12 平行结构 ================= */
    {
      id: 'g12', title: '⑫ 平行结构',
      items: [
        {
          t: '规则', rule: 'and / or / but / not only...but also 连接的两边，**形式必须一致**。',
          list: [
            '名词对名词：I like apples and bananas.（不是 apples and to play）',
            '动词形式对动词形式：She likes singing and dancing.（不是 singing and to dance）',
            '形容词对形容词：He is kind and honest.',
            '介词短语对介词短语：in the morning and in the evening',
            'not only...but also / both...and / either...or / neither...nor 两边必须同型',
            '比较结构两边同型：Reading is more useful than **watching TV**.'
          ],
          signals: ['and 两边一个是 doing 一个是 to do', 'both 后面跟 A and 跟 B 但形式不同', 'than 两边结构不对称']
        }
      ]
    }
  ]
};
