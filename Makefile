VERSION ?= latest
REGISTRY ?= osseu.azurecr.io

.PHONY: build
build: docker-build
build: docker-push

.PHONY: docker-build
docker-build:
	docker build -t $(REGISTRY)/hello-helm:$(VERSION) .

.PHONY: docker-push
docker-push:
	docker push $(REGISTRY)/hello-helm:$(VERSION)
