use tauri::{AppHandle, Manager, Emitter, menu::*};

pub fn create_menu(app: &AppHandle) -> Result<Menu<tauri::Wry>, tauri::Error> {
    // File Menu
    let quick_add = MenuItem::with_id(app, "quick_add", "Quick Add", true, Some("Ctrl+Shift+A"))?;
    let sync = MenuItem::with_id(app, "sync", "Sync Library", true, None::<&str>)?;
    let import = MenuItem::with_id(app, "import", "Import", true, Some("Ctrl+I"))?;
    let export = MenuItem::with_id(app, "export", "Export", true, Some("Ctrl+E"))?;
    let preferences = MenuItem::with_id(app, "preferences", "Preferences", true, Some("Ctrl+,"))?;
    let quit = MenuItem::with_id(app, "quit", "Quit Watchfolio", true, Some("Ctrl+Q"))?;

    let file_menu = SubmenuBuilder::new(app, "File")
        .item(&quick_add)
        .separator()
        .item(&sync)
        .item(&import)
        .item(&export)
        .separator()
        .item(&preferences)
        .separator()
        .item(&quit)
        .build()?;

    // View Menu
    let toggle_sidebar = MenuItem::with_id(app, "toggle_sidebar", "Toggle Sidebar", true, Some("Ctrl+B"))?;
    let toggle_filters = MenuItem::with_id(app, "toggle_filters", "Toggle Filters", true, Some("Alt+F"))?;
    let reload = MenuItem::with_id(app, "reload", "Reload", true, Some("Ctrl+R"))?;
    let toggle_fullscreen = MenuItem::with_id(app, "toggle_fullscreen", "Toggle Fullscreen", true, Some("F11"))?;

    let view_menu = SubmenuBuilder::new(app, "View")
        .item(&toggle_sidebar)
        .item(&toggle_filters)
        .separator()
        .item(&reload)
        .item(&toggle_fullscreen)
        .build()?;

    // Library Menu
    let library_all = MenuItem::with_id(app, "library_all", "All Media", true, None::<&str>)?;
    let library_watching = MenuItem::with_id(app, "library_watching", "Watching", true, None::<&str>)?;
    let library_completed = MenuItem::with_id(app, "library_completed", "Completed", true, None::<&str>)?;
    let library_plan = MenuItem::with_id(app, "library_plan", "Plan to Watch", true, None::<&str>)?;
    let library_hold = MenuItem::with_id(app, "library_hold", "On Hold", true, None::<&str>)?;
    let library_dropped = MenuItem::with_id(app, "library_dropped", "Dropped", true, None::<&str>)?;
    let library_stats = MenuItem::with_id(app, "library_stats", "Statistics", true, None::<&str>)?;
    let library_settings = MenuItem::with_id(app, "library_settings", "Library Settings", true, None::<&str>)?;
    let library_clear = MenuItem::with_id(app, "library_clear", "Clear Library", true, Some("Shift+Delete"))?;

    let library_menu = SubmenuBuilder::new(app, "Library")
        .item(&library_all)
        .item(&library_watching)
        .item(&library_completed)
        .item(&library_plan)
        .item(&library_hold)
        .item(&library_dropped)
        .separator()
        .item(&library_stats)
        .item(&library_settings)
        .separator()
        .item(&library_clear)
        .build()?;

    // Go Menu
    let go_home = MenuItem::with_id(app, "go_home", "Home", true, Some("G+H"))?;
    let go_library = MenuItem::with_id(app, "go_library", "Library", true, Some("G+L"))?;
    let go_movies = MenuItem::with_id(app, "go_movies", "Movies", true, Some("G+M"))?;
    let go_tv = MenuItem::with_id(app, "go_tv", "TV Shows", true, Some("G+T"))?;
    let go_search = MenuItem::with_id(app, "go_search", "Search", true, Some("G+S"))?;
    let go_mood = MenuItem::with_id(app, "go_mood", "Mood Match", true, None::<&str>)?;
    let go_collections = MenuItem::with_id(app, "go_collections", "Collections", true, None::<&str>)?;
    let go_celebrities = MenuItem::with_id(app, "go_celebrities", "Celebrities", true, None::<&str>)?;
    let go_networks = MenuItem::with_id(app, "go_networks", "Networks", true, None::<&str>)?;
    let go_back = MenuItem::with_id(app, "go_back", "Back", true, Some("Alt+Left"))?;
    let go_forward = MenuItem::with_id(app, "go_forward", "Forward", true, Some("Alt+Right"))?;

    let go_menu = SubmenuBuilder::new(app, "Go")
        .item(&go_home)
        .item(&go_library)
        .item(&go_movies)
        .item(&go_tv)
        .item(&go_search)
        .separator()
        .item(&go_mood)
        .item(&go_collections)
        .item(&go_celebrities)
        .item(&go_networks)
        .separator()
        .item(&go_back)
        .item(&go_forward)
        .build()?;

    // Help Menu
    let keyboard_shortcuts = MenuItem::with_id(app, "keyboard_shortcuts", "Keyboard Shortcuts", true, Some("?"))?;
    let report_issue = MenuItem::with_id(app, "report_issue", "Report Issue", true, None::<&str>)?;
    let check_updates = MenuItem::with_id(app, "check_updates", "Check for Updates", true, None::<&str>)?;
    let about = MenuItem::with_id(app, "about", "About Watchfolio", true, None::<&str>)?;

    let help_menu = SubmenuBuilder::new(app, "Help")
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
        .item(&view_menu)
        .item(&library_menu)
        .item(&go_menu)
        .item(&help_menu)
        .build()?;

    Ok(menu)
}

