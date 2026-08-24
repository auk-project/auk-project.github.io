import "./styles/site.css";
import { mountAllAudioPlayers, redrawAllPlayers } from "./scripts/audio-player";
import {
  capabilities,
  familyChips,
  headlineStats,
  resourceLinks,
  type CapabilityFamily,
  type DemoGroup,
  type DemoSample,
  type Placeholder,
} from "./data/capabilities";

const isPlaceholder = (audio: DemoSample["audio"]): audio is Placeholder =>
  typeof audio === "object" && "missing" in audio;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string),
  );

function buildStatsList(): void {
  const list = document.getElementById("hero-stats");
  if (!list) return;
  list.innerHTML = headlineStats
    .map(
      (s) =>
        `<li><strong>${escapeHtml(s.value)}</strong><span>${escapeHtml(s.label)}${
          s.note ? ` · ${escapeHtml(s.note)}` : ""
        }</span></li>`,
    )
    .join("");
}

function buildResourceLinks(): void {
  const container = document.getElementById("resource-links");
  if (!container) return;
  container.innerHTML = resourceLinks
    .map((l) => {
      const icon = renderIcon(l.icon);
      if (l.href) {
        return `<span class="link-block"><a href="${escapeHtml(l.href)}" class="external-link button is-normal is-rounded is-dark" target="_blank" rel="noopener">${icon}<span>${escapeHtml(l.label)}</span></a></span>`;
      }
      return `<span class="link-block"><span class="external-link button is-normal is-rounded is-dark is-disabled" aria-disabled="true">${icon}<span>${escapeHtml(l.label)}</span></span></span>`;
    })
    .join("");
}

function renderIcon(kind: string): string {
  const common = 'class="icon" aria-hidden="true"';
  switch (kind) {
    case "arxiv":
      return `<span ${common}><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 4h18v3H3zm0 4.5h18v3H3zm0 4.5h18v3H3zm0 4.5h18v3H3z"/></svg></span>`;
    case "github":
      return `<span ${common}><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.1c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.76.4-1.27.74-1.56-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.18-1.48 3.14-1.17 3.14-1.17.63 1.59.24 2.76.12 3.05.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.35.78 1.05.78 2.12v3.14c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5z"/></svg></span>`;
    case "hf":
      return `<span ${common}><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="9.5" cy="11" r="1.2"/><circle cx="14.5" cy="11" r="1.2"/><path d="M9 15.5q1.5 1.5 3 1.5t3-1.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>`;
    default:
      return `<span ${common}></span>`;
  }
}

