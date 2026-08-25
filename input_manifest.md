# Auk Demo Input 生成清单

每个 demo 的 **input 音频** 由 seed-audio 1.0 按 `生成描述` 生成（保存为 `{sample_id}-input.wav`）；`demo instruction` 是页面上展示给用户的指令。

## zs-tts-zh-2 · Zero-Shot TTS · Mandarin [zh]
- **生成描述（seed-audio）**: 一位30岁左右的普通话女声，声音温和亲切，语速适中，清晰自然地说：好的，那我们就这么定了，明天见。
- **Demo instruction**: 用这个人的声音说：明天早上八点叫我起床

## zs-tts-en-1 · Zero-Shot TTS · English [en]
- **生成描述（seed-audio）**: A calm male voice in his 40s, clear neutral American English, speaking at a steady pace: Let me walk you through the steps one more time.
- **Demo instruction**: Use this voice to say: Please hold, your call will be answered shortly.

## zs-tts-en-2 · Zero-Shot TTS · English [en]
- **生成描述（seed-audio）**: A warm young female voice with a light British accent, friendly tone: Thanks for joining us today, we really appreciate it.
- **Demo instruction**: Use this voice to say: Please call me back at your convenience.

## content-speech-insert-zh-1 · Insert · Mandarin [zh]
- **生成描述（seed-audio）**: 一位普通话男声，平静自然地朗读：我们打算下周三去北京出差，顺便拜访一下老朋友。
- **Demo instruction**: 在“去北京出差”前面加上“下周三”

## content-speech-delete-zh-1 · Delete · Mandarin [zh]
- **生成描述（seed-audio）**: 一位普通话女声，流畅自然地朗读：其实呢，这个方案我觉得还不错，不过还需要再讨论一下。
- **Demo instruction**: 把“其实呢”删掉

## content-speech-replace-en-1 · Replace · English [en]
- **生成描述（seed-audio）**: A clear male American voice saying naturally: We will meet on Monday to finalize the budget, and then start the rollout.
- **Demo instruction**: Change "Monday" to "Tuesday"

## content-speech-insert-en-1 · Insert · English [en]
- **生成描述（seed-audio）**: A steady female voice: The report is due on Friday, so please send me your feedback by Thursday afternoon.
- **Demo instruction**: Add "on Friday" after "due"

## content-speech-delete-en-1 · Delete · English [en]
- **生成描述（seed-audio）**: A relaxed male voice: Well, honestly, I think the plan is fine, but we should double-check the numbers.
- **Demo instruction**: Remove "honestly"

## vocal-edit-replace-zh-2 · Vocal Edit · Mandarin [zh]
- **生成描述（seed-audio）**: 一位女声清唱一段中文旋律：晚风轻拂澎湖湾，白浪逐沙滩，没有椰林缀斜阳，只是一片海蓝蓝。
- **Demo instruction**: 把歌词里的“澎湖湾”改成“外婆桥”

## vocal-edit-replace-en-1 · Vocal Edit · English [en]
- **生成描述（seed-audio）**: A male voice singing an English pop melody: Twinkle twinkle little star, how I wonder what you are, up above the world so high.
- **Demo instruction**: Change "little star" to "little moon" in the lyrics

## vocal-edit-replace-en-2 · Vocal Edit · English [en]
- **生成描述（seed-audio）**: A female voice humming and singing a folk tune: Scarborough Fair, parsley sage rosemary and thyme, remember me to one who lives there.
- **Demo instruction**: Replace "Scarborough Fair" with "Morning Dew" in the singing

## enhance-2 · Enhance Speech · Mandarin [zh]
- **生成描述（seed-audio）**: 在嘈杂的街道环境中，一位普通话男声说话，背景有明显的人群声和车辆声：喂，你到了吗？我在东门口等你。
- **Demo instruction**: 把背景噪音去掉，声音干净点

## enhance-3 · Enhance Speech · English [en]
- **生成描述（seed-audio）**: In a noisy cafe with background chatter and clinking cups, a female voice says: Could you say that again? I could not quite hear you.
- **Demo instruction**: Remove the background noise and make the voice clearer

