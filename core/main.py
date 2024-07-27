import Millennium
import threading, json

from api.css_analyzer import parse_root
from api.themes import Colors
from util.theme_installer import serve_websocket, start_websocket_server

from api.themes import find_all_themes
from api.plugins import find_all_plugins
from api.config import Config, cfg
from util.webkit_handler import WebkitStack, add_browser_css, add_browser_js
from util.theme_installer import uninstall_theme
from updater.version_control import Updater

print(f"Loading Millennium-Core@{Millennium.version()}")
updater = Updater()

def get_load_config():
    config = cfg.get_config()

    return json.dumps({
        "accent_color": json.loads(Colors.get_accent_color()), 
        "conditions": config["conditions"] if "conditions" in config else None, 
        "active_theme": json.loads(cfg.get_active_theme()),
        "settings": config,
        "steamPath": Millennium.steam_path()
    })

def update_plugin_status(plugin_name: str, enabled: bool):
    Millennium.change_plugin_status(plugin_name, enabled)

class Plugin:
    def _front_end_loaded(self):
        print("SteamUI successfully loaded!")

    def _load(self):     
        cfg.set_theme_cb()

        # Disable until further notice
        # websocket_thread = threading.Thread(target=start_websocket_server)
        # websocket_thread.start()

        print("Millennium-Core is ready!")
        Millennium.ready()

    def _unload(self):
        pass