function buildFamilyRail(): void {
  const rail = document.getElementById("family-rail");
  if (!rail) return;
  rail.innerHTML = familyChips
    .map(
      (c, i) =>
        `<a href="#family-${escapeHtml(c.id)}" data-rail="${escapeHtml(c.id)}" data-rail-active="${
          i === 0 ? "1" : "0"
        }">${escapeHtml(c.name)}</a>`,
    )
    .join("");

  // Tab-style switch: clicking a rail chip hides other families and only
  // shows the selected one. Sections are looked up lazily because the
  // family markup may not have been rendered when this function runs.
  const links = Array.from(rail.querySelectorAll<HTMLAnchorElement>("a[data-rail]"));
  let currentId: string | null = null;

  const apply = (id: string | null) => {
    currentId = id;
    links.forEach((l) => {
      const on = id === null || l.dataset.rail === id;
      l.dataset.railActive = on ? "1" : "0";
    });
    capabilities.forEach((c) => {
      const s = document.getElementById(`family-${c.id}`);
      if (!s) return;
      s.hidden = id !== null && c.id !== id;
    });
  };

  links.forEach((l) => {
    l.addEventListener("click", (e) => {
      const id = l.dataset.rail!;
      const next = currentId === id ? null : id;
      e.preventDefault();
      apply(next);
      if (next) {
        history.replaceState(null, "", `#family-${next}`);
        const target = document.getElementById(`family-${next}`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        history.replaceState(null, "", "#demos");
        document.getElementById("demos")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Honor deep links (e.g. #family-... in URL on first load).
  const initial = window.location.hash.match(/family-([\w-]+)/)?.[1];
  if (initial) {
    setTimeout(() => apply(initial), 0);
  }
}

function buildDemos(): void {
  const root = document.getElementById("demos-body");
  if (!root) return;
  root.innerHTML = capabilities.map(renderFamily).join("\n");
}

function renderFamily(c: CapabilityFamily): string {
  return `
    <section class="family-section" id="family-${c.id}">
      <div class="family-section__intro">
        <h2 class="family-section__name">${escapeHtml(c.name)}</h2>
        <p class="family-section__lede">${escapeHtml(c.intro)}</p>
      </div>
      ${c.groups.map(renderGroup).join("\n")}
    </section>
  `;
}

function renderGroup(g: DemoGroup): string {
  return `
    <div class="demo-group" id="group-${g.id}">
      <div class="demo-group__head">
        <h3 class="demo-group__title">${escapeHtml(g.title)}</h3>
        <p class="demo-group__subtitle">${escapeHtml(g.subtitle)}</p>
      </div>
      <div class="demo-list">${g.samples.map(renderSample).join("\n")}</div>
    </div>
  `;
}

function renderSample(s: DemoSample): string {
  if (isPlaceholder(s.audio)) {
    const langPill = s.lang !== "instrumental" ? `<span class="lang-pill">${escapeHtml(s.lang)}</span>` : "";
    return `
      <article class="demo-card placeholder-card" data-sample-id="${escapeHtml(s.id)}">
        <div class="demo-card__head">
          <span class="demo-card__title">${escapeHtml(s.label)}</span>
          ${langPill}
        </div>
        <p class="demo-card__instruction"><span class="demo-card__instruction-label">Instruction:</span> ${escapeHtml(s.instruction)}</p>
        <p class="placeholder-text">${escapeHtml(s.audio.text)}</p>
      </article>
    `;
  }
  return renderReal(s);
}

function renderReal(s: DemoSample): string {
  const audio = s.audio as { src?: string; out?: string; outs?: { label: string; url: string }[] };
  if (audio.outs && audio.outs.length > 0 && audio.src) {
    return renderSlider(s, audio.src, audio.outs);
  }
  return renderPair(s, audio.src, audio.out);
}

function renderPair(s: DemoSample, src?: string, out?: string): string {
  const tracks: { url: string; label: string; side?: "a" | "b" }[] = [];
  if (src) tracks.push({ url: src, label: "Input", side: "a" });
  if (out) tracks.push({ url: out, label: "Output", side: "b" });
  const cfg = JSON.stringify({ tracks }).replace(/'/g, "&#39;");
  const langPill = s.lang !== "instrumental" ? `<span class="lang-pill">${escapeHtml(s.lang)}</span>` : "";
  return `
    <article class="demo-card" data-sample-id="${escapeHtml(s.id)}">
      <div class="demo-card__head">
        <span class="demo-card__title">${escapeHtml(s.label)}</span>
        ${langPill}
      </div>
      <p class="demo-card__instruction"><span class="demo-card__instruction-label">Instruction:</span> ${escapeHtml(s.instruction)}</p>
      <div class="auk-player-mount" data-auk-player='${cfg}'></div>
    </article>
  `;
}

function renderSlider(s: DemoSample, src: string, outs: { label: string; url: string }[]): string {
  const stops = outs.map((o, i) => ({ idx: i, label: o.label, url: o.url }));
  const defaultIdx = Math.max(0, stops.findIndex((x) => /source|0 dB|1\.0×|0\b/i.test(x.label)));
  const resolvedIdx = defaultIdx >= 0 ? defaultIdx : 0;
  const cfg = {
    slider: {
      stops,
      defaultIdx: resolvedIdx,
    },
  };
  const cfgJson = JSON.stringify(cfg).replace(/'/g, "&#39;");
  const stopsHtml = stops
    .map(
      (o, i) =>
        `<button type="button" class="auk-slider__stop" data-idx="${i}" aria-pressed="${
          i === resolvedIdx ? "true" : "false"
        }"><span class="auk-slider__label">${escapeHtml(o.label)}</span></button>`,
    )
    .join("");
  const firstUrl = stops[resolvedIdx]?.url ?? src;
  const firstLabel = stops[resolvedIdx]?.label ?? "Source";
  const playerCfg = JSON.stringify({
    tracks: [{ url: firstUrl, label: firstLabel }],
  }).replace(/'/g, "&#39;");
  return `
    <article class="demo-card" data-sample-id="${escapeHtml(s.id)}" data-slider>
      <div class="demo-card__head">
        <span class="demo-card__title">${escapeHtml(s.label)}</span>
        <span class="lang-pill">${escapeHtml(s.lang)}</span>
      </div>
      <p class="demo-card__instruction"><span class="demo-card__instruction-label">Instruction:</span> ${escapeHtml(s.instruction)}</p>
      <div class="auk-slider" data-auk-slider='${cfgJson}'>
        <div class="auk-slider__rail" role="slider" tabindex="0" aria-label="${escapeHtml(s.instruction)} — drag to change the output" aria-valuemin="0" aria-valuemax="${stops.length - 1}" aria-valuenow="${resolvedIdx}">
          <div class="auk-slider__labels">${stopsHtml}</div>
          <div class="auk-slider__fill"></div>
          <div class="auk-slider__thumb" style="left: ${(resolvedIdx / (stops.length - 1)) * 100}%"></div>
        </div>
      </div>
      <div class="auk-player-mount" data-auk-player='${playerCfg}'></div>
    </article>
  `;
}

function attachBibtexCopy(): void {
  const btn = document.getElementById("copy-bibtex");
  const code = document.getElementById("bibtex-code");
  const status = document.getElementById("bibtex-status");
  if (!btn || !code || !status) return;
  btn.addEventListener("click", async () => {
    const text = code.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "BibTeX copied to clipboard.";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        status.textContent = "BibTeX copied to clipboard.";
      } catch {
        status.textContent = "Copy failed — please select the text manually.";
      }
      ta.remove();
    }
    setTimeout(() => (status.textContent = ""), 4000);
  });
}

function attachSliderLogic(): void {
  document.querySelectorAll<HTMLElement>(".auk-slider").forEach((slider) => {
    let stops: { idx: number; label: string; url: string }[] = [];
    try {
      const parsed = JSON.parse(slider.dataset.aukSlider || "{}") as {
        slider?: { stops?: { idx: number; label: string; url: string }[] };
      };
      stops = parsed.slider?.stops ?? [];
    } catch {
      return;
    }
    if (stops.length === 0) return;
    const rail = slider.querySelector<HTMLElement>(".auk-slider__rail");
    const fill = slider.querySelector<HTMLElement>(".auk-slider__fill");
    const thumb = slider.querySelector<HTMLElement>(".auk-slider__thumb");
    const card = slider.closest<HTMLElement>(".demo-card[data-slider]");
    const mount = card?.querySelector<HTMLElement>(".auk-player-mount");
    let currentIdx = 0;

    const rebuildPlayer = (idx: number) => {
      const stop = stops[idx];
      if (!stop || !mount || !card) return;
      const cfg = JSON.stringify({
        tracks: [{ url: stop.url, label: stop.label }],
      }).replace(/'/g, "&#39;");
      const fresh = document.createElement("div");
      fresh.className = "auk-player-mount";
      fresh.dataset.aukPlayer = cfg;
      fresh.dataset.aukPlayerMounted = "";
      mount.replaceWith(fresh);
      import("./scripts/audio-player").then((m) => {
        (m as { mountAllAudioPlayers: () => void }).mountAllAudioPlayers();
      });
    };

    const render = (idx: number) => {
      currentIdx = idx;
      const ratio = stops.length > 1 ? idx / (stops.length - 1) : 0;
      if (fill) fill.style.width = `${ratio * 100}%`;
      if (thumb) thumb.style.left = `${ratio * 100}%`;
      if (rail) rail.setAttribute("aria-valuenow", String(idx));
      slider.querySelectorAll<HTMLButtonElement>(".auk-slider__stop").forEach((b, i) => {
        b.setAttribute("aria-pressed", i === idx ? "true" : "false");
      });
    };

    const idxFromEvent = (clientX: number): number => {
      const rect = rail?.getBoundingClientRect();
      if (!rect || rect.width === 0) return 0;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (stops.length - 1));
    };

    const apply = (clientX: number, commit: boolean) => {
      const idx = idxFromEvent(clientX);
      render(idx);
      if (commit) rebuildPlayer(idx);
    };

    let dragging = false;
    rail?.addEventListener("pointerdown", (e) => {
      dragging = true;
      rail.setPointerCapture(e.pointerId);
      apply(e.clientX, false);
    });
    rail?.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      apply(e.clientX, false);
    });
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (rail) rail.releasePointerCapture(e.pointerId);
      apply(e.clientX, true);
    };
    rail?.addEventListener("pointerup", endDrag);
    rail?.addEventListener("pointercancel", endDrag);
    rail?.addEventListener("keydown", (e) => {
      let next = currentIdx;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(stops.length - 1, currentIdx + 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, currentIdx - 1);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = stops.length - 1;
      else return;
      e.preventDefault();
      render(next);
      rebuildPlayer(next);
    });

    render(resolvedDefault(stops));
  });
}

function resolvedDefault(stops: { idx: number; label: string; url: string }[]): number {
  const found = stops.findIndex((x) => /source|0 dB|1\.0×|0\b/i.test(x.label));
  return found >= 0 ? found : 0;
}

function ensurePlaceholderTokens(): void {
  const text = document.body.textContent ?? "";
  const okAudio = text.includes("[audio|<instruction><reference audio description>]");
  if (!okAudio) {
    console.warn("Auk demo page: placeholder syntax not detected.");
  }
}

function init(): void {
  buildStatsList();
  buildResourceLinks();
  buildFamilyRail();
  buildDemos();
  attachBibtexCopy();
  attachSliderLogic();
  mountAllAudioPlayers();
  ensurePlaceholderTokens();
  window.addEventListener("resize", redrawAllPlayers);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