## enhance-4 · Enhance Speech · English [en]
- **生成描述（seed-audio）**: A phone-call quality male voice with static and crackle: We are running late, please start the meeting without us.
- **Demo instruction**: Clean up the audio and remove the static

## separate-speech · Separate by content · Mandarin [zh]
- **生成描述（seed-audio）**: 两个人对话：男声说“明天我们几点出发？”，女声回答“八点吧，早点走不堵车。”
- **Demo instruction**: 只保留说“明天”的那个人

## ss-order-zh-1 · Separate by speaking order · Mandarin [zh]
- **生成描述（seed-audio）**: 三个人依次说话：第一个男声说“大家好”，第二个女声说“欢迎光临”，第三个男声说“请随便看看”。
- **Demo instruction**: 只保留第一个说话的人

## ss-loudest-zh-1 · Separate the loudest speaker · Mandarin [zh]
- **生成描述（seed-audio）**: 两个人在嘈杂环境中交谈，一个男声大声说“这次一定要赢！”，另一个女声小声说“我觉得我们尽力就好”。
- **Demo instruction**: 只保留声音最大的那个人

## ss-content-en-1 · Separate by content · English [en]
- **生成描述（seed-audio）**: Two speakers: a man says "Tomorrow we should go hiking", then a woman replies "I would rather stay home and rest".
- **Demo instruction**: Keep only the person who says "hiking"

## ss-order-en-1 · Separate by speaking order · English [en]
- **生成描述（seed-audio）**: Three speakers in order: first man says "Good morning everyone", then woman says "Welcome to the meeting", then another man says "Let us begin".
- **Demo instruction**: Keep only the first speaker

## ss-loudest-en-1 · Separate the loudest speaker · English [en]
- **生成描述（seed-audio）**: Two speakers arguing, a loud man shouts "I told you we should leave earlier!", a quiet woman murmurs "Maybe we can still make it".
- **Demo instruction**: Keep only the loudest speaker

## extract-vocals · Extract Vocals · Mandarin [zh]
- **生成描述（seed-audio）**: 一段流行歌曲片段，女声演唱旋律，伴随明显的电子鼓点和贝斯伴奏：夜空中最亮的星，能否听清，那仰望的人心底的孤独和叹息。
- **Demo instruction**: 提取人声，去掉伴奏

## ev-zh-2 · Extract Vocals · Mandarin [zh]
- **生成描述（seed-audio）**: 一段中文民谣，男声演唱，吉他伴奏清晰可闻：同桌的你，明天你是否会想起，昨天你写的日记。
- **Demo instruction**: 提取人声，去掉伴奏

## ev-en-1 · Extract Vocals · English [en]
- **生成描述（seed-audio）**: An English pop song clip, male vocals over a strong synth and drum beat: We are the champions, my friends, and we will keep on fighting till the end.
- **Demo instruction**: Extract the vocals, remove the music

## ev-en-2 · Extract Vocals · English [en]
- **生成描述（seed-audio）**: A light acoustic song, female vocals with guitar strumming: Hey there Delilah, whats it like in New York City?
- **Demo instruction**: Keep only the singing voice, remove the guitar

## super-resolution · Improve Quality · Mandarin [zh]
- **生成描述（seed-audio）**: 一段非常模糊的电话音质语音，声音像从老式收音机里传出：各位观众朋友们，大家好，欢迎收看今天的新闻节目。
- **Demo instruction**: 音质太差像打电话，提升清晰度

## sr-zh-2 · Improve Quality · Mandarin [zh]
- **生成描述（seed-audio）**: 一段低采样率、有明显失真的录音：请所有乘客注意，列车即将进站，请站在安全线以内候车。
- **Demo instruction**: 提升音质，让声音更清晰

## sr-en-1 · Improve Quality · English [en]
- **生成描述（seed-audio）**: A heavily compressed low-quality voice recording: This is a message from your bank, please call us back at your earliest convenience.
- **Demo instruction**: Improve the audio quality and make it clearer

## sr-en-2 · Improve Quality · English [en]
- **生成描述（seed-audio）**: A muffled distant voice with echo, like recorded in a hallway: The meeting has been moved to room 302, please bring your laptop.
- **Demo instruction**: Restore the audio, reduce the echo

