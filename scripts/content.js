const SELECTORS = {
  videoCard: 'ytd-rich-item-renderer',
  watchSidebar: 'ytd-watch-next-secondary-results-renderer',
  comments: 'ytd-comments',
  cinemaButton: '.ytp-size-button',
  endScreenSuggestions: '.ytp-fullscreen-grid-stills-container',
};

let cinemaModeHandled = false;

function hideElement(el) {
  el.style.display = 'none';
}

function showElement(el) {
  el.style.display = '';
}

function enableCinemaMode() {
  if (cinemaModeHandled) return;

  const flexy = document.querySelector('ytd-watch-flexy');
  if (!flexy) return;

  if (!flexy.hasAttribute('theater')) {
    const cinemaBtn = document.querySelector(SELECTORS.cinemaButton);
    if (cinemaBtn) {
      cinemaBtn.click();
    }
  }

  cinemaModeHandled = true; // mark as done, never auto-trigger again this session
}

function applyFilters(settings) {
  if (settings.hideFeed) {
    document.querySelectorAll(SELECTORS.videoCard).forEach(hideElement);
    document.querySelectorAll(SELECTORS.watchSidebar).forEach(hideElement);
    document.querySelectorAll(SELECTORS.comments).forEach(hideElement);
    document.querySelectorAll(SELECTORS.endScreenSuggestions).forEach(hideElement);
    enableCinemaMode();
  } else {
    document.querySelectorAll(SELECTORS.videoCard).forEach(showElement);
    document.querySelectorAll(SELECTORS.watchSidebar).forEach(showElement);
    document.querySelectorAll(SELECTORS.comments).forEach(showElement);
    document.querySelectorAll(SELECTORS.endScreenSuggestions).forEach(showElement);
  }
}

const observer = new MutationObserver(() => {
  chrome.storage.sync.get(['hideFeed'], applyFilters);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    chrome.storage.sync.get(['hideFeed'], applyFilters);
  }
});

chrome.storage.sync.get(['hideFeed'], applyFilters);