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

function redirectToGettingStartedPage() {
  chrome.tabs.create({
    url: "https://jent.ly/gettingstarted/",
    active: true
  });

  return false;
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Listen for when the user installs the extension.
chrome.runtime.onInstalled.addListener(redirectToGettingStartedPage);