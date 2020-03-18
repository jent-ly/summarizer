/*global chrome*/


const defaultDomains = [
  'www.bloomberg.com',
  'www.cnn.com',
  'www.dailymail.co.uk',
  'www.economist.com',
  'www.huffingtonpost.ca',
  'www.huffpost.com',
  'medium.com',
  'www.nytimes.com',
  'www.telegraph.co.uk',
  'www.theglobeandmail.com',
  'www.theguardian.com',
  'www.thestar.com',
  'www.usatoday.com',
  'www.wikipedia.org',
];

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

const runMark = (sentences, tab) => {
  chrome.tabs.executeScript(tab.id, { file: "bg/mark.js" }, () => {
    chrome.tabs.executeScript(tab.id, {code: 'var instance = new Mark(document.querySelector("body"));'});
    sentences.forEach(sentence => {
      // console.log(sentence);
      let markCode = `instance.mark("${sentence}", {
        "acrossElements": true,
        "caseSensitive": true,
        "ignoreJoiners": true,
        "separateWordSearch": false
      });`;
      chrome.tabs.executeScript(tab.id, {code: markCode});
    });
  });
};

chrome.runtime.onInstalled.addListener(function({reason}) {
  chrome.storage.sync.get({
    summaryDomainWhitelist: [],
    removedDomains: [],
  }, function({summaryDomainWhitelist, removedDomains}) {
     let cur = new Set(summaryDomainWhitelist);
     let def = new Set(defaultDomains);
     let rem = new Set(removedDomains);
     let toAdd = new Set([...def].filter(d => !rem.has(d)));

    chrome.storage.sync.set({
      // @ts-ignore - spread operator on Set
      summaryDomainWhitelist: [...cur, ...toAdd]
    }, () => {
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == 'complete' && tab.active) {
    chrome.tabs.sendMessage(tabId, {notification: "tabReady"});
  }
});

let toHighlight;
// Listen for requests to highlight page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.request_type === "highlight") {
    // use this API here since it cannot be used from contentScript
    chrome.identity.getProfileUserInfo(userInfo => {
      chrome.tabs.insertCSS(sender.tab.id, {code: message.highlight_color});
      // Here we want to get the HTML
      chrome.tabs.executeScript(sender.tab.id, { file: "bg/Readability.js" }, () => {
        chrome.tabs.executeScript(sender.tab.id, { code: 
            `var cleandoc = document.cloneNode(true);
            new Readability(cleandoc).parse()` }, (ret) => {
          var article = ret[0];
          var div = document.createElement('div');
          div.innerHTML = article.content;
          var text = Array.prototype.map.call(div.querySelectorAll('p,li'), (p) => { return p.innerText }).join(' ');
          apiCall(userInfo.email, userInfo.id, article.title, text, navigator.language.substring(0, 2)).then(response => {
            return response.json();
          }).then(sentences => {
            toHighlight = sentences;
            chrome.tabs.sendMessage(sender.tab.id, {notification: "highlightReady"});
          }).catch(exception => {
            // this will log into the background script environment
            // go to: chrome://extensions/ -> Inspect views
            console.log(exception);
          });
        });
      });
    }); 
  } else if (message.request_type === "mark") {
    runMark(toHighlight, sender.tab);
  }
  // sends ack to contentScript until response ready (https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-484772327)  
});
