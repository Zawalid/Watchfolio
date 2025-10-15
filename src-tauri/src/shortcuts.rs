use tauri::{AppHandle, Manager, Emitter};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};

/// Register ONLY system-wide global shortcuts
/// These shortcuts work even when the app is minimized or hidden
///
/// Note: All other shortcuts are handled by React (useHotkeys) when the app is focused
pub fn register_shortcuts(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // Global Shortcut 1: Quick Add (Ctrl+Shift+W)
    // Works anywhere - brings app to foreground and opens Quick Add modal
    app.global_shortcut().on_shortcut("Ctrl+Shift+W", {
        let app = app.clone();
        move |_app, _shortcut, _event| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("shortcut:quick-add", ());
            }
        }
    })?;

    // Global Shortcut 2: Show/Hide App (Ctrl+Shift+Space)
    // Toggles app window visibility from anywhere
    app.global_shortcut().on_shortcut("Ctrl+Shift+Space", {
        let app = app.clone();
        move |_app, _shortcut, _event| {
            if let Some(window) = app.get_webview_window("main") {
                if window.is_visible().unwrap_or(false) {
                    let _ = window.hide();
                } else {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        }
    })?;

    // Optional Global Shortcut 3: Global Search (Ctrl+Shift+F)
    // Uncomment to enable system-wide search
    // app.global_shortcut().on_shortcut("Ctrl+Shift+F", {
    //     let app = app.clone();
    //     move |_app, _shortcut, _event| {
    //         if let Some(window) = app.get_webview_window("main") {
    //             let _ = window.show();
    //             let _ = window.set_focus();
    //             let _ = window.emit("shortcut:global-search", ());
    //         }
    //     }
    // })?;

    // Register the shortcuts (2 active shortcuts)
    app.global_shortcut().register("Ctrl+Shift+W")?;
    app.global_shortcut().register("Ctrl+Shift+Space")?;
    // Uncomment if enabling global search:
    // app.global_shortcut().register("Ctrl+Shift+F")?;

    Ok(())
}

#[tauri::command]
pub async fn register_custom_shortcut(
    app: AppHandle,
    shortcut: String,
    action: String,
) -> Result<(), String> {
    let shortcut_obj: Shortcut = shortcut.parse().map_err(|e| format!("Invalid shortcut: {}", e))?;

    app.global_shortcut()
        .on_shortcut(shortcut_obj.clone(), {
            let app = app.clone();
            move |_app, _shortcut, _event| {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.emit("shortcut:custom", &action);
                }
            }
        })
        .map_err(|e| e.to_string())?;

    app.global_shortcut()
        .register(shortcut_obj)
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn unregister_shortcut(app: AppHandle, shortcut: String) -> Result<(), String> {
    let shortcut_obj: Shortcut = shortcut.parse().map_err(|e| format!("Invalid shortcut: {}", e))?;

    app.global_shortcut()
        .unregister(shortcut_obj)
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn is_shortcut_registered(app: AppHandle, shortcut: String) -> Result<bool, String> {
    let shortcut_obj: Shortcut = shortcut.parse().map_err(|e| format!("Invalid shortcut: {}", e))?;

    Ok(app.global_shortcut().is_registered(shortcut_obj))
}
