import json
import cssutils
import enum
from logger.logger import logger

class ColorTypes(enum.Enum):
    RawRGB = 1
    RGB = 2
    RawRGBA = 3
    RGBA = 4
    Hex = 5
    Unknown = 6

def convert_from_hex(color, type: ColorTypes):

    if type == ColorTypes.Unknown:
        return None

    color = color.lstrip('#')

    if type == ColorTypes.RawRGB:
            
        r = int(color[0:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
        return f"{r}, {g}, {b}"
    
    elif type == ColorTypes.RawRGBA:
            
        r = int(color[0:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
        a = int(color[6:8], 16) / 255.0
        return f"{r}, {g}, {b}, {a:.2f}"
    
    elif type == ColorTypes.RGB:
                
        r = int(color[0:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
        return f"rgb({r}, {g}, {b})"
    
    elif type == ColorTypes.RGBA:
         
        r = int(color[0:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
        a = int(color[6:8], 16) / 255.0
        return f"rgba({r}, {g}, {b}, {a:.2f})"

    elif type == ColorTypes.Hex:
        return "#" + color


def convert_to_hex(color, type: ColorTypes):

    if type == ColorTypes.RawRGB:

        r, g, b = [x.strip() for x in color.split(',')]
        r, g, b = int(r), int(g), int(b)
        return f'#{r:02x}{g:02x}{b:02x}'
    
    elif type == ColorTypes.RawRGBA:

        r, g, b, a = [x.strip() for x in color.split(',')]
        r, g, b = int(r), int(g), int(b)
        a = float(a)
        a = int(a * 255)
        return f'#{r:02x}{g:02x}{b:02x}{a:02x}'  

    elif type == ColorTypes.RGB:

        r, g, b = [x.strip() for x in color[4:-1].split(',')]
        r, g, b = int(r), int(g), int(b)
        return f'#{r:02x}{g:02x}{b:02x}'

    elif type == ColorTypes.RGBA:

        r, g, b, a = [x.strip() for x in color[5:-1].split(',')]
        r, g, b = int(r), int(g), int(b)
        a = float(a)
        a = int(a * 255)
        return f'#{r:02x}{g:02x}{b:02x}{a:02x}'

    elif type == ColorTypes.Hex:
        return color
    else:
        return None

def try_raw_parse(color):
    if ", " in color:
        channels = color.split(", ")

        if len(channels) == 3:
            return ColorTypes.RawRGB
        elif len(channels) == 4:
            return ColorTypes.RawRGBA
    
    return ColorTypes.Unknown


def parse_color(color):
    if color.startswith('rgb('):
        return ColorTypes.RGB
    elif color.startswith('rgba('):
        return ColorTypes.RGBA
    elif color.startswith('#'):
        return ColorTypes.Hex
    elif color.startswith('hsl('):
        return ColorTypes.Unknown
    elif color.startswith('hsla('):
        return ColorTypes.Unknown
    elif color.startswith('hsv('):
        return ColorTypes.Unknown
    elif color.startswith('hsva('):
        return ColorTypes.Unknown
    else:
        return try_raw_parse(color)


def parse_root(file_path):
    cssutils.log.setLevel(50)
    sheet = cssutils.parseFile(file_path)

    result = []

    for rule in sheet:

        if isinstance(rule, cssutils.css.CSSStyleRule) and rule.selectorText == ':root':
            item_map = {}
            for item in rule.style.cssText.split(";"):
                comment = None
                if "/*" in item and "*/" in item:
                    comment = item[item.index("/*"):item.index("*/")+2]
                    item = item.replace(comment, "")

                item = item.strip().split(":")[0]
                if not comment:
                    item_map[item] = (None, None)
                    continue

                name = None
                description = None

                for line in comment.split("\n"):
                    if "@name" in line:          name = line.split("@name")[1].strip()
                    elif "@description" in line: description = line.split("@description")[1].strip()

                item_map[item] = (name, description)

            for prop in rule.style:

                color_type = parse_color(prop.value)

                if color_type == ColorTypes.Unknown:
                    logger.error(f"ERROR: Could not parse color value '{prop.value}'")
                    continue

                details = item_map.get(prop.name, (None, None))

                result.append({
                    "color": prop.name,
                    "name": details[0],
                    "description": details[1],
                    "type": color_type.value,
                    "defaultColor": convert_to_hex(prop.value, color_type)
                })

    return json.dumps(result, indent=4)

    

