#!/bin/bash
aws ecr get-login-password --region us-east-1 --profile platformLegacy | docker login --username AWS --password-stdin 782141671658.dkr.ecr.us-east-1.amazonaws.com

docker tag distributed-systems-sample-write-api 782141671658.dkr.ecr.us-east-1.amazonaws.com/test/write-api:1.0.0
docker tag distributed-systems-sample-read-api 782141671658.dkr.ecr.us-east-1.amazonaws.com/test/read-api:1.0.0  

docker push 782141671658.dkr.ecr.us-east-1.amazonaws.com/test/write-api:1.0.0
docker push 782141671658.dkr.ecr.us-east-1.amazonaws.com/test/read-api:1.0.0

kubectl apply -f read-api
kubectl apply -f write-api

helm install metrics-server metrics-server/metrics-server -n observability
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack -n observability -f ./kube-prometheus-stack/values.yaml
helm install elasticsearch elastic/elasticsearch -f ./elasticsearch/values.yaml 
helm install kibana elastic/kibana -f ./kibana/values.yaml
