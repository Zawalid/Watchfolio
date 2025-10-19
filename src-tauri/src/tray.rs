use tauri::{AppHandle, Manager, Emitter, tray::*, menu::*};

pub fn create_tray(app: &AppHandle) -> Result<(), tauri::Error> {
    // Create tray menu
    let show_hide = MenuItemBuilder::with_id("show_hide", "Show Watchfolio").build(app)?;
    let separator1 = PredefinedMenuItem::separator(app)?;

    // Quick actions
    let quick_add = MenuItemBuilder::with_id("quick_add", "Quick Add").build(app)?;
    let search = MenuItemBuilder::with_id("search", "Search").build(app)?;
    let separator2 = PredefinedMenuItem::separator(app)?;

    // Navigation
    let library = MenuItemBuilder::with_id("library", "Library").build(app)?;
    let discover = MenuItemBuilder::with_id("discover", "Discover").build(app)?;
    let statistics = MenuItemBuilder::with_id("statistics", "Statistics").build(app)?;
    let separator3 = PredefinedMenuItem::separator(app)?;

    // Status actions submenu
    let mark_watching = MenuItemBuilder::with_id("mark_watching", "Watching").build(app)?;
    let mark_completed = MenuItemBuilder::with_id("mark_completed", "Completed").build(app)?;
    let mark_plan = MenuItemBuilder::with_id("mark_plan", "Plan to Watch").build(app)?;
    let mark_on_hold = MenuItemBuilder::with_id("mark_on_hold", "On Hold").build(app)?;
    let mark_dropped = MenuItemBuilder::with_id("mark_dropped", "Dropped").build(app)?;

    let quick_status = SubmenuBuilder::new(app, "Quick Status")
        .item(&mark_watching)
        .item(&mark_completed)
        .item(&mark_plan)
        .item(&mark_on_hold)
        .item(&mark_dropped)
        .build()?;

    let separator4 = PredefinedMenuItem::separator(app)?;

    // Sync status
    let sync_now = MenuItemBuilder::with_id("sync_now", "Sync Now").build(app)?;
    let separator5 = PredefinedMenuItem::separator(app)?;

    // Settings and quit
    let preferences = MenuItemBuilder::with_id("preferences", "Preferences").build(app)?;
    let separator6 = PredefinedMenuItem::separator(app)?;
    let quit = MenuItemBuilder::with_id("quit", "Quit Watchfolio").build(app)?;

    // Build the tray menu
    let menu = MenuBuilder::new(app)
        .item(&show_hide)
        .item(&separator1)
        .item(&quick_add)
        .item(&search)
        .item(&separator2)
        .item(&library)
        .item(&discover)
        .item(&statistics)
        .item(&separator3)
        .item(&quick_status)
        .item(&separator4)
        .item(&sync_now)
        .item(&separator5)
        .item(&preferences)
        .item(&separator6)
        .item(&quit)
        .build()?;

    // Create the tray with icon
    let _tray = TrayIconBuilder::new()
        .menu(&menu)
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Watchfolio")
        .on_menu_event(move |app, event| handle_tray_event(app, event))
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { button: MouseButton::Left, .. } = event {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    if window.is_visible().unwrap_or(false) {
                        let _ = window.hide();
                    } else {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
        })
        .build(app)?;

    Ok(())
}

pub fn handle_tray_event(app: &AppHandle, event: MenuEvent) {
    let window = app.get_webview_window("main");

    match event.id().as_ref() {
        "show_hide" => {
            if let Some(window) = window {
                if window.is_visible().unwrap_or(false) {
                    let _ = window.hide();
                } else {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        }
        "quick_add" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:quick-add", ());
            }
        }
        "search" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/search");
            }
        }
        "library" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/library");
            }
        }
        "discover" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/home");
            }
        }
        "statistics" => {
            if let Some(window) = window {
                let _ = window.emit("tray:statistics", ());
            }
        }
        "mark_watching" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/library/watching");
            }
        }
        "mark_completed" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/library/completed");
            }
        }
        "mark_plan" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/library/will-watch");
            }
        }
        "mark_on_hold" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/library/on-hold");
            }
        }
        "mark_dropped" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/library/dropped");
            }
        }
        "sync_now" => {
            if let Some(window) = window {
                let _ = window.emit("tray:sync-now", ());
            }
        }
        "preferences" => {
            if let Some(window) = window {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("tray:navigate", "/settings/preferences");
            }
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}

// Update tray menu dynamically
#[tauri::command]
pub async fn update_tray_tooltip(_app: AppHandle, _tooltip: String) -> Result<(), String> {
    // This would update the tray tooltip with current status
    // e.g., "Watchfolio - 5 items syncing"
    Ok(())
}

#[tauri::command]
pub async fn show_tray_notification(app: AppHandle, title: String, body: String) -> Result<(), String> {
    // Show notification from tray
    #[cfg(not(any(target_os = "android", target_os = "ios")))]
    {
        use tauri_plugin_notification::NotificationExt;
        app.notification()
            .builder()
            .title(title)
            .body(body)
            .show()
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
