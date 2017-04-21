# Notica
Send browser notifications from your terminal. No installation. No registration.

https://notica.us/

## Usage

Notica is a Bash function / alias that sends a notification to a tab in your browser when it's ran:

```
$ long-running-command; notica Finished!
```

This will wait until the first command completes before running Notica.
That way you can go do other things while your long task runs.
Then you will recieve a notification on any devices that have the Notica website open.

![Notification Example gif](https://i.imgur.com/476ezFy.gif)

## Setup

Please follow the instructions on the Notica home page since they are generated specific to you:

https://notica.us/

## Source Code

### License

Notica is free and open-source software released under the MIT License.

### Self-hosting

Hosting Notica on your own server is extremely easy.
Clone this repository, change all notica.us URLs to your own domain, and then run `npm install && npm start`.
You can connect to it directly or through a reverse proxy.

### Usage

```

Usage: npm start -- [options]
(After npm run build) Usage: node server.js [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -p, --port <3000>       Port to host
    -H, --host <127.0.0.1>  Ip to host
    -u, --url <path>        If this parameter is blank, will be use random id as
 url path

  Examples:

    $ npm start -- -p 80
    $ npm start -- -p 8080 -u notification

```
