import React, { useEffect, useState } from "react";
import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

import { Connection, PublicKey } from '@solana/web3.js';

let connection = new Connection("https://api.devnet.solana.com", "confirmed");
let mint_address_strings = [
  "EWPTNEDRUQjt7WNN2PDXfD69PewNaKKsfjWY8YCZyRHK",
  "Gxw6JKDMc8ULCxXWQexPbYHQHR3EqzJ52Y89hru1yud5",
  "3rEDaZsUPWgpfFmLVc7snPGMSjPrbZvRvYqx3EedNvvv",
  "FFJqqcfQZybRRpeGFdusgb71xxovyKbc34ikJbUaC5uW",
  "GjEepgGPcxUHMgvGwexyanfrUFviZ6QRDxBR5D9F3Re4",
  "HMxjLuFLgFouhxxmkb6rUYuJ3V18RzNFXeNMvbL9LFhQ",
  "5J7z22D86SBWtF6dECzz2eNwqaYXEqbXFyPpLTVZtjiZ",
  "EwCfaYcRcaDVhNKYgi3MJ7oZpziLkuxJZFpM4sAo9RuK",
  "dKpNS5dEofAcUESPbZKa2WZt6oieeNBXCVAKZnyP857",
  "Eo9NELZR8TGnwhz8qPZLz2CAZyMEQtZujhC5Bo7FWPpU"
]

interface NFT {
  mint_address_string: string
  name: string,
  uri: URL,
  organization?: string,
  cohort?: string,
  image?: URL
}

interface Attribute {
  trait_type: string,
  value: string
}

function Member(props: { nft: NFT }) {
  return (
    <Grid item xs={12} sm={3}>
      <Card>
        <CardActionArea href={`https://explorer.solana.com/address/${props.nft.mint_address_string}?cluster=devnet`} target="_blank">
          <CardMedia
            component="img"
            image={props.nft.image!.toString()}
            title={props.nft.name}
          />
        </CardActionArea>
        <CardActions>
          <Button href={props.nft.uri.toString()} target="_blank">
            METADATA
          </Button>
        </CardActions>
      </Card>
    </Grid >
  );
}

function App() {
  const [nfts, setNfts] = useState<Array<NFT>>([]);

  const fetchNft = async (mint_address_string: string) => {
    const mint_address = new PublicKey(mint_address_string);
    const metadata_address = await Metadata.getPDA(mint_address);
    let accountInfo = await connection.getAccountInfo(metadata_address);
    let metadataData = MetadataData.deserialize(accountInfo!.data);
    let nft: NFT = { mint_address_string, name: metadataData.data.name, uri: metadataData.data.uri };
    let metadata = await (await fetch(nft.uri.toString())).json();
    nft.image = metadata.image;
    let attributes: Array<Attribute> = metadata.attributes;
    nft.organization = attributes.filter(attr => attr.trait_type === "organization")[0].value;
    nft.cohort = attributes.filter(attr => attr.trait_type === "cohort")[0].value;
    return nft;
  }

  useEffect(() => {
    (async () => {
      let nfts = await Promise.all<NFT>(mint_address_strings.map(fetchNft));
      if (nfts.length > 0) {
        setNfts(nfts)
      }
    })();
  }, []
  )

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="textSecondary">
          WePledge1% Members
        </Typography>
      </Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom color="textSecondary">
          Founding Members
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {nfts.filter(nft => nft.cohort === "Founding").map((nft, i) => <Member nft={nft} key={i.toString()} />)}
      </Grid >
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom color="textSecondary">
          2021-07 Cohort
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {nfts.filter(nft => nft.cohort === "2021-07").map((nft, i) => <Member nft={nft} key={i.toString()} />)}
      </Grid >
    </Container>
  );
}

export default App;
