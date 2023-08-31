let detectedDomains = new Set();

function isValidUrl(urlString) {
    try {
        new URL(urlString);
        return true;
    } catch (_) {
        return false;
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        chrome.storage.local.get(['selectedDomain', 'currentTabUrl'], (data) => {
            const selectedDomain = data.selectedDomain;
            if (details.initiator === selectedDomain && details.url.includes('videoproxy')) {
                console.log(details)
                const urlObject = new URL(details.url);
                const proxyDomain = urlObject.protocol + "//" + urlObject.hostname;
                console.log(proxyDomain)
                chrome.storage.local.set({ 'proxyDomain': proxyDomain });
            }

        });
    },
    { urls: ["<all_urls>"] }
);

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        chrome.storage.local.get(['proxyDomain', 'capturedUrls'], (data) => {
            const proxyDomain = data.proxyDomain;
            if (details.initiator === proxyDomain && details.url.endsWith('.ts')) {
                console.log(details)
                console.log(details.url)
                const capturedUrls = data.capturedUrls || [];
                capturedUrls.push(details.url);
                chrome.storage.local.set({ 'capturedUrls': capturedUrls });
            }
        });
    },
    { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "activate_listener") {
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        chrome.storage.local.get('selectedDomain', (data) => {
            const selectedDomain = data.selectedDomain;
            if (selectedDomain && new URL(tab.url).origin === selectedDomain) {
                const actualTab = new URL(tab.url).href
                chrome.storage.local.set({ 'actualTab': actualTab });
                chrome.storage.local.remove('capturedUrls');
            }
        });
    }
});
