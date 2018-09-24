// gets all text without html tags
function getText(){
    return document.body.innerText
}

// gets entire html of page
function getHTML(){
    return document.body.outerHTML
}

chrome.storage.sync.get(['summaryDomainWhitelist'], function(result) {
  var whitelist;
  if (!result) {
    whitelist = new Set();
  } else {
    whitelist = new Set(result.summaryDomainWhitelist);
  }
  var pageDomain = document.domain;
  if (whitelist.has(pageDomain)) {
    console.log("run on this domain");
    // code here to summarize and change style
    chrome.storage.sync.get({
      apiKey: ""
    }, function(items) {
      console.log(items.apiKey);
      fetch('https://textanalysis-text-summarization.p.mashape.com/text-summarizer', {
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "X-Mashape-Key": items.apiKey,
          },
          body: '{"url":"' + document.URL + '","text":"","sentnum":8}',
      }).then(response => {
          return response.json();
      }).then(myJson => {
        console.log(myJson.sentences);
        var div = document.createElement('div');
        div.setAttribute('class', 'summary');
        div.innerHTML = '<h1>Page Summary</h1><ol><li>' + myJson.sentences.join('</li><li>') + '</li></ol>';
        document.body.insertBefore(div, document.body.firstChild);
      });
    });
  } else {
    console.log("don't run here");
  }
});
