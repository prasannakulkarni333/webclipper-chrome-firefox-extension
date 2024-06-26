
let targetUrls;
let targetUrl = 'Undefined';
let sanitisedUrl;
const apiDataDiv = document.getElementById("api__data_div")
const resetApiBtn = document.getElementById("id_reset_api")
console.log('send_tab_url.js loaded');


function messageElement() {
    return document.querySelector("#message-content");
}

function sendCurrentTabUrl(tabUrl, pageTitle, button) {

    let targetUrl = button.dataset.url;
    console.log('Sending the tab: ', tabUrl, 'via', targetUrl);

    /*
     * Make a request to send the URL. Server should support CORS (i.e.
     * include response header Access-Control-Allow-Origin), otherwise firefox
     * prevents our code from accessing the response.
     */

    messageElement().classList.remove("hidden");
    messageElement().innerText = "Sending...";

    button.setAttribute('disabled', true);

    /*
     * The targetUrl is the template that's used in the GET request
     * to the target server. The tokens {URL} and {TITLE} will be
     * replaced by the URL and title of the tab. The values MUST
     * be encoded.
     * https://stackoverflow.com/questions/12893981/logging-to-console-from-firefox-extension
     */
    let requestUrl = targetUrl
        .replace('{TITLE}', encodeURIComponent(pageTitle))
        .replace('{URL}', encodeURIComponent(tabUrl));


    fetch(requestUrl,
        {
            method: 'POST',
            mode: 'no-cors', // no-cors, *cors, same-origin. See Request.mode
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'omit', // include, *same-origin, omit
        }
    )
        .then((response) => {
            if (response.status === 200) {
                messageElement().innerText = "URL was sent successfully.";
                document.querySelector("#popup-content").classList.add('fadeout');
                setTimeout(function () {
                    document.querySelector("#popup-content").classList.add("hidden");
                    messageElement().innerHTML = "<h1>Thanks!</h1>";
                    setTimeout(function () { window.close() }, 2300);
                }, 1200);
            } else {
                throw 'Server responded with a failure (' + response.status + ')';
            }
        })
        .catch((err) => {
            messageElement().innerText = 'Failed to send. ' + err;
            console.log('Error: ', err)
        });
}
function listenForClicks() {

    document.addEventListener("click", (e) => {

        /**
         * Check the event came from a button, then call sendCurrentTabUrl()
         */
        if (e.target.classList.contains("button")) {

            let pageTitle = document.querySelector("#title").value;

            sendCurrentTabUrl(sanitisedUrl, pageTitle, e.target);
        }

    });
}


browser.tabs.query({
    currentWindow: true,
    active: true
})
    .then((tabs) => {
        let tab = tabs[0];
        console.log(tab);

        const url = new URL(tab.url);
        //console.log(url);

        url.hash = '';
        url.password = '';
        url.username = '';
        sanitisedUrl = url.href;

        console.log('Sanitised: ', sanitisedUrl);
        document.querySelector("#url").innerText = sanitisedUrl;

        document.querySelector("#title").value = tab.title;

        // If we have a valid URL, then listen for clicks
        listenForClicks();
    })
    .catch(console.log);

document.addEventListener("DOMContentLoaded", function () {
    var submitButton = document.getElementById("id_api_btn");
    var apiInput = document.getElementById("id_api");
    var statusDiv = document.getElementById("id_api_status");

    // check if api data exist
    browser.storage.local.get("apiKey").then(data => {
        if (data.apiKey == null) {
            apiDataDiv.style.display = "block"
        } else {
            apiDataDiv.style.display = "none"
        }
    })

    resetApiBtn.addEventListener("click", function () {
        // Remove apiKey data
        browser.storage.local.remove("apiKey")
            .then(() => {
                apiDataDiv.style.display = "block"
                statusDiv.textContent = "API Key Reset!";
            })
            .catch(error => {
                console.error('Error removing data:', error);
            });
    })
    submitButton.addEventListener("click", function () {
        var apiValue = apiInput.value;

        // Store user data
        browser.storage.local.set({ "apiKey": apiValue }).then(() => {
            statusDiv.textContent = "Data saved!";
            apiInput.value = ""
            apiDataDiv.style.display = "none"
            // close popup after 3 secs
            setTimeout(function () {
                window.close()
            }, 3000);
        }).catch(error => {
            statusDiv.textContent = "Error saving data: " + error.message;
        });
    });
});
