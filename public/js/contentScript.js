/*global chrome*/
// gets all text without html tags
const getText = () => {
  return document.body.innerText;
};

// gets entire html of page
const getHTML = () => {
  return document.body.innerHTML;
};

// TODO: replace with milestone 2 implementation
// const displaySummary = (sentences) => {
//   var div = document.createElement('div');
//   div.setAttribute('class', 'summary');
//   div.innerHTML = '<h1>Page Summary</h1><ol><li>' + sentences.join('</li><li>') + '</li></ol>';
//   document.body.insertBefore(div, document.body.firstChild);
// };

// TODO: replace with milestone 2 implementation
const apiCall = () => {
  return fetch("https://jent.ly/api/summarize", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({url: window.location.href, html: getHTML()}),
  });
};

const findFirstOccurrenceTextInHTML = (text, body) => {
  let tag = false;
  for (let i = 0; i < body.length - text.length + 1; i++) {
    let body_index = i;
    let text_index = 0;

    if (body[i] === '<') tag = true;
    else if (body[i] === '>') tag = false;
    let saved_tag = tag;

    if (tag) continue;
    while (text_index < text.length && body_index < body.length) {
      if (body[body_index] === '<') tag = true;

      if (!tag && body[body_index] !== text[text_index]) break;
      if (!tag) text_index++;

      if (body[body_index] === '>') tag = false;

      body_index++;
    }
    if (text_index === text.length) return [i, body_index];
    tag = saved_tag;
  }
  return []
};

const highlightText = (sentences) => {
  let html = getHTML();

  chrome.storage.sync.get({
    color: "yellow"
  }, (items) => {
    let color = items.color;
    for (let i = 0 ; i < sentences.length ; i++) {
      let sub_sentences = sentences[i].split('\n')
      for (let j = 0 ; j < sub_sentences.length ; j++) {
        let indices = findFirstOccurrenceTextInHTML(sub_sentences[j], html);
        if (indices.length === 0) {
          console.log("Unable to find sentence \"" + sentences[i] + "\"");
          continue;
        }
        html = [
          html.slice(0, indices[0]),
          "<b style=\"background-color: ", color, ";\">", html.slice(indices[0], indices[1]), "</b>",
          html.slice(indices[1])
        ].join('');
      }
    }
    document.body.innerHTML = html;
  });
};

chrome.storage.sync.get({
  'summaryDomainWhitelist': [],
  'isSummarizerEnabled': false
}, function(result) {
  // do nothing if not enabled
  if (!result.isSummarizerEnabled) {
    return;
  }

  // do nothing if current website is not whitelisted
  let whitelist = new Set(result.summaryDomainWhitelist);
  // eslint-disable-next-line TODO: find alternative for this? maybe chrome tabs query, no-restricted-globals
  let url = new URL(location.href);
  if (!whitelist.has(url.hostname)) {
    return;
  }

  // otherwise, do the thing!
  // code here to summarize and change style
  apiCall().then(response => {
    return response.json();
  }).then(sentences => {
    highlightText(sentences);
  }).catch(exception => {
    console.log(exception);
  });
});
