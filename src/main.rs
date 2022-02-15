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

const MEMBERS: &str = "members/members_mainnet.json";
const OUT_DIR: &str = "assets_mainnet/";

fn files_setup() {
    let data = fs::read_to_string(MEMBERS).unwrap();
    let members: Vec<Member> = serde_json::from_str(&data).unwrap();

    members.iter().enumerate().for_each(|(i, m)| {
        fs::copy(
            format!("members/{}", m.image),
            format!("{}{}.png", OUT_DIR, i),
        )
        .unwrap();
        fs::write(
            format!("{}{}.json", OUT_DIR, i),
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
    });
}
#[tokio::main]
async fn main() {
    let sol_keypair_path = env::var("SOL_KEYPAIR_PATH").ok().map(PathBuf::from);
    if sol_keypair_path.is_none() {
        println!("SOL_KEYPAIR_PATH environment variable must be set.");
        return ();
    };

    files_setup();

    env::set_current_dir(PathBuf::from(OUT_DIR)).unwrap();
    let paths_iter = glob::glob("*.png").unwrap().flat_map(Result::ok);

    command_upload_nfts(
        &Arweave::default(),
        paths_iter,
        None,
        10_000_000,
        2.,
        &OutputFormat::Display,
        5,
        sol_keypair_path,
        false,
    )
    .await
    .unwrap();
}
