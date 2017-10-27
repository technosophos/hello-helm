# Hello Helm

This is a simple demo of an ACR webhook to automatically upgrade a Helm chart. The
`brigade.js` is configured to upgrae a Helm release every time the specified
Docker image is upgraded in an Azure Container Registry (ACR).

_This is not production quailty. It is a demo._

To use this demo, you will need to point it to your own ACR repository.
To do this, you will need to edit the registry in the following places:

- Makefile
- charts/values.yaml

Then you will need to configure your ACR to trigger a webhook on each push
event.

**Note:** With a little bit of modification to the `brigade.js`, you can also
use this for DockerHub webhooks.

## Prerequisites

- Helm and Brigade must be installed on your cluster
- Your cluster must have a routable IP attached to the `brigade-gw` service
- You must have an ACR created with type `Managed`
- You need a clone of this repository
- You need to configure a Slack incomming webhook. See [Slack-Notify](https://github.com/technosophos/slack-notify)

## Configuring ACR

You can either use the `az acr webhook` tool or use the `webhooks` panel in the
Container Registry section of the Azure portal. You must configure the webhook
to point to the Brigade gateway.

To get the external IP of the gateway, do:

```
$ kubectl get svc | brigade-gw
```

Set up your webhook to use `http://<IP>:7744/events/dockerhub/<Project Name>/<Commit>.`

- The IP is the gateway IP from the command above (or a DNS address, if you set one up)
- Project name is the _name of your Brigade project_ (`foo/bar`)
- Commit is the commit/branch/repo in the repo you want to use to fetch the brigade.js from, usually `master`

So if project name is `technosophos/hello-helm`, and the host is `example.com`, then
the URL would be something like:

```
http://example.com:7744/events/dockerhub/technosophos/hello-helm/master
```

## Configuring your Brigade project

If this is the first time you have used the Slack Notifier webhook, you need to add
the Slack incomming webhook URL to your project.

Typically, you will want to edit the project's `values.yaml` overrides. But here's how to do it
from the Helm commandline:

```console
$ helm upgrade myproject brigade/brigade-project --set secrets.SLACK_WEBHOOK=https://rest/of/url
```

## How it works

- `make docker-build docker-push` pushes a new image
- ACR responds to the push by calling the webhook
- The webhook triggers a brigade event
- The brigade event handler causes Helm to upgrade the chart with the new label

You can update the new build by running:

```
$ VERSION=0.1.2 make docker-build docker-push
```

The above will create a new tag for the image (`0.1.2`), which will trigger a
new `helm upgrade`.
