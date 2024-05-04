# Whats4Social

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v3/monitor/16724.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

## Description

Provide integration with Bluesky, Twitter and Whatsapp

Post on social media sending message with Whatsapp

## Getting started

1 - Provide .env with api keys and secrets as exemplified by the .env.example file from your account to use WhatsApp Business API, Twitter API and BlueSky API.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Routes available

```bash
$ localhost:3000/api
```

## Healthcheck

```bash
$ localhost:3000/api/health
```

## Create a post to Twitter and Bluesky

```bash
$ curl --location 'http://localhost:3000/api/social' \
--header 'Content-Type: application/json' \
--data '{
  "message": "My post from whats4social to Twitter and Bluesky"
}'
```

## Stay in touch

- Author - [Nathally Souza](https://linkedin.com/in/nathsouza)

## License

Nest is [MIT licensed](LICENSE).

### The first post with service

<img src="https://media.licdn.com/dms/image/D4D22AQGi31vzH3xE9A/feedshare-shrink_1280/0/1714823898152?e=1717632000&v=beta&t=frIGz6iD60Cll879JJht6u1CCypA3IcMZ5PkJLjdErQ" alt="Post enviado pelo Whatsapp" style="width:300px;"/>

<img src="https://media.licdn.com/dms/image/D4D22AQFuKih4Kh7DlA/feedshare-shrink_1280/0/1714823897943?e=1717632000&v=beta&t=mAhW-cWjAG2yd_BKL4YNtSGSIs4m6EcabRK6SgSwT-I" alt="Post publicado no Twitter" style="width:400px;"/>

<img src="https://media.licdn.com/dms/image/D4D22AQHwEgVpWt-Njw/feedshare-shrink_1280/0/1714823897920?e=1717632000&v=beta&t=NJA-lv2ZbFY8Ae3isROx670_afmrhRDnaF9tyIDgVz8" alt="Post publicado no Bluesky" style="width:400px;"/>
