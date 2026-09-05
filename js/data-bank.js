/* ============================================================
   真题结构题库 ①：阅读理解 + 完形填空  window.ED.bank
   河南专升本公共英语结构：阅读 4 篇×5 题(2分/题)、完形 20 空(1分/空)
   ============================================================ */
(function (g) {
  var B = { reading: [], cloze: [] };

  /* ---------------- 阅读理解 ---------------- */
  B.reading.push({
    id: 'R1', t: 'Online Shopping', level: 2,
    tx: 'Online shopping has become more and more popular in China. Every year, millions of people buy clothes, books and even fresh fruit on the Internet. There are several reasons for this. First, online shopping saves time, because people do not have to go to crowded shops. Second, goods online are often cheaper, especially during big sales such as "Double Eleven". Third, delivery is very fast; in many cities, packages arrive within one or two days. However, online shopping also has some problems. Some customers complain that the things they receive are different from the pictures. Others worry that their personal information may be stolen. To enjoy online shopping safely, experts advise us to buy from famous websites, read other buyers\' comments carefully, and keep the receipts. In a word, online shopping is convenient, but we must be smart customers.',
    qs: [
      { q: 'What is the passage mainly about?', o: ['The popularity of online shopping and its advantages and problems.', 'How to open an online shop.', 'The development of express delivery services.', 'Why people refuse to shop online.'], a: 0, e: '全文谈网购流行、好处、问题与建议，故选 A。' },
      { q: 'Which of the following is NOT a reason why people like online shopping?', o: ['It saves time.', 'Goods are often cheaper during big sales.', 'Delivery is fast.', 'People can see the real goods before buying.'], a: 3, e: '网购无法先看到实物，这正是问题之一，不是喜欢网购的理由。' },
      { q: 'The underlined word "goods" in the passage means ___.', o: ['商店', '商品', '价格', '评论'], a: 1, e: 'goods 意为“商品、货物”。' },
      { q: 'What does the writer advise us to do?', o: ['Buy from famous websites and read buyers\' comments.', 'Never shop on the Internet.', 'Buy things only on Double Eleven.', 'Give personal information to every seller.'], a: 0, e: '末段专家建议到知名网站购买并仔细阅读买家评论。' },
      { q: 'Which of the following is TRUE according to the passage?', o: ['People seldom buy fresh fruit online.', 'Delivery usually takes more than a week.', 'Some received goods are different from the pictures.', 'Online shopping has no problems at all.'], a: 2, e: '文中提到有人抱怨收到的商品与图片不符。' }
    ]
  });
  B.reading.push({
    id: 'R2', t: 'Building Good Habits', level: 2,
    tx: 'Many students want to change themselves, but they fail because they try to do too much at once. The secret of success is to build small habits step by step. Scientists have found that every habit has three parts: a cue, a routine and a reward. A cue is something that reminds you to act, such as putting your running shoes beside your bed. The routine is the action itself, like running for ten minutes. The reward makes you feel good, for example, a warm shower or a cup of tea. If you repeat the same cycle for about three weeks, the action will become natural. Besides, it is important to start with something easy. If you want to read more, begin with just one page a day rather than fifty pages. Once a small habit is formed, you can slowly make it bigger. Remember: slow progress is still progress. What matters most is that you never stop trying.',
    qs: [
      { q: 'What is the best title for the passage?', o: ['How to Build Habits Step by Step', 'The Importance of Running', 'Why Students Fail Exams', 'The Secret of Happiness'], a: 0, e: '全文围绕“如何循序渐进养成习惯”。' },
      { q: 'According to the passage, a habit has three parts: ___.', o: ['a cue, a routine and a reward', 'a plan, a goal and a friend', 'a book, a room and a bed', 'a start, a middle and an end'], a: 0, e: '第二段明确指出 cue、routine、reward 三部分。' },
      { q: 'The example "putting your running shoes beside your bed" shows ___.', o: ['a cue', 'a routine', 'a reward', 'a dream'], a: 0, e: '它提醒你去行动，属于触发线索 cue。' },
      { q: 'If you want to read more, the writer suggests that you ___.', o: ['start with one page a day', 'read fifty pages every day', 'read only on weekends', 'give up other hobbies'], a: 0, e: '作者建议从小目标开始，如每天只读一页。' },
      { q: 'What does the writer think of slow progress?', o: ['It is still progress and valuable.', 'It is a waste of time.', 'It means you are lazy.', 'It should be avoided.'], a: 0, e: '末句：Slow progress is still progress，慢进步也是进步。' }
    ]
  });
  B.reading.push({
    id: 'R3', t: 'Chinese Tea Culture', level: 3,
    tx: 'Tea is more than a drink in China; it is part of daily life and a symbol of Chinese culture. The history of tea goes back thousands of years. According to a legend, Shen Nong discovered tea when leaves fell into his boiling water. Today, Chinese tea can be divided into several kinds: green tea, black tea, oolong tea and others. Longjing, a famous green tea from Hangzhou, is loved for its fresh taste. Making and drinking tea is an art. The tea ceremony teaches people to be calm and patient. When guests come, the host serves tea with both hands as a sign of respect. In many families, drinking tea after dinner has become a daily habit. Scientists say tea is good for health because it contains substances that help the body fight disease. With the spread of Chinese culture, more and more foreigners are learning to enjoy Chinese tea. In this way, a cup of tea has become a bridge between China and the world.',
    qs: [
      { q: 'According to the legend, tea was discovered by ___.', o: ['Shen Nong', 'Longjing', 'a foreigner', 'a scientist'], a: 0, e: '传说神农氏发现茶。' },
      { q: 'Longjing is a kind of ___.', o: ['green tea', 'black tea', 'oolong tea', 'milk tea'], a: 0, e: '文中明确 Longjing 是杭州名绿茶。' },
      { q: 'Why does the host serve tea with both hands?', o: ['To show respect to the guests.', 'To keep the tea warm.', 'To show that the tea is expensive.', 'To make the tea taste better.'], a: 0, e: '用双手奉茶是表示尊重。' },
      { q: 'The word "ceremony" in the passage most probably means ___.', o: ['仪式', '饮料', '商店', '比赛'], a: 0, e: 'tea ceremony 茶道、茶艺仪式。' },
      { q: 'What can we infer from the last sentence?', o: ['Tea helps spread Chinese culture to the world.', 'Chinese people no longer drink tea.', 'Tea is only popular in Hangzhou.', 'Foreigners dislike Chinese tea.'], a: 0, e: '“一杯茶成了中国与世界之间的桥梁”说明茶促进文化交流。' }
    ]
  });
  B.reading.push({
    id: 'R4', t: 'Bike Sharing in the City', level: 2,
    tx: 'In recent years, shared bikes have changed the way people travel in Chinese cities. For a small fee, anyone can unlock a bike with a mobile phone and ride it to the subway station, the office or the park. Bike sharing brings many benefits. It helps reduce traffic jams and air pollution, because more people choose bikes instead of cars. It also encourages people to do more exercise in their daily life. However, bike sharing has also caused problems. Some users leave bikes anywhere, blocking sidewalks and entrances. Others damage the bikes on purpose. To solve these problems, cities are trying new methods. For example, some companies have set up "electronic fences": if a user parks outside the allowed area, the bike cannot be locked and the user has to pay extra. At the same time, riders who break the rules may be punished. Experts believe that with better management, shared bikes will continue to serve the city and its people well.',
    qs: [
      { q: 'How do people unlock a shared bike?', o: ['With a mobile phone.', 'With a special key.', 'By showing an ID card.', 'By paying cash to a worker.'], a: 0, e: '用手机扫码解锁。' },
      { q: 'Which is NOT a benefit of bike sharing mentioned in the passage?', o: ['Reducing traffic jams.', 'Cutting down air pollution.', 'Encouraging people to exercise.', 'Making every rider earn money.'], a: 3, e: '文中的好处是缓解拥堵、减少污染、促进锻炼，不包括让骑行者赚钱。' },
      { q: 'What does "electronic fences" do?', o: ['They stop users from parking outside allowed areas.', 'They make bikes faster.', 'They charge riders for unlocking.', 'They repair broken bikes.'], a: 0, e: '电子围栏外无法锁车，阻止乱停放。' },
      { q: 'The writer\'s attitude towards shared bikes is ___.', o: ['supportive but realistic', 'completely negative', 'indifferent', 'angry'], a: 0, e: '作者肯定好处也承认问题，并相信管理改善后能更好服务，属“支持而理性”。' },
      { q: 'What is the passage mainly about?', o: ['Shared bikes and their influence on city life.', 'How to repair shared bikes.', 'The history of bicycles.', 'A new kind of subway.'], a: 0, e: '全文讨论共享单车给城市生活带来的利与弊。' }
    ]
  });
  B.reading.push({
    id: 'R5', t: 'Tips on Managing Your Time', level: 2,
    tx: 'Do you often feel that you have too much homework but too little time? Time management is a skill that every student should learn. Here are some useful tips. First, make a to-do list every morning. Write down the most important tasks first, and finish them before doing anything else. Second, divide big tasks into smaller ones. A long essay becomes easier if you write it paragraph by paragraph. Third, avoid distractions. When you study, turn off your mobile phone or put it in another room, because every message may steal five minutes of your attention. Fourth, take short breaks. After studying for forty-five minutes, rest for five or ten minutes. Your brain needs time to relax and remember. Finally, do not stay up too late. A good night\'s sleep helps you think clearly the next day. Remember: it is not how long you study that matters, but how well you use your time.',
    qs: [
      { q: 'What is the first tip given in the passage?', o: ['Making a to-do list every morning.', 'Staying up late to study.', 'Studying without any rest.', 'Doing easy tasks first.'], a: 0, e: '第一条建议是每天早晨列任务清单。' },
      { q: 'Why should we turn off the mobile phone while studying?', o: ['Because messages may distract our attention.', 'Because the phone is too expensive.', 'Because we need to save electricity.', 'Because nobody calls us anyway.'], a: 0, e: '消息会偷走注意力，造成分心。' },
      { q: 'The writer suggests taking breaks ___.', o: ['after studying for 45 minutes', 'only at noon', 'after finishing all tasks', 'every five minutes'], a: 0, e: '学 45 分钟后休息 5-10 分钟。' },
      { q: 'What does the writer think is the key to study?', o: ['How well you use your time, not how long.', 'How long you study every day.', 'How many books you buy.', 'How fast you read.'], a: 0, e: '末句点题：重要的不是学多久而是如何利用时间。' },
      { q: 'The passage is probably written for ___.', o: ['students', 'doctors', 'drivers', 'farmers'], a: 0, e: '内容围绕作业、学习建议，主要面向学生。' }
    ]
  });
  B.reading.push({
    id: 'R6', t: 'Never Stop Learning', level: 3,
    tx: 'Education does not end when we leave school. In fact, lifelong learning has become more important than ever in a world that changes quickly. New technology appears almost every year, and skills that were useful ten years ago may be out of date today. People who keep learning can follow the changes and find better chances in their jobs. There are many ways to continue learning. Some adults attend evening classes or training programs to get new certificates. Others take online courses, which allow them to study at home at any time. Reading is also a simple but powerful way to learn: books, newspapers and magazines can open windows to new ideas. Moreover, learning is not only about work. Many people study music, cooking or a foreign language simply because they enjoy it, and this makes their lives richer and more colorful. As the saying goes, "It is never too old to learn." So whatever your age is, keep a curious mind, and the world will always have something new to teach you.',
    qs: [
      { q: 'Why has lifelong learning become more important?', o: ['Because the world changes quickly and skills may become out of date.', 'Because school education has been stopped.', 'Because people have too much free time.', 'Because books are cheaper than before.'], a: 0, e: '技术更新快、旧技能可能过时，故终身学习更重要。' },
      { q: 'Which of the following is NOT mentioned as a way of lifelong learning?', o: ['Attending evening classes.', 'Taking online courses.', 'Reading books and newspapers.', 'Traveling abroad every month.'], a: 3, e: '文中提到夜校、网课和阅读，未提到每月出国旅行。' },
      { q: 'According to the passage, learning can make life ___.', o: ['richer and more colorful', 'busier and more tiring', 'simpler and easier', 'more expensive'], a: 0, e: '学习让生活更丰富、更多彩。' },
      { q: 'The phrase "out of date" in the passage means ___.', o: ['过时的', '流行的', '有用的', '昂贵的'], a: 0, e: 'out of date 意为“过时的”。' },
      { q: 'What is the writer\'s main purpose in writing the passage?', o: ['To encourage people to keep learning all their lives.', 'To teach people how to use computers.', 'To introduce some famous books.', 'To compare school and home education.'], a: 0, e: '全文倡导终身学习。' }
    ]
  });

  /* ---------------- 完形填空（20 空，每题 1 分） ---------------- */
  B.cloze.push({
    id: 'CL1', t: 'A Change for Health',
    zh: '大意：久坐的“我”听从医生建议开始晨跑，三个月后成功减重，也带动了家人。',
    body: [
      'Last year I __(1)__ a computer programmer who never took any exercise. I often felt tired, and eating too __(2)__ junk food made me even worse. One day my doctor told me that __(3)__ I didn\'t lose weight soon, I would be in danger. __(4)__ his advice, I decided to run every morning.',
      'At first, it was really hard __(5)__ me to get up at six o\'clock. But I didn\'t give __(6)__. Whenever I wanted to stop, I told __(7)__ that health must come first. After three months, I could run five kilometers __(8)__ stopping. Now running has become part of __(9)__ daily life. I have lost ten kilograms, and my friends are all surprised __(10)__ my great change.',
      'This experience has taught __(11)__ that nothing is more important than health. __(12)__ you are healthy, you can do whatever you like. Last month I took part __(13)__ a city running race, and __(14)__ I didn\'t win a prize, I finished the whole course. That was a big success __(15)__ me. My parents are proud __(16)__ my change, and they have also begun to run __(17)__ me every morning.',
      'Now I often tell my friends: “Start today, and don\'t put __(18)__ what you can do now.” As __(19)__ saying goes, “A journey of a thousand miles begins with a single step.” If you want to be healthy, just take the __(20)__ step right now.'
    ],
    opts: [
      ['was', 'am', 'is', 'be'],                      // 1 was
      ['much', 'many', 'little', 'few'],              // 2 much
      ['if', 'although', 'because', 'unless'],        // 3 if
      ['Following', 'Followed', 'Follow', 'To follow'],// 4 Following
      ['for', 'to', 'with', 'of'],                    // 5 for
      ['up', 'in', 'out', 'away'],                    // 6 up
      ['myself', 'himself', 'me', 'mine'],            // 7 myself
      ['without', 'with', 'not', 'against'],          // 8 without
      ['my', 'mine', 'me', 'I'],                      // 9 my
      ['at', 'with', 'for', 'from'],                  // 10 at
      ['me', 'I', 'my', 'myself'],                    // 11 me
      ['If', 'Unless', 'Although', 'Because'],        // 12 If
      ['in', 'part', 'at', 'on'],                     // 13 in
      ['although', 'so', 'because', 'if'],            // 14 although
      ['for', 'to', 'with', 'by'],                    // 15 for
      ['of', 'with', 'for', 'in'],                    // 16 of
      ['with', 'for', 'by', 'after'],                 // 17 with
      ['off', 'up', 'away', 'on'],                    // 18 off
      ['the', 'a', 'an', '不填'],                      // 19 the
      ['first', 'second', 'next', 'last']             // 20 first
    ],
    ans: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  });
  /* 说明：每题四个选项在每次作答/模考时会被程序随机打乱，
     正确答案以数据中的索引为准（此处统一为 0），展示顺序随机化，
     避免“正确答案固定在前”影响练习质量。 */

  B.cloze.push({
    id: 'CL2', t: 'A High-speed Train Journey',
    zh: '大意：第一次坐高铁回老家的见闻与感受，展现中国速度。',
    body: [
      'Last winter, I went back to my hometown by high-speed train for __(1)__ first time. Before that, the journey used to take almost a whole day by bus, __(2)__ it took only three hours on the train. I was amazed __(3)__ the speed of the train, which could run about 300 kilometers an hour.',
      'The station was clean and busy. After I found my seat, I looked __(4)__ of the window. The train started so smoothly that I could hardly feel __(5)__ moving. The fields and villages flew past __(6)__ quickly that they became a blur. __(7)__ the train, a friendly passenger told me that he traveled to our city twice a month for __(8)__. “High-speed rail has really changed our life,” he said __(9)__ a smile.',
      'During the journey, I thought about my grandfather. When he was young, people __(10)__ letters that took days to arrive, and a trip to the city was a big event. Now, thanks __(11)__ modern technology, we can visit our families __(12)__ we want. The world seems much __(13)__ than before.',
      'When the train finally arrived at the station, I felt __(14)__ excited that I couldn\'t wait to see my grandparents. My grandmother was waiting __(15)__ me at the gate, and the moment she saw me, she smiled happily. We walked home __(16)__, talking about everything. I realized that __(17)__ the train makes the journey faster, it cannot take the place __(18)__ the love between family members. I hope that in the future, people can stay __(19)__ touch with their loved ones more easily, __(20)__ far away they live.'
    ],
    opts: [
      ['the', 'a', 'an', '不填'],
      ['but', 'so', 'and', 'or'],
      ['at', 'with', 'of', 'by'],
      ['out', 'up', 'down', 'after'],
      ['it', 'its', 'it\'s', 'itself'],
      ['so', 'such', 'too', 'very'],
      ['On', 'In', 'At', 'Under'],
      ['work', 'working', 'works', 'worked'],
      ['with', 'in', 'on', 'for'],
      ['sent', 'send', 'have sent', 'were sending'],
      ['to', 'for', 'of', 'with'],
      ['whenever', 'wherever', 'whatever', 'however'],
      ['smaller', 'smallest', 'bigger', 'biggest'],
      ['so', 'such', 'too', 'enough'],
      ['for', 'to', 'with', 'on'],
      ['together', 'lonely', 'alone', 'separately'],
      ['although', 'because', 'if', 'unless'],
      ['of', 'for', 'with', 'in'],
      ['in', 'on', 'at', 'by'],
      ['however', 'whatever', 'wherever', 'whenever']
    ],
    ans: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  });

  g.ED = g.ED || {}; g.ED.bank = B;
})(window);
