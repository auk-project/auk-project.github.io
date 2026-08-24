// Auk demo content schema & dataset.
// 15 speech tasks. Missing metadata stays as `<...>`; missing audio samples
// use the literal syntax `[audio|<instruction><reference audio description>]`.

export type DemoKind = "single" | "pair" | "multi" | "placeholder" | "slider";

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
  audio: AudioAsset | Placeholder;
}

export interface DemoGroup {
  id: string;
  title: string;
  subtitle: string;
  /** `slider` is used for rate / volume / pitch with one source + several outs. */
  layout: DemoKind;
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

const ph = (): Placeholder => ({
  missing: true,
  text: `[audio|<instruction><reference audio description>]`,
});

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
        subtitle: "Voice described in natural language · no reference audio needed",
        layout: "single",
        samples: [
          {
            id: "instruct-tts-zh-1",
            lang: "zh",
            label: "Instruct TTS · Mandarin",
            instruction: "用年轻女生的温柔体贴的语气说",
            transcript: "欢迎回来，今天上班累不累呀",
            audio: { out: "assets/audio/instruct-tts-output.wav" },
          },
          {
            id: "instruct-tts-zh-2",
            lang: "zh",
            label: "Instruct TTS · Mandarin",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: ph(),
          },
          {
            id: "instruct-tts-en-1",
            lang: "en",
            label: "Instruct TTS · English",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: ph(),
          },
          {
            id: "instruct-tts-en-2",
            lang: "en",
            label: "Instruct TTS · English",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: ph(),
          },
        ],
      },
      {
        id: "zero-shot-tts",
        title: "Zero-Shot TTS",
        subtitle: "Voice cloned from a reference clip",
        layout: "pair",
        samples: [
          {
            id: "zs-tts-zh-1",
            lang: "zh",
            label: "Zero-Shot TTS · Mandarin",
            instruction: "用这个人的声音说",
            transcript: "大家好，欢迎收看今天的节目",
            audio: {
              src: "assets/audio/zero-shot-reference.wav",
              out: "assets/audio/zero-shot-output.wav",
            },
          },
          {
            id: "zs-tts-zh-2",
            lang: "zh",
            label: "Zero-Shot TTS · Mandarin",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: ph(),
          },
          {
            id: "zs-tts-en-1",
            lang: "en",
            label: "Zero-Shot TTS · English",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: ph(),
          },
          {
            id: "zs-tts-en-2",
            lang: "en",
            label: "Zero-Shot TTS · English",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: ph(),
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
        layout: "pair",
        samples: [
          {
            id: "content-speech-replace-zh-1",
            lang: "zh",
            label: "Replace · Mandarin",
            instruction: "把“今天”改成“明天”",
            transcript: "<source transcript> → <target transcript>",
            audio: {
              src: "assets/audio/speech-edit-source.wav",
              out: "assets/audio/speech-edit-output.wav",
            },
          },
          {
            id: "content-speech-insert-zh-1",
            lang: "zh",
            label: "Insert · Mandarin",
            instruction: "<instruction>",
            transcript: "<source transcript> → <target transcript>",
            audio: ph(),
          },
          {
            id: "content-speech-delete-zh-1",
            lang: "zh",
            label: "Delete · Mandarin",
            instruction: "<instruction>",
            transcript: "<source transcript> → <target transcript>",
            audio: ph(),
          },
          {
            id: "content-speech-replace-en-1",
            lang: "en",
            label: "Replace · English",
            instruction: "<instruction>",
            transcript: "<source transcript> → <target transcript>",
            audio: ph(),
          },
          {
            id: "content-speech-insert-en-1",
            lang: "en",
            label: "Insert · English",
            instruction: "<instruction>",
            transcript: "<source transcript> → <target transcript>",
            audio: ph(),
          },
          {
            id: "content-speech-delete-en-1",
            lang: "en",
            label: "Delete · English",
            instruction: "<instruction>",
            transcript: "<source transcript> → <target transcript>",
            audio: ph(),
          },
        ],
      },
      {
        id: "vocal-edit",
        title: "Vocal Edit",
        subtitle: "Insert / Delete / Replace · sung lyrics",
        layout: "pair",
        samples: [
          {
            id: "vocal-edit-replace-zh-1",
            lang: "zh",
            label: "Vocal Edit · Mandarin",
            instruction: "把这首歌里唱的“明天你好”改成“未来你好”",
            transcript: "<source lyrics> → <target lyrics>",
            audio: {
              src: "assets/audio/lyric-edit-source.wav",
              out: "assets/audio/lyric-edit-output.wav",
            },
          },
          {
            id: "vocal-edit-replace-zh-2",
            lang: "zh",
            label: "Vocal Edit · Mandarin",
            instruction: "<instruction>",
            transcript: "<source lyrics> → <target lyrics>",
            audio: ph(),
          },
          {
            id: "vocal-edit-replace-en-1",
            lang: "en",
            label: "Vocal Edit · English",
            instruction: "<instruction>",
            transcript: "<source lyrics> → <target lyrics>",
            audio: ph(),
          },
          {
            id: "vocal-edit-replace-en-2",
            lang: "en",
            label: "Vocal Edit · English",
            instruction: "<instruction>",
            transcript: "<source lyrics> → <target lyrics>",
            audio: ph(),
          },
        ],
      },
    ],
  },
  {
    id: "enhancement-separation",
    name: "Enhancement and Separation",
    tagline: "Clean, isolate, or restore audio",
    intro: "Restore degraded recordings, separate speakers, extract vocals, and improve quality — all from natural-language instructions.",
    groups: [
      {
        id: "enhance-speech",
        title: "Enhance Speech",
        subtitle: "Remove noise, restore clarity",
        layout: "pair",
        samples: [
          {
            id: "enhance-1",
            lang: "zh",
            label: "Enhance Speech · Mandarin",
            instruction: "把背景噪音去掉，声音干净点",
            transcript: "<noisy speech> → <clean speech>",
            audio: {
              src: "assets/audio/enhancement-source.wav",
              out: "assets/audio/enhancement-output.wav",
            },
          },
          {
            id: "enhance-2",
            lang: "zh",
            label: "Enhance Speech · Mandarin",
            instruction: "<instruction>",
            audio: ph(),
          },
          {
            id: "enhance-3",
            lang: "en",
            label: "Enhance Speech · English",
            instruction: "<instruction>",
            audio: ph(),
          },
          {
            id: "enhance-4",
            lang: "en",
            label: "Enhance Speech · English",
            instruction: "<instruction>",
            audio: ph(),
          },
        ],
      },
      {
        id: "separate-speech",
        title: "Separate Speech",
        subtitle: "By content, order, or loudest speaker · 3 cues × 2 languages",
        layout: "pair",
        samples: [
          {
            id: "ss-content-zh-1",
            lang: "zh",
            label: "Separate by content · Mandarin",
            instruction: "只保留说“明天”的那个人",
            audio: ph(),
          },
          {
            id: "ss-order-zh-1",
            lang: "zh",
            label: "Separate by speaking order · Mandarin",
            instruction: "只保留第一个说话的人",
            audio: ph(),
          },
          {
            id: "ss-loudest-zh-1",
            lang: "zh",
            label: "Separate the loudest speaker · Mandarin",
            instruction: "只保留声音最大的那个人",
            audio: ph(),
          },
          {
            id: "ss-content-en-1",
            lang: "en",
            label: "Separate by content · English",
            instruction: "<instruction>",
            audio: ph(),
          },
          {
            id: "ss-order-en-1",
            lang: "en",
            label: "Separate by speaking order · English",
            instruction: "<instruction>",
            audio: ph(),
          },
          {
            id: "ss-loudest-en-1",
            lang: "en",
            label: "Separate the loudest speaker · English",
            instruction: "<instruction>",
            audio: ph(),
          },
        ],
      },
      {
        id: "extract-vocals",
        title: "Extract Vocals",
        subtitle: "Vocal out / accompaniment out / enhance",
        layout: "pair",
        samples: [
          {
            id: "ev-zh-1",
            lang: "zh",
            label: "Extract Vocals · Mandarin",
            instruction: "提取人声，去掉伴奏",
            audio: ph(),
          },
          {
            id: "ev-zh-2",
            lang: "zh",
            label: "Extract Vocals · Mandarin",
            instruction: "<instruction>",
            audio: ph(),
          },
          {
            id: "ev-en-1",
            lang: "en",
            label: "Extract Vocals · English",
            instruction: "<instruction>",
            audio: ph(),
          },
          {
            id: "ev-en-2",
            lang: "en",
            label: "Extract Vocals · English",
            instruction: "<instruction>",
            audio: ph(),
          },
        ],
      },
      {
        id: "super-resolution",
        title: "Improve Quality",
        subtitle: "Super-resolution / bandwidth extension",
        layout: "pair",
        samples: [
          {
            id: "sr-zh-1",
            lang: "zh",
            label: "Improve Quality · Mandarin",
            instruction: "音质太差像打电话，提升清晰度",
            audio: ph(),
          },
          {
            id: "sr-zh-2",
            lang: "zh",
            label: "Improve Quality · Mandarin",
            instruction: "<instruction>",
            audio: ph(),
          },
          {
            id: "sr-en-1",
            lang: "en",
            label: "Improve Quality · English",
            instruction: "<instruction>",
            audio: ph(),
          },
          {
            id: "sr-en-2",
            lang: "en",
            label: "Improve Quality · English",
            instruction: "<instruction>",
            audio: ph(),
          },
        ],
      },
    ],
  },
  {
    id: "paralinguistic",
    name: "Paralinguistic Editing",
    tagline: "Edit how something is said, not what is said",
    intro: "Change emotion, voice identity, non-verbal events, whisper style, and accent without changing the words.",
    groups: [
      {
        id: "emotion-edit",
        title: "Emotion Edit",
        subtitle: "Angry · Happy · Sad · Fearful · Surprised · Disgusted · Calm · Excited",
        layout: "pair",
        samples: [
          {
            id: "emotion-1",
            lang: "zh",
            label: "Emotion Edit · Mandarin",
            instruction: "让他听起来开心点",
            audio: {
              src: "assets/audio/emotion-source.wav",
              out: "assets/audio/emotion-output.wav",
            },
          },
          { id: "emotion-angry-1", lang: "zh", label: "Angry", instruction: "听起来生气一点", audio: ph() },
          { id: "emotion-happy-1", lang: "zh", label: "Happy", instruction: "听起来开心一点", audio: ph() },
          { id: "emotion-sad-1", lang: "zh", label: "Sad", instruction: "听起来难过一点", audio: ph() },
          { id: "emotion-fearful-1", lang: "zh", label: "Fearful", instruction: "听起来害怕一点", audio: ph() },
          { id: "emotion-surprised-1", lang: "zh", label: "Surprised", instruction: "听起来惊讶一点", audio: ph() },
          { id: "emotion-disgusted-1", lang: "zh", label: "Disgusted", instruction: "听起来厌恶一点", audio: ph() },
          { id: "emotion-calm-1", lang: "zh", label: "Calm", instruction: "听起来平静一点", audio: ph() },
          { id: "emotion-excited-1", lang: "zh", label: "Excited", instruction: "听起来兴奋一点", audio: ph() },
        ],
      },
      {
        id: "voice-edit",
        title: "Voice Edit",
        subtitle: "Replace the speaker identity · keep the words",
        layout: "pair",
        samples: [
          {
            id: "voice-edit-1",
            lang: "zh",
            label: "Voice Edit · Mandarin",
            instruction: "把这段话的声音换成低沉磁性的男声，内容别变",
            audio: {
              src: "assets/audio/timbre-source.wav",
              out: "assets/audio/timbre-output.wav",
            },
          },
          { id: "voice-edit-zh-2", lang: "zh", label: "Voice Edit · Mandarin", instruction: "换成活泼开朗的女声", audio: ph() },
          { id: "voice-edit-zh-3", lang: "zh", label: "Voice Edit · Mandarin", instruction: "换成浑厚的中年男声", audio: ph() },
          { id: "voice-edit-en-1", lang: "en", label: "Voice Edit · English", instruction: "<instruction>", audio: ph() },
        ],
      },
      {
        id: "nonverbal-edit",
        title: "Nonverbal Edit",
        subtitle: "Insert or remove non-verbal events (breath, laugh, sigh, cough, …)",
        layout: "pair",
        samples: [
          {
            id: "nv-breath-rm",
            lang: "zh",
            label: "Remove · breath",
            instruction: "把语音里的换气声都去掉",
            audio: ph(),
          },
          { id: "nv-laugh-add", lang: "zh", label: "Insert · laugh", instruction: "在开头加一声笑", audio: ph() },
          { id: "nv-sigh-add", lang: "zh", label: "Insert · sigh", instruction: "在结尾加一声叹气", audio: ph() },
          { id: "nv-cough-rm", lang: "zh", label: "Remove · cough", instruction: "把咳嗽声去掉", audio: ph() },
          { id: "nv-um-rm", lang: "zh", label: "Remove · um", instruction: "把“嗯”去掉", audio: ph() },
          { id: "nv-cry-add", lang: "en", label: "Insert · cry", instruction: "<instruction>", audio: ph() },
          { id: "nv-stammer-rm", lang: "en", label: "Remove · stammer", instruction: "<instruction>", audio: ph() },
          { id: "nv-yeah-add", lang: "en", label: "Insert · yeah", instruction: "<instruction>", audio: ph() },
        ],
      },
      {
        id: "whisper-edit",
        title: "Whisper Edit",
        subtitle: "Transform between normal speech and whispered speech",
        layout: "pair",
        samples: [
          {
            id: "whisper-to-normal-1",
            lang: "zh",
            label: "Whisper → Normal · Mandarin",
            instruction: "把这段耳语转换成正常说话的声音",
            audio: {
              src: "assets/audio/whisper-source.wav",
              out: "assets/audio/whisper-output.wav",
            },
          },
          { id: "whisper-to-normal-2", lang: "zh", label: "Whisper → Normal · Mandarin", instruction: "<instruction>", audio: ph() },
          { id: "normal-to-whisper-1", lang: "zh", label: "Normal → Whisper · Mandarin", instruction: "把这段话转换成耳语", audio: ph() },
          { id: "normal-to-whisper-2", lang: "en", label: "Normal → Whisper · English", instruction: "<instruction>", audio: ph() },
        ],
      },
      {
        id: "accent-edit",
        title: "Accent Edit",
        subtitle: "De-accent to standard Mandarin · 13 dialect / regional-accent categories",
        layout: "pair",
        samples: [
          {
            id: "accent-1",
            lang: "zh",
            label: "Accent Edit · Mandarin",
            instruction: "把这段话的方言口音去掉，说得标准点",
            audio: {
              src: "assets/audio/deaccent-source.wav",
              out: "assets/audio/deaccent-output.wav",
            },
          },
          { id: "accent-dongbei", lang: "zh", label: "东北口音 → 标准普通话", instruction: "把东北口音去掉，说得标准点", audio: ph() },
          { id: "accent-sichuan", lang: "zh", label: "四川口音 → 标准普通话", instruction: "把四川口音去掉，说得标准点", audio: ph() },
          { id: "accent-henan", lang: "zh", label: "河南口音 → 标准普通话", instruction: "把河南口音去掉，说得标准点", audio: ph() },
          { id: "accent-hunan", lang: "zh", label: "湖南口音 → 标准普通话", instruction: "把湖南口音去掉，说得标准点", audio: ph() },
          { id: "accent-jiangxi", lang: "zh", label: "江西口音 → 标准普通话", instruction: "把江西口音去掉，说得标准点", audio: ph() },
          { id: "accent-shanghai", lang: "zh", label: "上海口音 → 标准普通话", instruction: "把上海口音去掉，说得标准点", audio: ph() },
          { id: "accent-guangdong", lang: "zh", label: "广东口音 → 标准普通话", instruction: "把广东口音去掉，说得标准点", audio: ph() },
          { id: "accent-fujian", lang: "zh", label: "福建口音 → 标准普通话", instruction: "把福建口音去掉，说得标准点", audio: ph() },
          { id: "accent-shandong", lang: "zh", label: "山东口音 → 标准普通话", instruction: "把山东口音去掉，说得标准点", audio: ph() },
          { id: "accent-hubei", lang: "zh", label: "湖北口音 → 标准普通话", instruction: "把湖北口音去掉，说得标准点", audio: ph() },
          { id: "accent-shaanxi", lang: "zh", label: "陕西口音 → 标准普通话", instruction: "把陕西口音去掉，说得标准点", audio: ph() },
          { id: "accent-anhui", lang: "zh", label: "安徽口音 → 标准普通话", instruction: "把安徽口音去掉，说得标准点", audio: ph() },
          { id: "accent-tianjin", lang: "zh", label: "天津口音 → 标准普通话", instruction: "把天津口音去掉，说得标准点", audio: ph() },
        ],
      },
    ],
  },
  {
    id: "acoustic-editing",
    name: "Acoustic Editing",
    tagline: "Fine-grained control of rate, pitch, and loudness",
    intro: "Auk adjusts the low-level speaking attributes — speed, volume, and pitch — while preserving the linguistic content and speaker identity. Each control is one source + several outputs on a slider.",
    groups: [
      {
        id: "speed-edit",
        title: "Speed Edit",
        subtitle: "Slide through every supported rate multiplier",
        layout: "slider",
        samples: [
          {
            id: "speed-1",
            lang: "zh",
            label: "Speed Edit",
            instruction: "说太快了，慢一点",
            audio: {
              src: "assets/audio/acoustic-source.wav",
              outs: [
                { label: "0.5×", url: "assets/audio/rate-0_5x-output.wav" },
                { label: "0.75×", url: "assets/audio/rate-0_75x-output.wav" },
                { label: "1.0× (source)", url: "assets/audio/acoustic-source.wav" },
                { label: "1.25×", url: "assets/audio/rate-1_25x-output.wav" },
                { label: "1.5×", url: "assets/audio/rate-1_5x-output.wav" },
                { label: "2.0×", url: "assets/audio/rate-2_0x-output.wav" },
              ],
            },
          },
          {
            id: "speed-2",
            lang: "zh",
            label: "Speed Edit",
            instruction: "<instruction>",
            audio: ph(),
          },
        ],
      },
      {
        id: "volume-edit",
        title: "Volume Edit",
        subtitle: "Slide through every supported loudness offset",
        layout: "slider",
        samples: [
          {
            id: "volume-1",
            lang: "zh",
            label: "Volume Edit",
            instruction: "声音大一点",
            audio: {
              src: "assets/audio/acoustic-source.wav",
              outs: [
                { label: "−15 dB", url: "assets/audio/loudness-minus-15db-output.wav" },
                { label: "−10 dB", url: "assets/audio/loudness-minus-10db-output.wav" },
                { label: "−5 dB", url: "assets/audio/loudness-minus-5db-output.wav" },
                { label: "0 dB (source)", url: "assets/audio/acoustic-source.wav" },
                { label: "+5 dB", url: "assets/audio/loudness-plus-5db-output.wav" },
                { label: "+10 dB", url: "assets/audio/loudness-plus-10db-output.wav" },
                { label: "+15 dB", url: "assets/audio/loudness-plus-15db-output.wav" },
              ],
            },
          },
          {
            id: "volume-2",
            lang: "zh",
            label: "Volume Edit",
            instruction: "<instruction>",
            audio: ph(),
          },
        ],
      },
      {
        id: "pitch-edit",
        title: "Pitch Edit",
        subtitle: "Slide through every supported pitch shift",
        layout: "slider",
        samples: [
          {
            id: "pitch-1",
            lang: "zh",
            label: "Pitch Edit",
            instruction: "声音再低沉一点",
            audio: {
              src: "assets/audio/acoustic-source.wav",
              outs: [
                { label: "−3 semi", url: "assets/audio/pitch-minus-3-output.wav" },
                { label: "−2 semi", url: "assets/audio/pitch-minus-2-output.wav" },
                { label: "−1 semi", url: "assets/audio/pitch-minus-1-output.wav" },
                { label: "0 (source)", url: "assets/audio/acoustic-source.wav" },
                { label: "+1 semi", url: "assets/audio/pitch-plus-1-output.wav" },
                { label: "+2 semi", url: "assets/audio/pitch-plus-2-output.wav" },
                { label: "+3 semi", url: "assets/audio/pitch-plus-3-output.wav" },
              ],
            },
          },
          {
            id: "pitch-2",
            lang: "zh",
            label: "Pitch Edit",
            instruction: "<instruction>",
            audio: ph(),
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
  { label: "Auk-Flash sampling steps", value: "4", note: "4.5× speedup" },
];

export const resourceLinks: { label: string; href: string | null; icon: string }[] = [
  { label: "Paper", href: null, icon: "arxiv" },
  { label: "GitHub", href: null, icon: "github" },
  { label: "Hugging Face", href: null, icon: "hf" },
  { label: "ModelScope", href: null, icon: "modelscope" },
];
