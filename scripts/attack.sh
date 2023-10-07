#!/bin/bash

jq -ncM 'while(true; .+1) | {method: "GET", url: ("http://10.152.183.104/search?q=" + (.|tostring) ) }' | \
  vegeta attack -rate=500/s -lazy -format=json -duration=5m | \
  tee results.bin | \
  vegeta report