let selectedTabId;

selectedTabId = -1;

chrome.tabs.onSelectionChanged.addListener(function (tabId, props) {
    selectedTabId = tabId;
});

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    selectedTabId = tabs[0].id;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //chrome.browserAction.setBadgeText({"text": 'OK', "tabId": selectedTabId});

    if (request.msg === 'active_icon') {
        chrome.browserAction.setIcon({
            path: {
                19: 'icon-active-19.png',
                38: 'icon-active-38.png'
            },
            tabId: sender.tab.id
        });

        sendResponse({'msg': true});
    }

    // Inject CSS/JS Files as Requested
    if (request.msg === 'file_injected') {
        let file;

        file = chrome.extension.getURL(request.file);

        chrome.tabs.insertCSS(sender.tab.id, {'file': request.file}, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
            } else {
                console.log(request.file + ' file has been injected!');
            }
        });
    }
});