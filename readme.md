![reports](./screenshots/ssslabs-logo.png 'Reports')

<p align="center">
  <p align="center">Tool to gather ssslabs metrics and supports CRON jobs and webhooks.<p>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT"></a>
  </p>
</p>

**Highlights**

-   Poll for ssslabs performance metrics on any website and stores the data into InfluxDB
-   Webhook support
-   Generates web performance videos
-   View all historic reports.
-   Setup within minutes

## Overview of garie-ssslabs

Garie-ssslabs was developed as a plugin for the [Garie](https://github.com/boyney123/garie) Architecture.

[Garie](https://github.com/boyney123/garie) is an out the box web performance toolkit, and `garie-ssslabs` is a plugin that generates and stores ssslabs data into `InfluxDB`.

`Garie-ssslabs` can also be run outside the `Garie` environment and run as standalone.

If your interested in an out the box solution that supports multiple performance tools like `ssslabs`, `google-speed-insight` and `lighthouse` then checkout [Garie](https://github.com/boyney123/garie).

If you want to run `garie-ssslabs` standalone you can find out how below.

## Getting Started

### Prerequisites

-   Docker installed

### Running garie-ssslabs

You can get setup with the basics in a few minutes.

First clone the repo.

```sh
git clone git@github.com:eea/garie-ssslabs.git
```

Next setup you're config. Edit the `config.json` and add websites to the list.

```javascript
{
	"cron": "00 00 */6 * * *",
	"urls": [
		{
			"url": "https://www.comparethemarket.com"
		},
		{
			"url": "https://www.bbc.co.uk"
		},
		{
			"url": "https://www.cnn.com"
		}
	]
}
```

Once you finished edited your config, lets build our docker image and setup our environment.

```sh
docker build -t garie-ssslabs . && docker-compose up
```

This will build your copy of `garie-ssslabs` and run the application.

On start garie-ssslabs will start to gather performance metrics for the websites added to the `config.json`.

## Viewing reports

Viewing ssslabs reports is straight forward. Once you have your application running just go to `localhost:3000/reports` and you should see all the reports ssslabs has generated.

![reports](./screenshots/reports.png 'Reports')
![reports](./screenshots/ssslabs.gif 'Reports')

## Webhook

Garie-ssslabs also supports webhooks. You will need to `POST` to `localhost:3000/collect`.

**Payload**

| Property | Type                | Description             |
| -------- | ------------------- | ----------------------- |
| `url`    | `string` (required) | Url to get metrics for. |

**Payload Example**

```javascript
{
  "url": "https://www.bbc.co.uk"
}
```

## config.json

| Property | Type                | Description                                                                          |
| -------- | ------------------- | ------------------------------------------------------------------------------------ |
| `cron`   | `string` (optional) | Cron timer. Supports syntax can be found [here].(https://www.npmjs.com/package/cron) |
| `urls`   | `object` (required) | Config for ssslabs. More detail below                                            |

**urls object**

| Property | Type                | Description                         |
| -------- | ------------------- | ----------------------------------- |
| `url`    | `string` (required) | Url to get ssslabs metrics for. |