## emotion-angry-1 · emotion-angry-1 [?]
- **生成描述（seed-audio）**: 一位男声用平静中性的语气说：会议已经推迟到下午三点了，地点没有变。
- **Demo instruction**: 

## emotion-happy-1 · emotion-happy-1 [?]
- **生成描述（seed-audio）**: 一位女声用平静中性的语气说：下班路上顺便买点菜回家，今晚我做饭。
- **Demo instruction**: 

## emotion-sad-1 · emotion-sad-1 [?]
- **生成描述（seed-audio）**: 一位男声用平静中性的语气说：我们认识很多年了，有些话一直没来得及说。
- **Demo instruction**: 

## emotion-fearful-1 · emotion-fearful-1 [?]
- **生成描述（seed-audio）**: 一位女声用平静中性的语气说：刚才手机响了，我有点担心是家里打来的。
- **Demo instruction**: 

## emotion-surprised-1 · emotion-surprised-1 [?]
- **生成描述（seed-audio）**: 一位男声用平静中性的语气说：楼下新开了家店，听说生意很好，要不要去看看。
- **Demo instruction**: 

## emotion-disgusted-1 · emotion-disgusted-1 [?]
- **生成描述（seed-audio）**: 一位女声用平静中性的语气说：厨房的水龙头好像坏了，一直滴滴答答的。
- **Demo instruction**: 

## emotion-calm-1 · emotion-calm-1 [?]
- **生成描述（seed-audio）**: 一位男声用平静中性的语气说：深呼吸，先把事情一件一件理清楚，不要着急。
- **Demo instruction**: 

## emotion-excited-1 · emotion-excited-1 [?]
- **生成描述（seed-audio）**: 一位女声用平静中性的语气说：周末我们去郊外爬山吧，天气正好。
- **Demo instruction**: 

## voice-edit-zh-2 · voice-edit-zh-2 [?]
- **生成描述（seed-audio）**: 一位中年男声，声音普通平淡，说：明天上午十点，我们在公司楼下集合。
- **Demo instruction**: 

## voice-edit-zh-3 · voice-edit-zh-3 [?]
- **生成描述（seed-audio）**: 一位年轻女声，声音普通平淡，说：这份文件我放你桌上了，记得看一下。
- **Demo instruction**: 

## voice-edit-en-1 · voice-edit-en-1 [?]
- **生成描述（seed-audio）**: A plain neutral voice saying: Please submit your report by the end of the day, thank you.
- **Demo instruction**: Change the voice to a deep calm male voice, keep the words

## nonverbal-edit · Remove · breath [zh]
- **生成描述（seed-audio）**: 一位男声朗读一段话，中间有明显的换气声：嗯……其实……这个项目，我们还有不少地方需要完善。
- **Demo instruction**: 把语音里的换气声都去掉

## nv-laugh-add · nv-laugh-add [?]
- **生成描述（seed-audio）**: 一位女声说一段话：你刚才说的那个笑话，真的太好笑了。
- **Demo instruction**: 在开头加一声笑

## nv-sigh-add · nv-sigh-add [?]
- **生成描述（seed-audio）**: 一位男声说一段话：唉，又下雨了，路上肯定很堵。
- **Demo instruction**: 在结尾加一声叹气

## nv-cough-rm · nv-cough-rm [?]
- **生成描述（seed-audio）**: 一位男声说话时咳嗽了两声：咳咳，不好意思，嗓子有点不舒服，我们继续。
- **Demo instruction**: 把咳嗽声去掉

## nv-um-rm · nv-um-rm [?]
- **生成描述（seed-audio）**: 一位女声说话时带口头语：嗯，我觉得吧，嗯，这个方案还是可以的。
- **Demo instruction**: 把“嗯”去掉

## nv-cry-add · nv-cry-add [?]
- **生成描述（seed-audio）**: A female voice speaking softly: I really did not expect it to end this way.
- **Demo instruction**: Add a crying sound at the beginning

## nv-stammer-rm · nv-stammer-rm [?]
- **生成描述（seed-audio）**: A male voice with stuttering: I, I mean, we, we should just, you know, try it.
- **Demo instruction**: Remove the stammering

