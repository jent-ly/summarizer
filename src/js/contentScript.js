// gets all text without html tags
function getText(){
    return document.body.innerText
}

// gets entire html of page
function getHTML(){
    return document.body.outerHTML
}

chrome.storage.sync.get(['summaryDomainWhitelist'], function(result) {
  var whitelist = new Set(result.summaryDomainWhitelist);
  var pageDomain = document.domain;
  if (whitelist.has(pageDomain)) {
    console.log("run on this domain");
    // code here to summarize and change style
  }
});
