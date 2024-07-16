import os
import json
import re
import Millennium
from core.themes import is_valid
from webkit.stack import WebkitStack, add_browser_css
import configparser

class Config:

    def get_config(self):
        return self.config
    
    def get_config_str(self):
        config_dict = {section: dict(self.config.items(section)) for section in self.config.sections()}
        
        for section, items in config_dict.items():
            for key, value in items.items():
                if value.lower() == 'yes':
                    config_dict[section][key] = True
                elif value.lower() == 'no':
                    config_dict[section][key] = False
        
        return json.dumps(config_dict)
    
    def write_config(self) -> None:

        with open(self.config_path, 'w') as configFile:
            self.config.write(configFile)

    def cfg(self, section, key, value) -> str:

        if not self.config.has_section(section):
            self.config.add_section(section)

        if isinstance(value, bool):
            value = "yes" if value else "no"

        self.config[section][key] = value
        self.write_config()

    def get_cfg(self, section, key) -> str:

        if not self.config.has_section(section):
            return None

        if key not in self.config[section]:
            return None

        return self.config[section][key]


    def change_theme(self, theme_name: str) -> None:

        self.cfg("Themes", "active_theme", theme_name)

        stack = WebkitStack()
        stack.unregister_all() 

        self.set_theme_cb()


    def create_default(self, section, key, value):

        if not self.config.has_section(section):
            self.config.add_section(section)

        if not self.config.has_option(section, key):
            self.cfg(section, key, value)
    

    def get_active_theme_name(self) -> str:
        return self.get_cfg("Themes", "active_theme")
    
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

        self.start_webkit_hook(theme, name)
        self.setup_conditionals(theme, name, json.loads(self.get_config_str()))


    def __init__(self):

        self.config = configparser.ConfigParser()
        self.config.optionxform = str  # Preserve case of keys

        self.config_path = os.path.join(Millennium.steam_path(), "ext", "millennium.ini")
        self.config.read(self.config_path)

        self.create_default("Themes", "active_theme", "default")
        self.create_default("Themes", "insert_javascript", True)
        self.create_default("Themes", "insert_stylesheets", True)     

        self.create_default("Themes", "theme_update_notifications", True)        

        active = self.get_cfg("Themes", "active_theme")
        # the active skin is not valid [doesn't exist, or doesnt have skin.json/it isn't valid]
        if active != "default" and not is_valid(active):
            self.cfg("Themes", "active_theme", "default")


        # pre-initialize webkit data for selected theme
        self.set_theme_cb()


    def get_conditionals(self):

        # if not os.path.exists(self.config_path):
        #     with open(self.config_path, 'w') as file:
        #         json.dump({}, file)

        # with open(self.config_path, 'r') as conditionals:
        #     # Read the content of the file

        #     conditions = json.load(conditionals)["conditions"]
        #     return json.dumps(conditions)
        
        # Initialize a dictionary to store conditions
        conditions = {}

        # Iterate over sections in the parsed INI
        for section in self.config.sections():
            # Check if the section starts with "Theme|"
            if section.startswith("Theme|"):
                theme_name = section[len("Theme|"):]  # Extract theme name
                theme_settings = {}  # Dictionary to store settings for this theme
                
                # Iterate over options in the section
                for option in self.config.options(section):
                    theme_settings[option] = self.config.get(section, option)
                
                # Add settings under the theme name
                conditions[theme_name] = theme_settings

        # Convert conditions dictionary to JSON
        json_data = json.dumps(conditions, indent=4)
        print(json_data)
        return json_data


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


    def json_to_ini(self, config) -> str:

        def clean_variable_name(input_string):
            cleaned_str = input_string.replace(' ', '_')
            cleaned_str = re.sub(r'\W|^(?=\d)', '', cleaned_str)
            cleaned_str = cleaned_str.lower()

            return cleaned_str

        for category, options in config["conditions"].items():
            section_name = f"Theme|{category}"

            for option, value in options.items():
                self.cfg(section_name, clean_variable_name(option), value)

            self.write_config()

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

        # self.set_config(json.dumps(config, indent=4))
        # print(json.dumps(config, indent=4))
        self.json_to_ini(config)


cfg = Config()