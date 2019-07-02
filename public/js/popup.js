/*global chrome*/
var app = chrome.extension.getBackgroundPage();
var floatTime = 3000;

toggleEnable = () => {
  var isChecked = document.getElementById('enableSummarizer').checked;
  chrome.storage.sync.set({
    isSummarizerEnabled: isChecked
  }, function() {
    if (isChecked) {
      displayStatus('Summarizer enabled! Refresh to see changes.');
    } else {
      displayStatus('Summarizer disabled... Refresh to see changes.');
    }
  });
}

addDomain = (domain, whitelist) => {
  whitelist.add(domain);
  chrome.storage.sync.set({
    summaryDomainWhitelist: [...whitelist]
  }, function() {
    document.getElementById('whitelistToggle').innerText = `Remove "${domain}"`;
    // display success
    displayStatus(`Added "${domain}". Refresh to see changes.`);
  });
}

removeDomain = (domain, whitelist) => {
  whitelist.delete(domain);
  chrome.storage.sync.set({
    summaryDomainWhitelist: [...whitelist]
  }, function() {
    document.getElementById('whitelistToggle').innerText = `Add "${domain}"`;
    // display success
    displayStatus(`Removed "${domain}". Refresh to see changes.`);
  });
}

toggleDomain = () => {
  chrome.storage.sync.get({
    summaryDomainWhitelist: []
  }, function(result) {
    var whitelist = new Set(result.summaryDomainWhitelist);
    chrome.tabs.getSelected(null, (tab) => {
      var url = new URL(tab.url);
      console.log("TOGGLE: ", url.hostname, whitelist);
      if (whitelist.has(url.hostname)) {
        removeDomain(url.hostname, whitelist);
      } else {
        addDomain(url.hostname, whitelist);
      }
    });
  });
}

// Helper for displaying status toastr thing
displayStatus = (status) => {
  var statusToast = document.getElementById('statusDisplay');
  statusToast.textContent = status;
  statusToast.classList.remove('summ-toast-hidden');
  setTimeout(() => {
    statusToast.classList.add('summ-toast-hidden');
  }, floatTime);
}

// initialize popup values and event listeners; update when more values added
initPopup = () => {
  chrome.storage.sync.get({
    summaryDomainWhitelist: [],
    isSummarizerEnabled: false
  }, (result) => {
    // Set displayed values
    var whitelist = new Set(result.summaryDomainWhitelist);
    document.getElementById('enableSummarizer').checked = result.isSummarizerEnabled;
    chrome.tabs.getSelected(null, (tab) => {
      var url = new URL(tab.url);
      console.log(url.hostname, whitelist);
      if (whitelist.has(url.hostname)) {
        document.getElementById('whitelistToggle').innerText = `Remove "${url.hostname}"`;
      } else {
        document.getElementById('whitelistToggle').innerText = `Add "${url.hostname}"`;
      }
    });
  });

  // Event listeners
  document.getElementById('enableSummarizer').addEventListener('click', toggleEnable);
  document.getElementById('moreOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
  document.getElementById('whitelistToggle').addEventListener('click', toggleDomain);
}

initPopup();