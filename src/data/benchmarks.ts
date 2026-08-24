// Benchmark data distilled from the paper's main summary table.
// Numbers are kept verbatim from main.tex; metric direction is encoded so
// the UI can label each value with the correct arrow.

export type Direction = "up" | "down";

export interface MetricRow {
  name: string;
  value: string;
  direction: Direction;
  /** When true, lower is better. */
  lowerIsBetter?: boolean;
}

export interface BenchmarkSystem {
  name: string;
  isOurs?: boolean;
  values: MetricRow[];
}

export interface BenchmarkBlock {
  id: string;
  title: string;
  subtitle: string;
  headers: string[];
  systems: BenchmarkSystem[];
  caption?: string;
}

export const benchmarkBlocks: BenchmarkBlock[] = [
  {
    id: "seed-tts-eval",
    title: "Zero-Shot TTS",
    subtitle: "Seed-TTS-Eval (test-en | test-zh | test-zh-hard | average)",
    headers: ["System", "WER ↓", "SIM ↑"],
    systems: [
      { name: "Qwen3-TTS", values: [{ name: "avg", value: "3.07", direction: "down" }, { name: "avg", value: "74.50", direction: "up" }] },
      { name: "CosyVoice 3", values: [{ name: "avg", value: "3.06", direction: "down" }, { name: "avg", value: "75.30", direction: "up" }] },
      { name: "Seed-TTS", values: [{ name: "avg", value: "3.65", direction: "down" }, { name: "avg", value: "77.80", direction: "up" }] },
      { name: "Auk", isOurs: true, values: [{ name: "avg", value: "2.63", direction: "down" }, { name: "avg", value: "79.53", direction: "up" }] },
      { name: "Auk-Flash", isOurs: true, values: [{ name: "avg", value: "2.79", direction: "down" }, { name: "avg", value: "79.03", direction: "up" }] },
    ],
  },
  {
    id: "instruct-tts",
    title: "Instruction-Following TTS",
    subtitle: "InstructTTSEval — DSD subset, Mandarin / English accuracy ↑",
    headers: ["System", "ZH-ACC ↑", "EN-ACC ↑"],
    systems: [
      { name: "Qwen3-TTS", values: [{ name: "zh", value: "81.10", direction: "up" }, { name: "en", value: "82.40", direction: "up" }] },
      { name: "Mimo-Audio", values: [{ name: "zh", value: "74.30", direction: "up" }, { name: "en", value: "77.60", direction: "up" }] },
      { name: "VoxInstruct", values: [{ name: "zh", value: "52.30", direction: "up" }, { name: "en", value: "57.00", direction: "up" }] },
      { name: "Auk", isOurs: true, values: [{ name: "zh", value: "83.37", direction: "up" }, { name: "en", value: "81.60", direction: "up" }] },
      { name: "Auk-Flash", isOurs: true, values: [{ name: "zh", value: "78.80", direction: "up" }, { name: "en", value: "82.40", direction: "up" }] },
    ],
  },
  {
    id: "speech-edit-bench",
    title: "Open-Ended Speech Editing",
    subtitle: "SpeechEditBench joint success (%)",
    headers: ["System", "Content ↑", "Emotion ↑", "Prosody ↑", "Paralinguistic ↑", "Acoustic ↑"],
    systems: [
      { name: "Ming-UniAudio", values: [
        { name: "content", value: "76.46", direction: "up" },
        { name: "emotion", value: "3.43", direction: "up" },
        { name: "prosody", value: "26.50", direction: "up" },
        { name: "paralinguistic", value: "11.25", direction: "up" },
        { name: "acoustic", value: "25.85", direction: "up" },
      ] },
      { name: "Step-Audio-EditX", values: [
        { name: "content", value: "16.50", direction: "up" },
        { name: "emotion", value: "7.71", direction: "up" },
        { name: "prosody", value: "20.13", direction: "up" },
        { name: "paralinguistic", value: "31.25", direction: "up" },
        { name: "acoustic", value: "22.89", direction: "up" },
      ] },
      { name: "Auk", isOurs: true, values: [
        { name: "content", value: "91.83", direction: "up" },
        { name: "emotion", value: "9.94", direction: "up" },
        { name: "prosody", value: "71.33", direction: "up" },
        { name: "paralinguistic", value: "38.50", direction: "up" },
        { name: "acoustic", value: "37.07", direction: "up" },
      ] },
      { name: "Auk-Flash", isOurs: true, values: [
        { name: "content", value: "87.50", direction: "up" },
        { name: "emotion", value: "6.29", direction: "up" },
        { name: "prosody", value: "70.00", direction: "up" },
        { name: "paralinguistic", value: "39.25", direction: "up" },
        { name: "acoustic", value: "30.26", direction: "up" },
      ] },
    ],
  },
  {
    id: "mmae-speech",
    title: "MMAE-Speech",
    subtitle: "Rubric-based open editing — higher is better",
    headers: ["System", "IFR ↑", "CR ↑", "EMR ↑"],
    systems: [
      { name: "Step-Audio-EditX", values: [
        { name: "ifr", value: "43.52", direction: "up" },
        { name: "cr", value: "77.27", direction: "up" },
        { name: "emr", value: "4.69", direction: "up" },
      ] },
      { name: "Ming-UniAudio", values: [
        { name: "ifr", value: "34.13", direction: "up" },
        { name: "cr", value: "76.01", direction: "up" },
        { name: "emr", value: "7.04", direction: "up" },
      ] },
      { name: "Auk", isOurs: true, values: [
        { name: "ifr", value: "48.23", direction: "up" },
        { name: "cr", value: "88.11", direction: "up" },
        { name: "emr", value: "12.44", direction: "up" },
      ] },
      { name: "Auk-Flash", isOurs: true, values: [
        { name: "ifr", value: "46.62", direction: "up" },
        { name: "cr", value: "86.41", direction: "up" },
        { name: "emr", value: "13.85", direction: "up" },
      ] },
    ],
  },
  {
    id: "signal-level",
    title: "Signal-Level Editing",
    subtitle: "Speech enhancement, separation, and super-resolution",
    headers: ["System", "DNSChallenge WER ↓", "DNSChallenge PER ↓", "Libri2Mix SpkSim ↑", "VCTK-SR LSD ↓"],
    systems: [
      { name: "Sidon-v0.1", values: [
        { name: "dns-wer", value: "3.33", direction: "down" },
        { name: "dns-per", value: "1.88", direction: "down" },
        { name: "libri-spksim", value: "—", direction: "up" },
        { name: "vctk-lsd", value: "—", direction: "down" },
      ] },
      { name: "MossFormer2-SS", values: [
        { name: "dns-wer", value: "—", direction: "down" },
        { name: "dns-per", value: "—", direction: "down" },
        { name: "libri-spksim", value: "0.96", direction: "up" },
        { name: "vctk-lsd", value: "—", direction: "down" },
      ] },
      { name: "Auk", isOurs: true, values: [
        { name: "dns-wer", value: "2.66", direction: "down" },
        { name: "dns-per", value: "1.48", direction: "down" },
        { name: "libri-spksim", value: "0.96", direction: "up" },
        { name: "vctk-lsd", value: "1.51", direction: "down" },
      ] },
      { name: "Auk-Flash", isOurs: true, values: [
        { name: "dns-wer", value: "2.93", direction: "down" },
        { name: "dns-per", value: "1.64", direction: "down" },
        { name: "libri-spksim", value: "0.96", direction: "up" },
        { name: "vctk-lsd", value: "1.38", direction: "down" },
      ] },
    ],
  },
];

export interface SpotlightStat {
  label: string;
  value: string;
  unit?: string;
  note?: string;
}

export const spotlightStats: SpotlightStat[] = [
  { label: "Speech generation (Seed-TTS-Eval avg WER)", value: "2.63", unit: "%", note: "Auk base" },
  { label: "Speaker similarity (Seed-TTS-Eval avg SIM)", value: "79.53", note: "Auk base" },
  { label: "Content editing joint success", value: "91.83", unit: "%", note: "SpeechEditBench" },
  { label: "Speech enhancement PER", value: "1.48", unit: "%", note: "DNSChallenge, Auk base" },
  { label: "Speech super-resolution LSD", value: "1.38", note: "VCTK-SR, Auk-Flash" },
  { label: "Auk-Flash sampling steps", value: "4", note: "4.5× speedup, no CFG" },
];
