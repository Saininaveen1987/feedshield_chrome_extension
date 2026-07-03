const SELECTORS = {
  homeFeed: 'ytd-browse[page-subtype="home"]',
  watchSidebar: 'ytd-watch-next-secondary-results-renderer',
  comments: 'ytd-comments',
  cinemaButton: '.ytp-size-button',
  endScreenSuggestions: '.ytp-fullscreen-grid-stills-container',
  searchShortsShelf: 'grid-shelf-view-model',
  homepageSections: 'ytd-rich-section-renderer',
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
    if (cinemaBtn) cinemaBtn.click();
  }
  cinemaModeHandled = true;
}

function getCurrentPageType() {
  const url = window.location.href;
  if (url.includes('/watch?')) return 'watch';
  if (url.includes('/results?')) return 'search';
  if (url.match(/\/@[\w]+/) || url.includes('/channel/')) return 'channel';
  return 'home';
}

// function applyFilters(settings) {
//   if (settings.hideFeed) {
//     document.querySelectorAll(SELECTORS.videoCard).forEach(hideElement);
//     document.querySelectorAll(SELECTORS.watchSidebar).forEach(hideElement);
//     document.querySelectorAll(SELECTORS.comments).forEach(hideElement);
//     document.querySelectorAll(SELECTORS.endScreenSuggestions).forEach(hideElement);
//     document.querySelectorAll(SELECTORS.searchShortsShelf).forEach(hideElement);
//     document.querySelectorAll(SELECTORS.searchVideoResult).forEach(hideElement);
//     document.querySelectorAll(SELECTORS.homepageSections).forEach(hideElement);
//     enableCinemaMode();
//   } else {
//     document.querySelectorAll(SELECTORS.videoCard).forEach(showElement);
//     document.querySelectorAll(SELECTORS.watchSidebar).forEach(showElement);
//     document.querySelectorAll(SELECTORS.comments).forEach(showElement);
//     document.querySelectorAll(SELECTORS.endScreenSuggestions).forEach(showElement);
//     document.querySelectorAll(SELECTORS.searchShortsShelf).forEach(showElement);
//     document.querySelectorAll(SELECTORS.searchVideoResult).forEach(showElement);
//     document.querySelectorAll(SELECTORS.homepageSections).forEach(showElement);
//   }
// }

function applyFilters(settings) {
  const page = getCurrentPageType();

  if (settings.hideFeed) {

    // Homepage only
    if (page === 'home') {
      document.querySelectorAll(SELECTORS.homeFeed).forEach(hideElement);
    }

    // Watch page only
    if (page === 'watch') {
      document.querySelectorAll(SELECTORS.watchSidebar).forEach(hideElement);
      document.querySelectorAll(SELECTORS.comments).forEach(hideElement);
      document.querySelectorAll(SELECTORS.endScreenSuggestions).forEach(hideElement);
      enableCinemaMode();
    }

    // Search page only
    if (page === 'search') {
      document.querySelectorAll(SELECTORS.searchShortsShelf).forEach(hideElement);
      document.querySelectorAll(SELECTORS.searchVideoResult).forEach(hideElement);
    }

    // Channel pages — hide nothing, let their content show

  } else {
    // Unhide everything regardless of page
    document.querySelectorAll(SELECTORS.videoCard).forEach(showElement);
    document.querySelectorAll(SELECTORS.watchSidebar).forEach(showElement);
    document.querySelectorAll(SELECTORS.comments).forEach(showElement);
    document.querySelectorAll(SELECTORS.endScreenSuggestions).forEach(showElement);
    document.querySelectorAll(SELECTORS.searchShortsShelf).forEach(showElement);
    document.querySelectorAll(SELECTORS.searchVideoResult).forEach(showElement);
    document.querySelectorAll(SELECTORS.homepageSections).forEach(showElement);
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