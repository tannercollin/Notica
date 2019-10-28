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

### Self-hosting

Hosting Notica on your own server is extremely easy.
Clone this repository, change all notica.us URLs to your own domain, and then run `yarn install && yarn start`.

#### Usage

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

#### Reverse Proxy

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

Add SSL with certbot:

```
$ sudo apt install certbot python-certbot-nginx
$ sudo certbot --nginx
```

Or Apache:

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

Apache SSL is left as an exercise for the reader :)

#### Process Control

I recommend using `supervisor` to auto-start and keep Notica running.

```
$ sudo apt install supervisor
$ sudo adduser --disabled-login --gecos '' --shell /bin/false notica
$ sudo chown -R notica:notica /opt/Notica
```

Add to `/etc/supervisor/supervisord.conf` or its own file:

```
[program:notica]
user=notica
directory=/opt/Notica
command=node server.js
autorestart=true
stopasgroup=true
killasgroup=true
stderr_logfile=/var/log/notica.log
stderr_logfile_maxbytes=10MB
stdout_logfile=/var/log/notica.log
stdout_logfile_maxbytes=10MB
```

### Self-hosting with Docker

#### Build

```
docker build -t notica .
```

#### Run

```
docker run --rm -it -p 3000:3000 notica
```

#### With Traefik Reverse Proxy

```
docker run -d \
  --name notica \
  --restart unless-stopped \
  --label "traefik.enable=true" \
  --label "traefik.frontend.rule=Host:notica.example.com" \
  --label "traefik.port=3000" \
  --network traefik-network \
  -e TZ=Europe/London \
notica
```

## License

This program is free and open-source software licensed under the MIT License. Please see the `LICENSE` file for details.

That means you have the right to study, change, and distribute the software and source code to anyone and for any purpose. You deserve these rights. Please take advantage of them because I like pull requests and would love to see this code put to use.

## Acknowledgements

Thanks to welbert, damc-dev, scribblemaniac, and lukasmrtvy for their contributions.
