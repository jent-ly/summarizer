/*global chrome*/
let highlightReady = false;
let tabReady = false;

const requestMark = () => {
  setTimeout(() => {
    chrome.runtime.sendMessage({request_type: "mark"});
  }, 100);
};

chrome.storage.sync.get({
  color: {r: 255, g: 255, b: 0},
  isSummarizerEnabled: true,
  summaryDomainWhitelist: []
}, function({color, isSummarizerEnabled, summaryDomainWhitelist}) {
  // do nothing if not enabled
  if (!isSummarizerEnabled) {
    return;
  }

  // do nothing if current website is not whitelisted
  let whitelist = new Set(summaryDomainWhitelist);
  // eslint-disable-next-line TODO: find alternative for this? maybe chrome tabs query, no-restricted-globals
  let url = new URL(location.href);
  if (!whitelist.has(url.hostname)) {
    return;
  }
  // kickoff highlighting routine on background script
  let rgb = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
  let highlightColor = `mark{background: ${rgb};}`
  chrome.runtime.sendMessage(
    {request_type: "highlight", highlight_color: highlightColor});
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.notification === "highlightReady") {
    highlightReady = true;
    if (highlightReady && tabReady) {
      requestMark();
    }
  } else if (message.notification === "tabReady") {
    tabReady = true;
    if (highlightReady && tabReady) {
      requestMark();
    }
  }
});
