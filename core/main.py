import subprocess, platform
import Millennium
import os, threading, json

from core.color_parser import parse_root
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

        websocket_thread = threading.Thread(target=start_websocket_server)
        websocket_thread.start()

        print("Millennium-Core is ready!")
        Millennium.ready()

    def _unload(self):
        pass
