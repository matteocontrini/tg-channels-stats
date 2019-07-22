workflow "Build and push" {
  on = "push"
  resolves = ["GitHub Action for Docker"]
}

action "Docker Build" {
  uses = "actions/docker/cli@86ff551d26008267bb89ac11198ba7f1d807b699"
  args = "build -t telegrammonitor ."
}

action "Docker Tag" {
  uses = "actions/docker/tag@86ff551d26008267bb89ac11198ba7f1d807b699"
  needs = ["Docker Build"]
  args = "telegrammonitor matteocontrini/telegrammonitor"
}

action "Docker Login" {
  uses = "actions/docker/login@86ff551d26008267bb89ac11198ba7f1d807b699"
  needs = ["Docker Tag"]
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "GitHub Action for Docker" {
  uses = "actions/docker/cli@86ff551d26008267bb89ac11198ba7f1d807b699"
  needs = ["Docker Login"]
  args = "push matteocontrini/telegrammonitor"
}
