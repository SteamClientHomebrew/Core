import Millennium
import json, os
import platform

# get runtime platform
_platform = platform.system()

if _platform == "Windows":
    from _win32.colors import get_accent_color
elif _platform == "Linux":
    from _posix.colors import get_accent_color

from api.themes_store import find_all_themes
from api.plugins_store import find_all_plugins
from api.user_data import get_conditionals
from config.settings import Config
from webkit.stack import WebkitStack, add_browser_css, add_browser_js

from updater.git import initialize_repositories, get_cached_updates, update_theme, needs_update

cfg = Config()

def get_load_config():

    query = {
        "accent_color": json.dumps(get_accent_color()), 
        "conditions": json.dumps(get_conditionals()), 
        "settings": json.dumps(cfg.get_config())
    }
    return json.dumps(query)


def update_plugin_status(plugin_name: str, enabled: bool):
    Millennium.change_plugin_status(plugin_name, enabled)

class Plugin:
    def _front_end_loaded(self):
        print("loaded millennium frontend")

    def _load(self):     
        try:
            print(f"loaded millennium v{Millennium.version()}")
            print("setting up settings store...")

            theme = json.loads(cfg.get_active_theme())
            name = cfg.get_active_theme_name()

            if "failed" not in theme and "Steam-WebKit" in theme["data"] and isinstance(theme["data"]["Steam-WebKit"], str):
                print("pre-initiliazing browser css module")
                add_browser_css(os.path.join(Millennium.steam_path(), "skins", name, theme["data"]["Steam-WebKit"]))

            initialize_repositories()

        except Exception as excep:
            print(f"exception thrown @ _load -> {excep}")

    def _unload(self):
        print("unloading")
