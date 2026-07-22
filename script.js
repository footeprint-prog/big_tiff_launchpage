const kickstarterButton = document.querySelector(".kickstarter-link");
const statusText = document.querySelector("#kickstarter-status");
const notice = document.querySelector(".notice");
const entranceButton = document.querySelector(".wisp-entry");
const dialog = document.querySelector(".portal-dialog");
const closeButton = document.querySelector(".portal-close");
const portalForm = document.querySelector(".portal-form");

let noticeTimer;

function showNotice(message) {
  window.clearTimeout(noticeTimer);
  notice.textContent = message;
  statusText.textContent = message;
  notice.hidden = false;
  noticeTimer = window.setTimeout(() => {
    notice.hidden = true;
  }, 4200);
}

kickstarterButton.addEventListener("click", () => {
  showNotice("Kickstarter details are coming soon. Please check back for the next chapter!");
});

notice.addEventListener("click", () => {
  notice.hidden = true;
});

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
