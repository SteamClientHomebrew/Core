import Millennium # type: ignore
import json, os

from win32.colors import get_accent_color
from api.themes_store import find_all_themes
from api.plugins_store import find_all_plugins
from api.user_data import get_conditionals
from config.settings import _init_settings, get_active_theme_name, get_active_theme, change_theme
from webkit.stack import WebkitStack

def update_plugin_status(plugin_name: str, enabled: bool):
    Millennium.change_plugin_status(plugin_name, enabled)

def add_browser_css(css_path: str) -> None:
    print(f"[debug] adding webkit css module -> {css_path}")
    stack = WebkitStack()
    stack.push(Millennium.add_browser_css(css_path))

def add_browser_js(js_path: str) -> None:
    print(f"[debug] adding webkit js module -> {js_path}")
    stack = WebkitStack()
    stack.push(Millennium.add_browser_js(js_path))

class Plugin:
    # if steam reloads, i.e. from a new theme being selected, or for other reasons, this is called. 
    # with the above said, that means this may be called more than once within your backends lifespan 
    def _front_end_loaded(self):
        print("loaded millennium frontend")

    def _load(self):     
        # This code is executed when your plugin loads. 
        # notes: thread safe, running for entire lifespan of millennium
        print(f"loaded millennium v{Millennium.version()}")
        print("setting up settings store...")
        _init_settings()

        theme = json.loads(get_active_theme())
        name = get_active_theme_name()

        
        if "Steam-WebKit" in theme["data"] and isinstance(theme["data"]["Steam-WebKit"], str):
            print("pre-initiliazing browser css module")
            add_browser_css(os.path.join(Millennium.steam_path(), "skins", name, theme["data"]["Steam-WebKit"]))
        # print("css module id", css_id)
        # print("js module id", js_id)

        # Millennium.remove_browser_module(css_id)
        # Millennium.remove_browser_module(js_id)

    def _unload(self):
        print("unloading")
