const notice = document.querySelector(".notice");
let noticeTimer;

function showNotice(message, statusTarget) {
  window.clearTimeout(noticeTimer);
  if (notice) {
    notice.textContent = message;
    notice.hidden = false;
  }
  if (statusTarget) statusTarget.textContent = message;

  noticeTimer = window.setTimeout(() => {
    if (notice) notice.hidden = true;
  }, 4200);
}

notice?.addEventListener("click", () => {
  notice.hidden = true;
});

function initDesktopExperience() {
  const kickstarterButton = document.querySelector(".desktop-world .kickstarter-link");
  const statusText = document.querySelector("#kickstarter-status");
  const entranceButtons = Array.from(
    document.querySelectorAll(".wisp-entry, .mobile-login-wisp"),
  );
  const dialog = document.querySelector(".portal-dialog");
  const closeButton = document.querySelector(".portal-close");
  const portalForm = document.querySelector(".portal-form");
  let lastEntranceButton = null;

  kickstarterButton?.addEventListener("click", () => {
    showNotice("Kickstarter details are coming soon. Please check back for the next chapter!", statusText);
  });

  if (!entranceButtons.length || !dialog || !closeButton || !portalForm) return;

  entranceButtons.forEach((entranceButton) => {
    entranceButton.addEventListener("click", () => {
      lastEntranceButton = entranceButton;
      entranceButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
      entranceButton.setAttribute("aria-expanded", "true");
      dialog.showModal();
    });
  });

  function closeDialog() {
    dialog.close();
    entranceButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
    lastEntranceButton?.focus();
  }

  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    entranceButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
  });
  const portalError = portalForm.querySelector(".portal-error");
  const submitBtn = portalForm.querySelector("button[type=submit]");

  function showPortalError(message) {
    if (portalError) {
      portalError.textContent = message;
      portalError.hidden = false;
    }
  }

  portalForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (portalError) portalError.hidden = true;
    const data = new FormData(portalForm);
    const username = String(data.get("username") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    if (!username || !password) {
      showPortalError("Please enter your traveler name and secret phrase.");
      return;
    }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Opening…"; }
    try {
      const ok = await authenticate(username, password);
      if (!ok) {
        showPortalError("That traveler name or secret phrase wasn't recognized.");
        return;
      }
      // Session is stored in localStorage by authenticate(); the tool at /app
      // reads it (same origin). Head into the world.
      window.location.href = "app/";
    } catch (err) {
      showPortalError("Couldn't reach the gate. Check your connection and try again.");
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Enter the world"; }
    }
  });
}

/**
 * Soft client-side auth against the public big-tiff-data/accounts.json.
 * Same PBKDF2-SHA256 scheme as the tool (writing.html) and the hash generator.
 * On success, stores the shared session localStorage key the tool reads.
 * This is a soft gate, not real security (see the data repo README).
 */
const ACCOUNTS_URL =
  "https://raw.githubusercontent.com/footeprint-prog/big-tiff-data/main/accounts.json";
const SESSION_KEY = "bigtiff-session";
const PBKDF2_ITER = 100000;

