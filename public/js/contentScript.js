/*global chrome*/
// gets all text without html tags
const getText = () => {
  return document.body.innerText;
};

// gets entire html of page
const getHTML = () => {
  return document.body.innerHTML;
};

// Listen for getHTML request
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.request_type === 'get_HTML') {
        sendResponse(getHTML());
    }
});

chrome.storage.sync.get({
  'color': {r: 255, g: 255, b: 0},
  'isSummarizerEnabled': false,
  'summaryDomainWhitelist': []
}, function(items) {
  // do nothing if not enabled
  if (!items.isSummarizerEnabled) {
    return;
  }

  // do nothing if current website is not whitelisted
  let whitelist = new Set(items.summaryDomainWhitelist);
  // eslint-disable-next-line TODO: find alternative for this? maybe chrome tabs query, no-restricted-globals
  let url = new URL(location.href);
  if (!whitelist.has(url.hostname)) {
    return;
  }

  // kickoff highlighting routine on background script
  let color = 'rgb(' + items.color.r + ',' + items.color.g + ',' + items.color.b + ')';
  let highlightColor = `mark{background: ${color};}`
  chrome.runtime.sendMessage({request_type: "highlight", highlight_color: highlightColor});
});
