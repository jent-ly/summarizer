// Saves options to chrome.storage
// Add handlers for each new setable options
function save_options() {
  var apiKey = document.getElementById('apiKey').value;
  chrome.storage.sync.set({
    apiKey: apiKey
  }, function() {
    // Update status to let user know options were saved.
    var keyStatus = document.getElementById('status');
    keyStatus.textContent = 'API Key saved!';
    setTimeout(function() {
      keyStatus.textContent = '\xa0';
    }, 1750);
  });
}

// Helper for adding a whitelist entry to the list
function add_whitelist_row(domain) {
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

// Restores state using the preferences stored in chrome.storage.
// Specifies default values to use; update when more setable options are added
function restore_options() {
  
  chrome.storage.sync.get({
    apiKey: "",
    summaryDomainWhitelist: []
  }, function(options) {
    // display apiKey
    document.getElementById('apiKey').value = options.apiKey;

    // generate and display whitelisted domains
    var whitelist = new Set(options.summaryDomainWhitelist);
    for (var domain of whitelist) {
      add_whitelist_row(domain);
    }
  });
}

// Wrapper for page load
function load_options() {
  restore_options();
}

function add_domain() {
  chrome.storage.sync.get({'summaryDomainWhitelist': []}, function(result) {
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
        chrome.storage.sync.set({summaryDomainWhitelist: [...whitelist]}, function() {
          // display success
          var domainStatus = document.getElementById('status');
          domainStatus.textContent = `Added '${domain}' to whitelist`;
          setTimeout(function() {
            domainStatus.textContent = '\xa0';
          }, 1750);
        });
        add_whitelist_row(domain);
      }
    }
  });
}

function remove_domain(e) {
  // retrieve table row element and the domain to remove
  var row = e.target.parentNode.parentNode;
  var domain = row.childNodes[1].innerText;

  // remove from html table
  document.getElementById('whitelist-list').removeChild(row);
  
  // remove from chrome storage
  chrome.storage.sync.get({'summaryDomainWhitelist': []}, function(result) {
    var whitelist = new Set(result.summaryDomainWhitelist);
    whitelist.delete(domain);
    chrome.storage.sync.set({summaryDomainWhitelist: [...whitelist]}, function() {
      // display success
      var domainStatus = document.getElementById('status');
      domainStatus.textContent = `Removed '${domain}' from whitelist`;
      setTimeout(function() {
        domainStatus.textContent = '\xa0';
      }, 1750);
    });
  });
}

document.addEventListener('DOMContentLoaded', load_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('add').addEventListener('click', add_domain);

