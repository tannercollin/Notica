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
Clone this repository, change all notica.us URLs to your own domain, and then run `yarn install && yarn start`.

### Usage

```text
Usage: yarn start [options]

  Options:

    -V, --version         output the version number
    -p, --port <port>     Host port (3000)
    -H, --host <IP>       Host IP (127.0.0.1)
    -U, --url <URL>       Website URL (https://notica.us)
    -t, --title <string>  Custom title ('Notification from Notica')
    -i, --icon <path>     Custom icon (img/icon.png)
    -h, --help            output usage information

  Example:

    $ yarn start -p 1234 -t 'My cool Title'
```

### Reverse Proxy

For security, it is recommended to run Notica behind a reverse proxy as a separate non-privileged user.

Here's a sample nginx reverse proxy config:

```
server {
    listen 80;
    listen [::]:80;

    root /var/www/html;
    index index.html index.htm;

    server_name notica.us;

    location / {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

And Apache:

```
<VirtualHost *:80>
    ServerName notica.us

    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
    ProxyPreserveHost On

    ErrorLog ${APACHE_LOG_DIR}/notica-error.log
    CustomLog ${APACHE_LOG_DIR}/notica-access.log combined
</VirtualHost>
```

SSL is left as an exercise for the reader :)