## nv-yeah-add · nv-yeah-add [?]
- **生成描述（seed-audio）**: A casual male voice: Yeah, that sounds good, yeah, let us do that.
- **Demo instruction**: Add "yeah" at the end

## whisper-to-normal-2 · whisper-to-normal-2 [?]
- **生成描述（seed-audio）**: 一段耳语声，压低声音悄悄说：别告诉别人，其实我早就知道了。
- **Demo instruction**: 把这段耳语转换成正常说话的声音

## normal-to-whisper-1 · normal-to-whisper-1 [?]
- **生成描述（seed-audio）**: 一位女声正常音量说：图书馆快闭馆了，我们收拾一下准备走吧。
- **Demo instruction**: 把这段话转换成耳语

## normal-to-whisper-2 · normal-to-whisper-2 [?]
- **生成描述（seed-audio）**: A normal female voice: The library is about to close, let us pack up and head out.
- **Demo instruction**: Turn this into a whisper

## accent-dongbei · accent-dongbei [?]
- **生成描述（seed-audio）**: 带有明显东北口音的普通话：这事儿吧，我跟你说，真没啥大不了的，别搁心里。
- **Demo instruction**: 

## accent-sichuan · accent-sichuan [?]
- **生成描述（seed-audio）**: 带有明显四川口音的普通话：这个事情嘛，做起来还是有点麻烦，不过慢慢来嘛。
- **Demo instruction**: 

## accent-henan · accent-henan [?]
- **生成描述（seed-audio）**: 带有明显河南口音的普通话：恁说的是这个理，咱慢慢商量，不着急。
- **Demo instruction**: 

## accent-hunan · accent-hunan [?]
- **生成描述（seed-audio）**: 带有明显湖南口音的普通话：这个菜味道蛮好的，你尝一下看咯。
- **Demo instruction**: 

## accent-jiangxi · accent-jiangxi [?]
- **生成描述（seed-audio）**: 带有明显江西方言的普通话：这个东西蛮好用的，你试一下就知道啦。
- **Demo instruction**: 

## accent-shanghai · accent-shanghai [?]
- **生成描述（seed-audio）**: 带有明显上海口音的普通话：侬好，这个事情阿拉再讨论一下好伐。
- **Demo instruction**: 

## accent-guangdong · accent-guangdong [?]
- **生成描述（seed-audio）**: 带有明显广东口音的普通话：呢个问题要好好处理下，唔好急。
- **Demo instruction**: 

## accent-fujian · accent-fujian [?]
- **生成描述（seed-audio）**: 带有明显福建口音的普通话：这个办法很好，我们大家一起努力哦。
- **Demo instruction**: 

## accent-shandong · accent-shandong [?]
- **生成描述（seed-audio）**: 带有明显山东口音的普通话：这个事儿就这么定了，明天一早咱就出发。
- **Demo instruction**: 

## accent-hubei · accent-hubei [?]
- **生成描述（seed-audio）**: 带有明显湖北口音的普通话：你莫急，我马上就来，等一哈。
- **Demo instruction**: 

## accent-shaanxi · accent-shaanxi [?]
- **生成描述（seed-audio）**: 带有明显陕西口音的普通话：这个活路我熟得很，你放心交给额。
- **Demo instruction**: 

## accent-anhui · accent-anhui [?]
- **生成描述（seed-audio）**: 带有明显安徽口音的普通话：这个菜烧得真好，你再吃点，别客气。
- **Demo instruction**: 

## accent-tianjin · accent-tianjin [?]
- **生成描述（seed-audio）**: 带有明显天津口音的普通话：介事儿嘛，挺好办的，您就放心吧。
- **Demo instruction**: 

## speed-2 · Speed Edit [zh]
- **生成描述（seed-audio）**: 一位男声以中等语速说：今天天气不错，适合出去走走，晒晒太阳。
- **Demo instruction**: 说太快了，慢一点

## volume-2 · Volume Edit [zh]
- **生成描述（seed-audio）**: 一位女声以正常音量说：请大家把手机调成静音，会议马上开始。
- **Demo instruction**: 声音大一点

## pitch-2 · Pitch Edit [zh]
- **生成描述（seed-audio）**: 一位男声说：好的，那我们就这样安排，有问题随时找我。
- **Demo instruction**: 声音再低沉一点
