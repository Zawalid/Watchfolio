use tauri::{AppHandle, Manager, menu::*};

pub fn create_menu(app: &AppHandle) -> Result<Menu<tauri::Wry>, tauri::Error> {
    // File Menu
    let new_item = MenuItem::with_id(app, "new_item", "New Item", true, Some("Ctrl+N"))?;
    let quick_add = MenuItem::with_id(app, "quick_add", "Quick Add...", true, Some("Ctrl+Shift+A"))?;
    let import = MenuItem::with_id(app, "import", "Import Library...", true, None::<&str>)?;
    let export = MenuItem::with_id(app, "export", "Export Library...", true, Some("Ctrl+E"))?;
    let preferences = MenuItem::with_id(app, "preferences", "Preferences...", true, Some("Ctrl+,"))?;
    let quit = MenuItem::with_id(app, "quit", "Quit Watchfolio", true, Some("Ctrl+Q"))?;

    let file_menu = SubmenuBuilder::new(app, "File")
        .item(&new_item)
        .item(&quick_add)
        .separator()
        .item(&import)
        .item(&export)
        .separator()
        .item(&preferences)
        .separator()
        .item(&quit)
        .build()?;

    // Edit Menu
    let undo = MenuItem::with_id(app, "undo", "Undo", true, Some("Ctrl+Z"))?;
    let redo = MenuItem::with_id(app, "redo", "Redo", true, Some("Ctrl+Y"))?;
    let cut = MenuItem::with_id(app, "cut", "Cut", true, Some("Ctrl+X"))?;
    let copy = MenuItem::with_id(app, "copy", "Copy", true, Some("Ctrl+C"))?;
    let paste = MenuItem::with_id(app, "paste", "Paste", true, Some("Ctrl+V"))?;
    let select_all = MenuItem::with_id(app, "select_all", "Select All", true, Some("Ctrl+A"))?;

    let edit_menu = SubmenuBuilder::new(app, "Edit")
        .item(&undo)
        .item(&redo)
        .separator()
        .item(&cut)
        .item(&copy)
        .item(&paste)
        .separator()
        .item(&select_all)
        .build()?;

    // View Menu
    let library = MenuItem::with_id(app, "view_library", "Library", true, Some("Ctrl+1"))?;
    let discover = MenuItem::with_id(app, "view_discover", "Discover", true, Some("Ctrl+2"))?;
    let statistics = MenuItem::with_id(app, "view_statistics", "Statistics", true, Some("Ctrl+3"))?;
    let recommendations = MenuItem::with_id(app, "view_recommendations", "Recommendations", true, Some("Ctrl+4"))?;
    let profile = MenuItem::with_id(app, "view_profile", "Profile", true, Some("Ctrl+5"))?;
    let reload = MenuItem::with_id(app, "reload", "Reload", true, Some("Ctrl+R"))?;
    let toggle_fullscreen = MenuItem::with_id(app, "toggle_fullscreen", "Toggle Fullscreen", true, Some("F11"))?;
    let actual_size = MenuItem::with_id(app, "actual_size", "Actual Size", true, Some("Ctrl+0"))?;
    let zoom_in = MenuItem::with_id(app, "zoom_in", "Zoom In", true, Some("Ctrl+Plus"))?;
    let zoom_out = MenuItem::with_id(app, "zoom_out", "Zoom Out", true, Some("Ctrl+-"))?;

    let view_menu = SubmenuBuilder::new(app, "View")
        .item(&library)
        .item(&discover)
        .item(&statistics)
        .item(&recommendations)
        .item(&profile)
        .separator()
        .item(&reload)
        .separator()
        .item(&toggle_fullscreen)
        .separator()
        .item(&actual_size)
        .item(&zoom_in)
        .item(&zoom_out)
        .build()?;

    // Window Menu
    let minimize = MenuItem::with_id(app, "minimize", "Minimize", true, Some("Ctrl+M"))?;
    let maximize = MenuItem::with_id(app, "maximize", "Maximize", true, None::<&str>)?;
    let hide = MenuItem::with_id(app, "hide", "Hide to Tray", true, Some("Ctrl+H"))?;

    let window_menu = SubmenuBuilder::new(app, "Window")
        .item(&minimize)
        .item(&maximize)
        .separator()
        .item(&hide)
        .build()?;

    // Help Menu
    let documentation = MenuItem::with_id(app, "documentation", "Documentation", true, Some("F1"))?;
    let keyboard_shortcuts = MenuItem::with_id(app, "keyboard_shortcuts", "Keyboard Shortcuts", true, Some("Ctrl+/"))?;
    let report_issue = MenuItem::with_id(app, "report_issue", "Report Issue", true, None::<&str>)?;
    let check_updates = MenuItem::with_id(app, "check_updates", "Check for Updates", true, None::<&str>)?;
    let about = MenuItem::with_id(app, "about", "About Watchfolio", true, None::<&str>)?;

    let help_menu = SubmenuBuilder::new(app, "Help")
        .item(&documentation)
        .item(&keyboard_shortcuts)
        .separator()
        .item(&report_issue)
        .item(&check_updates)
        .separator()
        .item(&about)
        .build()?;

    // Build main menu
    let menu = MenuBuilder::new(app)
        .item(&file_menu)
        .item(&edit_menu)
        .item(&view_menu)
        .item(&window_menu)
        .item(&help_menu)
        .build()?;

    Ok(menu)
}

