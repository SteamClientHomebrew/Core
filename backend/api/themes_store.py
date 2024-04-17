import os
import json
import Millennium

def find_all_themes() -> str:

    themes = [] 
    path = Millennium.steam_path() + "/steamui/skins"

    filenames = os.listdir(path)
    subdirectories = [filename for filename in filenames if os.path.isdir(os.path.join(path, filename))]
    subdirectories.sort()

    for theme in subdirectories:
        skin_json_path = os.path.join(path, theme, "skin.json")

        if not os.path.exists(skin_json_path):
            continue

        with open(skin_json_path, 'r') as json_file:
            try:
                skin_data = json.load(json_file)
                # Process the skin_data as needed
                themes.append({"native-name": theme, "data": skin_data})
            except json.JSONDecodeError:
                print(f"Error parsing {skin_json_path}. Invalid JSON format.")

    return json.dumps(themes)
