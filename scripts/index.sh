#!/bin/bash

for file in ./data/products/part-00006
do
  echo "Indexing products for $file..."
  cat $file | xargs -d $'\n' -n 50 -P 100 bash -c '
    for line in "$@";
    do
      curl -s -o /dev/null -X POST "http://localhost:3000/index" -H "Content-type: application/json" -d "$line"
    done
  '
done
