use arloader::{commands::*, status::OutputFormat, Arweave};
use serde::Deserialize;
use serde_json::json;
use std::{env, fs, path::PathBuf};

#[derive(Deserialize)]
struct Member {
    name: String,
    cohort: String,
    image: String,
}

const MEMBERS: &str = "members_2022_02";
const OUT_DIR: &str = "assets_mainnet_2022_02";
const START_NUMBER: usize = 11;

fn files_setup() {
    let data = fs::read_to_string(format!("{MEMBERS}/members.json")).unwrap();
    let members: Vec<Member> = serde_json::from_str(&data).unwrap();

    members.iter().enumerate().for_each(|(i, m)| {
        fs::copy(
            format!("{MEMBERS}/{}", m.image),
            format!("{OUT_DIR}/{}.png", i + START_NUMBER),
        )
        .unwrap();
        fs::write(
            format!("{OUT_DIR}/{}.json", i + START_NUMBER),
            serde_json::to_string(&json!({
                "name": format!("WePledge1% #{}", i + START_NUMBER),
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
    });
}
#[tokio::main]
async fn main() {
    let ar_keypair_path = env::var("AR_KEYPAIR_PATH").ok().map(PathBuf::from);
    if ar_keypair_path.is_none() {
        println!("AR_KEYPAIR_PATH environment variable must be set.");
        return ();
    };

    files_setup();

    env::set_current_dir(PathBuf::from(OUT_DIR.to_string() + "/")).unwrap();
    let paths_iter = glob::glob("*.png").unwrap().flat_map(Result::ok);

    command_upload_nfts(
        &Arweave::default(),
        paths_iter,
        None,
        10_000_000,
        2.,
        &OutputFormat::Display,
        5,
        None,
        false,
    )
    .await
    .unwrap();
}
