import Millennium
import os, threading, json

from core.themes import Colors
from ipc.socket import serve_websocket, start_websocket_server

from core.themes  import find_all_themes
from core.plugins import find_all_plugins
from core.cfg     import Config, cfg
from webkit.stack import WebkitStack, add_browser_css, add_browser_js
from ipc.socket   import uninstall_theme
from ffi.git      import Updater

print(f"Loading Millennium-Core@{Millennium.version()}")
updater = Updater()

def get_load_config():
    config = cfg.get_config()
    
    active = config.get("Themes", "active_theme")
    styles = config.get("Themes", "insert_stylesheets")
    scripts = config.get("Themes", "insert_javascript")
    updateNotifications = config.get("Themes", "theme_update_notifications")

    return json.dumps({
        "accent_color": json.loads(Colors.get_accent_color()), 
        "conditions": json.loads(cfg.get_conditionals()), 
        "active_theme": json.loads(cfg.get_active_theme()),
        "settings": {
            "styles": True if styles == "yes" else False,
            "scripts": True if scripts == "yes" else False,
            "updateNotifications": True if updateNotifications == "yes" else False,
            "active": True if active == "yes" else False
        }
    })


def update_plugin_status(plugin_name: str, enabled: bool):
    Millennium.change_plugin_status(plugin_name, enabled)


class Plugin:
    def _front_end_loaded(self):
        print("SteamUI successfully loaded!")

    def _load(self):     
        try:
            theme = json.loads(cfg.get_active_theme())
            name = cfg.get_active_theme_name()

            if "failed" not in theme and "Steam-WebKit" in theme["data"] and isinstance(theme["data"]["Steam-WebKit"], str):
                print("Preloading webkit hooks...")
                add_browser_css(os.path.join(Millennium.steam_path(), "skins", name, theme["data"]["Steam-WebKit"]))

        except Exception as exception:
            print(f"Exception thrown while loading core: {exception}")

        websocket_thread = threading.Thread(target=start_websocket_server)
        websocket_thread.start()

        print("Millennium-Core is ready!")
        Millennium.ready()

    def _unload(self):
        pass
