mod modules;

use modules::system_monitor::get_system_info;
use std::path::PathBuf;
use tauri::Manager;

#[tauri::command]
fn get_system_info_command() -> Result<modules::system_monitor::SystemInfo, String> {
    Ok(get_system_info())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_app_config_dir(app: tauri::AppHandle) -> Result<String, String> {
    let exe_dir = app
        .path()
        .resource_dir()
        .map_err(|e| format!("Failed to get resource dir: {}", e))?;
    
    let config_dir = exe_dir.join("config");
    
    if !config_dir.exists() {
        std::fs::create_dir_all(&config_dir)
            .map_err(|e| format!("Failed to create config dir: {}", e))?;
    }
    
    Ok(config_dir.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info_command,
            get_app_config_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
