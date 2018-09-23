var app = chrome.extension.getBackgroundPage();

function addDomain() {
  chrome.storage.sync.get(['summaryDomainWhitelist'], function(result) {
    var whitelist;
    if (!result) {
      whitelist = new Set();
    } else {
      whitelist = new Set(result.summaryDomainWhitelist);
    }
    chrome.tabs.getSelected(null,function(tab) {
      var url = new URL(tab.url)
      whitelist.add(url.hostname);
      chrome.storage.sync.set({summaryDomainWhitelist: [...whitelist]}, function() {
        app.console.log(whitelist);
      });
    });
  });
}

function removeDomain() {
  chrome.storage.sync.get(['summaryDomainWhitelist'], function(result) {
    var whitelist = new Set(result.summaryDomainWhitelist);
    chrome.tabs.getSelected(null,function(tab) {
      var url = new URL(tab.url)
      whitelist.delete(url.hostname);
      chrome.storage.sync.set({summaryDomainWhitelist: [...whitelist]}, function() {
        app.console.log(whitelist);
      });
    });
  });
}

document.getElementById('addDomain').addEventListener('click', addDomain);
document.getElementById('removeDomain').addEventListener('click', removeDomain);
