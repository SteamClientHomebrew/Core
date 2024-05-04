
import json


def get_accent_color():
    # Get the accent color
    print("[posix] get_accent_color has no implementation")


    color_dictionary = {
        'accent': '#000',
        'light1': '#000', 'light2': '#000', 'light3': '#000',
        'dark1': '#000',   'dark2': '#000',   'dark3': '#000',
    }
    return json.dumps(color_dictionary)