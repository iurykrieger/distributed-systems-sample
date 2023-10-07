#!/bin/bash

# Split files
#for file in part-*; do split -l 300 $file chunks/c-$file-; done

# Transform products
# for file in chunks/c-*; do cat $file | jq '{ id: .id, apikey: .apiKey, name: .name, price: .price, oldPrice: .oldPrice, description: .description }' | jq -s '.' > $file.json && rm $file; done

# Send chunks
ls data/products/chunks/*.json -A | xargs -d $'\n' -n 30 -P 100 \
  bash -c 'for line in "$@"; do curl -s -X POST "http://10.152.183.27/index" -H "Content-type: application/json" -d @$line; done'