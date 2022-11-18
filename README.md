![Build Health](https://github.com/mpaauw/grog/actions/workflows/build-and-test.yml/badge.svg)

# grog

A fully-functional, locally-run MTG API service.

## Setup
Grog is designed to enable quick setup and minimal-yet-extensive configuration.

To start, clone this repo onto your local machine, using HTTPS / SSH.

Next, navigate to your newly-cloned repo root, and run the following to build the project:

```
npm install --force
```

Once you've built the project, you need to build your local API routes:

```
npm run apiSetup
```

Next, jump to the `Environment` section below, and follow the instructions there to set up your local environment.

Once you've got your environment set up, you can go ahead and start the service directly:

```
npm run start
```

If you'd rather run the service in a containerized manner, or using some other configuration, read on.

### Environment
In order to support a wide no-code configuration, there are several important environment variables that can be set before running Grog for the first time.

Grog utilizes [dotenv](https://github.com/motdotla/dotenv#readme). Before running anything, be sure to have a `.env` file in the root of your project directory, and setup your local environment using the README found [here](env/README.md).

### Docker
Grog is designed specifically to be ran in a containerized environment via [Docker](https://www.docker.com/). 

To utilize this functionality, first ensure that you have [Docker Desktop](https://docs.docker.com/get-docker/) installed locally.

Once you have Docker installed, you should be able to immediately build and run the Grog Docker image. Navigate to your repo root and run the following:

```
docker-compose up
```

...and you're good! The compose command should take a few minutes to build during a cold start, but once the image is built, startup should be much faster. The following logs in your `docker-compose` window should indicate that Grog is ready and healthy to accept requests:

```
grog-grog-1 | [2022-11-18T18:44:07.198Z] [] info: Successfully initialized Cache Service.
grog-grog-1 | [2022-11-18T18:44:25.262Z] [] info: Successfully initialized Database Service.
grog-grog-1 | [2022-11-18T18:44:25.264Z] [] info: Grog API is running on port: 3000
```

Note that startup dependencies are spun-up asynchronously, so the logs on your machine may or may not appear in this same order.

## Usage
Once you've set up your environment and built your project / image, you should be good to start using Grog!

Try the sample request to retrieve card data on `Phyrexian Hulk`, as an example (replacing the domain / port with your specific environment values, if they differ from the defaults):

```
curl --location --request GET 'localhost:3000/v1/card/Phyrexian Hulk'
```

Running the above curl command, you should get back the following (response truncated due to save space!):

```
{
    "_type": "grogData",
    "data": {
        "object": "card",
        "id": "304bc0a2-0cf4-4609-a0fc-de933402c64a",
        <...>,
        "name": "Phyrexian Hulk",
        "lang": "en",
        "released_at": "2015-05-06",
        "uri": "https://api.scryfall.com/cards/304bc0a2-0cf4-4609-a0fc-de933402c64a",
        <...>,
        "mana_cost": "{6}",
        <...>,
        "type_line": "Artifact Creature — Phyrexian Golem",
        <...>,
        "power": "5",
        "toughness": "4",
        "colors": [],
        <...>,
        "set_name": "Tempest Remastered",
        "rarity": "uncommon",
        <...>,
        "flavor_text": "\"They are convenient in having no souls, but less so in having no spirit.\"\n—Volrath",
        "card_back_id": "0aeebaf5-8c7d-4636-9e82-8c27447861f7",
        "artist": "Matthew D. Wilson",
        <...>
    },
    "dataSource": "scryfall",
    "id": "287e2f25-7431-4f45-8ad7-b3e00486bd50",
    "version": "card.v1"
}
```

## Dependencies

### HTTP
Grog uses [Express](https://expressjs.com/) for it's HTTP server, and [tsoa](https://github.com/lukeautry/tsoa) to define strict API endpoint contracts.

### Database
[Couchbase](https://www.couchbase.com/) is used for Grog's persistent NoSQL Document-based store.

### Cache
[Redis Stack](https://redis.io/docs/stack/) is used as a quick-and-easy Caching solution layer on top of Couchbase.

### Computer Vision
[Tesseract.js](https://tesseract.projectnaptha.com/) is utilized for Image-to-text calculations.

## Misc
It should be noted that Grog uses a caching mechanism for it's APIs. This means that when an object (i.e., Card) is queried initially, latency may be increased. However, once the object has been retrieved, it is cached (for a 1-hour default period), and subsequent queries are much faster.

Currently, Grog utilizes [Scryfall](https://scryfall.com/) for it's default card database.

### Run Tests

After you've built the npm project and API routes, you can run tests by executing:

```
npm run test
```
