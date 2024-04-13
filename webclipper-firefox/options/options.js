/**
 * (C)2020 Kevin Sangeelee, released under the GNU GPLv2
 * https://gitlab.com/ksangeelee/send-tab-url/tree/master
 * See the above project for license terms.
 */


function getNameElement(idx) { return document.querySelector('#name' + idx) }
function getUrlElement(idx) { return document.querySelector('#url' + idx) }

/*
 * There are message <spans> under the URL box, and under the save button that
 * give feedback when the URL has been saved, or when it doesn't validate.
 */
function setMessage(message1) {
    document.querySelector('#message1').textContent = message1;
}

/**
 * Save handler. Called when we click the save button.
 */
document.querySelector('#save-button').addEventListener('click', function() {

    let options = [];
    let warning = '';

    for(let idx=0; idx < 3; idx++) {

        const nameElement = document.getElementById("name" + idx);
        const urlElement = document.getElementById("url" + idx);
        
        let name = nameElement.value;
        let url = urlElement.value;

        const config = { "name": name, "url": url };

        options.push( config );
        
        // If we have an enry without a {URL} tag, the warn about it.
        if( (name != '' || url != '') && !url.includes('{URL}')) {
            warning = 'Warning: check all URLs have a {URL} tag';
        }
    }

    browser.storage.local.set( {"targetUrls": options} )
    .then( () => {
        setMessage(warning == '' ? 'Saved' : 'Saved. ' + warning );
        setTimeout( function() { setMessage('') }, 5000);
    } );

});

window.onload = function() {

    console.log('options onload');

    /*
     * There are three input elements, one each for three possible target URLs.
     * The options HTML only defines one of these, and so the code below clones
     * it for the other two. Ultimately, this allows for easier editing and for
     * extending the number of possible link target URLs the extension supports.
     */

    // get the table and the reference row to clone.
    const table = document.getElementById("targetUrls");
    const row = document.getElementById("targetUrl0");
    const saveButtonRow = document.getElementById("save-button-row");

    for(let idx=1; idx < 3; idx++) {
        // Deep clone the node, and re-assign ids.
        const newRow = row.cloneNode(true);
        newRow.id = "targetUrl" + idx;
        newRow.querySelector("#name0").id = "name" + idx;
        newRow.querySelector("#url0").id = "url" + idx;
        // Insert the new row before the save-button row.
        saveButtonRow.insertAdjacentElement('beforebegin', newRow);
    }

    /*
     * Try to fetch the configuration from Extension Storage, and initialise
     * the value of each option's input elements if the configuration entry
     * looks valid.
     */
    browser.storage.local.get()
    .then( (config) => {

        console.log('onload config', config.targetUrls);

        if( Array.isArray(config.targetUrls) ) {

            for(let idx = 0; idx < 3; idx++) {
                let targetUrl = config.targetUrls[idx];
                getNameElement(idx).setAttribute('value', targetUrl.name);
                getUrlElement(idx).setAttribute('value', targetUrl.url);
            }
        }
        //if(config.targetUrls.includes('{URL}')) {
        //    getUrlElement().setAttribute('value', config.targetUrl);
        //}
    })
    .catch( console.log );

}

