use serde::{Deserialize, Serialize};
use tauri::Manager;

mod menu;
mod tray;
mod shortcuts;
mod system_settings;

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

/// Check if app was autostarted
#[tauri::command]
fn was_autostarted() -> bool {
  let args: Vec<String> = std::env::args().collect();
  args.contains(&"--autostarted".to_string())
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
      was_autostarted,
      shortcuts::register_custom_shortcut,
      shortcuts::unregister_shortcut,
      shortcuts::is_shortcut_registered,
      tray::update_tray_tooltip,
      tray::show_tray_notification,
      updater::manual_check_updates,
      updater::install_update,
      system_settings::set_keep_running_in_background,
      system_settings::get_keep_running_in_background,
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
      .plugin(tauri_plugin_process::init())
      .plugin(tauri_plugin_opener::init())
      .plugin(tauri_plugin_autostart::init(
        tauri_plugin_autostart::MacosLauncher::LaunchAgent,
        Some(vec!["--autostarted"]),
      ));
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
        // Initialize system settings state
        app.manage(system_settings::SystemSettings {
          keep_running_in_background: std::sync::Mutex::new(true),
        });
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

        // Handle --autostarted flag for startup behavior
        // Hide window on autostart - frontend will show it if startMinimized is false
        let args: Vec<String> = std::env::args().collect();
        if args.contains(&"--autostarted".to_string()) {
          if let Some(window) = app.get_webview_window("main") {
            let _ = window.hide();
          }
        }

        // Handle window close event based on keep_running_in_background setting
        if let Some(window) = app.get_webview_window("main") {
          let app_handle = app.handle().clone();
          window.on_window_event(move |event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
              if let Some(window) = app_handle.get_webview_window("main") {
                let should_keep_running = system_settings::should_keep_running(&app_handle);

                if should_keep_running {
                  api.prevent_close();
                  let _ = window.hide();
                }
              }
            }
          });
        }
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
