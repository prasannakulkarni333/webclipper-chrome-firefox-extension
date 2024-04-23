/**
 * (C)2020 Kevin Sangeelee, released under the GNU GPLv2
 * https://gitlab.com/ksangeelee/send-tab-url/tree/master
 * See the above project for license terms.
 */

/*
 * If no target URL exists in storage, then create a default
 * configuration in storage.
 */
let defaultUrl = "http://127.0.0.1"

window.onload = (() => {

    const defaultUrls = [
        { name: 'send to save to reading', url: '{defaultUrl}?url={URL}&mangoblogger_points=5&tags=toread&status=toread' },
        { name: 'star the page', url: '{defaultUrl}?url={URL}&mangoblogger_points=5' },

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
// let api_key = browser.cookies.get({ url: "https://mangoblogger.com", name: "API_KEY" });


function getCookies() {

    let cookies2 = browser.cookies.getAll({ url: "https://mangoblogger.com" }).then((cookies) => {
        console.log("loggong cookies", cookies);

    });

    let cookies3 = browser.cookies.getAll({ url: "http://127.0.0.1" }).then((cookies2) => {
        console.log("loggong cookies", cookies2);

    });
    browser.cookies.get({ name: ".mangoblogger.com", url: "https://mangoblogger.com" }).then((cookies) => {
        console.log("loggong cookies et", cookies);

    });
}

getCookies();



function messageElement() {
    return document.querySelector("#message-content");
}

function AutoSentCurrentTabUrl(tabUrl, pageTitle, customUrl) {

    let targetUrl = customUrl;
    console.error('Sending: ', tabUrl, 'via', targetUrl);

    let requestUrl = targetUrl
        .replace('{TITLE}', encodeURIComponent(pageTitle))
        .replace('{URL}', encodeURIComponent(tabUrl));

    var apiKey;
    browser.storage.local.get("apiKey").then(data => {
        apiKey = data.apiKey;
        let requestData = {
            "taburl" : tabUrl,
            "api_key" : apiKey,
            "title" : pageTitle,
            "association" : "Pages Visited"
        }

        fetch(requestUrl,
            {
                method: 'POST',
                mode: 'no-cors', // no-cors, *cors, same-origin. See Request.mode
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
browser.webNavigation.onCompleted.addListener((details) => {

    function getCookies() {

        let cookies2 = browser.cookies.getAll({ url: "{defaultUrl}" }).then((cookies) => {
            console.log("loggong cookies", cookies);

        });
    }

    getCookies();

    let openUrl = details.url;

    const url = new URL(openUrl);
    //console.log(url);
    console.log('tab details ', details);
    url.hash = '';
    url.password = '';
    url.username = '';
    sanitisedUrl = url.href;
    let pageTitle = details.title;

    browser.tabs.query({ currentWindow: true }, function (tabs) {


    });
    console.error('sanitisedUrl ', sanitisedUrl);
    console.log('pageTitle asdfasdf', pageTitle,);
    AutoSentCurrentTabUrl(sanitisedUrl, pageTitle, `${defaultUrl}?page={URL}&API_KEY={api-key}`);
});






