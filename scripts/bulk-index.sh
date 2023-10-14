#!/bin/bash

# Split files
#for file in part-*; do split -l 300 $file chunks/c-$file-; done

# Transform products
# for file in chunks/c-*; do cat $file | jq '{ id: .id, apikey: .apiKey, name: .name, price: .price, oldPrice: .oldPrice, description: .description }' | jq -s '.' > $file.json && rm $file; done

# Send chunks
ls data/products/chunks/*.json -A | xargs -d $'\n' -n 10 -P 50 \
  bash -c 'for line in "$@"; do curl -s -X POST "http://localhost:3000/index" -H "Content-type: application/json" -d @$line; done' > /dev/null