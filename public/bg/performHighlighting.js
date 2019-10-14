/*global chrome*/
const apiCall = (userEmail, userId, html) => {
  return fetch("https://jent.ly/api/summarize", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: window.location.href,
      html: html,
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
        chrome.tabs.sendMessage(tabs[0].id, {request_type: 'get_HTML'}, html => {
          apiCall(userInfo.email, userInfo.id, html).then(response => {
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
  } 
  // sends ack to contentScript until response ready (https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-484772327) 
  return true;  
});