pub fn handle_menu_event(app: &AppHandle, event: tauri::menu::MenuEvent) {
    let window = app.get_webview_window("main").unwrap();

    match event.id().as_ref() {
        // File menu
        "quick_add" => {
            let _ = window.emit("menu:quick-add", ());
        }
        "sync" => {
            let _ = window.emit("menu:sync", ());
        }
        "import" => {
            let _ = window.emit("menu:import-export", "import");
        }
        "export" => {
            let _ = window.emit("menu:import-export", "export");
        }
        "preferences" => {
            let _ = window.emit("menu:preferences", ());
        }
        "quit" => {
            app.exit(0);
        }

        // View menu
        "toggle_sidebar" => {
            let _ = window.emit("menu:toggle-sidebar", ());
        }
        "toggle_filters" => {
            let _ = window.emit("menu:toggle-filters", ());
        }
        "reload" => {
            let _ = window.eval("window.location.reload()");
        }
        "toggle_fullscreen" => {
            let fullscreen = window.is_fullscreen().unwrap_or(false);
            let _ = window.set_fullscreen(!fullscreen);
        }

        // Library menu
        "library_all" => {
            let _ = window.emit("menu:navigate", "/library/all");
        }
        "library_watching" => {
            let _ = window.emit("menu:navigate", "/library/watching");
        }
        "library_completed" => {
            let _ = window.emit("menu:navigate", "/library/completed");
        }
        "library_plan" => {
            let _ = window.emit("menu:navigate", "/library/plan-to-watch");
        }
        "library_hold" => {
            let _ = window.emit("menu:navigate", "/library/on-hold");
        }
        "library_dropped" => {
            let _ = window.emit("menu:navigate", "/library/dropped");
        }
        "library_stats" => {
            let _ = window.emit("menu:library-stats", ());
        }
        "library_settings" => {
            let _ = window.emit("menu:navigate", "/settings/library");
        }
        "library_clear" => {
            let _ = window.emit("menu:library-clear", ());
        }

        // Go menu
        "go_home" => {
            let _ = window.emit("menu:navigate", "/home");
        }
        "go_library" => {
            let _ = window.emit("menu:navigate", "/library/all");
        }
        "go_movies" => {
            let _ = window.emit("menu:navigate", "/movies");
        }
        "go_tv" => {
            let _ = window.emit("menu:navigate", "/tv");
        }
        "go_search" => {
            let _ = window.emit("menu:navigate", "/search");
        }
        "go_mood" => {
            let _ = window.emit("menu:navigate", "/mood-match");
        }
        "go_collections" => {
            let _ = window.emit("menu:navigate", "/collections");
        }
        "go_celebrities" => {
            let _ = window.emit("menu:navigate", "/celebrities");
        }
        "go_networks" => {
            let _ = window.emit("menu:navigate", "/networks");
        }
        "go_back" => {
            let _ = window.emit("menu:go-back", ());
        }
        "go_forward" => {
            let _ = window.emit("menu:go-forward", ());
        }

        // Help menu
        "keyboard_shortcuts" => {
            let _ = window.emit("menu:keyboard-shortcuts", ());
        }
        "report_issue" => {
            let _ = tauri_plugin_opener::open_url(
                "https://github.com/zawalid/watchfolio/issues",
                None::<&str>
            );
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
