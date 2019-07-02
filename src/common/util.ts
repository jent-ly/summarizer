/*global chrome*/
export const displayStatus = (status: string) => {
    const floatTime = 3000;
    let statusToast = document.getElementById('statusDisplay');
    // @ts-ignore
    statusToast.textContent = status;
    // @ts-ignore
    statusToast.classList.remove('summ-toast-hidden');
    setTimeout(() => {
        // @ts-ignore
        statusToast.classList.add('summ-toast-hidden');
    }, floatTime);
};

export const addDomain = (domain: string) => {
    console.log('add domain', domain);
    chrome.storage.sync.get({
        summaryDomainWhitelist: []
    }, ({summaryDomainWhitelist}) => {
        let whitelist = new Set(summaryDomainWhitelist);
        whitelist.add(domain);
        chrome.storage.sync.set({
            // @ts-ignore - spread operator on Set
            summaryDomainWhitelist: [...whitelist]
        }, () => {
            // @ts-ignore - whitelistToggle shouldn't be null
            // display success
            displayStatus(`Added "${domain}". Refresh to see changes.`);
        });
    });
};

export const removeDomain = (domain: string) => {
    console.log('remove domain', domain);
    chrome.storage.sync.get({
        summaryDomainWhitelist: []
    }, ({summaryDomainWhitelist}) => {
        let whitelist = new Set(summaryDomainWhitelist);
        whitelist.delete(domain);
        chrome.storage.sync.set({
            // @ts-ignore - spread operator on Set
            summaryDomainWhitelist: [...whitelist]
        }, () => {
            // @ts-ignore - whitelistToggle shouldn't be null
            // display success
            displayStatus(`Removed "${domain}". Refresh to see changes.`);
        });
    });
};