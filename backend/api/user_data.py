import os
import json
import Millennium
from api.themes_store import is_valid
from webkit.stack import WebkitStack, add_browser_css

class Config:

    def set_config_keypair(self, key: str, value) -> None:
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

        self.set_theme_cb()

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
    
    def start_webkit_hook(self, theme, name):

        if "failed" not in theme and "Steam-WebKit" in theme["data"] and isinstance(theme["data"]["Steam-WebKit"], str):
            print("pre-initiliazing browser css module")
            add_browser_css(os.path.join(Millennium.steam_path(), "skins", name, theme["data"]["Steam-WebKit"]))

    def set_theme_cb(self):

        config = self.get_config()
        theme = json.loads(self.get_active_theme())
        name = self.get_active_theme_name()

        # initialize webkit hooks
        self.start_webkit_hook(theme, name)

        # setup theme conditionals
        self.setup_conditionals(theme, name, config)


    def __init__(self):

        self.config_path = os.path.join(Millennium.steam_path(), ".millennium", "theme.cfg.json")
        self.config = self.get_config()

        self.create_default("active", "default", str)
        self.create_default("scripts", True, bool)
        self.create_default("styles", True, bool)        
        self.create_default("updateNotifications", True, bool)        

        active = self.config["active"]
        # the active skin is not valid [doesn't exist, or doesnt have skin.json/it isn't valid]
        if active != "default" and not is_valid(active):
            self.config["active"] = "default"

        self.set_config(json.dumps(self.config, indent=4))   

        # pre-initialize webkit data for selected theme
        self.set_theme_cb()

    """
    BEGIN CONDITIONAL SETUP
    """
    def get_conditionals(self):
        path = Millennium.steam_path() + "/.millennium/theme.cfg.json"

        if not os.path.exists(path):
            with open(path, 'w') as file:
                json.dump({}, file)

        with open(path, 'r') as conditionals:
            # Read the content of the file

            conditions = json.load(conditionals)["conditions"]
            return json.dumps(conditions)
        

    # Checks if a given condition doesn't exist, or is a value outside of whats allowed. 
    def is_invalid_condition(self, conditions: dict, name: str, condition_name: str, condition_value):

        default_value =  condition_value["default"] if "default" in condition_value else list(condition_value["values"].keys())[0]

        if name not in conditions.keys():
            conditions[name] = {}

        if condition_name not in conditions[name].keys():
            conditions[name][condition_name] = default_value
        
        elif conditions[name][condition_name] not in condition_value["values"].keys():
            conditions[name][condition_name] = default_value


    def change_condition(self, theme, newData, condition):

        try:
            config = self.get_config()

            config["conditions"][theme][condition] = newData
            self.set_config(json.dumps(config, indent=4))

            return json.dumps({"success": True})
        
        except Exception as ex:
            return json.dumps({"success": False, "message": str(ex)})


    def setup_conditionals(self, theme, name, config):
        print("setting up conditionals")


        if "conditions" not in config:
            config["conditions"] = {}

        if "failed" in theme:
            return # failed to parse the skin, invalid or default

        if "Conditions" not in theme["data"]:
            print("no conditions to evaluate")
            return 
        
        for condition_name, condition_value in theme["data"]["Conditions"].items():

            self.is_invalid_condition(config["conditions"], name, condition_name, condition_value)

        self.set_config(json.dumps(config, indent=4))


cfg = Config()