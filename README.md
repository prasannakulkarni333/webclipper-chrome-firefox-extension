# webclipper-chrome-firefox-extension
 Send your current tab URL to an address

 # Functionality and background
1. This add-on saves all the tab URLs visited by the user to mangoblogger.com. 
2. User can also star the current page and save it to mangoblogger.com
3. User can also save the current page to mangoblogger.com with association "ToRead"
4. Once the user logs in to mangoblogger.com/accounts/profile the API_KEY will be set in the browser cookie
5. User can reset the app settings to default and wipe any cookies used from mangblogger.com
6. Users can change the default URL in the options page
7. One tab of the extension will pull the current tab page from https://mangoblogger.com/webpages/?url={taburl} and display the response in the popup in key value pairs 

Requirements

## Login and Authorization

On clicking the extension icon, there will be two tabs.
### Tab 1
1. After installing the add-on and clicking on toolbar icon, user will be asked to go to https://mangoblogger.com/accounts/profile
2. Once the user access this page and cookie will be set in the browser for mangoblogger.com with api_key set to the user's api key
3. After clicking on the toolbar icon, now the user will be able to **save the current tab URL to the {address}** with below parameters
    - `taburl` : current tab URL
    - `api_key` : user's api key
    - `title` : title of the page
    - `association` : "ToRead"
  
and **star the current page with below parameters**

    - `taburl` : current tab URL
    - `api_key` : user's api key
    - `title` : title of the page
    - `association` : "Starred"

4. In the background the extension will send a POST request to the address with the the each taburl, below parameters
    - `taburl` : current tab URL
    - `api_key` : user's api key
    - `title` : title of the page
    - `association` : "Pages Visited"
### Tab 2
1. The second tab will pull the current tab page from https://mangoblogger.com/webpages/?url={taburl} and display the response in the popup in key value pairs

# Settings
1. User can set the default address in settings
default address is https://mangoblogger.com/accounts/profile?page={taburl}&api_key={api_key}&title={title}&association={association}


# Reset Settings and authroizazation
1. User can reset the settings to default and wipe any cookies used from mangblogger.com by clicking on the reset settings button in the options page
