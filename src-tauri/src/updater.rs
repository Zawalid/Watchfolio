use tauri::{AppHandle, Emitter};
use tauri_plugin_updater::UpdaterExt;

#[derive(Clone, serde::Serialize)]
struct UpdateProgress {
    downloaded: usize,
    content_length: Option<u64>,
}

#[derive(Clone, serde::Serialize)]
struct UpdateAvailable {
    version: String,
    current_version: String,
    date: Option<String>,
    body: Option<String>,
}

pub async fn check_for_updates(
    app: AppHandle,
    silent: bool,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("Checking for updates...");

    let update = app.updater()?.check().await?;

    if let Some(update) = update {
        let current_version = app.package_info().version.to_string();
        let new_version = update.version.clone();

        println!(
            "Update available: {} -> {}",
            current_version, new_version
        );

        if !silent {
            let _ = app.emit(
                "update-available",
                UpdateAvailable {
                    version: new_version.clone(),
                    current_version,
                    date: update.date.map(|d| d.to_string()),
                    body: update.body.clone(),
                },
            );
        }

        Ok(())
    } else {
        println!("App is up to date");

        if !silent {
            let _ = app.emit("update-not-available", ());
        }

        Ok(())
    }
}

pub async fn download_and_install(
    app: AppHandle,
) -> Result<(), Box<dyn std::error::Error>> {
    println!("Starting update download...");

    let update = app.updater()?.check().await?;

    if let Some(update) = update {
        let mut downloaded = 0;

        update
            .download_and_install(
                |chunk_length, content_length| {
                    downloaded += chunk_length;
                    println!(
                        "Downloaded {} of {:?} bytes",
                        downloaded, content_length
                    );

                    let _ = app.emit(
                        "update-download-progress",
                        UpdateProgress {
                            downloaded,
                            content_length,
                        },
                    );
                },
                || {
                    println!("Download finished, preparing to install...");
                    let _ = app.emit("update-ready-to-install", ());
                },
            )
            .await?;

        println!("Update installed successfully");
        let _ = app.emit("update-installed", ());

        Ok(())
    } else {
        Err("No update available".into())
    }
}

pub fn start_background_updater(app: AppHandle) {
    std::thread::spawn(move || {
        tauri::async_runtime::block_on(async move {
            loop {
                // Sleep for 24 hours (86400 seconds)
                std::thread::sleep(std::time::Duration::from_secs(86400));
                println!("Running scheduled update check...");

                if let Err(e) = check_for_updates(app.clone(), true).await {
                    eprintln!("Background update check failed: {}", e);
                }
            }
        })
    });

    println!("Background updater started (checks every 24 hours)");
}

#[tauri::command]
pub async fn manual_check_updates(
    app: AppHandle,
) -> Result<(), String> {
    check_for_updates(app, false)
        .await
        .map_err(|e| format!("Failed to check for updates: {}", e))
}

#[tauri::command]
pub async fn install_update(app: AppHandle) -> Result<(), String> {
    download_and_install(app)
        .await
        .map_err(|e| format!("Failed to install update: {}", e))
}
