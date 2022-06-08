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

let connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

let mint_address_strings = [
  "Doxn3sz65obsH3XFBqEMivgQwcbKmtLBn2dbV6XwhJ8D",
  "2sekHAHBg4QSYiiFiKWePE8zVeNNxJzkV6atuei15xWa",
  "GzkCChSicC7K3iy4EzMvtU4XfC4gjHRDV3nQnmHiQpZ4",
  "GhFdtRr32tdqGTZp5xevtqdb8KBU3KLHfYfDhhJ8N6D2",
  "F1gVwG3J1zNvzM66AzKcoVEGt6cKjWTj8UUHmELbTTJL",
  "91xK5oCTrrWfMeSNambWJQLMJTH5E1QZqEV9rW9XQKPt",
  "Eb5DtMz5q4uQUiaUTRyRUcNavGQXXY4Rdq1U1z3LHgCg",
  "Eq4xw6ETFoYqh8SihsYS4Gbu3Pc6AjcdNtgrHcZ1sJmf",
  "JT9FxzoivUfNaE6twVpbuWVF9aTBx681CVaNiXzxQWt",
  "DRAydboahjhf5UhgWRB9k2TTbBtZuvk4DH7uvePLsU7L",
  "2Ac9GrQWif5WNx5jZexfLtiiDbpAFD9128oCxMYsfdvo",
  "99fG65J9MpRBH9qHV2NNoS3pqDe8c5FCvknGeG2KXfLf",
  "7EVrkF7kzjQsA2E9TV8eAJLqRHascUgY9hYG76ScUAsQ",
  "8uYrn5qowYKC9abWsWwAG3S4wpfD6eLB1z8wfemynvdh",
  "Gur4VV1iRjda6w1P5y2cxjQ3ygdPoZBxcGKZcv5uhos7",
  "H4hjEMQ8Rc7BdRqQcovHh9TAyoQMEzvRyYndFx4UgNrA",
  "HG9kbCFKd7Jr3T62RtGwon5hbiu4oGTyK1Nzn1VffUc7",
  "DhVuBZg3YUhon6svnFxX93TEWbqZi8wNFM1oGF1xBAA7",
  "8n3VAt4taa7X7NJiVZRNKBeEkhhGmMWe8Qq3Fkj24Sqz",
  "CJj8q1oTkcd5fzZgoCTcLiy1ixZ66H1iWuQ3p4VB3Ghf",
  "ZPoW3xniwz2hNfiWfUccpengviUo3xD4FEbJBR4Wwmg",
  "HCReEdMouqfirXAJ71H1xF18kwZX2bMnowPNsg3ziCqW",
  "EBZM1qnH6Cs18tFhxkzdW4w9ZvcA7ez7fjXXjBY2GRk7"
];

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
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardActionArea href={`https://explorer.solana.com/address/${props.nft.mint_address_string}`} target="_blank">
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
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom color="textSecondary">
          2022-02 Cohort
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {nfts.filter(nft => nft.cohort === "2022-02").map((nft, i) => <Member nft={nft} key={i.toString()} />)}
      </Grid >
    </Container>
  );
}

export default App;
