# Garie ssllabs plugin

<p align="center">
  <p align="center">Tool to gather ssllabs metrics and supports CRON jobs.<p>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT"></a>
  </p>
</p>

**Highlights**

-   Poll for ssllabs performance metrics on any website and stores the data into InfluxDB
-   Generates web performance videos
-   View all historic reports.
-   Setup within minutes

## Overview of garie-ssllabs

Garie-ssllabs was developed as a plugin for the [Garie](https://github.com/boyney123/garie) Architecture.

[Garie](https://github.com/boyney123/garie) is an out the box web performance toolkit, and `garie-ssllabs` is a plugin that generates and stores ssllabs data into `InfluxDB`.

`Garie-ssllabs` can also be run outside the `Garie` environment and run as standalone.

If your interested in an out the box solution that supports multiple performance tools like `ssllabs`, `google-speed-insight` and `lighthouse` then checkout [Garie](https://github.com/boyney123/garie).

If you want to run `garie-ssllabs` standalone you can find out how below.

## Getting Started

### Prerequisites

-   Docker installed

### Running garie-ssllabs

You can get setup with the basics in a few minutes.

First clone the repo.

```sh
git clone git@github.com:eea/garie-ssllabs.git
```

Next setup you're config. Edit the `config.json` and add websites to the list.

```javascript
{
  "plugins":{
        "ssllabs":{
            "cron": "0 */4 * * *"
        }
    },
  "urls": [
    {
      "url": "https://www.eea.europa.eu/"
    },
    {
      "url": "https://biodiversity.europa.eu/"
    }
  ]
}
```

Once you finished edited your config, lets setup our environment.

```sh
docker-compose up
```

This will build your copy of `garie-ssllabs` and run the application.

On start garie-ssllabs will start to gather performance metrics for the websites added to the `config.json`.

## config.json

| Property | Type                | Description                                                                          |
| -------- | ------------------- | ------------------------------------------------------------------------------------ |
| `cron`   | `string` (optional) | Cron timer. Supports syntax can be found [here].(https://www.npmjs.com/package/cron) |
| `urls`   | `object` (required) | Config for ssllabs. More detail below                                            |

**urls object**

| Property | Type                | Description                         |
| -------- | ------------------- | ----------------------------------- |
| `url`    | `string` (required) | Url to get ssllabs metrics for. |
