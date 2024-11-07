chrome.omnibox.onInputEntered.addListener((text) => {
    chrome.storage.sync.get(['shortcuts'], (result) => {
      const shortcuts = result.shortcuts || [];
      const matchedShortcut = shortcuts.find(shortcut => shortcut.keyword === text);
      
      if (matchedShortcut) {
        chrome.tabs.update({ url: matchedShortcut.url });
      } else {
        // If no match found, perform a Google search
        chrome.tabs.update({ url: `https://www.google.com/search?q=${encodeURIComponent(text)}` });
      }
    });
  });