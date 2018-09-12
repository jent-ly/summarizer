# Extension Setup, Requirements, and Publishing

## What is an extension?
[Detailed info here](https://developer.chrome.com/extensions/overview)
Extensions are zipped bundles of HTML, CSS, JS, imgs, etc. that customize the Google Chrome browsing experience. They are build using web technology and can use the same APIs the browser provides to the open web.

Users will interact with a popup from the icon.
We will eventually need to update the icons.
- [] design popup content
- [] update icons

### Referring to files
Files can be referred to with an absolute URL `chrome-extension://<extensionID>/<pathToFile>` or relative URL which is the same as the `<pathToFile>`. `<extensionID>` is a unique identifier that the extension system generates for each extension, and can be viewed by going to `chrome://extensions`.
Extension ID can change during development. Use `chrome.runtime.getURL()` to avoid hardcoding the ID during development.

### Background script
The extension's event handler: listeners for browser events, performs logic

### UI elements:
1. A [browser action](https://developer.chrome.com/extensions/browserAction) or [page action](https://developer.chrome.com/extensions/pageAction) to the right of the address bar.
- browser action can open a popup, always available
- page action represents actions that can be taken on the current page, can be hidden
2. Extension UI pages ie. the popup
- contains HTML pages with JavaSctipt logic
- communicates with background script to make its icon clickable to users
3. [Content Scripts](https://developer.chrome.com/extensions/content_scripts)
- contains JavaScript that executes in the context of the current page
- *read/modify the DOM of web pages*
- communicates with extension by exchanges messages and storing values using the storage API
4. Options page
- customization of the extension

### Using Chrome APIs
Extensions can use the same APIs as web pages, and also [extension-specific APIs](https://developer.chrome.com/extensions/api_index).
Most Chrome API methods are async, ie. `chrome.tabs.query(object queryInfo, function callback)`

### Saving data and incognito
Extensions can save data using the [storage API](https://developer.chrome.com/extensions/overview), the HTML5 [web storage API](https://html.spec.whatwg.org/multipage/webstorage.html), or by making server requests that save data.
By default, extensions don't run in incognito. When in incognito, don't save data. We can store setting preferences though.
Can check incognito like this:
```
function saveTabData(tab) {
  if (tab.incognito) {
    return;
  } else {
    chrome.storage.local.set({data: tab.url});
  }
}
```

## Publishing to Chrome Web Store
1. Create app's zip file
2. Create a developer account
3. Upload the app
4. Pick a payment system
5. Get app constraints and finish app code
6. Get app ID
7. Get OAuth token
8. Finish the app
9. Provide store content
10. Pay developer sign up fee
	- *$5 one-time fee*
11. Publish the app

Extensions only require the Manifest file, along with the app code, images etc.
More detailed information about the publishing process [here](https://developer.chrome.com/webstore/publish).