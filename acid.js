const {events, Job} = require("libacid")

events.on("imagePush", (e, p) => {
  var name = "example-hello"
  var docker = JSON.parse(e.payload)
  var version = docker.push_data.tag || "dev"

  var helm = new Job("helm", "lachlanevenson/k8s-helm:latest")
  helm.tasks = [
    "helm upgrade --set tag=" + version + " --install " + name + " /src/charts/helm-hello"
  ]

  var slack = new Job("slack-notify", "technosophos/slack-notify:latest", ["/slack-notify"])

  helm.run().then( result => {
    slack.env = {
      SLACK_WEBHOOK: project.secrets.SLACK_WEBHOOK,
      SLACK_USERNAME: "AcidBot",
      SLACK_TITLE: ":helm: upgraded " + name,
      SLACK_MESSAGE: result.toString() + " <https://" + project.repo.name + ">",
      SLACK_COLOR: "#0000ff"
    }
    slack.run()
  })
})
