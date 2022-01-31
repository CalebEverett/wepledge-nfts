use arloader::{commands::*, error::Error, status::OutputFormat, Arweave};
use serde::Deserialize;
use serde_json::json;
use std::{env, fs, path::PathBuf, str::FromStr};

#[derive(Deserialize)]
struct Member {
    name: String,
    cohort: String,
    image: String,
}

fn files_setup() {
    let data = fs::read_to_string("members/members.json").unwrap();
    let members: Vec<Member> = serde_json::from_str(&data).unwrap();

    members.iter().enumerate().for_each(|(i, m)| {
        fs::copy(format!("members/{}", m.image), format!("assets/{}.png", i)).unwrap();
        fs::write(
            format!("assets/{}.json", i),
            serde_json::to_string(&json!({
                "name": format!("WePledge1% #{}", i),
                "symbol": "WP1",
                "description": "Official NFT recognizing WePledge1% members.",
                "collection": json!({"name": "WePledge1%", "family": "WePledge1%"}),
                "attributes": json!([
                    json!({
                        "trait_type": "organization",
                        "value": m.name
                    }),
                    json!({
                        "trait_type": "cohort",
                        "value": m.cohort
                    })
                ]),
                "properties": {"category": "image"},
            }))
            .unwrap(),
        )
        .unwrap();
    })
}
#[tokio::main]
async fn main() {
    files_setup()
}
