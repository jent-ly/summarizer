// Enables/disables the summarizer
toggle_enable = () => {
  var isChecked = document.getElementById('enable').checked;
  chrome.storage.sync.set({
    isSummarizerEnabled: isChecked
  }, function() {
    if (isChecked) {
      display_status('Summarizer enabled!');
    } else {
      display_status('Summarizer disabled...');
    }
  });
}

// Saves apiKey to chrome.storage
save_apiKey = () => {
  var apiKey = document.getElementById('apiKey').value;
  if (apiKey)
  chrome.storage.sync.set({
    apiKey: apiKey
  }, function() {
    // Update status to let user know apiKey was saved.
    display_status('API Key saved!');
  });
}

// Saves color to chrome.storage
save_color = () => {
  var color = document.getElementById('color').value;
  if (color == "") {
    chrome.storage
          .sync
          .remove("color")
  } else {
    chrome.storage
          .sync
          .set({
      color: color
    }, function() {
      // Update status to let user know color was saved.
      display_status('Color saved!');
    });
  }
}

// Restores state using the preferences stored in chrome.storage.
// Specifies default values to use; update when more setable options are added
restore_options = () => {
  chrome.storage.sync.get({
    isSummarizerEnabled: false,
    apiKey: "",
    color: "",
    summaryDomainWhitelist: []
  }, function(options) {
    // display saved chrome.storage values
    document.getElementById('enable').checked = options.isSummarizerEnabled;
    document.getElementById('apiKey').value = options.apiKey;
    document.getElementById('color').value = options.color;

    // generate and display whitelisted domains
    var whitelist = new Set(options.summaryDomainWhitelist);
    for (var domain of whitelist) {
      add_whitelist_row(domain);
    }
  });
}

// Wrapper for page load
load_options = () => {
  restore_options();
}

add_domain = () => {
  chrome.storage.sync.get({
    summaryDomainWhitelist: []
  }, function(result) {
    var whitelist = new Set(result.summaryDomainWhitelist);
    var domain = document.getElementById('domain').value;
    if (!!domain) { // don't want to add an empty string
      if (whitelist.has(domain)) {
        // display check if already whitelisted
        var domainStatus = document.getElementById('status');
        domainStatus.textContent = `'${domain}' is already whitelisted`;
        setTimeout(function() {
          domainStatus.textContent = '\xa0';
        }, 1750);
      } else {
        whitelist.add(domain);
        chrome.storage.sync.set({
          summaryDomainWhitelist: [...whitelist]
        }, function() {
          // display success
          display_status(`Added '${domain}' to whitelist`);
        });
        add_whitelist_row(domain);
      }
    }
  });
}

remove_domain = (e) => {
  // retrieve table row element and the domain to remove
  var row = e.target.parentNode.parentNode;
  var domain = row.childNodes[1].innerText;

  // remove from html table
  document.getElementById('whitelist-list').removeChild(row);

  // remove from chrome storage
  chrome.storage.sync.get({
    summaryDomainWhitelist: []
  }, function(result) {
    var whitelist = new Set(result.summaryDomainWhitelist);
    whitelist.delete(domain);
    chrome.storage.sync.set({
      summaryDomainWhitelist: [...whitelist]
    }, function() {
      // display success
      display_status(`Removed '${domain}' from whitelist`);
    });
  });
}

// Helper for adding a whitelist entry to the list
add_whitelist_row = (domain) => {
  var row = document.createElement('tr');
  var removeCol = document.createElement('td');
  var removeBut = document.createElement('button');
  var domainVal = document.createElement('td');

  removeCol.classList.add("remove-domain-col");
  removeBut.classList.add("remove-domain-button");
  removeBut.id = "remove";
  removeBut.innerText = 'X';
  removeBut.addEventListener('click', (event) => remove_domain(event));
  domainVal.classList.add("domain-item");
  domainVal.innerText = `${domain}`;

  removeCol.appendChild(removeBut);
  row.appendChild(removeCol);
  row.appendChild(domainVal);

  document.getElementById('whitelist-list').appendChild(row);
}

// Helper for displaying status
display_status = (status) => {
  var domainStatus = document.getElementById('status');
  domainStatus.textContent = status;
  setTimeout(function() {
    domainStatus.textContent = '\xa0';
  }, 1750);
}

document.addEventListener('DOMContentLoaded', load_options);
document.getElementById('save').addEventListener('click', save_apiKey);
document.getElementById('save-color').addEventListener('click', save_color);
document.getElementById('add').addEventListener('click', add_domain);
document.getElementById('enable').addEventListener('change', toggle_enable);
