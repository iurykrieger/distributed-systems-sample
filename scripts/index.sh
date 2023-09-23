#!/bin/bash

cat ./data/products/part* | xargs -d $'\n' -n 100 -P 1000 \
  bash -c 'for line in "$@"; do curl -s -o /dev/null -w "%{http_code}\n" -X POST "http://localhost:3000/index" -H "Content-type: application/json" -d "$line"; done'
