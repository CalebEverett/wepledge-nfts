#!/bin/bash

METAPLEX_ITEMS=assets_mainnet/arloader_nnLjAk-lwbg/metadata/metaplex_items_se-0E-dX54yZWAzGP_--aiKQ8W0wst4Uf1FY43DgVXo.json
RESULT=$(jq -c . "$METAPLEX_ITEMS")
SYMBOL="WP1"
SELLER_FEE_BASIS_POINTS=0

for row in $(echo $RESULT | jq 'keys' | jq .[])
do
    name=$(echo $RESULT | jq ".["$row"].name") 
    link=$(echo $RESULT | jq ".["$row"].link" -r)
    echo metaplex_cli nft-create --name $name  --uri $link --symbol $SYMBOL --seller-fee-basis-points $SELLER_FEE_BASIS_POINTS
done