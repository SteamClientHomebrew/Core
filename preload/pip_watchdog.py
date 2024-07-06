import os
import subprocess
import Millennium
import var

def bootstrap_pip():
    print("bootstrapping pip...")

    import urllib.request
    pip_temp_path = os.path.join(Millennium.steam_path(), "ext", "data", "cache", "get-pip.py")

    # download get-pip.py
    urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", pip_temp_path)
    result = subprocess.run([var.PYTHON_BIN, pip_temp_path, "--no-warn-script-location"], capture_output=True, text=True)

    with open(var.PIP_INSTALL_LOGS, 'a') as file:
        file.write(result.stdout)

    os.remove(pip_temp_path)


def verify_pip():
    try:
        from pip._internal import main
    except ImportError:
        bootstrap_pip()