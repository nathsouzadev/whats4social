# Whats4Social

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

## Create a post to Twitter and Bluesky

```bash
$ curl --location 'http://localhost:3005/api/social' \
--header 'Content-Type: application/json' \
--data '{
  "message": "My post from whats4social to Twitter and Bluesky"
}'
```

## Stay in touch

- Author - [Nathally Souza](https://linkedin.com/in/nathsouza)

## License

Nest is [MIT licensed](LICENSE).
