import os
import json
import Millennium

def is_enabled(plugin_name: str) -> json:
    with open(Millennium.steam_path() + "/ext/plugins.json", 'r') as enabled:
        obj = json.load(enabled)

        if plugin_name in obj["enabled"]:
            return True
    
    return False

def search_dirs(m_path: str, plugins: list) -> None:

    subdirectories = [filename for filename in os.listdir(m_path) if os.path.isdir(os.path.join(m_path, filename))]

    for theme in subdirectories:
        skin_json_path = os.path.join(m_path, theme, "plugin.json")

        if not os.path.exists(skin_json_path):
            continue

        with open(skin_json_path, 'r') as json_file:

            try:
                skin_data = json.load(json_file)
                plugin_name: str = "undefined_plugin_name"
                
                if 'name' in skin_data:
                    plugin_name = skin_data["name"]

                plugins.append({'path': os.path.join(m_path, theme), 'enabled': is_enabled(plugin_name), 'data': skin_data})

            except json.JSONDecodeError:
                print(f"Error parsing {skin_json_path}. Invalid JSON format.")


def find_all_plugins() -> str:

    plugins = [] 

    search_dirs(os.path.join(Millennium.steam_path(), "ext", "data"), plugins)
    search_dirs(os.path.join(Millennium.steam_path(), "plugins"), plugins)

    return json.dumps(plugins)
