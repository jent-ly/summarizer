var app = chrome.extension.getBackgroundPage();
var floatTime = 3000;

function addDomain() {
  chrome.storage.sync.get({'summaryDomainWhitelist': []}, function(result) {
    var whitelist = new Set(result.summaryDomainWhitelist);

    chrome.tabs.getSelected(null, function(tab) {
      var url = new URL(tab.url)
      whitelist.add(url.hostname);
      chrome.storage.sync.set({summaryDomainWhitelist: [...whitelist]}, function() {
        // display success
        var statusDisplay = document.getElementById('statusDisplay');
        statusDisplay.textContent = 'Added "' + url.hostname + '". Refresh to see changes.';
        setTimeout(function() {
          statusDisplay.textContent = '';
        }, floatTime);
      });
    });
  });
}

function removeDomain() {
  chrome.storage.sync.get({'summaryDomainWhitelist': []}, function(result) {
    var whitelist = new Set(result.summaryDomainWhitelist);

    chrome.tabs.getSelected(null, function(tab) {
      var url = new URL(tab.url)
      whitelist.delete(url.hostname);
      chrome.storage.sync.set({summaryDomainWhitelist: [...whitelist]}, function() {
        // display success
        var statusDisplay = document.getElementById('statusDisplay');
        statusDisplay.textContent = 'Removed "' + url.hostname + '"';
        setTimeout(function() {
          statusDisplay.textContent = '';
        }, floatTime);
      });
    });
  });
}

document.getElementById('addDomain').addEventListener('click', addDomain);
document.getElementById('removeDomain').addEventListener('click', removeDomain);
