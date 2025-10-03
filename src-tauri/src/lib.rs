use serde::{Deserialize, Serialize};

mod menu;
mod tray;
mod shortcuts;

#[cfg(not(any(target_os = "android", target_os = "ios")))]
mod updater;

#[derive(Debug, Serialize, Deserialize)]
pub struct ExportOptions {
  pub path: String,
  pub format: String,
  pub data: String,
}

/// Export data to file system
#[tauri::command]
async fn export_data(options: ExportOptions) -> Result<String, String> {
  std::fs::write(&options.path, options.data)
    .map_err(|e| format!("Failed to export data: {}", e))?;
  Ok(options.path)
}

/// Get platform information
#[tauri::command]
fn get_platform_info() -> Result<serde_json::Value, String> {
  Ok(serde_json::json!({
    "os": std::env::consts::OS,
    "arch": std::env::consts::ARCH,
    "family": std::env::consts::FAMILY,
  }))
}

/// Check if running in Tauri
#[tauri::command]
fn is_tauri() -> bool {
  true
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let mut builder = tauri::Builder::default()
    .plugin(tauri_plugin_shell::init());

  #[cfg(not(any(target_os = "android", target_os = "ios")))]
  {
    builder = builder.invoke_handler(tauri::generate_handler![
      export_data,
      get_platform_info,
      is_tauri,
      shortcuts::register_custom_shortcut,
      shortcuts::unregister_shortcut,
      shortcuts::is_shortcut_registered,
      tray::update_tray_tooltip,
      tray::show_tray_notification,
      updater::manual_check_updates,
      updater::install_update,
    ]);
  }

  #[cfg(any(target_os = "android", target_os = "ios"))]
  {
    builder = builder.invoke_handler(tauri::generate_handler![
      export_data,
      get_platform_info,
      is_tauri,
    ]);
  }

  #[cfg(not(any(target_os = "android", target_os = "ios")))]
  {
    builder = builder
      .plugin(tauri_plugin_os::init())
      .plugin(tauri_plugin_dialog::init())
      .plugin(tauri_plugin_notification::init())
      .plugin(tauri_plugin_deep_link::init())
      .plugin(tauri_plugin_global_shortcut::Builder::new().build())
      .plugin(tauri_plugin_updater::Builder::new().build())
      .plugin(tauri_plugin_process::init());
  }

  builder
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      #[cfg(not(any(target_os = "android", target_os = "ios")))]
      {
        // Create native menu
        let menu = menu::create_menu(&app.handle())?;
        app.set_menu(menu)?;
        app.on_menu_event(menu::handle_menu_event);

        // Create system tray
        tray::create_tray(&app.handle())?;

        // Register global shortcuts
        if let Err(e) = shortcuts::register_shortcuts(&app.handle()) {
          log::warn!("Failed to register some shortcuts: {}", e);
        }

        // Start background updater (checks every 24 hours)
        updater::start_background_updater(app.handle().clone());
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
