#!/bin/bash

METAPLEX_ITEMS=assets_mainnet_2022_02/arloader_hLXF2FUk_Mg/metadata/metaplex_items_tvvX6Jv4IBKVoAnUklatm0npwmAiDQmZR8gbJ-IPFeM.json
RESULT=$(jq -c . "$METAPLEX_ITEMS")
SYMBOL="WP1"
SELLER_FEE_BASIS_POINTS=0

for row in $(echo $RESULT | jq 'keys' | jq .[])
do
    name=$(echo $RESULT | jq ".["$row"].name") 
    link=$(echo $RESULT | jq ".["$row"].link" -r)
    echo /home/caleb/projects/metaplex-cli/target/release/metaplex_cli nft-create --name $name  --uri $link --symbol $SYMBOL --seller-fee-basis-points $SELLER_FEE_BASIS_POINTS
done