# Hello Helm

This is a simple demo of an ACR webhook to automatically upgrade a Helm chart.

To customize it, you will need to edit the registry in the following places:

- Makefile
- charts/values.yaml

Then you will need to configure your ACR to trigger a webhook on each push
event.


