/*global chrome*/
const apiCall = (userEmail, userId, title, text, lang) => {
  return fetch("https://api.jent.ly/v1/summarize", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: window.location.href,
      title: title,
      text: text,
      lang: lang,
      email: userEmail,
      gaia: userId,
    }),
  });
};

// Listen for requests to highlight page
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.request_type === "highlight") {
    // use this API here since it cannot be used from contentScript
    chrome.identity.getProfileUserInfo(userInfo => { 
      chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.insertCSS(tabs[0].id, {code: message.highlight_color});
        // Here we want to get the HTML
        chrome.tabs.executeScript(null, { file: "bg/Readability.js" }, () => {
          chrome.tabs.executeScript(null, { code: `var cleandoc = document.cloneNode(true);
              new Readability(cleandoc).parse()` }, (ret) => {
            var article = ret[0];
            var div = document.createElement('div');
            div.innerHTML = article.content;
            var text = Array.prototype.map.call(div.getElementsByTagName('p'), (p) => { return p.innerText }).join(' ');
            apiCall(userInfo.email, userInfo.id, article.title, text, navigator.language.substring(0, 2)).then(response => {
              return response.json();
            }).then(sentences => {
              chrome.tabs.executeScript(null, { file: "bg/mark.js" }, () => {
                chrome.tabs.executeScript(null, {code: 'var instance = new Mark(document.querySelector("body"));'});
                sentences.forEach(sentence => {
                  console.log(sentence);
                  let markCode = `instance.mark("${sentence}", {
                    "acrossElements": true,
                    "caseSensitive": true,
                    "separateWordSearch": false
                  });`;
                  chrome.tabs.executeScript(null, {code: markCode});
                });
              });
            }).catch(exception => {
              // this will log into the background script environment
              // go to: chrome://extensions/ -> Inspect views
              console.log(exception);
            });
          });
        });
      });
    }); 
  } 
  // sends ack to contentScript until response ready (https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-484772327) 
  return true;  
});
