/**
 * JMS · lightweight interaction layer
 * ---------------------------------------------------------------------------
 * Keeps the custom cursor, scroll progress and subtle pointer-driven card tilt.
 * The old always-running particle canvas and click-spark DOM effects have been
 * removed: they added continuous work without improving the data workflow.
 * All pointer work is event-driven and coalesced into requestAnimationFrame.
 */

const CARD_SELECTOR = [
  "#root main article",
  '#root main :is(section, div)[class*="bg-white"][class*="border-[#ebe8e1]"][class*="rounded-"]',
  '#root main div[class*="border-[#eeeae2]"][class*="rounded-[11px]"]',
].join(",");

const INTERACTIVE_SELECTOR =
  'a, button, select, summary, [role="button"], [role="tab"], input[type="checkbox"], input[type="radio"]';
const TEXT_SELECTOR =
  'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"]), textarea, [contenteditable="true"]';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function createScrollProgress() {
  const progress = document.createElement("div");
  progress.className = "fx-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<b></b>";
  document.body.append(progress);

  const bar = progress.firstElementChild;
  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    bar.style.setProperty(
      "--p",
      max > 0 ? String(clamp(doc.scrollTop / max, 0, 1)) : "0"
    );
    ticking = false;
  };
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  update();
}

function startCursorAndTilt() {
  const html = document.documentElement;
  const ring = document.createElement("div");
  ring.className = "fx-cursor-ring";
  ring.innerHTML = "<i></i>";
  const dot = document.createElement("div");
  dot.className = "fx-cursor-dot";
  dot.innerHTML = "<i></i>";
  ring.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);

  const pointer = { x: -200, y: -200 };
  const state = {
    ringX: -200,
    ringY: -200,
    target: null,
    currentCard: null,
    mode: "default",
    moved: false,
    running: false,
    visible: false,
  };

  const resetCard = (card) => {
    if (!card) return;
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
    card.style.removeProperty("--mx");
    card.style.removeProperty("--my");
    card.classList.remove("fx-tilting");
  };

  const updateCard = () => {
    const target = state.target;
    const nextCard = target?.closest?.(CARD_SELECTOR) ?? null;
    if (state.currentCard && state.currentCard !== nextCard) {
      resetCard(state.currentCard);
      state.currentCard = null;
    }
    if (!nextCard || target.closest("table, input, select, textarea, [role='dialog']")) {
      if (state.currentCard) resetCard(state.currentCard);
      state.currentCard = null;
      return;
    }

    const rect = nextCard.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // A restrained 3D response: large enough to notice, small enough to read.
    const area = rect.width * rect.height;
    const maxTilt = area < 90000 ? 3.4 : area < 260000 ? 2.1 : 1.15;
    const nx = clamp((pointer.x - rect.left) / rect.width, 0, 1);
    const ny = clamp((pointer.y - rect.top) / rect.height, 0, 1);

    nextCard.classList.add("fx-tilting");
    nextCard.style.setProperty("--rx", `${((0.5 - ny) * 2 * maxTilt).toFixed(2)}deg`);
    nextCard.style.setProperty("--ry", `${((nx - 0.5) * 2 * maxTilt).toFixed(2)}deg`);
    nextCard.style.setProperty("--mx", `${(pointer.x - rect.left).toFixed(1)}px`);
    nextCard.style.setProperty("--my", `${(pointer.y - rect.top).toFixed(1)}px`);
    state.currentCard = nextCard;
  };

  const getMode = (target) => {
    if (!target?.closest) return "default";
    if (target.closest(TEXT_SELECTOR)) return "text";
    if (target.closest("button:disabled, [aria-disabled='true']")) return "disabled";
    if (target.closest(INTERACTIVE_SELECTOR)) return "link";
    return "default";
  };

  const frame = () => {
    state.ringX += (pointer.x - state.ringX) * 0.24;
    state.ringY += (pointer.y - state.ringY) * 0.24;
    ring.style.transform = `translate3d(${state.ringX}px, ${state.ringY}px, 0)`;
    dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;

    if (state.moved) {
      state.moved = false;
      const nextMode = getMode(state.target);
      if (nextMode !== state.mode) {
        state.mode = nextMode;
        html.dataset.fxCursor = nextMode;
      }
      updateCard();
    }

    const settling =
      Math.abs(pointer.x - state.ringX) > 0.2 ||
      Math.abs(pointer.y - state.ringY) > 0.2 ||
      state.moved;

    if (settling) {
      requestAnimationFrame(frame);
    } else {
      state.running = false;
    }
  };

  const wake = () => {
    if (state.running) return;
    state.running = true;
    requestAnimationFrame(frame);
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      state.target = event.target;
      state.moved = true;

      if (!state.visible) {
        state.visible = true;
        state.ringX = event.clientX;
        state.ringY = event.clientY;
        html.classList.add("fx-cursor-on");
      }
      html.classList.remove("fx-cursor-away");
      wake();
    },
    { passive: true }
  );

  document.documentElement.addEventListener("mouseleave", () => {
    html.classList.add("fx-cursor-away");
    state.target = null;
    state.moved = true;
    if (state.currentCard) resetCard(state.currentCard);
    state.currentCard = null;
    wake();
  });

  document.documentElement.addEventListener("mouseenter", () => {
    html.classList.remove("fx-cursor-away");
  });

  document.addEventListener(
    "pointerdown",
    () => html.setAttribute("data-fx-press", ""),
    { passive: true }
  );
  const release = () => html.removeAttribute("data-fx-press");
  document.addEventListener("pointerup", release, { passive: true });
  document.addEventListener("pointercancel", release, { passive: true });
  window.addEventListener("blur", release);
}

export function initEffects() {
  if (typeof window === "undefined" || window.__jmsFx) return;
  window.__jmsFx = true;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const mount = () => {
    createScrollProgress();
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      startCursorAndTilt();
    }
  };

  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount, { once: true });
}