function b64ToBytes(b64) {
  const bin = atob(b64);
  const a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return a;
}
function bytesToB64(buf) {
  let s = "";
  const a = new Uint8Array(buf);
  for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
  return btoa(s);
}
async function verifyPassword(password, saltB64, expectedHashB64) {
  const keyMat = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: b64ToBytes(saltB64), iterations: PBKDF2_ITER },
    keyMat,
    256,
  );
  const got = bytesToB64(bits);
  if (got.length !== expectedHashB64.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expectedHashB64.charCodeAt(i);
  return diff === 0;
}
async function authenticate(username, password) {
  const res = await fetch(`${ACCOUNTS_URL}?t=${Date.now()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("accounts " + res.status);
  const accounts = await res.json();
  const user = (accounts.users || []).find((u) => u.username === username);
  if (!user) return false;
  const ok = await verifyPassword(password, user.salt, user.hash);
  if (!ok) return false;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ username: user.username, role: user.role, canSyncCanon: !!user.canSyncCanon }),
  );
  return true;
}

function initMobileExperience() {
  const mobileQuery = window.matchMedia("(max-width: 700px)");
  const mobileWorld = document.querySelector(".mobile-world");
  const mobileViewport = document.querySelector(".mobile-viewport");
  if (!mobileQuery.matches || !mobileWorld || !mobileViewport) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const leftCanopy = document.querySelector(".mobile-tree-left .mobile-tree-canopy");
  const rightCanopy = document.querySelector(".mobile-tree-right .mobile-tree-canopy");
  const leftTrunk = document.querySelector(".mobile-tree-left .mobile-tree-trunk");
  const rightTrunk = document.querySelector(".mobile-tree-right .mobile-tree-trunk");
  const leftSecondaryCanopy = document.querySelector(".mobile-secondary-canopy-left");
  const rightSecondaryCanopy = document.querySelector(".mobile-secondary-canopy-right");
  const leftSecondaryTree = document.querySelector(".mobile-secondary-tree-left");
  const rightSecondaryTree = document.querySelector(".mobile-secondary-tree-right");
  const leftEdgeTree = document.querySelector(".mobile-tree-edge-left");
  const rightEdgeTree = document.querySelector(".mobile-tree-edge-right");
  const stageThreeShade = document.querySelector(".mobile-stage-three-shade");
  const forestFloor = document.querySelector(".mobile-forest-floor");
  const openingTitle = document.querySelector(".mobile-title-opening");
  const wispCue = document.querySelector(".mobile-wisp-cue");
  const tiff = document.querySelector(".mobile-tiff");
  const scrollStage = document.querySelector(".mobile-scroll-stage");
  const closedScroll = document.querySelector(".mobile-closed-scroll");
  const pullRig = document.querySelector(".mobile-pull-rig");
  const pullCord = document.querySelector(".mobile-pull-cord");
  const pullTag = document.querySelector(".mobile-pull-tag");
  const unfurl = document.querySelector(".mobile-unfurl");
  const stageStatus = document.querySelector("#mobile-stage-status");
  const mobileFundButton = document.querySelector(".mobile-fund-button");
  const mobileFundStatus = document.querySelector("#mobile-kickstarter-status");
  const mobileLoginWisp = document.querySelector(".mobile-login-wisp");

  mobileFundButton?.addEventListener("click", () => {
    showNotice(
      "Kickstarter details are coming soon. Please check back for the next chapter!",
      mobileFundStatus,
    );
  });

  if (
    !leftCanopy ||
    !rightCanopy ||
    !leftTrunk ||
    !rightTrunk ||
    !leftSecondaryCanopy ||
    !rightSecondaryCanopy ||
    !leftSecondaryTree ||
    !rightSecondaryTree ||
    !leftEdgeTree ||
    !rightEdgeTree ||
    !stageThreeShade ||
    !forestFloor ||
    !openingTitle ||
    !wispCue ||
    !tiff ||
    !scrollStage ||
    !closedScroll ||
    !pullRig ||
    !pullCord ||
    !pullTag ||
    !unfurl ||
    !mobileLoginWisp
  ) {
    mobileWorld.classList.add("mobile-world-fallback");
    unfurl?.setAttribute("aria-hidden", "false");
    return;
  }

  document.documentElement.classList.add("mobile-story-active");
  document.body.classList.add("mobile-story-active");

  let unlocked = false;
  let dragStartY = 0;
  let dragDistance = 0;
  let activePointerId = null;
  let suppressNextClick = false;
  let pullingTag = false;
  let gestureLastY = null;
  let targetProgress = 0;
  let currentProgress = 0;
  let framePending = false;
  let lastAnnouncedStage = "";
  let autoJourneyFrame = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const ease = (value) => value * value * (3 - 2 * value);
  const viewportHeight = () => mobileViewport.clientHeight || window.innerHeight;

  function announceStage(key, message) {
    if (key === lastAnnouncedStage) return;
    lastAnnouncedStage = key;
    if (stageStatus) stageStatus.textContent = message;
  }

  function renderMobileStory() {
    framePending = false;
    const distance = targetProgress - currentProgress;
    currentProgress = reducedMotion
      ? targetProgress
      : Math.abs(distance) < 0.0005
        ? targetProgress
        : currentProgress + distance * 0.24;

    const openingProgress = clamp(currentProgress);
    const revealProgress = clamp(currentProgress - 1);
    const openingEase = ease(openingProgress);
    const revealEase = ease(revealProgress);
    const ensembleProgress = ease(range(openingProgress, 0.36, 0.9));
    const characterProgress = ensembleProgress;
    const scrollProgress = ensembleProgress;
    const wispProgress = ease(range(openingProgress, 0.03, 0.38));
    const floorProgress = ease(range(revealProgress, 0.12, 0.92));

    const canopyX = openingEase * 66 + revealEase * 10;
    const canopyY = -openingEase * 2 - revealEase * 20;
    const canopyScale = 1 - openingEase * 0.3 - revealEase * 0.08;
    const canopyOpacity = 1 - revealEase * 0.26;
    leftCanopy.style.transform = `translate3d(${-canopyX}vw, ${canopyY}svh, 0) scale(${canopyScale})`;
    rightCanopy.style.transform = `translate3d(${canopyX}vw, ${canopyY}svh, 0) scaleX(-1) scale(${canopyScale})`;
    leftCanopy.style.opacity = String(canopyOpacity);
    rightCanopy.style.opacity = String(canopyOpacity);
    const secondaryCanopyX = openingEase * 49 + revealEase * 8;
    const secondaryCanopyY = openingEase * 5 - revealEase * 15;
    const secondaryCanopyScale = 1.08 - openingEase * 0.2 - revealEase * 0.05;
    leftSecondaryCanopy.style.transform = `translate3d(${-secondaryCanopyX}vw, ${secondaryCanopyY}svh, 0) rotate(-7deg) scale(${secondaryCanopyScale})`;
    rightSecondaryCanopy.style.transform = `translate3d(${secondaryCanopyX}vw, ${secondaryCanopyY}svh, 0) rotate(7deg) scaleX(-1) scale(${secondaryCanopyScale})`;

    const trunkX = -openingEase * 4 + revealEase * 5;
    const trunkY = openingEase * 8 - revealEase * 8;
    const trunkOpacity = 0.18 + openingEase * 0.82;
    leftTrunk.style.transform = `translate3d(${trunkX}vw, ${trunkY}svh, 0)`;
    rightTrunk.style.transform = `translate3d(${-trunkX}vw, ${trunkY}svh, 0) scaleX(-1)`;
    leftTrunk.style.opacity = String(trunkOpacity);
    rightTrunk.style.opacity = String(trunkOpacity);
    leftTrunk.style.clipPath = `inset(0 0 ${(1 - openingEase) * 62}% 0)`;
    rightTrunk.style.clipPath = `inset(0 0 ${(1 - openingEase) * 62}% 0)`;
    const secondaryTreeX = openingEase * 2 - revealEase * 3;
    const secondaryTreeY = openingEase * 7 - revealEase * 5;
    leftSecondaryTree.style.transform = `translate3d(${-secondaryTreeX}vw, ${secondaryTreeY}svh, 0) scale(1.12)`;
    rightSecondaryTree.style.transform = `translate3d(${secondaryTreeX}vw, ${secondaryTreeY}svh, 0) scaleX(-1) scale(1.12)`;
    leftSecondaryTree.style.opacity = String(0.06 + openingEase * 0.44);
    rightSecondaryTree.style.opacity = String(0.06 + openingEase * 0.44);
    leftEdgeTree.style.transform = `translate3d(${trunkX}vw, ${trunkY}svh, 0)`;
    rightEdgeTree.style.transform = `translate3d(${-trunkX}vw, ${trunkY}svh, 0) scaleX(-1)`;
    const edgeOpacity = Math.min(
      1,
      0.12 + range(openingProgress, 0.28, 0.72) * (0.62 + revealEase * 0.26),
    );
    leftEdgeTree.style.opacity = String(edgeOpacity);
    rightEdgeTree.style.opacity = String(edgeOpacity);

    openingTitle.style.transform = `translate3d(0, ${-openingEase * 2.5 - revealEase * 9}svh, 0) scale(${1 - openingEase * 0.12 - revealEase * 0.08})`;
    openingTitle.style.opacity = String(1 - range(revealProgress, 0.02, 0.34));
    wispCue.style.transform = `translate3d(0, ${wispProgress * 20}px, 0)`;
    wispCue.style.opacity = String(1 - wispProgress);
    wispCue.style.pointerEvents = wispProgress > 0.82 ? "none" : "auto";

    tiff.style.transform = `translate3d(0, ${(1 - characterProgress) * 31 - revealEase * 21}svh, 0) scale(${0.78 + characterProgress * 0.22 - revealEase * 0.54})`;
    tiff.style.opacity = String(characterProgress);
    scrollStage.style.transform = `translate3d(0, ${(1 - scrollProgress) * 31 - revealEase * 47}svh, 0) scale(${1 - revealEase * 0.08})`;
    scrollStage.style.opacity = String(scrollProgress);
    closedScroll.style.opacity = String(1 - range(revealProgress, 0.02, 0.18));
    pullRig.style.opacity = String(1 - range(revealProgress, 0.02, 0.18));
    unfurl.style.opacity = String(range(revealProgress, 0.03, 0.2));
    unfurl.style.clipPath = `inset(0 0 ${(1 - revealProgress) * 100}% 0)`;
    unfurl.style.pointerEvents = revealProgress > 0.88 ? "auto" : "none";
    const loginProgress = ease(range(revealProgress, 0.78, 0.97));
    mobileLoginWisp.style.opacity = String(loginProgress * 0.45);
    mobileLoginWisp.style.transform = `translate3d(0, ${(1 - loginProgress) * 12}px, 0)`;
    mobileLoginWisp.style.pointerEvents = loginProgress > 0.82 ? "auto" : "none";

    forestFloor.style.opacity = String(floorProgress);
    forestFloor.style.transform = `translate3d(-50%, ${(1 - floorProgress) * 18}svh, 0) scale(${0.9 + floorProgress * 0.1})`;
    stageThreeShade.style.opacity = String(revealEase);
    mobileViewport.style.setProperty("--mobile-story-progress", currentProgress.toFixed(4));

    if (revealProgress > 0.84) {
      announceStage("stage-three", "The announcement is open. Tiff's first adventure is coming soon.");
    } else if (revealProgress > 0.16) {
      announceStage("unfurling", "The announcement scroll is unfurling.");
    } else if (openingProgress > 0.92) {
      announceStage("stage-two", "You found Big Tiff and the sealed announcement.");
    } else {
      announceStage("stage-one", "Follow the light into Big Tiff's World.");
    }

    if (Math.abs(targetProgress - currentProgress) >= 0.0005) {
      requestRender();
    }
  }

  function requestRender() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(renderMobileStory);
  }

  function journeyTo(destination, duration = 760) {
    window.cancelAnimationFrame(autoJourneyFrame);
    const startProgress = targetProgress;
    const distance = destination - startProgress;
    const startTime = window.performance.now();

    function advanceJourney(now) {
      const elapsed = clamp((now - startTime) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      targetProgress = startProgress + distance * eased;
      requestRender();
      if (elapsed < 1) {
        autoJourneyFrame = window.requestAnimationFrame(advanceJourney);
      }
    }

    autoJourneyFrame = window.requestAnimationFrame(advanceJourney);
  }

  function unlockScroll() {
    if (unlocked) return;
    unlocked = true;
    pullTag.setAttribute("aria-expanded", "true");
    pullTag.style.pointerEvents = "none";
    unfurl.setAttribute("aria-hidden", "false");
    announceStage("released", "The seal releases. Scroll to unfurl Big Tiff's announcement.");

    pullTag.style.transform = "translate3d(0, 76px, 0) rotate(2.5deg)";
    pullCord.style.transform = "scaleY(2.15)";
    journeyTo(Math.max(targetProgress, 1.28), reducedMotion ? 1 : 720);
  }

  function resetPullRig() {
    pullTag.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    pullCord.style.transform = "scaleY(1)";
  }

  pullTag.addEventListener("pointerdown", (event) => {
    if (unlocked) return;
    pullingTag = true;
    activePointerId = event.pointerId;
    dragStartY = event.clientY;
    dragDistance = 0;
    suppressNextClick = false;
    pullTag.setPointerCapture(event.pointerId);
  });

  pullTag.addEventListener("pointermove", (event) => {
    if (event.pointerId !== activePointerId || unlocked) return;
    dragDistance = Math.max(0, Math.min(94, event.clientY - dragStartY));
    suppressNextClick = dragDistance > 8;
    pullTag.style.transform = `translate3d(0, ${dragDistance}px, 0) rotate(${dragDistance * 0.035}deg)`;
    pullCord.style.transform = `scaleY(${1 + dragDistance / 58})`;
  });

  function finishPull(event) {
    if (event.pointerId !== activePointerId || unlocked) return;
    if (pullTag.hasPointerCapture(event.pointerId)) {
      pullTag.releasePointerCapture(event.pointerId);
    }
    activePointerId = null;
    pullingTag = false;
    if (dragDistance >= 58) {
      unlockScroll();
    } else {
      resetPullRig();
    }
  }

  pullTag.addEventListener("pointerup", finishPull);
  pullTag.addEventListener("pointercancel", (event) => {
    if (event.pointerId !== activePointerId || unlocked) return;
    activePointerId = null;
    pullingTag = false;
    resetPullRig();
  });

  pullTag.addEventListener("click", (event) => {
    if (suppressNextClick) {
      event.preventDefault();
      suppressNextClick = false;
      return;
    }
    unlockScroll();
  });

  wispCue.addEventListener("click", () => {
    journeyTo(1, reducedMotion ? 1 : 860);
  });

  function setStoryProgress(nextProgress) {
    window.cancelAnimationFrame(autoJourneyFrame);
    const maximum = unlocked ? 2 : 1;
    targetProgress = clamp(nextProgress, 0, maximum);
    requestRender();
  }

  mobileWorld.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1 || pullingTag || event.target.closest("button, input, textarea, select")) {
        gestureLastY = null;
        return;
      }
      gestureLastY = event.touches[0].clientY;
    },
    { passive: true },
  );

  mobileWorld.addEventListener(
    "touchmove",
    (event) => {
      if (gestureLastY === null || event.touches.length !== 1 || pullingTag) return;
      const nextY = event.touches[0].clientY;
      const delta = gestureLastY - nextY;
      gestureLastY = nextY;
      if (Math.abs(delta) < 0.5) return;
      event.preventDefault();
      setStoryProgress(targetProgress + delta / (viewportHeight() * 2.15));
    },
    { passive: false },
  );

  mobileWorld.addEventListener("touchend", () => {
    gestureLastY = null;
  }, { passive: true });
  mobileWorld.addEventListener("touchcancel", () => {
    gestureLastY = null;
  }, { passive: true });

  mobileWorld.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      setStoryProgress(targetProgress + event.deltaY / (viewportHeight() * 2.15));
    },
    { passive: false },
  );

  window.addEventListener("keydown", (event) => {
    if (event.target.closest("input, textarea, select")) return;
    const increments = {
      ArrowDown: 0.08,
      PageDown: 0.3,
      " ": 0.3,
      ArrowUp: -0.08,
      PageUp: -0.3,
    };
    if (!(event.key in increments)) return;
    event.preventDefault();
    setStoryProgress(targetProgress + increments[event.key]);
  });

  window.addEventListener("resize", requestRender, { passive: true });
  window.visualViewport?.addEventListener("resize", requestRender, { passive: true });

  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
    const previewParams = new URLSearchParams(window.location.search);
    const previewStage = Number(previewParams.get("storyStage"));
    if (previewStage === 2) {
      targetProgress = 1;
      currentProgress = 1;
    } else if (previewStage === 3) {
      unlocked = true;
      targetProgress = 2;
      currentProgress = 2;
      pullTag.setAttribute("aria-expanded", "true");
      pullTag.style.pointerEvents = "none";
      unfurl.setAttribute("aria-hidden", "false");
    }
  }

  renderMobileStory();
}

initDesktopExperience();
window.addEventListener("load", initMobileExperience, { once: true });
