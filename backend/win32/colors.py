from winrt.windows.ui.viewmanagement import UISettings, UIColorType
import json

def get_accent_color():
    # Get the accent color
    settings = UISettings()

    def hex(accent):
        rgba = settings.get_color_value(accent)
        return "#{:02x}{:02x}{:02x}{:02x}".format(rgba.r, rgba.g, rgba.b, rgba.a)

    color_dictionary = {
        'accent': hex(UIColorType.ACCENT),
        'light1': hex(UIColorType.ACCENT_LIGHT1), 'light2': hex(UIColorType.ACCENT_LIGHT2), 'light3': hex(UIColorType.ACCENT_LIGHT3),
        'dark1': hex(UIColorType.ACCENT_DARK1),   'dark2': hex(UIColorType.ACCENT_DARK2),   'dark3': hex(UIColorType.ACCENT_DARK3),
    }
    return json.dumps(color_dictionary)