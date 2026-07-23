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
  if (!mobileQuery.matches || !mobileWorld) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const leftTree = document.querySelector(".mobile-tree-left");
  const rightTree = document.querySelector(".mobile-tree-right");
  const treeTrunks = document.querySelectorAll(".mobile-tree-trunk");
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
    !leftTree ||
    !rightTree ||
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

  let unlocked = false;
  let revealAnchor = 0;
  let dragStartY = 0;
  let dragDistance = 0;
  let activePointerId = null;
  let suppressNextClick = false;

  let framePending = false;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const ease = (value) => value * value * (3 - 2 * value);
  const viewportHeight = () => document.querySelector(".mobile-viewport")?.clientHeight || window.innerHeight;
  const openingEnd = () => viewportHeight() * 4.2;
  const revealDistance = () => viewportHeight() * 5.2;

  function announceStage(message) {
    if (stageStatus) stageStatus.textContent = message;
  }

  function renderMobileStory() {
    framePending = false;
    const height = viewportHeight();
    const openingProgress = reducedMotion ? (window.scrollY > height * 0.7 ? 1 : 0) : clamp(window.scrollY / openingEnd());
    const revealProgress = unlocked
      ? (reducedMotion ? (window.scrollY > revealAnchor + height * 0.7 ? 1 : 0) : clamp((window.scrollY - revealAnchor) / revealDistance()))
      : 0;
    const characterProgress = ease(range(openingProgress, 0.18, 0.74));
    const scrollProgress = ease(range(openingProgress, 0.34, 0.86));
    const wispProgress = ease(range(openingProgress, 0.04, 0.46));
    const revealEase = ease(revealProgress);
    const treeX = openingProgress * 16 + revealEase * 8;
    const treeY = openingProgress * -3.5 + revealEase * -8;
    const trunkProgress = ease(range(openingProgress, 0.16, 0.62));

    leftTree.style.transform = `translate3d(${-treeX}vw, ${treeY}svh, 0)`;
    rightTree.style.transform = `translate3d(${treeX}vw, ${treeY}svh, 0)`;
    treeTrunks.forEach((trunk) => {
      trunk.style.opacity = String(trunkProgress);
      trunk.style.transform = `translate3d(0, ${(1 - trunkProgress) * 12}svh, 0)`;
    });
    openingTitle.style.transform = `translate3d(0, ${-openingProgress * 7 - revealEase * 4}svh, 0) scale(${1 - openingProgress * 0.24 - revealEase * 0.12})`;
    openingTitle.style.opacity = String(1 - revealEase * 0.88);
    wispCue.style.transform = `translate3d(0, ${wispProgress * 24}px, 0)`;
    wispCue.style.opacity = String(1 - wispProgress);
    wispCue.style.pointerEvents = wispProgress > 0.8 ? "none" : "auto";
    tiff.style.transform = `translate3d(0, ${(1 - characterProgress) * 34 - revealEase * 21}svh, 0) scale(${0.76 + characterProgress * 0.24 - revealEase * 0.5})`;
    tiff.style.opacity = String(characterProgress);
    scrollStage.style.transform = `translate3d(0, ${(1 - scrollProgress) * 32 - revealEase * 37}svh, 0) scale(${1 - revealEase * 0.07})`;
    scrollStage.style.opacity = String(scrollProgress);
    closedScroll.style.opacity = String(1 - range(revealProgress, 0, 0.12));
    pullRig.style.opacity = String(1 - range(revealProgress, 0, 0.12));
    unfurl.style.opacity = String(range(revealProgress, 0.01, 0.16));
    unfurl.style.clipPath = `inset(0 0 ${(1 - revealProgress) * 100}% 0)`;
    unfurl.style.pointerEvents = revealProgress > 0.92 ? "auto" : "none";

    if (revealProgress > 0.84) {
      announceStage("The announcement is open. Tiff's first adventure is coming soon.");
    } else if (revealProgress > 0.16) {
      announceStage("The announcement scroll is unfurling.");
    } else if (openingProgress > 0.92) {
      announceStage("You found Big Tiff and the sealed announcement.");
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
    revealAnchor = window.scrollY;
    pullTag.setAttribute("aria-expanded", "true");
    pullTag.style.pointerEvents = "none";
    if (mobileViewport) mobileViewport.scrollTop = 0;
    unfurl.setAttribute("aria-hidden", "false");
    announceStage("The seal releases. Scroll to unfurl Big Tiff's announcement.");

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
    window.scrollBy({
      top: viewportHeight() * 0.62,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  });

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender, { passive: true });
  window.visualViewport?.addEventListener("resize", requestRender, { passive: true });
  renderMobileStory();
}

initDesktopExperience();
window.addEventListener("load", initMobileExperience, { once: true });
