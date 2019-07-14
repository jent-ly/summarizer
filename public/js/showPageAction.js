// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  var url = new URL(tab.url);
  if (url.protocol.startsWith("http")) {
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.request_type === "userInfo") {
    // use this API here since it cannot be used from contentScript
    chrome.identity.getProfileUserInfo(function(userInfo) {
      sendResponse(userInfo);
    });
  }
  // sends ack to contentScript until response ready (https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-484772327)
  return true;
});
