use tauri::{AppHandle, Manager, State};
use std::sync::Mutex;

#[derive(Default)]
pub struct SystemSettings {
    pub keep_running_in_background: Mutex<bool>,
}

#[tauri::command]
pub fn set_keep_running_in_background(
    settings: State<SystemSettings>,
    enabled: bool,
) -> Result<(), String> {
    *settings.keep_running_in_background.lock().unwrap() = enabled;
    Ok(())
}

#[tauri::command]
pub fn get_keep_running_in_background(settings: State<SystemSettings>) -> bool {
    *settings.keep_running_in_background.lock().unwrap()
}

pub fn should_keep_running(app: &AppHandle) -> bool {
    match app.try_state::<SystemSettings>() {
        Some(settings) => *settings.keep_running_in_background.lock().unwrap(),
        None => true, // Default to true
    }
}
