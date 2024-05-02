import Millennium
import os
import json
import io
from api.themes_store import find_all_themes, is_valid
from webkit.stack import WebkitStack, add_browser_css, add_browser_js

def get_config() -> json:

    config_path = os.path.join(Millennium.steam_path(), ".millennium", "theme.cfg.json")

    # Check if the file exists
    if not os.path.exists(config_path):
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(config_path), exist_ok=True)

        # Create the file
        with open(config_path, 'w') as out:
            out.write("{}")
            pass

    with open(config_path, 'r') as config:
        try:
            return json.loads(config.read())
        except json.JSONDecodeError: 
            return json.loads("{}")

def set_config(dumps: str) -> None:
    config_path = os.path.join(Millennium.steam_path(), ".millennium", "theme.cfg.json")

    with open(config_path, 'w') as config:
        config.write(dumps)

def _init_settings():
    config = get_config()

    if "active" not in config or not isinstance(config["active"], str):
        config["active"] = "default"
    else:
        active = config["active"]
        # the active skin is not valid [doesn't exist, or doesnt have skin.json/it isn't valid]
        if active != "default" and not is_valid(active):
            config["active"] = "default"

    set_config(json.dumps(config, indent=4))
    return config["active"]

def get_active_theme_name() -> str:
    return _init_settings()

def get_active_theme() -> str:

    active_theme = get_active_theme_name()

    if not is_valid(active_theme):
        return '{"failed": true}'

    file_path = os.path.join(Millennium.steam_path(), "steamui", "skins", active_theme, "skin.json")

    with open(file_path, 'r') as file:
        return json.dumps({"native": active_theme, "data": json.load(file)})
    
    return '{"failed": true}'

def change_theme(theme_name: str) -> None:

    config = get_config()
    config["active"] = theme_name

    set_config(json.dumps(config, indent=4))

    stack = WebkitStack()
    stack.unregister_all() 

    theme = json.loads(get_active_theme())
    name = get_active_theme_name()
    
    if "Steam-WebKit" in theme["data"] and isinstance(theme["data"]["Steam-WebKit"], str):
        print("pre-initiliazing browser css module")
        add_browser_css(os.path.join(Millennium.steam_path(), "skins", name, theme["data"]["Steam-WebKit"]))



    


        
