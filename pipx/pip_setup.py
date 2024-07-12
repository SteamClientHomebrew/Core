import os
import subprocess
import Millennium
from logger import logger

def bootstrap_pip(config):
    logger.log("Installing Preferred Installer Program...")

    import urllib.request
    pip_temp_path = os.path.join(Millennium.steam_path(), "ext", "data", "cache", "get-pip.py")

    # download get-pip.py
    urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", pip_temp_path)
    result = subprocess.run([config.get('package.manager', 'python'), pip_temp_path, "--no-warn-script-location"], capture_output=True, text=True)

    with open(config.get('package.manager', 'pip_boot'), 'a') as file:
        file.write(result.stdout)

    os.remove(pip_temp_path)


def verify_pip(config):
    try:
        from pip._internal import main
    except ImportError:
        bootstrap_pip(config)