pub fn handle_menu_event(app: &AppHandle, event: tauri::menu::MenuEvent) {
    let window = app.get_webview_window("main").unwrap();

    match event.id().as_ref() {
        // File menu
        "new_item" => {
            let _ = window.emit("menu:new-item", ());
        }
        "quick_add" => {
            let _ = window.emit("menu:quick-add", ());
        }
        "import" => {
            let _ = window.emit("menu:import", ());
        }
        "export" => {
            let _ = window.emit("menu:export", ());
        }
        "preferences" => {
            let _ = window.emit("menu:preferences", ());
        }
        "quit" => {
            app.exit(0);
        }

        // Edit menu
        "undo" | "redo" | "cut" | "copy" | "paste" | "select_all" => {
            // These are handled by webview automatically
        }

        // View menu
        "view_library" => {
            let _ = window.emit("menu:navigate", "/library");
        }
        "view_discover" => {
            let _ = window.emit("menu:navigate", "/discover");
        }
        "view_statistics" => {
            let _ = window.emit("menu:navigate", "/statistics");
        }
        "view_recommendations" => {
            let _ = window.emit("menu:navigate", "/recommendations");
        }
        "view_profile" => {
            let _ = window.emit("menu:navigate", "/profile");
        }
        "reload" => {
            let _ = window.eval("window.location.reload()");
        }
        "toggle_fullscreen" => {
            let fullscreen = window.is_fullscreen().unwrap_or(false);
            let _ = window.set_fullscreen(!fullscreen);
        }
        "actual_size" => {
            let _ = window.eval("document.body.style.zoom = '100%'");
        }
        "zoom_in" => {
            let _ = window.eval(
                "document.body.style.zoom = (parseFloat(document.body.style.zoom || '100') + 10) + '%'"
            );
        }
        "zoom_out" => {
            let _ = window.eval(
                "document.body.style.zoom = Math.max(50, parseFloat(document.body.style.zoom || '100') - 10) + '%'"
            );
        }

        // Window menu
        "minimize" => {
            let _ = window.minimize();
        }
        "maximize" => {
            let maximized = window.is_maximized().unwrap_or(false);
            if maximized {
                let _ = window.unmaximize();
            } else {
                let _ = window.maximize();
            }
        }
        "hide" => {
            let _ = window.hide();
        }

        // Help menu
        "documentation" => {
            let _ = window.emit("menu:documentation", ());
        }
        "keyboard_shortcuts" => {
            let _ = window.emit("menu:keyboard-shortcuts", ());
        }
        "report_issue" => {
            let _ = tauri::async_runtime::spawn(async {
                let _ = tauri_plugin_shell::ShellExt::shell(&app)
                    .open("https://github.com/yourusername/watchfolio/issues", None);
            });
        }
        "check_updates" => {
            let _ = window.emit("menu:check-updates", ());
        }
        "about" => {
            let _ = window.emit("menu:about", ());
        }

        _ => {}
    }
}
