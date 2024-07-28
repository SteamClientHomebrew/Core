from typing import Dict, Tuple
import cssutils, enum, json
from util.logger import logger

# Supported color types
class ColorTypes(enum.Enum):
    RawRGB = 1 # 255, 255, 255
    RGB = 2 # rgb(255, 255, 255)
    RawRGBA = 3 # 255, 255, 255, 1.0
    RGBA = 4 # rgba(255, 255, 255, 1.0)
    Hex = 5 # #ffffff
    Unknown = 6 # Unknown


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


# Expand short hex color codes (provided by the CSS parser) to full hex color codes
def expand_hex_color(short_hex):
    if len(short_hex) == 4 and short_hex[0] == '#':
        return '#' + ''.join([char*2 for char in short_hex[1:]])
    else:
        return short_hex


# Attempt to parse a raw color value (e.g. "255, 255, 255")
def try_raw_parse(color):

    if ", " not in color:
        return ColorTypes.Unknown

    channels = color.split(", ")

    if len(channels) == 3:
        return ColorTypes.RawRGB
    elif len(channels) == 4:
        return ColorTypes.RawRGBA


# Parse a color value and determine its type
def parse_color(color):
    if   color.startswith('rgb('):  return ColorTypes.RGB
    elif color.startswith('rgba('): return ColorTypes.RGBA
    elif color.startswith('#'):     return ColorTypes.Hex
    elif color.startswith('hsl('):  return ColorTypes.Unknown
    elif color.startswith('hsla('): return ColorTypes.Unknown
    elif color.startswith('hsv('):  return ColorTypes.Unknown
    elif color.startswith('hsva('): return ColorTypes.Unknown
    else:
        return try_raw_parse(color)


# Lexically analyze the CSS properties of a style rule and construct a map of property names to their respective comments
def lexically_analyze(rule: cssutils.css.CSSStyleRule):

    propertyMap = {}
    for item in rule.style.cssText.split(";"):
        comment = None
        if "/*" in item and "*/" in item:
            comment = item[item.index("/*"):item.index("*/")+2]
            item = item.replace(comment, "")

        item = item.strip().split(":")[0]
        if not comment:
            propertyMap[item] = (None, None)
            continue

        name = None
        description = None

        for line in comment.split("\n"):
            if "@name" in line:          name = line.split("@name")[1].strip()
            elif "@description" in line: description = line.split("@description")[1].strip()

        propertyMap[item] = (name, description)

    return propertyMap


# Generate metadata for each color property in the CSS style rule
def generate_color_metadata(style_rule, property_map):

    result = []
    for property_rule in style_rule.style:

        value = expand_hex_color(property_rule.value)
        type  = parse_color(value)

        if type == ColorTypes.Unknown:
            logger.error(f"ERROR: Could not parse color value '{value}'")
            continue

        details = property_map.get(property_rule.name, (None, None))

        result.append({
            "color": property_rule.name,
            "name": details[0],
            "description": details[1],
            "type": type.value,
            "defaultColor": convert_to_hex(value, type)
        })

    return result


# Find the root CSS component in a CSS file
def find_root(file_path):
    # Suppress CSS parsing warnings
    cssutils.log.setLevel(50)
    parsed_style_sheet = cssutils.parseFile(file_path)

    for style_rule in parsed_style_sheet:

        if not isinstance(style_rule, cssutils.css.CSSStyleRule) or style_rule.selectorText != ':root':
            continue

        return style_rule

    return None


# Parse the root CSS component and generate metadata for each color property
def parse_root(file_path):
    root_component = find_root(file_path)
    property_map = lexically_analyze(root_component)
    result = generate_color_metadata(root_component, property_map)

    return json.dumps(result, indent=4)
