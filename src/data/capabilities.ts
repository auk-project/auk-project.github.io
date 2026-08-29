// AuK demo content schema & dataset.
// 15 speech tasks. Missing metadata stays as `<...>`; missing audio samples
// use the literal syntax `[audio|<instruction><reference audio description>]`.
//
// Audio paths point at `assets/audio-norm/`, a loudness-normalized mirror of
// `assets/audio/` produced by `scripts/normalize_audio.py`. The masters are kept
// untouched under the original folder. Energy-edit clips are copied verbatim
// into the mirror, so that demo keeps the level differences it exists to show.

export type DemoKind = "single" | "pair" | "multi" | "placeholder" | "slider" | "emotion" | "separate" | "nv";

/** How a group's instruction line behaves. Every card shows its input and its
 *  output at once, so the line is always visible when present.
 *  - `always` one static instruction for the card
 *  - `track`  follows whichever output the card's switch selects
 *  - `none`   no instruction line at all */
export type InstructionMode = "always" | "track" | "none";

export interface AudioAsset {
  src?: string;
  out?: string;
  /** Optional secondary output for slider-style controls. */
  outs?: { label: string; url: string }[];
}

export interface Placeholder {
  missing: true;
  text: string;
}

export interface DemoSample {
  id: string;
  lang: "zh" | "en" | "bilingual" | "instrumental";
  label: string;
  hint?: string;
  transcript?: string;
  instruction: string;
  /** For emotion sliders: the emotion the source clip already carries, so that
   *  stop is understood to replay the input rather than an edit. */
  defaultEmotion?: string;
  /** For separate-speech cards: one instruction per output track. */
  separateInstructions?: { content: string; number: string };
  /** For nonverbal-edit sliders: JSON map of stop label -> instruction. */
  nvInstructions?: string;
  /** Per-output annotations on the transcript, JSON string keyed by output
   *  label: deleted spans (red strike), added spans (green), replaced spans
   *  (blue from→to). */
  transcriptMarks?: string;
  audio: AudioAsset | Placeholder;
}

export interface DemoGroup {
  id: string;
  title: string;
  subtitle: string;
  /** `slider` is used for rate / volume / pitch with one source + several outs. */
  layout: DemoKind;
  /** Defaults to `always`. */
  instructionMode?: InstructionMode;
  /** Fold the spoken text into the instruction instead of showing it as a
   *  separate quoted block (text-to-speech, where the text *is* the request). */
  inlineTranscript?: boolean;
  /** Connector placed before the folded-in text. Defaults to ": ". */
  transcriptConnector?: string;
  samples: DemoSample[];
  /** Optional note shown under the group (e.g. supported dialect list). */
  note?: string;
}

export interface CapabilityFamily {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  groups: DemoGroup[];
}

