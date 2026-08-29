# AuK 推理结果 · 通过任务打包

共 **18** 条通过任务 · 模型 AuK base (online/NFE32/CFG2) · 生成时间 2026-08-25

| 任务 | 分类 | PE前指令 | PE后规范指令 | ASR |
|---|---|---|---|---|
| content_add_en | 内容编辑 | 在这句话开头加上'My dear friends, '，后面的内容保持不变 | Add 'My dear friends, ' before 'And so, my fellow Americans, | And so, my fellow Americans, ask not wha |
| content_del_zh | 内容编辑 | 把'跑步'两个字删掉，其他内容不变 | 删掉‘跑步’ / 删掉‘跑步’ / 删掉‘跑步’ | 我认为跑步最重要的就是，给我带来了身体健康。 |
| speed_en_up | 语速调整 | 语速加快一点，说得快一些 | 将语速加快到原速的1.25倍,谢谢。 / 将这段话的语速加速至1.25x。 / 把说话的速度加快到1.25倍。 | I knocked at the door on the ancient sid |
| speed_en_down | 语速调整 | 说太快了，慢一点 | 将语速放缓到原速的0.75倍,谢谢。 / 将这段话的语速减速到0.75x。 / 把说话的速度放慢到0.75倍。 | And so my fellow Americans, ask not what |
| vocal_ext_en2 | 提取人声 | 把伴奏去掉，只保留人声 | 只保留人声内容，说话、唱歌，其余声音全都不要。 / 请把所有人声都留下，不论是说还是唱；其它都去掉。 / 把所有人发出的 | She looked just like a movie star. She's |
| vocal_ext_en1 | 提取人声 | 提取人声，去掉伴奏 | 只保留人声内容，说话、唱歌，其余声音全都不要。 / 请把所有人声都留下，不论是说还是唱；其它都去掉。 / 把所有人发出的 | It always seems like time stands still w |
| sr_en_16k | 语音超分 | The audio sounds like a phone call. Impr | This audio suffers from limited bandwidth. Please restore it | How do you get it back? |
| emo_excited | 情绪编辑 | 让他听起来很兴奋 | 请将朗读的情感转为兴奋。 / 把情感换成兴奋的感觉。 / 将这段话重新演绎,情感设为兴奋。 | I had faith in them. |
| nv_rm_breath | 非语言声编辑 | 把语音里的换气声都去掉 | 请把语音中的换气声都删掉。 / 移除音频里全部的换气声。 / 删除音频中所有的换气声。 | 重点呢想谈三个问题，首先呢就是这一轮全球金融动荡的表现。 |
| nv_add_sigh | 非语言声编辑 | 在开头加一声叹气 | 在语音开头插入叹气。 / 于开头添加叹气。 / 在语音开头增加叹气。 | 我认为跑步最重要的就是，给我带来了身体健康。 |
| nv_add_cough | 非语言声编辑 | 在'I knocked at the door'后面加一声咳嗽 | 在语音中"I knocked at the door"后插入咳嗽。 / 于"I knocked at the door" | I knocked at the door on the ancient sid |
| whisper_w2n_zh | 耳语转换 | 把这段耳语转换成正常说话的声音 | 把这段耳语转换成正常说话的声音。 / 把这段耳语转换成正常说话的声音。 / 把这段耳语转换成正常说话的声音。 | 微风轻拂，树叶沙沙作响，带来了一丝丝宁静。 |
| whisper_n2w_en | 耳语转换 | 把这段话转换成耳语 | 用小声耳语的方式把这段话说出来。 / 用小声耳语的方式把这段话说出来。 / 用小声耳语的方式把这段话说出来。 | The eastern coast is a place for pure pl |
| whisper_n2w_zh | 耳语转换 | 把这段话转换成耳语 | 用小声耳语的方式把这段话说出来。 / 用小声耳语的方式把这段话说出来。 / 用小声耳语的方式把这段话说出来。 | 我认为跑步最重要的就是，给我带来了身体健康。 |
| attr_speed_1_75x | 属性编辑 | 语速加快到1.75倍 | 将语速加快到双倍速度,谢谢。 / 将这段话的语速加速至2.00x。 / 把说话的速度加快到2倍。 | 对我做了介绍啊，那么我想说的是呢，大家如果对我的研究感兴趣呢。 |
| content_del_en | 内容编辑 | 把'I knocked at the door on the ancient s | Remove 'ancient'. / Remove 'ancient'. / Remove 'ancient'. | I knocked at the door on the ancient sid |
| ss_order_en | 说话人分离 | This audio has two speakers one after an | Please keep the first speaker to start talking and remove th | Shall I never miss home, talk and blessi |
| ss_voice_en | 说话人分离 | Two people are talking here. Keep only t | This audio contains multiple speakers. Please locate the spe | In the rest of the work, the power of la |