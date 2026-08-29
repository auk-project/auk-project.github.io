#!/usr/bin/env python3
"""Pre-normalize the demo audio into public/assets/audio-norm/.

The originals under public/assets/audio/ are never touched — this writes a
parallel tree that the page loads instead, so the masters stay available.

Level is moved with a single linear gain derived from an EBU R128 integrated
loudness measurement, so a file's internal dynamics survive untouched; only its
overall level changes. The gain is clamped so the true peak stays under the
ceiling, which means a clip already near full scale is left alone rather than
squashed by a limiter.

Energy-edit clips are copied byte-for-byte: the whole point of that demo is the
level difference between stops, and normalizing them would erase it.
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_ROOT = ROOT / "public" / "assets" / "audio"
DST_ROOT = ROOT / "public" / "assets" / "audio-norm"
DATA_FILE = ROOT / "src" / "data" / "capabilities.ts"

TARGET_LUFS = -20.0
PEAK_CEILING_DBTP = -1.5
MAX_GAIN_DB = 24.0

# Relative paths under assets/audio/ whose level must survive verbatim.
VERBATIM_PREFIXES = ("energy/",)

I_RE = re.compile(r"^\s*I:\s*(-?[\d.]+|-inf)\s*LUFS", re.M)
PEAK_RE = re.compile(r"^\s*Peak:\s*(-?[\d.]+|-inf)\s*dBFS", re.M)


def referenced_paths() -> list[str]:
    """Every assets/audio/... wav the demo data actually loads."""
    text = DATA_FILE.read_text(encoding="utf-8")
    found = sorted(set(re.findall(r'"assets/audio/([^"]+\.wav)"', text)))
    return found


def measure(path: Path) -> tuple[float | None, float | None]:
    """Integrated loudness (LUFS) and true peak (dBFS) via ebur128."""
    proc = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-nostats", "-i", str(path),
            "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-",
        ],
        capture_output=True, text=True,
    )
    blob = proc.stderr
    # The summary block at the end is the integrated result; per-frame logging is
    # off, so the last match is the summary.
    i_hits = I_RE.findall(blob)
    p_hits = PEAK_RE.findall(blob)

    def last(hits: list[str]) -> float | None:
        for raw in reversed(hits):
            if raw != "-inf":
                return float(raw)
        return None

    return last(i_hits), last(p_hits)


def gain_for(loudness: float | None, peak: float | None) -> float:
    if loudness is None:
        return 0.0
    want = TARGET_LUFS - loudness
    if peak is not None:
        want = min(want, PEAK_CEILING_DBTP - peak)
    return max(-MAX_GAIN_DB, min(MAX_GAIN_DB, want))


def process(rel: str) -> tuple[str, str]:
    src = SRC_ROOT / rel
    dst = DST_ROOT / rel
    dst.parent.mkdir(parents=True, exist_ok=True)

    if not src.exists():
        return rel, "MISSING"

    if rel.startswith(VERBATIM_PREFIXES):
        shutil.copy2(src, dst)
        return rel, "verbatim"

    loudness, peak = measure(src)
    gain = gain_for(loudness, peak)

    if abs(gain) < 0.1:
        shutil.copy2(src, dst)
        return rel, f"copy (I={loudness}, gain={gain:+.2f})"

    proc = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-nostats", "-loglevel", "error", "-y",
            "-i", str(src),
            "-af", f"volume={gain:.2f}dB",
            "-c:a", "pcm_s16le",
            str(dst),
        ],
        capture_output=True, text=True,
    )
    if proc.returncode != 0:
        return rel, f"FAIL {proc.stderr.strip()[:120]}"
    return rel, f"gain {gain:+.2f} dB (I={loudness})"


def main() -> int:
    rels = referenced_paths()
    print(f"{len(rels)} referenced wavs -> {DST_ROOT}", flush=True)

    results: list[tuple[str, str]] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        for rel, note in pool.map(process, rels):
            results.append((rel, note))
            print(f"  {rel:<52} {note}", flush=True)

    bad = [r for r in results if r[1].startswith(("FAIL", "MISSING"))]
    print(f"\ndone: {len(results)} files, {len(bad)} problems", flush=True)
    for rel, note in bad:
        print(f"  !! {rel}: {note}", flush=True)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
