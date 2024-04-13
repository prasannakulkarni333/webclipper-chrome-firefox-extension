# thanks to https://gitlab.com/ksangeelee/send-tab-url

### Firefox extension - send the current tab's URL as a GET request to a server.

#### TL;DR
The send-tab-url extension adds a button to Firefox that, when clicked, sends
the current tab's URL and page title to a server that you configure in the
extension's preferences.

#### A bit more detail
This was written as part of the Commerce Filtered Search initiative to record
the URLs of high-quality or otherwise interesting web pages, and by default this
extension logs the URLs to my server.

(See https://www.susa.net/wordpress/random/cfs-commerce-filtered-search/ for more
details, though note that the add-on can be used as a generic link-sender, that is,
it can be configured to send to your own logging server instead.)

All URLs submitted will be made available as a public download, the idea being
that people can create directories or search indexes from those URLs, and use
them as a starting point to discover other quality content.

My personal proxy for 'quality content' is to look at how many requsts get
blocked by uBlock Origin. The lower the number, the higher the quality. If you
want to participate, please only send sincerely created interesting stuff, no
click-bait and mainstream news articles, etc.

Alternatively, if you want to send tab URLs to your own server, just configure
your own URL in the Add-ons Preferences, and the extension will send there
instead.

The code has been kept to an absolute minimum so as to be easily auditable.
There's very little to it, you can easily unzip the .xpi file to verify that it
matches the code in this repository.

This project is released under the GNU GPLv2, except the 'tag-plus-outline' icon
which is by Michael Richins (@MrGrigri), available from Material Design Icons at
https://materialdesignicons.com/ Used here with thanks!

#### Using with the Linkalot server

Linkalot is a basic but functional free-software server written in PHP that can
be used as a repository for URLs, and offers a simple user-inferface to list
and edit the URLs that you submit. An example of the URL format you can
configure in the addon's preferences is shown below.

```https://127.0.0.1/linkalot/?url={URL}&txt={TITLE}&key=SECRET```

See https://gitlab.com/dmpop/linkalot for more information and installation
instructions.

#### My server code that receives URLs
The following example shows PHP code that receives a request from the add-on and
writes the given URL to a SQLite database (or alternatively, just a plain-text
file).

Make sure the web server process (e.g. the www-data user) has permission to write
the db or txt file.

Since the add-on allows you to configure your target URL however you want, none
of this is mandatory. Any handler that processes a GET request can be used.

```
<?php

// CORS policy - allow any page that we submit to read our response.
header('Access-Control-Allow-Origin: *');

/*
 * store_url.php
 */

class UrlDB extends SQLite3
{
    function __construct() {
        $this->open('/opt/url_logger/url_store.db');
        $this->exec('create table if not exists urls(' .
            'url text unique, status integer)');
    }
}

if(isset($_REQUEST['p'])) {

    $url = $_REQUEST['p'];

    $db = new UrlDB();

    $statement = $db->prepare("insert or ignore into urls(url) values(:url)");
    $statement->bindValue(':url', $url);
    $statement->execute();

    $db->close();

    echo "OK: $url";

    // Alternatively, forget the database and just log to a text file.
    // file_put_contents('/opt/url_logger/interesting_urls.txt', "{$url}\n", FILE_APPEND);
}
?>
```
