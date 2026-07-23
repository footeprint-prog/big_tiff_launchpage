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
