import os
import json
import Millennium

def is_enabled(plugin_name: str) -> json:
    with open(Millennium.steam_path() + "/.millennium/settings.json", 'r') as enabled:
        obj = json.load(enabled)

        if plugin_name in obj["enabled"]:
            return True
    
    return False

def find_all_plugins() -> str:

    plugins = [] 
    path = Millennium.steam_path() + "/steamui/plugins"

    filenames = os.listdir(path)
    subdirectories = [filename for filename in filenames if os.path.isdir(os.path.join(path, filename))]
    subdirectories.sort()

    for theme in subdirectories:
        skin_json_path = os.path.join(path, theme, "plugin.json")

        if not os.path.exists(skin_json_path):
            continue

        with open(skin_json_path, 'r') as json_file:
            try:
                skin_data = json.load(json_file)
                pname: str = "undefined_plugin_name"
                if 'name' in skin_data:
                    pname = skin_data["name"]
                # Process the skin_data as needed
                plugins.append({'path': os.path.join(path, theme), 'enabled': is_enabled(pname), 'data': skin_data})
            except json.JSONDecodeError:
                print(f"Error parsing {skin_json_path}. Invalid JSON format.")

    print(plugins)
    return json.dumps(plugins)
