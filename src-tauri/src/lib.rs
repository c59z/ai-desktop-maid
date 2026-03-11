mod modules;

use modules::system_monitor::get_system_info;
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
fn get_app_config_dir() -> Result<String, String> {
    // 使用项目目录下的 data 文件夹存储配置
    let project_dir = std::env::current_dir()
        .map_err(|e| format!("Failed to get current dir: {}", e))?;
    
    let config_dir = project_dir.join("data").join("config");

    if !config_dir.exists() {
        std::fs::create_dir_all(&config_dir)
            .map_err(|e| format!("Failed to create config dir: {}", e))?;
    }

    Ok(config_dir.to_string_lossy().to_string())
}

// 窗口拖拽功能
#[tauri::command]
fn drag_window(window: tauri::Window) -> Result<(), String> {
    println!("Rust: 开始拖拽窗口");
    window
        .start_dragging()
        .map_err(|e| format!("Failed to drag window: {}", e))
}

// 关闭窗口
#[tauri::command]
fn close_window(window: tauri::Window) -> Result<(), String> {
    println!("Rust: 尝试关闭窗口");
    let result = window
        .close()
        .map_err(|e| format!("Failed to close window: {}", e));
    println!("Rust: 关闭窗口结果: {:?}", result);
    result
}

// 最小化窗口
#[tauri::command]
fn minimize_window(window: tauri::Window) -> Result<(), String> {
    println!("Rust: 尝试最小化窗口");
    let result = window
        .minimize()
        .map_err(|e| format!("Failed to minimize window: {}", e));
    println!("Rust: 最小化窗口结果: {:?}", result);
    result
}

// 设置窗口大小
#[tauri::command]
fn set_window_size(window: tauri::Window, width: f64, height: f64) -> Result<(), String> {
    window
        .set_size(tauri::Size::Physical(tauri::PhysicalSize::new(width as u32, height as u32)))
        .map_err(|e| format!("Failed to set window size: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info_command,
            get_app_config_dir,
            drag_window,
            close_window,
            minimize_window,
            set_window_size
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
