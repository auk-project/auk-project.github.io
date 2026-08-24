// Auk demo content schema & dataset (16 tasks).
// Missing metadata stays as `<...>` placeholders; missing audio samples use
// the literal syntax `[audio|<instruction><reference audio description>]`.

export type DemoKind = "single" | "pair" | "multi" | "placeholder";

export interface AudioAsset {
  src?: string;
  out?: string;
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
  instruction?: string;
  audio: AudioAsset | Placeholder;
}

export interface DemoGroup {
  id: string;
  title: string;
  subtitle: string;
  layout: DemoKind;
  samples: DemoSample[];
  note?: string;
}

export interface CapabilityFamily {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  groups: DemoGroup[];
}

// ---- reusable placeholder ----
const missing = (label: string): Placeholder => ({
  missing: true,
  text: `[audio|<instruction><reference audio description>]`,
});
void missing;

export const capabilities: CapabilityFamily[] = [
  {
    id: "speech-generation",
    name: "Speech Generation",
    tagline: "Synthesize speech from text",
    intro:
      "Auk generates natural speech from text — either by describing the voice in free-form language (Instruct TTS) or by cloning a speaker from a short reference clip (Zero-shot TTS).",
    groups: [
      {
        id: "instruct-tts",
        title: "Instruct TTS",
        subtitle: "Text synthesis from a voice description · no reference audio needed",
        layout: "single",
        samples: [
          {
            id: "instruct-tts-zh-1",
            lang: "zh",
            label: "用年轻女生的温柔体贴的语气说：",
            transcript: "欢迎回来，今天上班累不累呀",
            instruction: "用年轻女生的温柔体贴的语气说",
            audio: { out: "assets/audio/instruct-tts-output.wav" },
          },
          {
            id: "instruct-tts-zh-2",
            lang: "zh",
            label: "Another voice description (Mandarin)",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: missing("instruct-tts-zh-2"),
          },
          {
            id: "instruct-tts-en-1",
            lang: "en",
            label: "A second voice description (English)",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: missing("instruct-tts-en-1"),
          },
        ],
      },
      {
        id: "zero-shot-tts",
        title: "Zero-shot TTS",
        subtitle: "Voice cloning from a reference clip · upload reference audio",
        layout: "pair",
        samples: [
          {
            id: "zs-tts-zh-1",
            lang: "zh",
            label: "用这个人的声音说：",
            transcript: "大家好，欢迎收看今天的节目",
            instruction: "用这个人的声音说",
            audio: {
              src: "assets/audio/zero-shot-reference.wav",
              out: "assets/audio/zero-shot-output.wav",
            },
          },
          {
            id: "zs-tts-en-1",
            lang: "en",
            label: "English target text with the same voice",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: missing("zs-tts-en-1"),
          },
          {
            id: "zs-tts-hard-1",
            lang: "zh",
            label: "Hard text (tongue twister)",
            instruction: "<instruction>",
            transcript: "<target text>",
            audio: missing("zs-tts-hard-1"),
          },
        ],
      },
    ],
  },
  {
    id: "content-editing",
    name: "Content Editing",
    tagline: "Edit what is said",
    intro:
      "Auk inserts, deletes, or replaces the spoken content of a recording while preserving the speaker's identity, prosody, and the surrounding acoustic context.",
    groups: [
      {
        id: "content-edit",
        title: "Content Edit",
        subtitle: "Change words while keeping the voice",
        layout: "pair",
        samples: [
          {
            id: "content-edit-1",
            lang: "zh",
            label: "把“今天”改成“明天”",
            instruction: "把“今天”改成“明天”",
            transcript: "<source transcript> → <target transcript>",
            audio: {
              src: "assets/audio/speech-edit-source.wav",
              out: "assets/audio/speech-edit-output.wav",
            },
          },
          {
            id: "content-edit-2",
            lang: "zh",
            label: "Insert a phrase (Mandarin)",
            instruction: "<instruction>",
            transcript: "<source transcript> → <target transcript>",
            audio: missing("content-edit-2"),
          },
          {
            id: "content-edit-3",
            lang: "en",
            label: "Replace a phrase (English)",
            instruction: "<instruction>",
            transcript: "<source transcript> → <target transcript>",
            audio: missing("content-edit-3"),
          },
        ],
      },
    ],
  },
  {
    id: "enhancement-separation",
    name: "Enhancement and Separation",
    tagline: "Clean, isolate, or restore audio",
    intro:
      "Auk restores degraded recordings, separates speakers, extracts vocals, and improves quality — all from natural-language instructions.",
    groups: [
      {
        id: "speech-enhancement",
        title: "Enhance Speech",
        subtitle: "Remove background noise for a clean voice",
        layout: "pair",
        samples: [
          {
            id: "enhance-1",
            lang: "zh",
            label: "把背景噪音去掉，声音干净点",
            instruction: "把背景噪音去掉，声音干净点",
            audio: {
              src: "assets/audio/enhancement-source.wav",
              out: "assets/audio/enhancement-output.wav",
            },
          },
          {
            id: "enhance-2",
            lang: "en",
            label: "Another noisy recording",
            instruction: "<instruction>",
            audio: missing("enhance-2"),
          },
        ],
      },
      {
        id: "speech-separation",
        title: "Separate Speech",
        subtitle: "Keep one speaker from a conversation",
        layout: "multi",
        samples: [
          {
            id: "separate-1",
            lang: "zh",
            label: "只保留第一个说话的人",
            instruction: "只保留第一个说话的人",
            audio: missing("separate-1"),
          },
          {
            id: "separate-2",
            lang: "en",
            label: "Extract the speaker who says “yes”",
            instruction: "<instruction>",
            audio: missing("separate-2"),
          },
        ],
      },
      {
        id: "vocal-extract",
        title: "Extract Vocals",
        subtitle: "Vocal out, accompaniment out",
        layout: "multi",
        samples: [
          {
            id: "vocals-1",
            lang: "zh",
            label: "提取人声，去掉伴奏",
            instruction: "提取人声，去掉伴奏",
            audio: missing("vocals-1"),
          },
          {
            id: "vocals-2",
            lang: "en",
            label: "Extract the instrumental track",
            instruction: "<instruction>",
            audio: missing("vocals-2"),
          },
        ],
      },
      {
        id: "quality-improve",
        title: "Improve Quality",
        subtitle: "Restore clarity from a telephone-like recording",
        layout: "pair",
        samples: [
          {
            id: "quality-1",
            lang: "zh",
            label: "音质太差像打电话，提升清晰度",
            instruction: "音质太差像打电话，提升清晰度",
            audio: missing("quality-1"),
          },
          {
            id: "quality-2",
            lang: "en",
            label: "Bandwidth extension demo",
            instruction: "<instruction>",
            audio: missing("quality-2"),
          },
        ],
      },
    ],
  },
  {
    id: "paralinguistic",
    name: "Paralinguistic and Voice Editing",
    tagline: "Edit how something is said",
    intro:
      "Auk changes the emotional color, timbre, accent, whisper style, and non-verbal events of an utterance without touching its words.",
    groups: [
      {
        id: "emotion-edit",
        title: "Emotion Edit",
        subtitle: "Change the emotional delivery",
        layout: "pair",
        samples: [
          {
            id: "emotion-1",
            lang: "zh",
            label: "让他听起来开心点",
            instruction: "让他听起来开心点",
            audio: {
              src: "assets/audio/emotion-source.wav",
              out: "assets/audio/emotion-output.wav",
            },
          },
          {
            id: "emotion-2",
            lang: "zh",
            label: "听起来难过一点",
            instruction: "<instruction>",
            audio: missing("emotion-2"),
          },
          {
            id: "emotion-3",
            lang: "en",
            label: "Make it sound angry",
            instruction: "<instruction>",
            audio: missing("emotion-3"),
          },
        ],
      },
      {
        id: "voice-edit",
        title: "Voice Edit",
        subtitle: "Change timbre, keep the words",
        layout: "pair",
        samples: [
          {
            id: "voice-edit-1",
            lang: "zh",
            label: "把这段话的声音换成低沉磁性的男声，内容别变",
            instruction: "把这段话的声音换成低沉磁性的男声，内容别变",
            audio: {
              src: "assets/audio/timbre-source.wav",
              out: "assets/audio/timbre-output.wav",
            },
          },
          {
            id: "voice-edit-2",
            lang: "zh",
            label: "换成活泼的女声",
            instruction: "<instruction>",
            audio: missing("voice-edit-2"),
          },
        ],
      },
      {
        id: "nonverbal-edit",
        title: "Nonverbal Edit",
        subtitle: "Insert or remove laughs, breaths, sighs",
        layout: "pair",
        samples: [
          {
            id: "nonverbal-1",
            lang: "zh",
            label: "把语音里的换气声都去掉",
            instruction: "把语音里的换气声都去掉",
            audio: missing("nonverbal-1"),
          },
          {
            id: "nonverbal-2",
            lang: "zh",
            label: "在开头加一声笑",
            instruction: "在开头加一声笑",
            audio: missing("nonverbal-2"),
          },
        ],
      },
      {
        id: "whisper-edit",
        title: "Whisper Edit",
        subtitle: "Whisper ↔ normal delivery",
        layout: "pair",
        samples: [
          {
            id: "whisper-1",
            lang: "zh",
            label: "把这段耳语转换成正常说话的声音",
            instruction: "把这段耳语转换成正常说话的声音",
            audio: {
              src: "assets/audio/whisper-source.wav",
              out: "assets/audio/whisper-output.wav",
            },
          },
          {
            id: "whisper-2",
            lang: "zh",
            label: "把这段话转换成耳语",
            instruction: "把这段话转换成耳语",
            audio: missing("whisper-2"),
          },
        ],
      },
      {
        id: "accent-edit",
        title: "Accent Edit",
        subtitle: "De-accent to standard pronunciation",
        layout: "pair",
        samples: [
          {
            id: "accent-1",
            lang: "zh",
            label: "把这段话的方言口音去掉，说得标准点",
            instruction: "把这段话的方言口音去掉，说得标准点",
            audio: {
              src: "assets/audio/deaccent-source.wav",
              out: "assets/audio/deaccent-output.wav",
            },
          },
          {
            id: "accent-2",
            lang: "zh",
            label: "Another dialect to standard Mandarin",
            instruction: "<instruction>",
            audio: missing("accent-2"),
          },
        ],
      },
    ],
  },
  {
    id: "acoustic-editing",
    name: "Acoustic Editing",
    tagline: "Fine-grained control of rate, pitch, and loudness",
    intro:
      "Auk adjusts the low-level speaking attributes — speed, volume, and pitch — while preserving the linguistic content and speaker identity.",
    groups: [
      {
        id: "speed-edit",
        title: "Speed Edit",
        subtitle: "Faster / slower speaking rate",
        layout: "multi",
        samples: [
          {
            id: "speed-source-1",
            lang: "zh",
            label: "Source (1.0×)",
            audio: { src: "assets/audio/acoustic-source.wav" },
          },
          {
            id: "speed-1",
            lang: "zh",
            label: "说太快了，慢一点",
            instruction: "说太快了，慢一点",
            audio: { out: "assets/audio/rate-1_5x-output.wav" },
          },
          {
            id: "speed-2",
            lang: "zh",
            label: "说得更快一点",
            instruction: "<instruction>",
            audio: missing("speed-2"),
          },
        ],
      },
      {
        id: "volume-edit",
        title: "Volume Edit",
        subtitle: "Louder / softer",
        layout: "multi",
        samples: [
          {
            id: "volume-source-1",
            lang: "zh",
            label: "Source",
            audio: { src: "assets/audio/acoustic-source.wav" },
          },
          {
            id: "volume-1",
            lang: "zh",
            label: "声音大一点",
            instruction: "声音大一点",
            audio: { out: "assets/audio/loudness-minus-15db-output.wav" },
          },
          {
            id: "volume-2",
            lang: "zh",
            label: "声音小一点",
            instruction: "<instruction>",
            audio: missing("volume-2"),
          },
        ],
      },
      {
        id: "pitch-edit",
        title: "Pitch Edit",
        subtitle: "Higher / lower pitch",
        layout: "multi",
        samples: [
          {
            id: "pitch-source-1",
            lang: "zh",
            label: "Source",
            audio: { src: "assets/audio/acoustic-source.wav" },
          },
          {
            id: "pitch-1",
            lang: "zh",
            label: "声音再低沉一点",
            instruction: "声音再低沉一点",
            audio: { out: "assets/audio/pitch-plus-2-output.wav" },
          },
          {
            id: "pitch-2",
            lang: "zh",
            label: "声音高一点",
            instruction: "<instruction>",
            audio: missing("pitch-2"),
          },
        ],
      },
    ],
  },
];

export const lyricEditPlaceholder: DemoSample = {
  id: "vocal-edit-1",
  lang: "zh",
  label: "把这首歌里唱的“明天你好”改成“未来你好”",
  instruction: "把这首歌里唱的“明天你好”改成“未来你好”",
  transcript: "<source lyrics> → <target lyrics>",
  audio: {
    src: "assets/audio/lyric-edit-source.wav",
    out: "assets/audio/lyric-edit-output.wav",
  },
};

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
  { label: "Unified task families", value: "5" },
  { label: "Auk-Flash sampling steps", value: "4", note: "4.5× speedup" },
];

export const resourceLinks: { label: string; href: string | null; icon: string }[] = [
  { label: "Paper", href: null, icon: "arxiv" },
  { label: "GitHub", href: null, icon: "github" },
  { label: "Hugging Face", href: null, icon: "hf" },
];
