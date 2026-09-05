/* ============================================================
   真题结构题库 ②：判断正误 / 英译汉选择 / 选词填空 / 汉译英 / 改错 / 写作
   ============================================================ */
(function (g) {
  var B2 = { tf: [], ec: [], wf: [], ce: [], ef: [], essays: [] };

  /* ---------- 判断正误（True/False，每题 2 分） ---------- */
  B2.tf.push({
    id: 'TF1', t: 'The Lantern Festival',
    tx: 'The Lantern Festival falls on the 15th day of the first lunar month, and it marks the end of the Spring Festival celebrations. On that night, the full moon is bright in the sky, and every family lights up colorful lanterns. People eat yuanxiao, a kind of sweet dumpling made of rice, which stands for family reunion and happiness. Another popular activity is guessing lantern riddles, which are written on the lanterns. Children and adults all enjoy this game because it is both fun and educational. In some cities, wonderful lantern shows are held in parks and streets, and people walk around to enjoy the beautiful lights. The festival is a time for families to get together and share their best wishes for the new year.',
    items: [
      { s: 'The Lantern Festival falls on the 15th day of the first lunar month.', v: true },
      { s: 'The Lantern Festival is celebrated at the beginning of the Spring Festival.', v: false },
      { s: 'Yuanxiao is a kind of sweet dumpling made of rice.', v: true },
      { s: 'Guessing lantern riddles is both fun and educational.', v: true },
      { s: 'The festival is a time for people to be alone and quiet.', v: false }
    ]
  });
  B2.tf.push({
    id: 'TF2', t: 'Mobile Payment in China',
    tx: 'In China today, most people pay with their mobile phones instead of cash. When you buy breakfast, take a taxi or shop in a supermarket, you can simply scan a QR code and the payment is done in seconds. Mobile payment is fast, safe and convenient, and it has greatly changed people\'s daily life. However, not everyone finds it easy. Some elderly people are not familiar with smartphones, and they may feel worried when they pay. To help them, many communities have set up training classes where volunteers teach the old to use mobile payment step by step. Banks and shops are also asked to keep cash service available. Thanks to these efforts, more and more old people can now enjoy the convenience of modern life without fear.',
    items: [
      { s: 'In China, most people now pay with mobile phones instead of cash.', v: true },
      { s: 'Mobile payment usually takes a long time.', v: false },
      { s: 'Some elderly people find it hard to use mobile payment.', v: true },
      { s: 'Communities train old people to use mobile payment.', v: true },
      { s: 'Shops are required to refuse cash payments.', v: false }
    ]
  });
  B2.tf.push({
    id: 'TF3', t: 'Sports and Study',
    tx: 'Some students think that playing sports wastes time that should be spent on study. In fact, the opposite is true. Scientists have found that moderate exercise, such as running, swimming or playing basketball, can make the brain work better. When we exercise, more blood and oxygen go to the brain, which helps us remember words and understand new ideas more easily. Exercise is also a good way to reduce stress. After a long day of classes, twenty minutes of sports can make us feel relaxed and happy. Of course, students should not exercise too much, because over-exercise may cause tiredness and injury. The key is balance: study hard when you study, and play well when you play. In this way, sports and study can help each other instead of fighting each other.',
    items: [
      { s: 'The writer believes playing sports wastes study time.', v: false },
      { s: 'Exercise can help the brain work better.', v: true },
      { s: 'Exercise can help students reduce stress.', v: true },
      { s: 'The writer thinks students should exercise as much as possible.', v: false },
      { s: 'The key is to keep a balance between sports and study.', v: true }
    ]
  });

  /* ---------- 英译汉选择（每题 2 分） ---------- */
  B2.ec.push(
    { en: 'He is always the first to come and the last to leave.', o: ['他总是第一个来，最后一个离开。', '他第一次来的时候，最后一个走。', '他总是先来后到。', '他第一个来，却很少离开。'], a: 0, e: 'the first to come / the last to leave 为“第一个到、最后一个走”。' },
    { en: 'Not only does she sing well, but she also dances beautifully.', o: ['她不仅歌唱得好，而且舞也跳得美。', '她唱歌不好，但跳舞很美。', '她既不唱歌也不跳舞。', '她只唱歌不跳舞。'], a: 0, e: 'not only…but also… 不仅…而且…。' },
    { en: 'It is reported that a new railway will be built in this area.', o: ['据报道，该地区将修建一条新铁路。', '报告说这条铁路已经建成了。', '有人报告说铁路正在被拆除。', '新铁路拒绝在这个地区修建。'], a: 0, e: 'It is reported that… 据报道；will be built 将被修建。' },
    { en: 'The more you read, the more you will understand.', o: ['你读得越多，理解得就越多。', '你读得多，才能理解得多。', '你读得越多，就越累。', '多读书并不能帮助你理解。'], a: 0, e: 'the more…, the more… 越…越…。' },
    { en: 'He has made up his mind to give up smoking.', o: ['他已下定决心戒烟。', '他还在考虑是否抽烟。', '他决定继续抽烟。', '他抽烟时心不在焉。'], a: 0, e: 'make up one\'s mind 下定决心；give up 放弃。' },
    { en: 'Only when you have experienced failure will you value success.', o: ['只有经历过失败，你才会珍惜成功。', '只有成功的人才会失败。', '当你成功时就会失败。', '失败使你不珍惜成功。'], a: 0, e: 'only when + 倒装主句，意为“只有…才…”。' },
    { en: 'No matter how difficult the task is, we will finish it on time.', o: ['无论任务多么困难，我们都会按时完成。', '任务太难了，我们不能按时完成。', '如果任务容易，我们就按时完成。', '我们只有在任务简单时才完成它。'], a: 0, e: 'no matter how 无论如何、不管多么。' },
    { en: 'The novel is well worth reading a second time.', o: ['这部小说很值得再读一遍。', '这部小说不值得读第二遍。', '这部小说写得不好，别再读了。', '这部小说比第二次写的好。'], a: 0, e: 'be well worth doing 很值得做。' },
    { en: 'It was not until midnight that he went to bed.', o: ['直到午夜他才上床睡觉。', '午夜之前他就睡了。', '他整夜没睡。', '他午夜醒来去睡觉。'], a: 0, e: 'not…until… 直到…才…，此处为强调句。' },
    { en: 'With the development of science, our life is becoming more and more convenient.', o: ['随着科学的发展，我们的生活变得越来越方便。', '科学阻止了生活变方便。', '科学使生活更加困难。', '科学只在发展时方便。'], a: 0, e: 'with + 名词短语表伴随，“随着…”。' }
  );

  /* ---------- 选词填空（10 选 5，每题 3 分） ---------- */
  B2.wf.push({
    id: 'WF1', t: 'Reading Habits',
    intro: '从方框中选择合适的词并用其正确形式填空（每词限用一次）。',
    box: ['habit', 'suggest', 'quiet', 'improve', 'daily', 'because', 'teacher', 'slowly', 'borrow', 'expensive'],
    text: 'Reading is a good __(1)__ that can bring us a lot. First, it can __(2)__ our writing skills, because good writers are usually good readers. Second, reading helps us learn about the world without leaving home. Many students like to read in a __(3)__ place, such as a library, __(4)__ there they can concentrate on their books. Experts __(5)__ that we should read at least twenty minutes every day and keep this as a __(5b)__ part of life.',
    blanks: 5,
    key: ['habit', 'improve', 'quiet', 'because', 'suggest'],
    exp: '1 habit 习惯；2 improve 提高；3 quiet 安静的；4 because 因为；5 suggest 建议。',
    note: '此题文本为示范结构，请在作答时按语境填入。'
  });

  // WF1 文本含占位更正：正式文本如下
  B2.wf[0].text = 'Reading is a good __(1)__ that can bring us a lot. First, it can __(2)__ our writing skills. Second, reading helps us learn about the world without leaving home. Many students like to read in a __(3)__ place, such as a library, __(4)__ there they can concentrate better. Experts __(5)__ that we should read for at least twenty minutes every day.';

  B2.wf.push({
    id: 'WF2', t: 'Protecting the Environment',
    intro: '从方框中选择合适的词填空（每词限用一次）。',
    box: ['plastic', 'instead', 'reduce', 'necessary', 'everywhere', 'rubbish', 'protect', 'collect', 'expensive', 'forget'],
    text: 'Environmental protection is very important for us all. To __(1)__ the earth, we should change some of our daily habits. For example, we can use cloth bags __(2)__ of plastic ones when we go shopping. We should also try to __(3)__ the waste we produce, such as sorting and recycling bottles and paper. It is also __(4)__ to save water and electricity in our daily life. If everyone does a little, the world will become cleaner, and we will see less __(5)__ on the streets.',
    blanks: 5,
    key: ['protect', 'instead', 'reduce', 'necessary', 'rubbish'],
    exp: '1 protect 保护；2 instead of 而不是；3 reduce 减少；4 necessary 必要的；5 rubbish 垃圾。'
  });
  B2.wf.push({
    id: 'WF3', t: 'A Good Friend',
    intro: '从方框中选择合适的词填空（每词限用一次）。',
    box: ['share', 'honest', 'support', 'value', 'whenever', 'angry', 'foreign', 'busy', 'cheap', 'danger'],
    text: 'What makes a good friend? In my opinion, a true friend should be __(1)__ and kind. He or she is willing to __(2)__ happiness and sadness with you. When you are in trouble, a real friend will give you __(3)__ and never leave you alone. __(4)__ you make mistakes, he or she will point them out gently and help you improve. We should __(5)__ such friendship and treat our friends with the same honesty and warmth.',
    blanks: 5,
    key: ['honest', 'share', 'support', 'whenever', 'value'],
    exp: '1 honest 诚实的；2 share 分享；3 support 支持；4 whenever 无论何时；5 value 珍视。'
  });

  /* ---------- 汉译英（每题 3 分，参考译文供自评） ---------- */
  B2.ce.push(
    { zh: '我每天坚持早起锻炼，这对我的健康很有好处。', ref: 'I keep getting up early to exercise every day, which is very good for my health.', note: 'keep doing sth 坚持做；非限定性定语从句 which 指代前句。' },
    { zh: '无论遇到什么困难，我们都不要放弃希望。', ref: 'No matter what difficulties we meet, we should never give up hope.', note: 'no matter what 引导让步状语从句；give up 放弃。' },
    { zh: '直到老师进来，学生们才停止说话。', ref: 'The students didn\'t stop talking until the teacher came in.', note: 'not…until… 直到…才…。' },
    { zh: '她太累了，以至于一上床就睡着了。', ref: 'She was so tired that she fell asleep as soon as she went to bed.', note: 'so…that…；as soon as 一…就…。' },
    { zh: '这本书值得再读一遍。', ref: 'The book is well worth reading again.', note: 'be worth doing 值得做，主动形式表被动。' },
    { zh: '如果我是你，我就会接受这份工作。', ref: 'If I were you, I would accept the job.', note: '与现在事实相反的虚拟语气，be 用 were。' },
    { zh: '保护环境是每个人的责任。', ref: 'It is everyone\'s duty to protect the environment.', note: 'It is + n. + to do 句式；duty 责任。' },
    { zh: '他不仅学习好，而且乐于助人。', ref: 'Not only does he study well, but he is also ready to help others.', note: 'not only 置句首需部分倒装；be ready to 乐于。' },
    { zh: '随着科技的发展，智能手机变得越来越普及。', ref: 'With the development of technology, smart phones are becoming more and more popular.', note: 'with + n. 表伴随；more and more 越来越。' },
    { zh: '我们相信只要你努力，就一定会成功。', ref: 'We believe that you are sure to succeed as long as you work hard.', note: 'as long as 只要；be sure to do 一定会。' },
    { zh: '他昨天没来上课，因为他生病了。', ref: 'He didn\'t come to class yesterday because he was ill.', note: 'because 引导原因状语从句；时态保持一致。' },
    { zh: '工人们正在建一座新桥，它明年将投入使用。', ref: 'The workers are building a new bridge, which will be put into use next year.', note: '非限定性定语从句；be put into use 投入使用。' },
    { zh: '虽然天气很冷，孩子们仍然在操场上玩得很开心。', ref: 'Although it was very cold, the children still had a good time playing on the playground.', note: 'although 不与 but 连用；have a good time (in) doing。' },
    { zh: '我期待尽快收到你的来信。', ref: 'I am looking forward to hearing from you as soon as possible.', note: 'look forward to doing；hear from sb 收到…的来信。' },
    { zh: '她建议我们每天大声朗读英语。', ref: 'She suggested that we (should) read English aloud every day.', note: 'suggest + that 从句用 (should) do。' }
  );

  /* ---------- 改错（找出并改正错误，每题 2 分） ---------- */
  B2.ef.push(
    { s: 'He don\'t like playing football at all.', bad: 'don\'t', good: 'doesn\'t', e: '主语 He 为第三人称单数，否定用 doesn\'t。' },
    { s: 'She has gone to Beijing twice since 2020.', bad: 'gone', good: 'been', e: 'have been to 去过已回；has gone to 去了未回，与 twice 矛盾。' },
    { s: 'Although it rained heavily, but the match continued.', bad: 'but', good: '删除', e: 'although 与 but 不能同时使用，删去 but。' },
    { s: 'There are a number of milk in the bottle.', bad: 'are', good: 'is', e: 'milk 不可数，谓语用单数 is。' },
    { s: 'I am looking forward to hear from you.', bad: 'hear', good: 'hearing', e: 'look forward to 中 to 是介词，后接 doing。' },
    { s: 'He told me that he will come the next day.', bad: 'will', good: 'would', e: '主句过去时，宾语从句应用过去将来时 would。' },
    { s: 'The number of the students are increasing year by year.', bad: 'are', good: 'is', e: 'the number of… 作主语谓语用单数。' },
    { s: 'My father suggested me to take more exercise.', bad: 'to take', good: 'take / that I (should) take', e: 'suggest 后接 doing 或 that 从句，不接 sb to do。' },
    { s: 'This pair of shoes are too small for me.', bad: 'are', good: 'is', e: 'a pair of… 作主语谓语用单数。' },
    { s: 'He has been ill for three days, so he was absent from school yesterday.', bad: 'has been', good: 'had been / was', e: '若强调“到昨天为止已病三天”，宜用过去完成时或过去时协调。', pick: '一般表述需保持时态一致：用 was。' },
    { s: 'I\'d like to have a cup of coffees.', bad: 'coffees', good: 'coffee', e: 'coffee 此处为不可数名词，不加 -s。' },
    { s: 'Either you or he are wrong about this matter.', bad: 'are', good: 'is', e: 'either…or… 就近原则，靠近谓语的是 he，用 is。' }
  );
  // EF10 简化题干（避免歧义）
  B2.ef[9].s = 'He has caught a bad cold and felt terrible yesterday.';
  B2.ef[9].bad = 'felt';
  B2.ef[9].good = 'felt (应为 had felt / 或用 felt 保持一般过去)';
  B2.ef[9].e = '主句为过去时，从句动作发生在主句动作之前可用过去完成，但常规改错以“时态一致”判定：has caught 与 yesterday 冲突，将 has caught 改为 caught。';
  B2.ef[9].good = 'caught';
  B2.ef[9].bad = 'has caught';
  B2.ef[9].s = 'He has caught a bad cold and felt terrible yesterday.';
  B2.ef[9].e = 'yesterday 表过去，动词用一般过去式 caught，不能与 has caught 同句。';

  /* ---------- 写作（20 分） ---------- */
  B2.essays.push({
    id: 'ES1', t: '坚持锻炼身体',
    req: 'Directions: 你校英语报正在举办以“健康生活”为主题的征文活动。请你根据以下提纲写一篇英语短文投稿：1. 锻炼身体的重要性；2. 你平时的锻炼习惯；3. 呼吁同学们坚持锻炼。词数 100~120。',
    sample: 'Nowadays, more and more students pay little attention to physical exercise because they are busy with their studies. However, doing sports is of great importance to us. Exercise can not only build up our bodies but also help us relax after a whole day of hard work.\n\nAs for me, I keep running for half an hour every morning and play basketball with my classmates at weekends. Thanks to these activities, I seldom fall ill and I always feel energetic in class.\n\nDear friends, let us take action from today. Remember: a healthy body is the first step to success. I hope every one of us can develop the habit of doing exercise and enjoy a healthier life.',
    points: '内容要点齐全、语言基本准确、结构清楚可得 16-20 分。'
  });
  B2.essays.push({
    id: 'ES2', t: 'My Dream Job / 我的梦想职业',
    req: 'Directions: 某英文网站正在开展“My Dream Job”主题讨论。请根据以下提纲写一篇短文：1. 你梦想的职业是什么；2. 你选择它的理由；3. 你打算如何实现梦想。词数 100~120。',
    sample: 'Everyone has his own dream job, and mine is to become an English teacher in the future.\n\nThere are several reasons for my choice. To begin with, I have been interested in English since I was a child, and I want to share my love for the language with others. Besides, a teacher can influence students\' lives in a positive way, which makes the job meaningful. Finally, working with young people always keeps me young and happy.\n\nTo realize my dream, I will study harder to enter a good university. I will also practice my spoken English every day and read more books about education. I believe that where there is a will, there is a way, and my dream will come true one day.',
    points: '结构：开头点题 + 理由（to begin with/besides/finally）+ 计划收尾。'
  });
  B2.essays.push({
    id: 'ES3', t: '保护环境，从我做起',
    req: 'Directions: 世界环境日即将到来，请以“Protecting the Environment”为题写一篇英语短文：1. 当前环境问题；2. 我们力所能及的事；3. 你的倡议。词数 100~120。',
    sample: 'With the development of industry, our environment is facing serious problems. The air is polluted, rivers are dirty, and more and more trees are being cut down. It is time for us to take action to protect our earth.\n\nIn our daily life, we can do many small things to help. For example, we should use cloth bags instead of plastic ones when shopping. We should also save water and electricity and sort the rubbish before throwing it away. If possible, we can go to school by bike or on foot instead of by car.\n\nIn a word, environmental protection is everyone\'s duty. Let\'s start from now and from ourselves, so that our children can still see blue skies and clean rivers.',
    points: '用 instead of / so that / if possible 等加分句型。'
  });
  B2.essays.push({
    id: 'ES4', t: '我心目中的“中国年”',
    req: 'Directions: 假设你是李华，你的外国朋友 Peter 对中国春节很感兴趣。请你给他写一封信，介绍春节：1. 春节的时间与意义；2. 传统习俗（如年夜饭、红包、拜年）；3. 邀请他来中国体验春节。词数 100~120。',
    sample: 'Dear Peter,\n\nI am glad to hear that you are interested in the Spring Festival. Now I would like to introduce it to you.\n\nThe Spring Festival, also called Chinese New Year, usually falls in January or February. It is the most important festival in China, a time for family reunion. On New Year\'s Eve, families get together to enjoy a big dinner. Children are given red packets, which stand for good luck. During the festival, people visit their relatives and friends and say "Happy New Year" to each other.\n\nIf you come to China during the festival, I am sure you will have a wonderful time. I would be happy to be your guide.\n\nYours,\nLi Hua',
    points: '书信格式（称呼/正文/署名）+ 邀请语气。'
  });
  B2.essays.push({
    id: 'ES5', t: 'The Importance of Learning English',
    req: 'Directions: 学校英语俱乐部将举办演讲比赛，请你以“The Importance of Learning English”为题写一篇演讲稿：1. 英语的重要性；2. 学习英语的方法；3. 呼吁大家坚持学习。词数 100~120。',
    sample: 'Good morning, everyone! Today my topic is the importance of learning English.\n\nAs we all know, English is one of the most widely used languages in the world. It is a bridge connecting China with other countries. With good English, we can read foreign books, watch international news and communicate with people from different cultures. What\'s more, English is very useful for our future study and work.\n\nThen how can we learn English well? In my opinion, we should first build a large vocabulary by reviewing words every day. Second, practice makes perfect, so we should speak English bravely and listen to English programs as often as possible.\n\nI hope everyone can keep learning English and enjoy the fun of it. Thank you for listening!',
    points: '演讲稿开头称呼 + 结尾致谢；多用 As we all know / in my opinion 等衔接。'
  });

  g.ED = g.ED || {}; g.ED.bank2 = B2;
})(window);
