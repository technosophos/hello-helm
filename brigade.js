const {events, Job} = require("brigadier")

// Set to 2.5.1 b/c of ACS requirements
const helmTag = "v2.5.1"

events.on("imagePush", (e, p) => {
  var name = "example-hello"
  var docker = JSON.parse(e.payload)
  console.log(docker)

  if (docker.action != "push") {
    console.log(`ignoring action ${docker.action}`)
    return
  }

  var version = docker.target.tag || "latest"
  if (version == "latest") {
    console.log("ignoring 'latest'")
    return
  }

  var helm = new Job("helm", "lachlanevenson/k8s-helm:" + helmTag)
  helm.storage.enabled = false
  helm.tasks = [
    "ls /src",
    "helm upgrade --reuse-values --set tag=" + version + " --install " + name + " /src/chart/helm-hello"
  ]

  var slack = new Job("slack-notify", "technosophos/slack-notify:latest", ["/slack-notify"])

  helm.run().then( result => {
    slack.storage.enabled = false
    slack.env = {
      SLACK_WEBHOOK: p.secrets.SLACK_WEBHOOK,
      SLACK_USERNAME: "AcidBot",
      SLACK_TITLE: ":helm: upgraded " + name,
      SLACK_MESSAGE: result.toString(),
      SLACK_COLOR: "#0000ff"
    }
    slack.run()
  })
})
