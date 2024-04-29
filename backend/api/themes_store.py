import os
import json
import Millennium

def is_valid(theme_native_name: str) -> bool:
    folder_path = os.path.join(Millennium.steam_path(), "steamui", "skins", theme_native_name)
    file_path = os.path.join(folder_path, "skin.json")

    # Check if the folder exists
    if not os.path.exists(folder_path):
        return False

    # Check if the file exists inside the folder
    if not os.path.isfile(file_path):
        return False

    # Check if the JSON file is valid
    try:
        with open(file_path, 'r') as file:
            json.load(file)
    except json.JSONDecodeError:
        return False

    return True

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
