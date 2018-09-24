// gets all text without html tags
function getText(){
  return document.body.innerText
}

// gets entire html of page
function getHTML(){
  return document.body.outerHTML
}

// TODO: replace with milestone 2 implementation
function displaySummary(sentences) {
  var div = document.createElement('div');
  div.setAttribute('class', 'summary');
  div.innerHTML = '<h1>Page Summary</h1><ol><li>' + sentences.join('</li><li>') + '</li></ol>';
  document.body.insertBefore(div, document.body.firstChild);
}

// TODO: replace with milestone 2 implementation
function apiCall(apiKey) {
  return fetch('https://textanalysis-text-summarization.p.mashape.com/text-summarizer', {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-Mashape-Key": apiKey,
    },
    body: '{"url":"' + document.URL + '","text":"","sentnum":8}',
  });
}

chrome.storage.sync.get({'summaryDomainWhitelist': []}, function(result) {
  var whitelist = new Set(result.summaryDomainWhitelist);

  var url = new URL(location.href);
  if (whitelist.has(url.hostname)) {
    console.log("Summarizer running on this domain");
    // code here to summarize and change style
    chrome.storage.sync.get({
      apiKey: ""
    }, (items) => {
      apiCall(items.apiKey).then(response => {
          return response.json();
      }).then(myJson => {
        displaySummary(myJson.sentences);
      });
    });
  } else {
    console.log("Summarizer not whitelisted on this domain");
  }
});
