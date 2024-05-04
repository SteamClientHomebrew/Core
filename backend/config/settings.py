import Millennium
import os
import json
import io
from api.themes_store import find_all_themes, is_valid
from webkit.stack import WebkitStack, add_browser_css, add_browser_js

class Config:

    def set_config_keypair(self, key: str, value: str) -> None:
        config = self.get_config()
        config[key] = value
        self.set_config(json.dumps(config, indent=4))

    def get_config(self) -> json:

        if not os.path.exists(self.config_path):

            os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
            with open(self.config_path, 'w') as out:
                out.write("{}")
                pass

        with open(self.config_path, 'r') as config:
            try:
                return json.loads(config.read())
            except json.JSONDecodeError: 
                return json.loads("{}")
            

    def get_config_str(self) -> json:
        return json.dumps(self.get_config())


    def set_config(self, dumps: str) -> None:
        with open(self.config_path, 'w') as config:
            config.write(dumps)


    def change_theme(self, theme_name: str) -> None:

        config = self.get_config()
        config["active"] = theme_name

        self.set_config(json.dumps(config, indent=4))

        stack = WebkitStack()
        stack.unregister_all() 

        theme = json.loads(self.get_active_theme())
        name = self.get_active_theme_name()
        
        if "Steam-WebKit" in theme["data"] and isinstance(theme["data"]["Steam-WebKit"], str):
            print("pre-initiliazing browser css module")
            add_browser_css(os.path.join(Millennium.steam_path(), "skins", name, theme["data"]["Steam-WebKit"]))

    def create_default(self, key: str, value, type):

        if key not in self.config or not isinstance(self.config[key], type):
            self.config[key] = value

    
    def get_active_theme_name(self) -> str:
        return self.get_config()["active"]
    
    def get_active_theme(self) -> str:

        active_theme = self.get_active_theme_name()

        if not is_valid(active_theme):
            return json.dumps({"failed": True})

        file_path = os.path.join(Millennium.steam_path(), "steamui", "skins", active_theme, "skin.json")

        try:
            with open(file_path, 'r') as file:
                return json.dumps({"native": active_theme, "data": json.load(file)})
        
        except Exception as ex:       
            return json.dumps({"failed": True})
    
    def __init__(self):

        self.config_path = os.path.join(Millennium.steam_path(), ".millennium", "theme.cfg.json")
        self.config = self.get_config()

        self.create_default("active", "default", str)
        self.create_default("scripts", True, bool)
        self.create_default("styles", True, bool)        

        active = self.config["active"]
        # the active skin is not valid [doesn't exist, or doesnt have skin.json/it isn't valid]
        if active != "default" and not is_valid(active):
            self.config["active"] = "default"

        self.set_config(json.dumps(self.config, indent=4))   




    


        
