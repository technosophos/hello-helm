const {events, Job} = require("libacid")

// Set to 2.5.1 b/c of ACS requirements
const helmTag = "v2.5.1"

events.on("imagePush", (e, p) => {
  var name = "example-hello"
  var docker = JSON.parse(e.payload)
  var version = docker.push_data.tag || "dev"

  var helm = new Job("helm", "lachlanevenson/k8s-helm:" + helmTag)
  helm.tasks = [
    "helm upgrade --set tag=" + version + " --install " + name + " /src/charts/helm-hello"
  ]

  var slack = new Job("slack-notify", "technosophos/slack-notify:latest", ["/slack-notify"])

  helm.run().then( result => {
    slack.env = {
      SLACK_WEBHOOK: project.secrets.SLACK_WEBHOOK,
      SLACK_USERNAME: "AcidBot",
      SLACK_TITLE: ":helm: upgraded " + name,
      SLACK_MESSAGE: result.toString(),
      SLACK_COLOR: "#0000ff"
    }
    slack.run()
  })
})
