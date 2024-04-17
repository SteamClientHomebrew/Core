import os
import json
import Millennium

def get_conditionals():
    path = Millennium.steam_path() + "/.millennium/config/conditionals.json"

    if not os.path.exists(path):
        with open(path, 'w') as file:
            json.dump({}, file)

    with open(path, 'r') as conditionals:
        # Read the content of the file
        return conditionals.read()