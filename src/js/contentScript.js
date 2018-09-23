// gets all text without html tags
function getText(){
    return document.body.innerText
}

// gets entire html of page
function getHTML(){
    return document.body.outerHTML
}

// console.log(getText());
// console.log(getHTML());
var url;
chrome.tabs.getSelected(null,function(tab) {
  var url = new URL(tab.url);
  console.log(url);
});
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
          body: '{"url":"http://en.wikipedia.org/wiki/Automatic_summarization","text":"","sentnum":8}',
      }).then(response => {
          console.log(response);
      });
  });
