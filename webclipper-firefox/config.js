
let defaultUrl = "https://mangoblogger.com/accounts/profile/api/"
// let defaultUrl = "http://127.0.0.1:8000/accounts/profile/api/"

window.onload = (() => {

    const defaultUrls = [
        { name: 'Save for reading later', url: `${defaultUrl}?url={URL}&mangoblogger_points=5&association_type=toread` },
        { name: 'Star the page', url: `${defaultUrl}?url={URL}&association_type=starred` },
    ];

    let options = { targetUrls: defaultUrls };

    browser.storage.local.get()
        .then((config) => {

            // Old single target config? Then convert to multi-target
            if (config.hasOwnProperty('targetUrl')) {
                defaultUrls[0] = { name: 'Default', url: config.targetUrl };
                defaultUrls[1] = { name: '', url: '' };
                defaultUrls[2] = { name: '', url: '' };
            }

            // Remove the existing configuration item.
            browser.storage.local.remove('targetUrl');

            // Do we have the new (array) config type? Then assign them, else initialise.
            if (config.hasOwnProperty('targetUrls') && Array.isArray(config.targetUrls))
                options.targetUrls = config.targetUrls;
            else {
                browser.storage.local.set(options);
            }
        })
        .catch(console.log);
});

let targetUrls;
let targetUrl = 'Undefined';
let sanitisedUrl;


function messageElement() {
    return document.querySelector("#message-content");
}

function AutoSentCurrentTabUrl(tabUrl, pageTitle, targetUrl) {
    var apiKey;
    browser.storage.local.get("apiKey").then(data => {
        apiKey = data.apiKey;
        let requestData = {
            "page": tabUrl,
            "API_KEY": apiKey,
            "title": pageTitle,
            "association": "Pages Visited"
        }
        let requestUrl = targetUrl
            .replace('{TITLE}', encodeURIComponent(pageTitle))
            .replace('{URL}', encodeURIComponent(tabUrl))
            .replace('{api-key}', encodeURIComponent(apiKey));

        console.error('Sending: ', tabUrl, 'via', requestUrl, 'with', requestData.API_KEY, 'and', requestData.title);
        fetch(requestUrl,
            {
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin. See Request.mode
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'omit', // include, *same-origin, omit
                body: JSON.stringify(requestData)
            }
        )
            .then((response) => {

                console.log('Response: ', response);
            })
            .catch((err) => {
                //  messageElement().innerText = 'Failed to send. ' + err;
                console.log('Error: ', err)
            });

    }).catch(error => {
        console.error("Error retrieving data:", error);
    });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        let openUrl = tab.url;
        const url = new URL(openUrl);
        url.hash = '';
        url.password = '';
        url.username = '';
        taburl = url.href;
        let pageTitle = tab.title;
        AutoSentCurrentTabUrl(taburl, pageTitle, `${defaultUrl}?page={URL}&API_KEY={api-key}`);
    }
});

// browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
//     if (temporary) return; // skip during development
//     switch (reason) {
//         case "install":
//             {
//                 const url = browser.runtime.getURL("views/installed.html");
//                 await browser.tabs.create({ url });
//                 // or: await browser.windows.create({ url, type: "popup", height: 600, width: 600, });
//             }
//             break;
//         // see below
//     }
// });



