/*global chrome*/
chrome.storage.sync.get({
  'color': {r: 255, g: 255, b: 0},
  'isSummarizerEnabled': true,
  'summaryDomainWhitelist': ['www.nytimes.com', 'www.cnn.com', 'www.huffpost.com', 'www.huffingtonpost.ca']
}, function(items) {
  // do nothing if not enabled
  if (!items.isSummarizerEnabled) {
    return;
  }

  // do nothing if current website is not whitelisted
  let whitelist = new Set(items.summaryDomainWhitelist);
  // eslint-disable-next-line TODO: find alternative for this? maybe chrome tabs query, no-restricted-globals
  let url = new URL(location.href);
  console.log('contentScript', url.hostname, whitelist);
  if (!whitelist.has(url.hostname)) {
    return;
  }
  console.log('contentScript highlighting');
  // kickoff highlighting routine on background script
  let color = 'rgb(' + items.color.r + ',' + items.color.g + ',' + items.color.b + ')';
  let highlightColor = `mark{background: ${color};}`
  chrome.runtime.sendMessage({request_type: "highlight", highlight_color: highlightColor});
});
