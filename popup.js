const checkboxes = ['hideFeed', 'hideShorts', 'hideAds'];

// On popup open, load current settings and reflect them in the UI
chrome.storage.sync.get(checkboxes, (settings) => {
  checkboxes.forEach((key) => {
    document.getElementById(key).checked = !!settings[key];
  });
});

// On any checkbox change, save the new value
checkboxes.forEach((key) => {
  document.getElementById(key).addEventListener('change', (e) => {
    chrome.storage.sync.set({ [key]: e.target.checked });
  });
});