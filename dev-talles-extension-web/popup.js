document.getElementById('activate').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        if (currentTab) {
            const currentTabDomain = new URL(currentTab.url).origin;
            chrome.storage.local.set({ 'selectedDomain': currentTabDomain }, () => {
                chrome.runtime.sendMessage({ action: "activate_listener", url: currentTab.url });
            });
        }
    });
});

document.getElementById('showUrls').addEventListener('click', function () {
    chrome.storage.local.get('capturedUrls', (data) => {
        const urlListDiv = document.getElementById('urlList');
        urlListDiv.innerHTML = '';
        const capturedUrls = data.capturedUrls || [];
        capturedUrls.forEach(url => {
            const urlDiv = document.createElement('div');
            const lastPartOfUrl = url.split('/').pop();
            urlDiv.textContent = lastPartOfUrl;
            urlListDiv.appendChild(urlDiv);
        });
    });
});

document.getElementById('clearUrls').addEventListener('click', function () {
    document.getElementById('urlList').innerHTML = '';
});

document.getElementById('download').addEventListener('click', function () {
    chrome.storage.local.get('capturedUrls', (data) => {
        const capturedUrls = data.capturedUrls || [];
        let delay = 0;
        capturedUrls.forEach(url => {
            setTimeout(() => forceDownload(url), delay);
            delay += 500;
        });
    });
});

// document.getElementById('send').addEventListener('click', function () {
//     chrome.storage.local.get('capturedUrls', (data) => {
//         const capturedUrls = data.capturedUrls || [];


//         sendUrlsToDownload(nameVideo, capturedUrls)
//     });
// });

document.getElementById('send').addEventListener('click', function () {
    chrome.storage.local.get('capturedUrls', (data) => {
        const capturedUrls = data.capturedUrls || [];

        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            const url = tabs[0].url;
            const nameVideo = url.substring(url.lastIndexOf('/') + 1);

            sendUrlsToDownload(nameVideo, capturedUrls);
        });
    });
});


function forceDownload(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function sendUrlsToDownload(nameVideo, UrlArray) {
    const requestData = {
        nameVideo: nameVideo,
        UrlArray: UrlArray
    };
    fetch('http://localhost:3000/download/files', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestData })
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error));
}
