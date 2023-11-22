# mal-list-sonarr

This is a fork of screeny05/letterboxd-list-radarr.

Connect sonarr to myanimelist.net plan to watch anime lists

## Usage

This service is hosted on render. That way you don't have to run the service yourself (but you can, see below).

### Sonarr v3 and up

1. Configure a new list in sonarr, using the _Custom Lists_ provider.
2. Set _List URL_ to `https://mal-list-sonarr.onrender.com` followed by the path to your list in letterboxd. For example: `https://mal-list-sonarr.onrender.com/animelist/bonafideterran/`
3. Configure the rest of the settings to your liking
4. Test & Save.

If there are any problems with v3, feel free to open an issue.

### Supported Lists:

-   Plan to watch: https://myanimelist.net<b>/animelist/<username></b>

ex:

Others may be supported, but are not tested, yet.

## FAQ

## Self-hosting

### Using render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

It might take a few minutes after deploying to render, before the instance becomes available.

Be aware that render currently has a [free limit](https://render.com/docs/free) of 750h/month. That's exactly enough to run this single service for the whole month.

### Using docker

#### Pre-built docker-image

You will get the newest image by pulling `DiegoFleitas/mal-list-sonarr:latest`. The image is available for both x86-64 and arm64.

Here is an example of how to use the image with docker-compose:

```
version: "3.8"
services:
    web:
        image: DiegoFleitas/mal-list-sonarr:latest
        ports:
            - 5000:5000
        environment:
            - REDIS_URL=redis://redis:6379
        depends_on:
            - redis
    redis:
        image: redis:6.0
```

For optimal configuration of redis, please check out the [redis.conf](redis.conf) file in this repository.

#### Building it yourself

```
git clone git@github.com:DiegoFleitas/mal-list-sonarr.git
cd mal-list-sonarr
npm install
docker-compose up -d
```

The file redis.conf can be used to configure your own settings for redis. It comes with a memory-limit of 256mb by default. You might want to increase that based on your usage.

Your local instance will be available on port 5000 `http://localhost:5000`

### Local & development

You need a working redis-instance, which is used for caching movie- & list-data.

Following environment-params are supported:

-   `REDIS_URL` - A [redis connection string](https://github.com/ServiceStack/ServiceStack.Redis#redis-connection-strings) to your redis-instance
-   `PORT` - The http-port which the application listens on
-   `LOG_LEVEL` - Set to `debug` for more info. Defaults to `info`
-   `USER_AGENT` - Allows you to set your own user-agent string

1. Clone this repo
2. Make sure you have configured the env-variables
3. `npm install`
4. `npm start`