export const capabilities: CapabilityFamily[] = [
  {
    id: "speech-generation",
    name: "Text-to-Speech",
    tagline: "Synthesize speech from text",
    intro: "Generate speech directly from text — by describing the voice in free-form language, or by cloning a speaker from a short reference clip.",
    groups: [
      {
        id: "instruct-tts",
        title: "Instruct TTS",
        subtitle: "Voice described in natural language, no reference audio needed",
        layout: "single",
        instructionMode: "always",
        inlineTranscript: true,
        transcriptConnector: ", and say: ",
        samples: [
          {
            id: "instruct-tts-1",
            lang: "zh",
            label: "Instruct TTS · Mandarin",
            instruction: "Say the following in the voice described here: “一位雄才大略、性格复杂的乱世枭雄，以略显沙哑却极有穿透力的中年男声说话。语气自信、果断，带着审视人心的敏锐感。讲话时节奏变化明显，可以先压低声音缓缓铺垫，再突然加重关键字。既有豪迈，也隐约带着危险与猜疑”",
            transcript: "宁可我负天下人，休教天下人负我。",
            audio: { out: "assets/audio-norm/instruct-tts-1-output.wav" },
          },
          {
            id: "instruct-tts-2",
            lang: "zh",
            label: "Instruct TTS · Mandarin",
            instruction: "Say the following in the voice described here: “一位中年女性，在面对面质问多年前抛弃自己的人时，用沙哑、干涩的嗓音倾诉三十年压抑的恨意与委屈，仿佛眼泪已经流尽。语速缓慢而沉稳，字字清晰冰冷，整体音量中等偏低，但说到愤恨处声音微微发颤、压抑着哽咽，音色苍凉而有力，句尾带着渗骨的决绝，最后一句陡然拔高、几乎用尽全身力气砸出来”",
            transcript: "哼，我的眼泪早哭干了，我没有委屈，我有的是恨，是悔，是三十年一天一天我自己受的苦。你大概已经忘了你做的事了！",
            audio: { out: "assets/audio-norm/instruct-tts-2-output.wav" },
          },
          {
            id: "instruct-tts-3",
            lang: "en",
            label: "Instruct TTS · English",
            instruction: "Say the following in the voice described here: “一位莎士比亚戏剧风格的经典反派，正在揭露真相前细细品味这一刻。声音是浑厚且富有戏剧张力的男中音，胸腔共鸣饱满，语速从容舒缓，带着刻意的停顿与强调；辅音被夸张地滚动、咬字清晰而富有舞台感。语调先佯装甜蜜温柔，几乎带着宠溺，随后在词句间骤然转冷，锋利如刀刃，每个字都缠绕着危险而愉悦的得意之情”",
            transcript: "You see, my dear, the trap was never meant for you. It was always meant for him.",
            audio: { out: "assets/audio-norm/instruct-tts-3-output.wav" },
          },
          {
            id: "instruct-tts-4",
            lang: "en",
            label: "Instruct TTS · English",
            instruction: "Say the following in the voice described here: “仿佛在葬礼上宣布噩耗一般，声音轻柔而哽咽，强忍着泪水，话语断断续续、每句之间都有停顿，字字愈发沉重，最后一句的尾音被悲伤撕裂、颤抖着透出压抑不住的哭腔。语调缓慢低沉，气息不稳，清晰度因哽咽而略受影响，整体氛围凝重而哀恸”",
            transcript: "He always said he\'d come back. He always kept his word. Until now.",
            audio: { out: "assets/audio-norm/instruct-tts-4-output.wav" },
          },
        ],
      },
      {
        id: "zero-shot-tts",
        title: "Zero-Shot TTS",
        subtitle: "Voice cloned from a reference clip",
        layout: "pair",
        instructionMode: "always",
        inlineTranscript: true,
        samples: [
          {
            id: "zs-tts-1",
            lang: "zh",
            label: "Zero-Shot TTS · Mandarin",
            instruction: "Say the following in the reference speaker's voice",
            transcript: "有些事情只有失去了才知道珍惜，有些人转身以后，就再也回不来了",
            audio: {
              src: "assets/audio-norm/zs-tts-1-input.wav",
              out: "assets/audio-norm/zs-tts-1-output.wav",
            },
          },
          {
            id: "zs-tts-2",
            lang: "zh",
            label: "Zero-Shot TTS · Mandarin",
            instruction: "Say the following in the reference speaker's voice",
            transcript: "谁在意啊？谁邀请你了？别干这种丢人的事！",
            audio: {
              src: "assets/audio-norm/zs-tts-2-input.wav",
              out: "assets/audio-norm/zs-tts-2-output.wav",
            },
          },
          {
            id: "zs-tts-3",
            lang: "en",
            label: "Zero-Shot TTS · English",
            instruction: "Say the following in the reference speaker's voice",
            transcript: "If not even light can escape the event horizon, how do you think you’ll escape me?",
            audio: {
              src: "assets/audio-norm/zs-tts-3-input.wav",
              out: "assets/audio-norm/zs-tts-3-output.wav",
            },
          },
          {
            id: "zs-tts-4",
            lang: "en",
            label: "Zero-Shot TTS · English",
            instruction: "Say the following in the reference speaker's voice",
            transcript: "Land is the only thing in the world worth working for, worth fighting for, worth dying for. Because it’s the only thing that lasts.",
            audio: {
              src: "assets/audio-norm/zs-tts-4-input.wav",
              out: "assets/audio-norm/zs-tts-4-output.wav",
            },
          },
        ],
      },
    ],
  },
  {
    id: "content-editing",
    name: "Content Editing",
    tagline: "Insert, delete, or replace the spoken content",
    intro: "Modify the words of a recording while preserving the speaker's identity, prosody, and the surrounding acoustic context.",
    groups: [
      {
        id: "content-edit-speech",
        title: "Speech Content Editing",
        subtitle: "Insert / Delete / Replace · spoken words",
        layout: "nv",
        instructionMode: "track",
        samples: [
          {
            id: "ce-zh-1",
            lang: "zh",
            label: "Content Editing · Mandarin",
            instruction: "",
            transcript: "愚夫，久闻先生大名如雷贯耳，曾两次进谒不得相见，已留书一封，不知可曾阅过？南阳野人，疏懒成性，吕蒙将军枉临，不胜惭愧。将军，请。先生请。二弟、三弟在此等候。",
            transcriptMarks: "{\"➕ Add\": {\"add\": [{\"text\": \"在下辗转反侧，梦寐以求\", \"after\": \"不得相见\"}]}, \"➖ Delete\": {\"delete\": [\"南阳野人，疏懒成性\"]}, \"🔁 Replace\": {\"change\": [{\"from\": \"曾两次进谒不得相见\", \"to\": \"我想与先生共商国事\"}]}}",
            nvInstructions: "{\"➕ Add\": \"Add “在下辗转反侧，梦寐以求” after “不得相见”\", \"➖ Delete\": \"Delete “南阳野人，疏懒成性”\", \"🔁 Replace\": \"Replace “曾两次进谒不得相见” with “我想与先生共商国事”\"}",
            audio: {
              src: "assets/audio-norm/content-edit/ce-zh-1-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/content-edit/ce-zh-1-input.wav" },
                { label: "➕ Add", url: "assets/audio-norm/content-edit/ce-zh-1-add.wav" },
                { label: "➖ Delete", url: "assets/audio-norm/content-edit/ce-zh-1-delete.wav" },
                { label: "🔁 Replace", url: "assets/audio-norm/content-edit/ce-zh-1-change.wav" },
              ],
            },
          },
          {
            id: "ce-zh-2",
            lang: "zh",
            label: "Content Editing · Mandarin",
            instruction: "",
            transcript: "等仗打完了，我赏给你半斤地瓜烧。啊，不过你得好好琢磨琢磨，怎么用两发炮弹，把敌人的指挥部给我打掉了。",
            transcriptMarks: "{\"➕ Add\": {\"add\": [{\"text\": \"三座大别墅\", \"after\": \"半斤地瓜烧\"}]}, \"➖ Delete\": {\"delete\": [\"用两发炮弹\"]}, \"🔁 Replace\": {\"change\": [{\"from\": \"半斤地瓜烧\", \"to\": \"两只大烧鸡\"}]}}",
            nvInstructions: "{\"➕ Add\": \"Add “三座大别墅” after “半斤地瓜烧”\", \"➖ Delete\": \"Delete “用两发炮弹”\", \"🔁 Replace\": \"Replace “半斤地瓜烧” with “两只大烧鸡”\"}",
            audio: {
              src: "assets/audio-norm/content-edit/ce-zh-2-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/content-edit/ce-zh-2-input.wav" },
                { label: "➕ Add", url: "assets/audio-norm/content-edit/ce-zh-2-add.wav" },
                { label: "➖ Delete", url: "assets/audio-norm/content-edit/ce-zh-2-delete.wav" },
                { label: "🔁 Replace", url: "assets/audio-norm/content-edit/ce-zh-2-change.wav" },
              ],
            },
          },
          {
            id: "ce-en-1",
            lang: "en",
            label: "Content Editing · English",
            instruction: "",
            transcript: "You know, thank you guys for all your sacrifice. You know, for all the hours I spend in the gym working and training, and Vanessa, you holding down the family the way that you have, I can't. There's no way I can thank you enough for that. So from the bottom of my heart, thank you. And what can I say? Mamba out.",
            transcriptMarks: "{\"➕ Add\": {\"add\": [{\"text\": \"never\", \"before\": \"out\"}]}, \"➖ Delete\": {\"delete\": [\"You know, for all the hours I spend in the gym working and training\"]}, \"🔁 Replace\": {\"change\": [{\"from\": \"Mamba\", \"to\": \"James\"}]}}",
            nvInstructions: "{\"➕ Add\": \"Add “never” before “out”\", \"➖ Delete\": \"Delete “You know, for all the hours I spend in the gym working and training”\", \"🔁 Replace\": \"Replace “Mamba” with “James”\"}",
            audio: {
              src: "assets/audio-norm/content-edit/ce-en-1-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/content-edit/ce-en-1-input.wav" },
                { label: "➕ Add", url: "assets/audio-norm/content-edit/ce-en-1-add.wav" },
                { label: "➖ Delete", url: "assets/audio-norm/content-edit/ce-en-1-delete.wav" },
                { label: "🔁 Replace", url: "assets/audio-norm/content-edit/ce-en-1-change.wav" },
              ],
            },
          },
          {
            id: "ce-en-2",
            lang: "en",
            label: "Content Editing · English",
            instruction: "",
            transcript: "Do you think the biggest victory is not fighting for what we want, but accepting what we cannot have? In some ways, like I was better equipped to answer that question when I was in my twenty s. Change is going to be a constant. That's such a great question.",
            transcriptMarks: "{\"➕ Add\": {\"add\": [{\"text\": \"and the most important lesson is to accept changes\", \"after\": \"Change is going to be a constant\"}]}, \"➖ Delete\": {\"delete\": [\"not fighting for what we want, but\"]}, \"🔁 Replace\": {\"change\": [{\"from\": \"but accepting what we cannot have\", \"to\": \"and living well with dreams unmet\"}]}}",
            nvInstructions: "{\"➕ Add\": \"Add “and the most important lesson is to accept changes” after “Change is going to be a constant”\", \"➖ Delete\": \"Delete “not fighting for what we want, but”\", \"🔁 Replace\": \"Replace “but accepting what we cannot have” with “and living well with dreams unmet”\"}",
            audio: {
              src: "assets/audio-norm/content-edit/ce-en-2-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/content-edit/ce-en-2-input.wav" },
                { label: "➕ Add", url: "assets/audio-norm/content-edit/ce-en-2-add.wav" },
                { label: "➖ Delete", url: "assets/audio-norm/content-edit/ce-en-2-delete.wav" },
                { label: "🔁 Replace", url: "assets/audio-norm/content-edit/ce-en-2-change.wav" },
              ],
            },
          },
        ],
      },
      {
        id: "vocal-edit",
        title: "Vocal Edit",
        subtitle: "Insert / Delete / Replace · sung lyrics",
        layout: "pair",
        instructionMode: "always",
        samples: [
          {
            id: "vocaledit-zh-1",
            lang: "zh",
            label: "Vocal Edit · Mandarin",
            instruction: "Replace “寂寞” with “疯狂” in the lyrics",
            transcript: "这是今天最寂寞的时候，太阳照着你好温柔",
            transcriptMarks: "{\"Output\": {\"change\": [{\"from\": \"寂寞\", \"to\": \"疯狂\"}]}}",
            audio: {
              src: "assets/audio-norm/vocaledit/vocaledit-zh-1-input.wav",
              out: "assets/audio-norm/vocaledit/vocaledit-zh-1-output.wav",
            },
          },
          {
            id: "vocaledit-zh-2",
            lang: "zh",
            label: "Vocal Edit · Mandarin",
            instruction: "Replace “恩怨” with “笑容” in the lyrics",
            transcript: "当恩怨搁一半，我怎么圈揽。看灯笼血红染，寻仇已太晚",
            transcriptMarks: "{\"Output\": {\"change\": [{\"from\": \"恩怨\", \"to\": \"笑容\"}]}}",
            audio: {
              src: "assets/audio-norm/vocaledit/vocaledit-zh-2-input.wav",
              out: "assets/audio-norm/vocaledit/vocaledit-zh-2-output.wav",
            },
          },
          {
            id: "vocaledit-en-2",
            lang: "en",
            label: "Vocal Edit · English",
            instruction: "Replace “can't be tamed” with “are the same” in the lyrics",
            transcript: "Come on, get on up. We're wild and we can't be tamed. And we're turning the floor into a zoo.",
            transcriptMarks: "{\"Output\": {\"change\": [{\"from\": \"can't be tamed\", \"to\": \"are the same\"}]}}",
            audio: {
              src: "assets/audio-norm/vocaledit/vocaledit-en-2-input.wav",
              out: "assets/audio-norm/vocaledit/vocaledit-en-2-output.wav",
            },
          },
          {
            id: "vocaledit-en-1",
            lang: "en",
            label: "Vocal Edit · English",
            instruction: "Replace “rear view” with “like you” in the lyrics",
            transcript: "They ain't gon' respect you 'til they fear you. Switching lanes, but they used to be in your rear view.",
            transcriptMarks: "{\"Output\": {\"change\": [{\"from\": \"rear view\", \"to\": \"like you\"}]}}",
            audio: {
              src: "assets/audio-norm/vocaledit/vocaledit-en-1-input.wav",
              out: "assets/audio-norm/vocaledit/vocaledit-en-1-output.wav",
            },
          },
        ],
      },
    ],
  },
  {
    id: "enhancement-separation",
    name: "Enhancement and Separation",
    tagline: "Clean, isolate, or restore audio",
    intro: "Restore degraded recordings, separate speakers, extract vocals, and improve quality.",
    groups: [
      {
        id: "enhance-speech",
        title: "Enhance Speech",
        subtitle: "Remove noise, restore clarity",
        layout: "pair",
        instructionMode: "none",
        samples: [
          {
            id: "se-zh-1",
            lang: "zh",
            label: "Enhance Speech · Mandarin",
            instruction: "Remove the background noise and make the voice cleaner",
            audio: {
              src: "assets/audio-norm/se/se-zh-2-input.wav",
              out: "assets/audio-norm/se/se-zh-2-output.wav",
            },
          },
          {
            id: "se-zh-2",
            lang: "zh",
            label: "Enhance Speech · Mandarin",
            instruction: "Remove the background noise and make the voice cleaner",
            audio: {
              src: "assets/audio-norm/se/se-zh-1-input.wav",
              out: "assets/audio-norm/se/se-zh-1-output.wav",
            },
          },
          {
            id: "se-en-1",
            lang: "en",
            label: "Enhance Speech · English",
            instruction: "Remove the background noise and make the voice clearer",
            audio: {
              src: "assets/audio-norm/se/se-en-1-input.wav",
              out: "assets/audio-norm/se/se-en-1-output.wav",
            },
          },
          {
            id: "se-en-2",
            lang: "en",
            label: "Enhance Speech · English",
            instruction: "Clean up the audio and remove the static",
            audio: {
              src: "assets/audio-norm/se/se-en-2-input.wav",
              out: "assets/audio-norm/se/se-en-2-output.wav",
            },
          },
        ],
      },
      {
        id: "separate-speech",
        title: "Separate Speech",
        subtitle: "Isolate one speaker by content or by speaking order",
        layout: "separate",
        instructionMode: "track",
        samples: [
          {
            id: "zh-1",
            lang: "zh",
            label: "Separate Speech · Mandarin",
            instruction: "",
            separateInstructions: {
              content: "Keep only the speaker who says “警队规矩”",
              number: "Keep only the second speaker",
            },
            audio: {
              src: "assets/audio-norm/ss/zh-1-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/ss/zh-1-input.wav" },
                { label: "Output1 · content", url: "assets/audio-norm/ss/zh-1-content.wav" },
                { label: "Output2 · number", url: "assets/audio-norm/ss/zh-1-number.wav" },
              ],
            },
          },
          {
            id: "zh-2",
            lang: "zh",
            label: "Separate Speech · Mandarin",
            instruction: "",
            separateInstructions: {
              content: "Keep only the speech of “皇儿”",
              number: "Keep only the second speaker",
            },
            audio: {
              src: "assets/audio-norm/ss/zh-2-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/ss/zh-2-input.wav" },
                { label: "Output1 · content", url: "assets/audio-norm/ss/zh-2-content.wav" },
                { label: "Output2 · number", url: "assets/audio-norm/ss/zh-2-number.wav" },
              ],
            },
          },
          {
            id: "en-1",
            lang: "en",
            label: "Separate Speech · English",
            instruction: "",
            separateInstructions: {
              content: "Keep only the speaker who says “get what”",
              number: "Keep only the first speaker",
            },
            audio: {
              src: "assets/audio-norm/ss/en-1-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/ss/en-1-input.wav" },
                { label: "Output1 · content", url: "assets/audio-norm/ss/en-1-content.wav" },
                { label: "Output2 · number", url: "assets/audio-norm/ss/en-1-number.wav" },
              ],
            },
          },
          {
            id: "en-2",
            lang: "en",
            label: "Separate Speech · English",
            instruction: "",
            separateInstructions: {
              content: "Keep only the speaker who says “I'm good and you”",
              number: "Keep only the first speaker",
            },
            audio: {
              src: "assets/audio-norm/ss/en-2-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/ss/en-2-input.wav" },
                { label: "Output1 · content", url: "assets/audio-norm/ss/en-2-content.wav" },
                { label: "Output2 · number", url: "assets/audio-norm/ss/en-2-number.wav" },
              ],
            },
          },
        ],
      },
      {
        id: "extract-vocals",
        title: "Extract Vocals",
        subtitle: "Separate the singing voice from the accompaniment",
        layout: "pair",
        instructionMode: "none",
        samples: [
          {
            id: "ev-1",
            lang: "zh",
            label: "Extract Vocals · Mandarin",
            instruction: "Extract the vocals and remove the accompaniment",
            audio: {
              src: "assets/audio-norm/vocalextraction/vocal-2-input.wav",
              out: "assets/audio-norm/vocalextraction/vocal-2-output.wav",
            },
          },
          {
            id: "ev-2",
            lang: "zh",
            label: "Extract Vocals · Mandarin",
            instruction: "Extract the vocals and remove the accompaniment",
            audio: {
              src: "assets/audio-norm/vocalextraction/vocal-4-input.wav",
              out: "assets/audio-norm/vocalextraction/vocal-4-output.wav",
            },
          },
          {
            id: "ev-3",
            lang: "en",
            label: "Extract Vocals · English",
            instruction: "Extract the vocals and remove the accompaniment",
            audio: {
              src: "assets/audio-norm/vocalextraction/vocal-1-input.wav",
              out: "assets/audio-norm/vocalextraction/vocal-1-output.wav",
            },
          },
          {
            id: "ev-4",
            lang: "en",
            label: "Extract Vocals · English",
            instruction: "Extract the vocals and remove the accompaniment",
            audio: {
              src: "assets/audio-norm/vocalextraction/vocal-3-input.wav",
              out: "assets/audio-norm/vocalextraction/vocal-3-output.wav",
            },
          },
        ],
      },
      {
        id: "super-resolution",
        title: "Improve Quality",
        subtitle: "Super-resolution / bandwidth extension",
        layout: "pair",
        instructionMode: "none",
        samples: [
          {
            id: "sr-zh-1",
            lang: "zh",
            label: "Improve Quality · Mandarin",
            instruction: "Improve the audio quality and make it clearer",
            audio: {
              src: "assets/audio-norm/sr/sr-zh-1-input.wav",
              out: "assets/audio-norm/sr/sr-zh-1-output.wav",
            },
          },
          {
            id: "sr-zh-2",
            lang: "zh",
            label: "Improve Quality · Mandarin",
            instruction: "Improve the audio quality and make it clearer",
            audio: {
              src: "assets/audio-norm/sr/sr-zh-2-input.wav",
              out: "assets/audio-norm/sr/sr-zh-2-output.wav",
            },
          },
          {
            id: "sr-en-1",
            lang: "en",
            label: "Improve Quality · English",
            instruction: "Improve the audio quality and make it clearer",
            audio: {
              src: "assets/audio-norm/sr/sr-en-1-input.wav",
              out: "assets/audio-norm/sr/sr-en-1-output.wav",
            },
          },
          {
            id: "sr-en-2",
            lang: "en",
            label: "Improve Quality · English",
            instruction: "Improve the audio quality and make it clearer",
            audio: {
              src: "assets/audio-norm/sr/sr-en-2-input.wav",
              out: "assets/audio-norm/sr/sr-en-2-output.wav",
            },
          },
        ],
      },
    ],
  },
  {
    id: "paralinguistic",
    name: "Paralinguistic Editing",
    tagline: "Edit how something is said, not what is said",
    intro: "Change emotion, voice timbre, non-verbal events, whisper style, and accent without changing the words.",
    groups: [
      {
        id: "emotion-edit",
        title: "Emotion Edit",
        subtitle: "Slide the emoji to change the emotion",
        layout: "emotion",
        instructionMode: "track",
        samples: [
          {
            id: "emo-zh-1",
            lang: "zh",
            label: "Emotion Edit · Mandarin",
            instruction: "Say this in a <emotion> tone",
            defaultEmotion: "angry",
            audio: {
              src: "assets/audio-norm/emotion-edit/zh-1-input.wav",
              outs: [
                { label: "😄 happy", url: "assets/audio-norm/emotion-edit/zh-1-happy.wav" },
                { label: "😭 sad", url: "assets/audio-norm/emotion-edit/zh-1-sad.wav" },
                { label: "😡 angry", url: "assets/audio-norm/emotion-edit/zh-1-input.wav" },
                { label: "😱 afraid", url: "assets/audio-norm/emotion-edit/zh-1-afraid.wav" },
                { label: "😐 calm", url: "assets/audio-norm/emotion-edit/zh-1-calm.wav" },
              ],
            },
          },
          {
            id: "emo-zh-2",
            lang: "zh",
            label: "Emotion Edit · Mandarin",
            instruction: "Say this in a <emotion> tone",
            defaultEmotion: "calm",
            audio: {
              src: "assets/audio-norm/emotion-edit/zh-2-input.wav",
              outs: [
                { label: "😄 happy", url: "assets/audio-norm/emotion-edit/zh-2-happy.wav" },
                { label: "😭 sad", url: "assets/audio-norm/emotion-edit/zh-2-sad.wav" },
                { label: "😡 angry", url: "assets/audio-norm/emotion-edit/zh-2-angry.wav" },
                { label: "😱 afraid", url: "assets/audio-norm/emotion-edit/zh-2-afraid.wav" },
                { label: "😐 calm", url: "assets/audio-norm/emotion-edit/zh-2-input.wav" },
              ],
            },
          },
          {
            id: "emo-en-1",
            lang: "en",
            label: "Emotion Edit · English",
            instruction: "Say this in a <emotion> tone",
            defaultEmotion: "calm",
            audio: {
              src: "assets/audio-norm/emotion-edit/en-1-input.wav",
              outs: [
                { label: "😄 happy", url: "assets/audio-norm/emotion-edit/en-1-happy.wav" },
                { label: "😭 sad", url: "assets/audio-norm/emotion-edit/en-1-sad.wav" },
                { label: "😡 angry", url: "assets/audio-norm/emotion-edit/en-1-angry.wav" },
                { label: "😱 afraid", url: "assets/audio-norm/emotion-edit/en-1-afraid.wav" },
                { label: "😐 calm", url: "assets/audio-norm/emotion-edit/en-1-input.wav" },
              ],
            },
          },
          {
            id: "emo-en-2",
            lang: "en",
            label: "Emotion Edit · English",
            instruction: "Say this in a <emotion> tone",
            defaultEmotion: "calm",
            audio: {
              src: "assets/audio-norm/emotion-edit/en-2-input.wav",
              outs: [
                { label: "😄 happy", url: "assets/audio-norm/emotion-edit/en-2-happy.wav" },
                { label: "😭 sad", url: "assets/audio-norm/emotion-edit/en-2-sad.wav" },
                { label: "😡 angry", url: "assets/audio-norm/emotion-edit/en-2-angry.wav" },
                { label: "😱 afraid", url: "assets/audio-norm/emotion-edit/en-2-afraid.wav" },
                { label: "😐 calm", url: "assets/audio-norm/emotion-edit/en-2-input.wav" },
              ],
            },
          },
        ],
      },
      {
        id: "voice-edit",
        title: "Timbre Edit",
        subtitle: "Replace the speaker timbre · keep the words",
        layout: "pair",
        instructionMode: "always",
        samples: [
          {
            id: "vc-1",
            lang: "zh",
            label: "Voice Edit · Mandarin",
            instruction: "Keep the words and change the timbre to: “这位说话人的声音低沉而浑厚，语速平稳，吐字清晰。他的说话风格沉稳而富有思考，带有平静的反思特质。”",
            audio: {
              src: "assets/audio-norm/vc/vc-1-input.wav",
              out: "assets/audio-norm/vc/vc-1-output.wav",
            },
          },
          {
            id: "vc-2",
            lang: "zh",
            label: "Voice Edit · Mandarin",
            instruction: "Keep the words and change the timbre to: “这位说话人是一位女声，音色清晰明亮，语速平稳，吐字非常清晰。她的说话风格正式且客观，具有新闻播报或正式文件朗读的风格。”",
            audio: {
              src: "assets/audio-norm/vc/vc-2-input.wav",
              out: "assets/audio-norm/vc/vc-2-output.wav",
            },
          },
          {
            id: "vc-3",
            lang: "zh",
            label: "Voice Edit · Mandarin",
            instruction: "Keep the words and change the timbre to: “The speaker is a female with a calm, conversational tone, discussing financial comparisons between different decades. Her speaking style is deliberate and matter-of-fact, using a standard Chinese accent with clear pronunciation.”",
            audio: {
              src: "assets/audio-norm/vc/vc-3-input.wav",
              out: "assets/audio-norm/vc/vc-3-output.wav",
            },
          },
          {
            id: "vc-4",
            lang: "en",
            label: "Voice Edit · English",
            instruction: "Keep the words and change the timbre to: “这位说话人的声音干净清透，带有明显的英国口音。他的语速缓慢，语气真诚而坦率，带有平静叙述个人经历的风格。其音色温润舒缓，吐字清晰利落，语调平和从容，营造出娓娓道来的讲述氛围。”",
            audio: {
              src: "assets/audio-norm/vc/vc-4-input.wav",
              out: "assets/audio-norm/vc/vc-4-output.wav",
            },
          },
        ],
      },
      {
        id: "nonverbal-edit",
        title: "Nonverbal Edit",
        subtitle: "Insert or remove a non-verbal event",
        layout: "nv",
        instructionMode: "track",
        samples: [
          {
            id: "zh-a",
            lang: "zh",
            label: "Nonverbal Edit · Mandarin · Insert",
            instruction: "",
            transcript: "这个月的转化率是 2.3%，比预期低了0.5个百分点。主要的缺口来自新客渠道，下周我先做一轮复盘，再决定要不要追加预算。",
            transcriptMarks: "{\"😮‍💨 sigh\": {\"add\": [{\"text\": \"😮‍💨\", \"before\": \"这个月\"}]}, \"😐 filler\": {\"add\": [{\"text\": \"😐\", \"before\": \"主要的缺口\"}]}, \"🤧 cough\": {\"add\": [{\"text\": \"🤧\", \"before\": \"再决定\"}]}}",
            nvInstructions: "{\"😮‍💨 sigh\": \"Add a sigh before “这个月”\", \"😐 filler\": \"Add a filler before “主要的缺口”\", \"🤧 cough\": \"Add a cough before “再决定”\"}",
            audio: {
              src: "assets/audio-norm/nv/zh-a-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/nv/zh-a-input.wav" },
                { label: "😮‍💨 sigh", url: "assets/audio-norm/nv/zh-a-sigh.wav" },
                { label: "😐 filler", url: "assets/audio-norm/nv/zh-a-filler.wav" },
                { label: "🤧 cough", url: "assets/audio-norm/nv/zh-a-cough.wav" },
              ],
            },
          },
          {
            id: "zh-b",
            lang: "zh",
            label: "Nonverbal Edit · Mandarin · Remove",
            instruction: "",
            transcript: "我跟你讲👃，他昨天真的去了，我以为他就随口一说😂，结果人家连行李都打包好了，哇🤩，这也太说到做到了吧。",
            transcriptMarks: "{\"😂 laugh\": {\"delete\": [\"😂\"]}, \"🤩 surprise\": {\"delete\": [\"🤩\"]}, \"👃 inhale\": {\"delete\": [\"👃\"]}}",
            nvInstructions: "{\"😂 laugh\": \"Remove the laughter\", \"🤩 surprise\": \"Remove the gasp of surprise\", \"👃 inhale\": \"Remove the sharp inhale\"}",
            audio: {
              src: "assets/audio-norm/nv/zh-b-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/nv/zh-b-input.wav" },
                { label: "😂 laugh", url: "assets/audio-norm/nv/zh-b-laugh.wav" },
                { label: "🤩 surprise", url: "assets/audio-norm/nv/zh-b-surprise.wav" },
                { label: "👃 inhale", url: "assets/audio-norm/nv/zh-b-inhale.wav" },
              ],
            },
          },
          {
            id: "en-c",
            lang: "en",
            label: "Nonverbal Edit · English · Insert",
            instruction: "",
            transcript: "The result came back this morning. We tested three versions, and only one of them held up under load. I'll show you which one in a second.",
            transcriptMarks: "{\"🌬️ breath\": {\"add\": [{\"text\": \"🌬️\", \"before\": \"We tested\"}]}, \"🤧 sneeze\": {\"add\": [{\"text\": \"🤧\", \"before\": \"only one of them\"}]}, \"⏸️ pause\": {\"add\": [{\"text\": \"⏸️\", \"after\": \"only one of them\"}]}}",
            nvInstructions: "{\"🌬️ breath\": \"Add a breath before “We tested”\", \"🤧 sneeze\": \"Add a sneeze before “only one of them”\", \"⏸️ pause\": \"Add a pause after “only one of them”\"}",
            audio: {
              src: "assets/audio-norm/nv/en-c-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/nv/en-c-input.wav" },
                { label: "🌬️ breath", url: "assets/audio-norm/nv/en-c-breath.wav" },
                { label: "🤧 sneeze", url: "assets/audio-norm/nv/en-c-sneeze.wav" },
                { label: "⏸️ pause", url: "assets/audio-norm/nv/en-c-pause.wav" },
              ],
            },
          },
          {
            id: "en-d",
            lang: "en",
            label: "Nonverbal Edit · English · Remove",
            instruction: "",
            transcript: "Sorry, I know it's really late right now. I walked past that shop tonight and they were playing our song. Hmm🎵~ I found out today the project was cancelled🐍...Nobody even told me. I gave it a year😢. Anyway, call me back when you wake up tomorrow.",
            transcriptMarks: "{\"🎵 hmm\": {\"delete\": [\"🎵\"]}, \"🐍 hiss\": {\"delete\": [\"🐍\"]}, \"😢 cry\": {\"delete\": [\"😢\"]}}",
            nvInstructions: "{\"🎵 hmm\": \"Remove the humming\", \"🐍 hiss\": \"Remove the hiss\", \"😢 cry\": \"Remove the sobbing\"}",
            audio: {
              src: "assets/audio-norm/nv/en-d-input.wav",
              outs: [
                { label: "Input", url: "assets/audio-norm/nv/en-d-input.wav" },
                { label: "🎵 hmm", url: "assets/audio-norm/nv/en-d-hmm.wav" },
                { label: "🐍 hiss", url: "assets/audio-norm/nv/en-d-hiss.wav" },
                { label: "😢 cry", url: "assets/audio-norm/nv/en-d-cry.wav" },
              ],
            },
          },
        ],
      },
      {
        id: "whisper-edit",
        title: "Whisper Edit",
        subtitle: "Transform between normal speech and whispered speech",
        layout: "pair",
        instructionMode: "always",
        samples: [
          {
            id: "wh-w2n-zh",
            lang: "zh",
            label: "Normal → Whisper · Mandarin",
            instruction: "Turn this into a whisper",
            audio: {
              src: "assets/audio-norm/whisper/wh-w2n-zh-input.wav",
              out: "assets/audio-norm/whisper/wh-w2n-zh-output.wav",
            },
          },
          {
            id: "wh-w2n-en",
            lang: "en",
            label: "Normal → Whisper · English",
            instruction: "Turn this into a whisper",
            audio: {
              src: "assets/audio-norm/whisper/wh-w2n-en-input.wav",
              out: "assets/audio-norm/whisper/wh-w2n-en-output.wav",
            },
          },
          {
            id: "wh-n2w-zh",
            lang: "zh",
            label: "Whisper → Normal · Mandarin",
            instruction: "Turn this whisper into normal speech",
            audio: {
              src: "assets/audio-norm/whisper/wh-n2w-zh-input.wav",
              out: "assets/audio-norm/whisper/wh-n2w-zh-output.wav",
            },
          },
          {
            id: "wh-n2w-en",
            lang: "en",
            label: "Whisper → Normal · English",
            instruction: "Turn this whisper into normal speech",
            audio: {
              src: "assets/audio-norm/whisper/wh-n2w-en-input.wav",
              out: "assets/audio-norm/whisper/wh-n2w-en-output.wav",
            },
          },
        ],
      },
      {
        id: "accent-edit",
        title: "Deaccent",
        subtitle: "Convert an accented recording to standard Mandarin",
        layout: "pair",
        instructionMode: "none",
        samples: [
          {
            id: "accent-tibetan",
            lang: "zh",
            label: "Tibetan accent → Standard Mandarin",
            instruction: "Deaccent this recording into standard Mandarin",
            audio: {
              src: "assets/audio-norm/accent/accent-tibetan-input.wav",
              out: "assets/audio-norm/accent/accent-tibetan-output.wav",
            },
          },
          {
            id: "accent-sichuan",
            lang: "zh",
            label: "Sichuan accent → Standard Mandarin",
            instruction: "Deaccent this recording into standard Mandarin",
            audio: {
              src: "assets/audio-norm/accent/accent-sichuan-input.wav",
              out: "assets/audio-norm/accent/accent-sichuan-output.wav",
            },
          },
          {
            id: "accent-dongbei",
            lang: "zh",
            label: "Northeastern accent → Standard Mandarin",
            instruction: "Deaccent this recording into standard Mandarin",
            audio: {
              src: "assets/audio-norm/accent/accent-dongbei-input.wav",
              out: "assets/audio-norm/accent/accent-dongbei-output.wav",
            },
          },
          {
            id: "accent-hubei",
            lang: "zh",
            label: "Hubei accent → Standard Mandarin",
            instruction: "Deaccent this recording into standard Mandarin",
            audio: {
              src: "assets/audio-norm/accent/accent-hubei-input.wav",
              out: "assets/audio-norm/accent/accent-hubei-output.wav",
            },
          },
          {
            id: "accent-hunan",
            lang: "zh",
            label: "Hunan accent → Standard Mandarin",
            instruction: "Deaccent this recording into standard Mandarin",
            audio: {
              src: "assets/audio-norm/accent/accent-hunan-input.wav",
              out: "assets/audio-norm/accent/accent-hunan-output.wav",
            },
          },
          {
            id: "accent-fujian",
            lang: "zh",
            label: "Fujian accent → Standard Mandarin",
            instruction: "Deaccent this recording into standard Mandarin",
            audio: {
              src: "assets/audio-norm/accent/accent-fujian-input.wav",
              out: "assets/audio-norm/accent/accent-fujian-output.wav",
            },
          },
        ],
      },
    ],
  },
  {
    id: "acoustic-editing",
    name: "Acoustic Editing",
    tagline: "Fine-grained control of rate, pitch, and loudness",
    intro: "AuK adjusts the low-level speaking attributes — speed, volume, and pitch.",
    groups: [
      {
        id: "speed-edit",
        title: "Speed Edit",
        subtitle: "Slide through every supported rate multiplier",
        layout: "slider",
        instructionMode: "none",
        samples: [
          {
            id: "speed-1",
            lang: "zh",
            label: "Speed Edit",
            instruction: "",
            audio: {
              src: "assets/audio-norm/speed/speed-edit-1-input.wav",
              outs: [
                { label: "0.5×", url: "assets/audio-norm/speed/speed-edit-1-0.5.wav" },
                { label: "0.75×", url: "assets/audio-norm/speed/speed-edit-1-0.75.wav" },
                { label: "1.0× (source)", url: "assets/audio-norm/speed/speed-edit-1-input.wav" },
                { label: "1.25×", url: "assets/audio-norm/speed/speed-edit-1-1.25.wav" },
                { label: "1.5×", url: "assets/audio-norm/speed/speed-edit-1-1.5.wav" },
                { label: "2.0×", url: "assets/audio-norm/speed/speed-edit-1-2.wav" },
              ],
            },
          },
          {
            id: "speed-2",
            lang: "zh",
            label: "Speed Edit",
            instruction: "",
            audio: {
              src: "assets/audio-norm/speed/speed-edit-input.wav",
              outs: [
                { label: "0.5×", url: "assets/audio-norm/speed/speed-edit-0.5.wav" },
                { label: "0.75×", url: "assets/audio-norm/speed/speed-edit-0.75.wav" },
                { label: "1.0× (source)", url: "assets/audio-norm/speed/speed-edit-input.wav" },
                { label: "1.25×", url: "assets/audio-norm/speed/speed-edit-1.25.wav" },
                { label: "1.5×", url: "assets/audio-norm/speed/speed-edit-1.5.wav" },
                { label: "2.0×", url: "assets/audio-norm/speed/speed-edit-2.wav" },
              ],
            },
          },
        ],
      },
      {
        id: "volume-edit",
        title: "Energy Edit",
        subtitle: "Slide through every supported loudness offset",
        layout: "slider",
        instructionMode: "none",
        samples: [
          {
            id: "volume-1",
            lang: "zh",
            label: "Energy Edit",
            instruction: "",
            audio: {
              src: "assets/audio-norm/energy/energy-edit-1-input.wav",
              outs: [
                { label: "−15 dB", url: "assets/audio-norm/energy/energy-edit-1--15.wav" },
                { label: "−10 dB", url: "assets/audio-norm/energy/energy-edit-1--10.wav" },
                { label: "−5 dB", url: "assets/audio-norm/energy/energy-edit-1--5.wav" },
                { label: "0 dB (source)", url: "assets/audio-norm/energy/energy-edit-1-input.wav" },
                { label: "+5 dB", url: "assets/audio-norm/energy/energy-edit-1-+5.wav" },
                { label: "+10 dB", url: "assets/audio-norm/energy/energy-edit-1-+10.wav" },
                { label: "+15 dB", url: "assets/audio-norm/energy/energy-edit-1-+15.wav" },
              ],
            },
          },
          {
            id: "volume-2",
            lang: "zh",
            label: "Energy Edit",
            instruction: "",
            audio: {
              src: "assets/audio-norm/energy/energy-edit-2-input.wav",
              outs: [
                { label: "−15 dB", url: "assets/audio-norm/energy/energy-edit-2--15.wav" },
                { label: "−10 dB", url: "assets/audio-norm/energy/energy-edit-2--10.wav" },
                { label: "−5 dB", url: "assets/audio-norm/energy/energy-edit-2--5.wav" },
                { label: "0 dB (source)", url: "assets/audio-norm/energy/energy-edit-2-input.wav" },
                { label: "+5 dB", url: "assets/audio-norm/energy/energy-edit-2-+5.wav" },
                { label: "+10 dB", url: "assets/audio-norm/energy/energy-edit-2-+10.wav" },
                { label: "+15 dB", url: "assets/audio-norm/energy/energy-edit-2-+15.wav" },
              ],
            },
          },
        ],
      },
      {
        id: "pitch-edit",
        title: "Pitch Edit",
        subtitle: "Slide through every supported pitch shift",
        layout: "slider",
        instructionMode: "none",
        samples: [
          {
            id: "pitch-1",
            lang: "zh",
            label: "Pitch Edit",
            instruction: "",
            audio: {
              src: "assets/audio-norm/pitch/pitch-1-input.wav",
              outs: [
                { label: "−3 semi", url: "assets/audio-norm/pitch/pitch-1--3.wav" },
                { label: "−2 semi", url: "assets/audio-norm/pitch/pitch-1--2.wav" },
                { label: "−1 semi", url: "assets/audio-norm/pitch/pitch-1--1.wav" },
                { label: "0 (source)", url: "assets/audio-norm/pitch/pitch-1-input.wav" },
                { label: "+1 semi", url: "assets/audio-norm/pitch/pitch-1-+1.wav" },
                { label: "+2 semi", url: "assets/audio-norm/pitch/pitch-1-+2.wav" },
                { label: "+3 semi", url: "assets/audio-norm/pitch/pitch-1-+3.wav" },
              ],
            },
          },
          {
            id: "pitch-2",
            lang: "zh",
            label: "Pitch Edit",
            instruction: "",
            audio: {
              src: "assets/audio-norm/pitch/pitch-2-input.wav",
              outs: [
                { label: "−3 semi", url: "assets/audio-norm/pitch/pitch-2--3.wav" },
                { label: "−2 semi", url: "assets/audio-norm/pitch/pitch-2--2.wav" },
                { label: "−1 semi", url: "assets/audio-norm/pitch/pitch-2--1.wav" },
                { label: "0 (source)", url: "assets/audio-norm/pitch/pitch-2-input.wav" },
                { label: "+1 semi", url: "assets/audio-norm/pitch/pitch-2-+1.wav" },
                { label: "+2 semi", url: "assets/audio-norm/pitch/pitch-2-+2.wav" },
                { label: "+3 semi", url: "assets/audio-norm/pitch/pitch-2-+3.wav" },
              ],
            },
          },
        ],
      },
    ],
  },
];

export interface FamilyChip {
  id: string;
  name: string;
}

export const familyChips: FamilyChip[] = capabilities.map((c) => ({
  id: c.id,
  name: c.name,
}));

export const headlineStats: { label: string; value: string; note?: string }[] = [
  { label: "Backbone parameters", value: "1.5B" },
  { label: "Hours of effective audio", value: "1.95M" },
  { label: "Instruction–audio instances", value: "3.03B" },
  { label: "Speech tasks", value: "15" },
  { label: "AuK-Flash sampling steps", value: "4", note: "4.5× speedup" },
];

export const resourceLinks: { label: string; href: string | null; icon: string }[] = [
  { label: "Paper", href: null, icon: "arxiv" },
  { label: "GitHub", href: null, icon: "github" },
  { label: "Hugging Face", href: null, icon: "hf" },
  { label: "ModelScope", href: null, icon: "modelscope" },
];
