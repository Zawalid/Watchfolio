use tauri::{AppHandle, Manager, Emitter};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut};

pub fn register_shortcuts(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // Quick Add - Ctrl+Shift+W
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

    // // Global Search - Ctrl+Shift+F
    // app.global_shortcut().on_shortcut("Ctrl+Shift+F", {
    //     let app = app.clone();
    //     move |_app, _shortcut, _event| {
    //         if let Some(window) = app.get_webview_window("main") {
    //             let _ = window.show();
    //             let _ = window.set_focus();
    //             let _ = window.emit("shortcut:search", ());
    //         }
    //     }
    // })?;

    // Show/Hide App - Ctrl+Shift+Space
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

    // Register the shortcuts
    app.global_shortcut().register("Ctrl+Shift+W")?;
    app.global_shortcut().register("Ctrl+Shift+F")?;
    app.global_shortcut().register("Ctrl+Shift+Space")?;

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
