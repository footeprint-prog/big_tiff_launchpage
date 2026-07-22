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
  if (!mobileQuery.matches || !mobileWorld) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const leftTree = document.querySelector(".mobile-tree-left");
  const rightTree = document.querySelector(".mobile-tree-right");
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
    !gsap ||
    !ScrollTrigger ||
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

  gsap.registerPlugin(ScrollTrigger);

  let unlocked = false;
  let revealTimeline;
  let dragStartY = 0;
  let dragDistance = 0;
  let activePointerId = null;
  let suppressNextClick = false;

  const openingEnd = () => window.innerHeight * 1.42;
  const revealEnd = () => window.innerHeight * 5.25;

  function announceStage(message) {
    if (stageStatus) stageStatus.textContent = message;
  }

  function setOpeningState(open) {
    gsap.set(leftTree, { x: open ? -window.innerWidth * 0.36 : 0, y: open ? -window.innerHeight * 0.08 : 0 });
    gsap.set(rightTree, { x: open ? window.innerWidth * 0.36 : 0, y: open ? -window.innerHeight * 0.07 : 0 });
    gsap.set(openingTitle, {
      y: open ? -window.innerHeight * 0.07 : 0,
      scale: open ? 0.76 : 1,
    });
    gsap.set(wispCue, { autoAlpha: open ? 0 : 1, y: open ? 38 : 0 });
    gsap.set(tiff, { autoAlpha: open ? 1 : 0, y: open ? 0 : window.innerHeight * 0.34, scale: open ? 1 : 0.76 });
    gsap.set(scrollStage, { autoAlpha: open ? 1 : 0, y: open ? 0 : window.innerHeight * 0.32 });
  }

  if (reducedMotion) {
    setOpeningState(false);
    ScrollTrigger.create({
      trigger: mobileWorld,
      start: () => window.innerHeight * 0.62,
      onEnter: () => {
        setOpeningState(true);
        announceStage("You found Big Tiff and the sealed announcement.");
      },
      onLeaveBack: () => {
        setOpeningState(false);
        announceStage("The forest entrance closes.");
      },
    });
  } else {
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: mobileWorld,
          start: "top top",
          end: () => `+=${openingEnd()}`,
          scrub: 0.38,
          invalidateOnRefresh: true,
          onLeave: () => announceStage("You found Big Tiff and the sealed announcement."),
          onEnterBack: () => announceStage("Follow the wisp back toward the forest entrance."),
        },
      })
      .to(leftTree, { x: () => -window.innerWidth * 0.36, y: () => -window.innerHeight * 0.08, duration: 1 }, 0)
      .to(rightTree, { x: () => window.innerWidth * 0.36, y: () => -window.innerHeight * 0.07, duration: 1 }, 0)
      .to(openingTitle, { y: () => -window.innerHeight * 0.07, scale: 0.76, duration: 0.78 }, 0.08)
      .to(wispCue, { autoAlpha: 0, y: 38, duration: 0.34 }, 0.12)
      .to(tiff, { autoAlpha: 1, y: 0, scale: 1, duration: 0.62 }, 0.36)
      .to(scrollStage, { autoAlpha: 1, y: 0, duration: 0.48 }, 0.52);
  }

  function setReducedMotionFinalState() {
    gsap.set([closedScroll, pullRig], { autoAlpha: 0 });
    gsap.set(unfurl, { autoAlpha: 1, height: "auto", overflow: "visible" });
    gsap.set(tiff, { autoAlpha: 1, y: () => -window.innerHeight * 0.235, scale: 0.46 });
    gsap.set(openingTitle, { autoAlpha: 0.12, y: () => -window.innerHeight * 0.12, scale: 0.62 });
    gsap.set(leftTree, { x: () => -window.innerWidth * 0.5, y: () => -window.innerHeight * 0.4, scale: 1.06 });
    gsap.set(rightTree, { x: () => window.innerWidth * 0.5, y: () => -window.innerHeight * 0.37, scale: 1.06 });
    gsap.set(scrollStage, { y: () => -window.innerHeight * 0.54 });
  }

  function createRevealTimeline() {
    if (revealTimeline || reducedMotion) return;

    revealTimeline = gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: mobileWorld,
          start: () => mobileWorld.offsetTop + openingEnd(),
          end: () => mobileWorld.offsetTop + revealEnd(),
          scrub: 0.42,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress > 0.84) {
              announceStage("The announcement is open. Tiff's first adventure is coming soon.");
            } else if (self.progress > 0.2) {
              announceStage("The announcement scroll is unfurling.");
            }
          },
        },
      })
      .to([closedScroll, pullRig], { autoAlpha: 0, y: -24, duration: 0.1 }, 0)
      .to(unfurl, { autoAlpha: 1, height: () => unfurl.scrollHeight, duration: 0.3 }, 0.02)
      .to(tiff, { y: () => -window.innerHeight * 0.235, scale: 0.46, duration: 0.42 }, 0)
      .to(openingTitle, { autoAlpha: 0.12, y: () => -window.innerHeight * 0.12, scale: 0.62, duration: 0.32 }, 0)
      .to(leftTree, {
        x: () => -window.innerWidth * 0.5,
        y: () => -window.innerHeight * 0.4,
        scale: 1.06,
        duration: 1,
      }, 0)
      .to(rightTree, {
        x: () => window.innerWidth * 0.5,
        y: () => -window.innerHeight * 0.37,
        scale: 1.06,
        duration: 1,
      }, 0)
      .to(scrollStage, { y: () => -window.innerHeight * 0.54, duration: 0.76 }, 0.24);
  }

  function unlockScroll({ moveForward = true } = {}) {
    if (unlocked) return;
    unlocked = true;
    mobileWorld.classList.add("is-unlocked");
    pullTag.setAttribute("aria-expanded", "true");
    unfurl.setAttribute("aria-hidden", "false");
    announceStage("The seal releases. Scroll to unfurl Big Tiff's announcement.");

    if (reducedMotion) {
      window.setTimeout(() => {
        setReducedMotionFinalState();
        ScrollTrigger.refresh();
        if (moveForward) {
          window.scrollTo({ top: openingEnd() + window.innerHeight * 1.25, behavior: "auto" });
        }
      }, 80);
      return;
    }

    gsap.to(pullTag, { y: 76, rotation: 2.5, duration: 0.24, ease: "power2.out" });
    gsap.to(pullCord, { scaleY: 2.15, duration: 0.24, ease: "power2.out" });

    window.setTimeout(() => {
      createRevealTimeline();
      ScrollTrigger.refresh();
      if (moveForward) {
        window.scrollTo({ top: openingEnd() + window.innerHeight * 0.18, behavior: "smooth" });
      }
    }, 560);
  }

  function resetPullRig() {
    gsap.to(pullTag, { y: 0, rotation: 0, duration: 0.34, ease: "back.out(2)" });
    gsap.to(pullCord, { scaleY: 1, duration: 0.3, ease: "power2.out" });
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
    gsap.set(pullTag, { y: dragDistance, rotation: dragDistance * 0.035 });
    gsap.set(pullCord, { scaleY: 1 + dragDistance / 58 });
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
    window.scrollTo({
      top: openingEnd() * 0.98,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  });

  if (window.scrollY > openingEnd() * 1.08) {
    unlockScroll({ moveForward: false });
  }
}

initDesktopExperience();
window.addEventListener("load", initMobileExperience, { once: true });
