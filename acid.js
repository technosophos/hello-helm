const {events, Job} = require("libacid")

events.on("imagePush", (e, p) => {
  var name = "helm-hello"
  // run a Helm build
  helm := new Job("helm", "lachlanevenson/k8s-helm:latest")
  helm.tasks = [
    "helm upgrade --install " + name + " charts/helm-hello"
  ]

  helm.run()
})
