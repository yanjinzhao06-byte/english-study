/* ============================================================
 *  data-errors.js — 河南专升本英语 · 改错题库（找错模式）
 *  每题结构：s 原句（含一处错） at 错在哪 to 怎么改 why 为什么
 *  at = "（无需改动）" 的是干扰项，训练"这行没错"的判断力
 * ============================================================ */
window.ERROR_DATA = {
  meta: {
    title: '改错题库',
    sub: '河南公共英语 改错 20 分 · 2 分 × 10 题',
    howto: '点击句中出错的那个词。判对后看「怎么改 + 为什么」。每章最后都有干扰项，别硬找错。',
    total: 156
  },

  chapters: [
    /* ---------- 1 冠词 ---------- */
    {
      id: 'e1', title: '① 冠词', rule: 'a/an 看首音素；可数单数前必须有冠词；不可数名词前不能加 a/an；独一无二事物用 the；乐器加 the、球类不加。',
      items: [
        { s: 'He is honest boy and we all like him.', at: 'honest', to: 'an honest', why: 'honest 首音为元音音素 /ˈɒnɪst/，用 an；可数单数 boy 前不能缺冠词。' },
        { s: 'The teacher told us that sun rises in the east.', at: 'that sun', to: 'that the sun', why: 'sun 为世界上独一无二的事物，前面必须加 the。' },
        { s: 'I bought a umbrella yesterday because it was raining.', at: 'a umbrella', to: 'an umbrella', why: 'umbrella 首音 /ʌ/ 是元音音素，用 an。' },
        { s: 'Please give me an advice about how to learn English.', at: 'an advice', to: 'a piece of advice', why: 'advice 是不可数名词，不能加 an，也不能变复数。' },
        { s: 'She plays the piano very well and she also likes playing the football.', at: 'the football', to: 'football', why: '乐器前加 the，球类运动前不加冠词。' },
        { s: 'I have never seen such a interesting film before.', at: 'a interesting', to: 'an interesting', why: 'interesting 首音 /ɪ/ 是元音音素，用 an。' },
        { s: 'He went to school by the bike this morning.', at: 'by the bike', to: 'by bike', why: 'by + 交通工具表方式时，名词前不加冠词（by bus / by train）。' },
        { s: 'The boy is tallest in his class.', at: 'tallest', to: 'the tallest', why: '形容词最高级前必须加 the。' },
        { s: 'She is an university student and studies very hard.', at: 'an university', to: 'a university', why: 'university 首音 /juː/ 是辅音音素，用 a。' },
        { s: 'I will finish the work in a hour.', at: 'a hour', to: 'an hour', why: 'hour 的 h 不发音，首音为元音音素，用 an。' },
        { s: 'There is a old man sitting under the tree.', at: 'a old', to: 'an old', why: 'old 首音 /əʊ/ 是元音音素，用 an。' },
        { s: 'The both of them agreed with the plan.', at: 'The both', to: 'Both', why: 'both 前面不加 the。' },
        { s: 'We had a good time last Sunday and the weather was fine.', at: '（无需改动）', to: '（无需改动）', why: '干扰项：have a good time 是固定搭配；the weather 特指当天的天气，均正确。' }
      ]
    },

    /* ---------- 2 名词 ---------- */
    {
      id: 'e2', title: '② 名词单复数与可数性', rule: '不可数名词不加 s、不加 a/an；以 -s 结尾的学科名、news、police 要看清单复数；hundred 前有数字用单数。',
      items: [
        { s: 'There are many informations in this book.', at: 'informations', to: 'information', why: 'information 是不可数名词，没有复数形式。' },
        { s: 'He gave me some good advices about the exam.', at: 'advices', to: 'advice', why: 'advice 不可数，无复数。' },
        { s: 'I have two hundreds books in my room.', at: 'two hundreds', to: 'two hundred', why: 'hundred 前有具体数字时用单数形式。' },
        { s: 'Physics are my favorite subject.', at: 'are', to: 'is', why: 'physics 等学科名虽以 -s 结尾，作单数看待。' },
        { s: 'Please put the furnitures in order before you leave.', at: 'furnitures', to: 'furniture', why: 'furniture 是不可数名词。' },
        { s: 'The police is looking into the case now.', at: 'is', to: 'are', why: 'police 作复数用，谓语用 are。' },
        { s: 'He has three childs and they all go to this school.', at: 'childs', to: 'children', why: 'child 的复数是 children。' },
        { s: 'Hundreds of peoples attended the meeting.', at: 'peoples', to: 'people', why: 'people 本身即复数；只有表示"民族"时才用 peoples。' },
        { s: 'The news are very exciting today.', at: 'are', to: 'is', why: 'news 虽以 -s 结尾，但作不可数单数。' },
        { s: "I'd like to give you a good news.", at: 'a good news', to: 'a piece of good news', why: 'news 不可数，不能直接加 a。' },
        { s: 'Two woman doctors are working in this hospital.', at: 'woman', to: 'women', why: 'man/woman 作定语修饰复数名词时，自身也要变复数。' },
        { s: 'All the equipments in the lab are new.', at: 'equipments', to: 'equipment', why: 'equipment 是不可数名词。' },
        { s: 'He spent three weeks doing his homeworks.', at: 'homeworks', to: 'homework', why: 'homework 是不可数名词。' }
      ]
    },

    /* ---------- 3 主谓一致 ---------- */
    {
      id: 'e3', title: '③ 主谓一致', rule: 'with/as well as 不改变主语；either...or / neither...nor / not only...but also 就近原则；each/every/everyone 用单数；the+形容词 用复数；the number of 用单数。',
      items: [
        { s: 'The teacher with his students are going to visit the museum.', at: 'are', to: 'is', why: 'with 引导的短语不是主语的一部分，谓语跟 the teacher 一致。' },
        { s: 'Neither he nor I are going to attend the meeting.', at: 'are', to: 'am', why: 'neither...nor 遵循就近原则，靠近 I，用 am。' },
        { s: 'Each of the students have a dictionary.', at: 'have', to: 'has', why: 'each of + 复数名词，谓语仍用单数。' },
        { s: 'The number of students in our school are increasing.', at: 'are', to: 'is', why: 'the number of 作主语，谓语用单数（a number of 才用复数）。' },
        { s: 'A number of books was borrowed from the library.', at: 'was', to: 'were', why: 'a number of 意为"许多"，谓语用复数。' },
        { s: 'The old in our village needs help.', at: 'needs', to: 'need', why: 'the + 形容词表示一类人，谓语用复数。' },
        { s: 'Ten years are a long time for a person.', at: 'are', to: 'is', why: '时间、金钱、距离作整体时看作单数。' },
        { s: 'Reading books are helpful for your English.', at: 'are', to: 'is', why: '动名词、不定式、从句作主语时，谓语用单数。' },
        { s: 'Not only the students but also the teacher have been to Beijing.', at: 'have', to: 'has', why: 'not only...but also 就近原则，靠近 the teacher 用 has。' },
        { s: 'Everyone in the class know the answer.', at: 'know', to: 'knows', why: 'everyone 作主语，谓语用第三人称单数。' },
        { s: 'There are a pen and two books on the desk.', at: 'are', to: 'is', why: 'there be 句型遵循就近原则，靠近 a pen 用 is。' },
        { s: 'The cattle is grazing on the hill.', at: 'is', to: 'are', why: 'cattle 作复数用。' },
        { s: 'Neither of the two answers are correct.', at: 'are', to: 'is', why: 'neither of + 复数名词，谓语用单数。' }
      ]
    },

    /* ---------- 4 时态 ---------- */
    {
      id: 'e4', title: '④ 时态', rule: 'yesterday/ago/last 用一般过去；since/for/already/yet 用现在完成；by + 过去时间 用过去完成；客观真理永远一般现在；主将从现。',
      items: [
        { s: 'I have seen him yesterday at the station.', at: 'have seen', to: 'saw', why: 'yesterday 是明确的过去时间，必须用一般过去时。' },
        { s: 'He has come here last week.', at: 'has come', to: 'came', why: 'last week 是明确过去时间，用一般过去。' },
        { s: 'The sun rose in the east.', at: 'rose', to: 'rises', why: '客观真理、自然规律用一般现在时。' },
        { s: 'I am knowing the answer now.', at: 'am knowing', to: 'know', why: 'know 是状态动词，不能用进行时。' },
        { s: 'She has finished her homework two hours ago.', at: 'has finished', to: 'finished', why: 'two hours ago 是明确过去时间，用一般过去。' },
        { s: 'By the end of last year, he has learned 2000 English words.', at: 'has learned', to: 'had learned', why: 'by the end of + 过去时间，主句用过去完成时。' },
        { s: 'Look! The children play football on the playground.', at: 'play', to: 'are playing', why: 'Look! 提示此刻正在发生，用现在进行时。' },
        { s: 'I will call you as soon as I will arrive.', at: 'will arrive', to: 'arrive', why: 'as soon as 引导时间状语从句，主将从现，从句用一般现在。' },
        { s: 'He said he will come tomorrow.', at: 'will come', to: 'would come', why: '主句是过去时，宾语从句要用过去将来时。' },
        { s: 'I have been in Beijing since three years.', at: 'since three years', to: 'for three years', why: 'since 后接时间点，for 后接时间段。' },
        { s: 'It is raining heavily when I got home.', at: 'is raining', to: 'was raining', why: 'when I got home 是过去时间点，用过去进行时。' },
        { s: 'He usually go to school by bike.', at: 'go', to: 'goes', why: 'usually 表经常性动作，用一般现在时，第三人称单数加 -es。' },
        { s: 'We are living here for ten years.', at: 'are living', to: 'have lived', why: 'for ten years 强调持续到现在，用现在完成时。' },
        { s: 'If it will rain tomorrow, we will stay at home.', at: 'will rain', to: 'rains', why: 'if 引导条件状语从句，主将从现。' }
      ]
    },

    /* ---------- 5 语态 ---------- */
    {
      id: 'e5', title: '⑤ 语态', rule: '主语是动作承受者才用被动（be + done）；happen/occur/die/take place 等不及物动词无被动；sell/read/write 表特性用主动。',
      items: [
        { s: 'The accident was happened last night.', at: 'was happened', to: 'happened', why: 'happen 是不及物动词，没有被动语态。' },
        { s: 'This kind of shoes are sold well in that shop.', at: 'are sold', to: 'sell', why: 'sell 说明商品本身特性时，用主动表被动。' },
        { s: 'The room needs to clean before we move in.', at: 'to clean', to: 'cleaning', why: 'need doing = need to be done，主动形式表被动。' },
        { s: 'The book was wrote by a famous writer.', at: 'was wrote', to: 'was written', why: '被动语态必须用过去分词 written。' },
        { s: 'A new hospital is building in our town.', at: 'is building', to: 'is being built', why: '医院是"被建"，现在进行时的被动为 is being done。' },
        { s: 'The meeting will hold next Monday.', at: 'will hold', to: 'will be held', why: '会议是"被举行"，用将来时被动。' },
        { s: 'He was made do the work all day.', at: 'made do', to: 'made to do', why: 'make 的被动式必须还原 to：be made to do。' },
        { s: 'The house has been sold to a young couple last month.', at: 'has been sold', to: 'was sold', why: 'last month 是明确过去时间，用一般过去时的被动。' },
        { s: 'English is speaking in many countries.', at: 'is speaking', to: 'is spoken', why: '英语是"被说"，用被动语态。' },
        { s: 'He was died in the war.', at: 'was died', to: 'died', why: 'die 是不及物动词，没有被动语态。' },
        { s: 'Great changes have been taken place in my hometown.', at: 'have been taken', to: 'have taken', why: 'take place 是不及物短语，没有被动语态。' },
        { s: 'The problem must solve as soon as possible.', at: 'must solve', to: 'must be solved', why: '问题是被解决，情态动词的被动为 must be done。' }
      ]
    },

    /* ---------- 6 非谓语 ---------- */
    {
      id: 'e6', title: '⑥ 非谓语动词', rule: '介词后的 to 接 doing；固定搭配要么 doing 要么 to do；分词作状语时逻辑主语必须与主句主语一致。',
      items: [
        { s: "I'm looking forward to hear from you soon.", at: 'hear', to: 'hearing', why: 'look forward to 中的 to 是介词，后接动名词。' },
        { s: 'The book writing by him last year sells well.', at: 'writing', to: 'written', why: '书是"被写"的，用过去分词作后置定语表被动。' },
        { s: 'Having finished his homework, the TV was turned on by him.', at: 'the TV was turned on by him', to: 'he turned on the TV', why: '分词作状语时，逻辑主语须与主句主语一致；完成作业的是 he，不是 the TV。' },
        { s: "It's no use to cry over spilt milk.", at: 'to cry', to: 'crying', why: "It's no use / no good 后面固定接动名词。" },
        { s: 'I heard her to sing a song in the next room.', at: 'to sing', to: 'sing', why: '感官动词 hear/see/watch + 宾语 + do（省略 to 的不定式）。' },
        { s: 'She is used to get up early in the morning.', at: 'get up', to: 'getting up', why: 'be used to doing 意为"习惯于"；be used to do 才是"被用来做"。' },
        { s: 'The teacher asked us to not be late again.', at: 'to not be', to: 'not to be', why: '不定式的否定形式是 not to do，not 放 to 前面。' },
        { s: 'Comparing with his brother, Tom is much taller.', at: 'Comparing', to: 'Compared', why: 'Tom 是被比较的对象，用过去分词作状语。' },
        { s: "I'd rather to stay at home than go out.", at: 'to stay', to: 'stay', why: 'would rather do sth than do sth，用动词原形。' },
        { s: 'There is a boy stand at the gate.', at: 'stand', to: 'standing', why: '现在分词作后置定语，表主动、正在。' },
        { s: 'He devoted himself to teach poor children.', at: 'teach', to: 'teaching', why: 'devote oneself to 中的 to 是介词，后接 doing。' },
        { s: 'Not known what to do, he turned to his teacher.', at: 'Not known', to: 'Not knowing', why: 'he 与 know 是主动关系，用现在分词。' },
        { s: "She can't help to laugh when she heard the joke.", at: 'to laugh', to: 'laughing', why: "can't help doing 意为「忍不住」。" },
        { s: "I'm sorry to have kept you wait so long.", at: 'wait', to: 'waiting', why: 'keep sb doing sth，宾语后用现在分词作补语。' },
        { s: 'The problem discussed at the meeting is very important.', at: '（无需改动）', to: '（无需改动）', why: '干扰项：problem 与 discuss 是被动关系，过去分词作定语是正确的。' },
        { s: "Faced with such a difficult situation, he didn't give up.", at: '（无需改动）', to: '（无需改动）', why: '干扰项：be faced with 是固定搭配，过去分词作状语正确。' }
      ]
    },

    /* ---------- 7 代词 ---------- */
    {
      id: 'e7', title: '⑦ 代词', rule: '介词和动词后用宾格；反身代词不作主语；作表语用名词性物主代词；比较时用 that/those 代替前面名词。',
      items: [
        { s: 'Between you and I, this plan is not good.', at: 'I', to: 'me', why: '介词 between 后必须用宾格。' },
        { s: 'Myself did the work alone.', at: 'Myself', to: 'I', why: '反身代词不能单独作主语。' },
        { s: 'The book is my, not yours.', at: 'my', to: 'mine', why: '作表语时用名词性物主代词 mine。' },
        { s: 'He hurt him when he fell off the bike.', at: 'him', to: 'himself', why: '主语和宾语是同一人，用反身代词。' },
        { s: 'The weather in Beijing is colder than it in Guangzhou.', at: 'it', to: 'that', why: '比较时用 that 代替前面提到的单数名词 weather。' },
        { s: 'I have two brothers. One is a doctor, another is a teacher.', at: 'another', to: 'the other', why: '两者中的另一个用 the other。' },
        { s: 'Its raining hard outside, so take an umbrella.', at: 'Its', to: "It's", why: "It's = it is，此处需要主谓结构。" },
        { s: "The dog wagged it's tail happily.", at: "it's", to: 'its', why: 'its 是形容词性物主代词，修饰 tail。' },
        { s: 'This is the man who I talked to him yesterday.', at: 'him', to: '（删去）', why: '定语从句中关系代词 who 已作介词宾语，不能再加 him。' },
        { s: 'You and me are good friends.', at: 'me', to: 'I', why: '作主语必须用主格。' },
        { s: 'Some of them like music, others of them like sports.', at: 'others of them', to: 'others', why: 'others 本身即代词，后面不能再接 of them。' },
        { s: 'The population of China is larger than Japan.', at: 'Japan', to: 'that of Japan', why: '比较对象必须一致：人口和人口比，用 that 代替 population。' }
      ]
    },

    /* ---------- 8 形容词副词 ---------- */
    {
      id: 'e8', title: '⑧ 形容词与副词', rule: '系动词后用形容词；实义动词后用副词；hard/hardly、late/lately 别混；形容词修饰 something 要后置；enough 修饰形容词要后置。',
      items: [
        { s: 'The soup tastes well.', at: 'well', to: 'good', why: 'taste 是系动词，后面接形容词作表语。' },
        { s: 'He works very hardly every day.', at: 'hardly', to: 'hard', why: "hardly 意为「几乎不」；「努力地」是 hard。" },
        { s: 'She sings very good.', at: 'good', to: 'well', why: '修饰实义动词 sing 必须用副词 well。' },
        { s: 'He told me important something.', at: 'important something', to: 'something important', why: '形容词修饰 something/anything/nothing 时要后置。' },
        { s: 'The room is enough big for us.', at: 'enough big', to: 'big enough', why: 'enough 修饰形容词或副词时要后置。' },
        { s: 'She is very carefully with her homework.', at: 'carefully', to: 'careful', why: '系动词 be 后用形容词作表语。' },
        { s: 'The flowers smell sweetly in the garden.', at: 'sweetly', to: 'sweet', why: 'smell 是系动词，后接形容词。' },
        { s: 'He speaks English very fluent.', at: 'fluent', to: 'fluently', why: '修饰实义动词 speak 用副词。' },
        { s: 'It was such a nice weather that we went out.', at: 'such a nice weather', to: 'such nice weather', why: 'weather 不可数，不能加 a。' },
        { s: 'The film was too boring that I fell asleep.', at: 'too', to: 'so', why: 'so + 形容词 + that 引导结果状语从句。' },
        { s: 'He runs fastly than his brother.', at: 'fastly', to: 'faster', why: 'fast 没有 fastly 这个副词形式，比较级为 faster。' },
        { s: 'The teacher explained the question clear.', at: 'clear', to: 'clearly', why: '修饰实义动词 explain 用副词。' },
        { s: 'I feel very lonely because I have few friends here.', at: '（无需改动）', to: '（无需改动）', why: '干扰项：lonely 是形容词"孤独的"，few 表"几乎没有"，逻辑与语法均正确。' }
      ]
    },

    /* ---------- 9 比较级 ---------- */
    {
      id: 'e9', title: '⑨ 比较级与最高级', rule: '修饰比较级用 much/far/even，不用 very；不能双重比较；两者用比较级，三者以上用最高级；比较对象要同类。',
      items: [
        { s: 'This book is very more interesting than that one.', at: 'very', to: 'much', why: '修饰比较级用 much/far/even/still，不能用 very。' },
        { s: 'He is more taller than his father.', at: 'more taller', to: 'taller', why: '比较级不能双重，taller 已含比较含义。' },
        { s: 'She is the tallest of the two girls.', at: 'the tallest', to: 'the taller', why: '两者之间的比较用比较级。' },
        { s: 'My English is better than me.', at: 'me', to: 'mine', why: '比较对象必须同类：英语和英语（mine）比，不能和"我"比。' },
        { s: 'The more you read, the much you know.', at: 'the much', to: 'the more', why: 'the + 比较级, the + 比较级（越……越……）。' },
        { s: 'This is the most easiest question in the paper.', at: 'the most easiest', to: 'the easiest', why: '最高级不能双重。' },
        { s: 'He is taller than any students in his class.', at: 'any students', to: 'any other student', why: '和自己班的人比要加 other，且 any other 后接单数名词。' },
        { s: 'Your handwriting is as better as his.', at: 'as better as', to: 'as good as', why: 'as...as 中间必须用原级。' },
        { s: 'Tom is more careful than any other boys in the class.', at: 'any other boys', to: 'any other boy', why: 'any other 后面接单数名词。' },
        { s: 'The weather today is more colder than yesterday.', at: 'more colder', to: 'much colder', why: 'colder 已是比较级，前面用 much 修饰，不能再加 more。' },
        { s: 'He is less careful than his sister does.', at: 'does', to: 'is', why: '比较的两边结构必须一致：less careful 对应 is careful。' },
        { s: 'This problem is far more difficult than that one.', at: '（无需改动）', to: '（无需改动）', why: '干扰项：far 可以修饰比较级，表示"……得多"，正确。' }
      ]
    },

    /* ---------- 10 介词 ---------- */
    {
      id: 'e10', title: '⑩ 介词与固定搭配', rule: '这类题没有技巧，只能背：depend on / insist on / result from / be good at / be responsible for / superior to / different from。',
      items: [
        { s: 'It depends of the weather.', at: 'of', to: 'on', why: '固定搭配 depend on。' },
        { s: 'He insisted in going there alone.', at: 'in', to: 'on', why: '固定搭配 insist on。' },
        { s: 'His success results in his hard work.', at: 'results in', to: 'results from', why: 'result from = 由……引起；result in = 导致。硬背：from 是来源，in 是结果。' },
        { s: "I'm interested on history.", at: 'on', to: 'in', why: '固定搭配 be interested in。' },
        { s: 'This book is different than that one.', at: 'than', to: 'from', why: '英式与考试标准用法为 be different from。' },
        { s: 'He is good in math.', at: 'in', to: 'at', why: '固定搭配 be good at。' },
        { s: 'She is familiar to this city.', at: 'to', to: 'with', why: 'sb be familiar with sth（人熟悉某物）；sth be familiar to sb（某物为人所熟悉）。' },
        { s: 'We arrived to the station at eight.', at: 'to', to: 'at', why: 'arrive at + 小地点；arrive in + 大地点；不能用 arrive to。' },
        { s: 'He was responsible of the project.', at: 'of', to: 'for', why: '固定搭配 be responsible for。' },
        { s: "I'll meet you in Monday morning.", at: 'in', to: 'on', why: '具体某一天的上下午用 on。' },
        { s: 'He has been married with her for ten years.', at: 'with', to: 'to', why: '固定搭配 be married to sb。' },
        { s: "The meeting will begin in 8 o'clock.", at: 'in', to: 'at', why: '具体时刻前用 at。' },
        { s: 'He is superior than me in English.', at: 'than', to: 'to', why: 'superior / inferior / prior / senior 后面接 to，不接 than。' },
        { s: 'The accident resulted from careless driving.', at: '（无需改动）', to: '（无需改动）', why: '干扰项：result from 表示"由……引起"，此处逻辑正确。' }
      ]
    },

    /* ---------- 11 连词 ---------- */
    {
      id: 'e11', title: '⑪ 连词与逻辑关系', rule: 'although 不与 but 连用；because 不与 so 连用；unless 本身含否定；not only...but also / either...or / neither...nor 别配错。',
      items: [
        { s: 'Although it was raining, but we went out.', at: 'but', to: '（删去）', why: 'although 与 but 不能在同一个句子里连用，留一个。' },
        { s: "Because he was ill, so he didn't come.", at: 'so', to: '（删去）', why: 'because 与 so 不能连用。' },
        { s: 'He is not only a writer, and also a painter.', at: 'and also', to: 'but also', why: '固定搭配 not only...but also...。' },
        { s: 'Neither Tom or I am wrong.', at: 'or', to: 'nor', why: '固定搭配 neither...nor...。' },
        { s: "Unless you don't study hard, you will fail.", at: "don't study", to: 'study', why: 'unless 本身已含否定（= if not），从句不能再加 not。' },
        { s: "I don't know that he will come or not.", at: 'that', to: 'whether', why: '表示"是否"要用 whether/if；whether...or not 为规范搭配。' },
        { s: 'He was tired, and he kept working.', at: 'and', to: 'but', why: '前后是转折关系，用 but。' },
        { s: 'Since you are free today, so please help me.', at: 'so', to: '（删去）', why: 'since 已引导原因状语从句，主句不能再加 so。' },
        { s: 'He speaks both English as well as French.', at: 'as well as', to: 'and', why: '固定搭配 both...and...。' },
        { s: "I'll wait here until you will come back.", at: 'will come', to: 'come', why: 'until 引导时间状语从句，主将从现。' },
        { s: 'Whether he will succeed depends on he works hard.', at: 'on he works', to: 'on whether he works', why: 'depends on 后接宾语从句，需要引导词 whether。' },
        { s: 'He is either a doctor nor a teacher.', at: 'nor', to: 'or', why: '固定搭配 either...or...。' }
      ]
    },

    /* ---------- 12 平行结构 ---------- */
    {
      id: 'e12', title: '⑫ 平行结构', rule: 'and / or / but / not only...but also 连接的两边，词性或形式必须一致。',
      items: [
        { s: 'She likes singing and to dance.', at: 'to dance', to: 'dancing', why: 'and 两边必须同为动名词：singing and dancing。' },
        { s: 'He is kind, honest and he is friendly.', at: 'he is friendly', to: 'friendly', why: '前两项都是形容词，第三项也应是形容词。' },
        { s: 'He spent the whole day cleaning the room and to wash the clothes.', at: 'to wash', to: 'washing', why: 'spend time doing A and doing B，两边都要用 doing。' },
        { s: 'The teacher told us to read the text and taking notes.', at: 'taking', to: 'take', why: 'to read and (to) take 并列，共用不定式符号。' },
        { s: 'Reading is more useful than to watch TV.', at: 'to watch', to: 'watching', why: '比较的两边结构必须一致：Reading 对应 watching。' },
        { s: 'He was not only clever but also he was hardworking.', at: 'he was hardworking', to: 'hardworking', why: 'not only 后是形容词 clever，but also 后也应是形容词。' },
        { s: 'She likes music, dancing and to sing.', at: 'to sing', to: 'singing', why: '并列三项中已有 dancing 是动名词，第三项也要用动名词。' },
        { s: 'It is important to eat well and sleeping enough.', at: 'sleeping', to: 'sleep', why: 'to eat and (to) sleep 并列，形式必须一致。' },
        { s: 'My job is teaching English and to write books.', at: 'to write', to: 'writing', why: '作表语的并列成分必须同型：teaching and writing。' },
        { s: 'He is good at singing and to play the piano.', at: 'to play', to: 'playing', why: 'at 后面接动名词，并列成分也必须是动名词。' },
        { s: 'I want to go home and rest.', at: '（无需改动）', to: '（无需改动）', why: '干扰项：to go 与 (to) rest 并列，可省略第二个 to，正确。' },
        { s: 'He neither drinks nor smokes.', at: '（无需改动）', to: '（无需改动）', why: '干扰项：neither...nor 连接两个第三人称单数动词形式一致，正确。' }
      ]
    }
  ]
};
