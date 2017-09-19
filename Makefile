VERSION ?= dev

.PHONY: build
build: docker-build
build: docker-push

.PHONY: docker-build
docker-build:
	docker build -t technosophos/hello-helm:$(VERSION) .

.PHONY: docker-push
docker-push:
	docker push technosophos/hello-helm
