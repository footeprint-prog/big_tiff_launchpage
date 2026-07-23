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
  const entranceButton = document.querySelector(".wisp-entry");
  const dialog = document.querySelector(".portal-dialog");
  const closeButton = document.querySelector(".portal-close");
  const portalForm = document.querySelector(".portal-form");

  kickstarterButton?.addEventListener("click", () => {
    showNotice("Kickstarter details are coming soon. Please check back for the next chapter!", statusText);
  });

  if (!entranceButton || !dialog || !closeButton || !portalForm) return;

  entranceButton.addEventListener("click", () => {
    entranceButton.setAttribute("aria-expanded", "true");
    dialog.showModal();
  });

  function closeDialog() {
    dialog.close();
    entranceButton.setAttribute("aria-expanded", "false");
    entranceButton.focus();
  }

  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    entranceButton.setAttribute("aria-expanded", "false");
  });
  portalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    closeDialog();
    portalForm.reset();
    showNotice("The private path is not open yet.");
  });
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
    !unfurl
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
    const characterProgress = ease(range(openingProgress, 0.34, 0.82));
    const scrollProgress = ease(range(openingProgress, 0.48, 0.9));
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

    const trunkX = -openingEase * 7 + revealEase * 18;
    const trunkY = openingEase * 10 - revealEase * 10;
    const trunkOpacity = 0.18 + openingEase * 0.82;
    leftTrunk.style.transform = `translate3d(${trunkX}vw, ${trunkY}svh, 0)`;
    rightTrunk.style.transform = `translate3d(${-trunkX}vw, ${trunkY}svh, 0) scaleX(-1)`;
    leftTrunk.style.opacity = String(trunkOpacity);
    rightTrunk.style.opacity = String(trunkOpacity);
    leftTrunk.style.clipPath = `inset(0 0 ${(1 - openingEase) * 62}% 0)`;
    rightTrunk.style.clipPath = `inset(0 0 ${(1 - openingEase) * 62}% 0)`;

    openingTitle.style.transform = `translate3d(0, ${-openingEase * 2.5 - revealEase * 9}svh, 0) scale(${1 - openingEase * 0.12 - revealEase * 0.08})`;
    openingTitle.style.opacity = String(1 - range(revealProgress, 0.02, 0.34));
    wispCue.style.transform = `translate3d(0, ${wispProgress * 20}px, 0)`;
    wispCue.style.opacity = String(1 - wispProgress);
    wispCue.style.pointerEvents = wispProgress > 0.82 ? "none" : "auto";

    tiff.style.transform = `translate3d(0, ${(1 - characterProgress) * 30 - revealEase * 22}svh, 0) scale(${0.78 + characterProgress * 0.22 - revealEase * 0.46})`;
    tiff.style.opacity = String(characterProgress);
    scrollStage.style.transform = `translate3d(0, ${(1 - scrollProgress) * 30 - revealEase * 43}svh, 0) scale(${1 - revealEase * 0.06})`;
    scrollStage.style.opacity = String(scrollProgress);
    closedScroll.style.opacity = String(1 - range(revealProgress, 0.02, 0.18));
    pullRig.style.opacity = String(1 - range(revealProgress, 0.02, 0.18));
    unfurl.style.opacity = String(range(revealProgress, 0.03, 0.2));
    unfurl.style.clipPath = `inset(0 0 ${(1 - revealProgress) * 100}% 0)`;
    unfurl.style.pointerEvents = revealProgress > 0.88 ? "auto" : "none";

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

  function unlockScroll() {
    if (unlocked) return;
    unlocked = true;
    targetProgress = Math.max(targetProgress, 1.025);
    pullTag.setAttribute("aria-expanded", "true");
    pullTag.style.pointerEvents = "none";
    unfurl.setAttribute("aria-hidden", "false");
    announceStage("released", "The seal releases. Scroll to unfurl Big Tiff's announcement.");

    pullTag.style.transform = "translate3d(0, 76px, 0) rotate(2.5deg)";
    pullCord.style.transform = "scaleY(2.15)";
    requestRender();
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
    targetProgress = Math.min(1, targetProgress + 0.24);
    requestRender();
  });

  function setStoryProgress(nextProgress) {
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
  renderMobileStory();
}

initDesktopExperience();
window.addEventListener("load", initMobileExperience, { once: true });
