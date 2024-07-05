import json
import os
import subprocess
import sys
import time
import Millennium
import importlib.metadata

print("starting pacman watchdog...")

# add the root directory to the python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# path to the python executable bundled with steam
PYTHON_BIN = os.path.join(Millennium.steam_path(), "ext", "data", "cache", "python.exe")
PACMAN_LOGS = os.path.join(Millennium.steam_path(), "ext", "data", "logs", "pacman.log")
PIP_INSTALL_LOGS = os.path.join(Millennium.steam_path(), "ext", "data", "logs", "pacman.log")

def bootstrap_pip():
    print("bootstrapping pip...")

    import urllib.request
    pip_temp_path = os.path.join(Millennium.steam_path(), "ext", "data", "cache", "get-pip.py")

    # download get-pip.py
    urllib.request.urlretrieve("https://bootstrap.pypa.io/get-pip.py", pip_temp_path)
    result = subprocess.run([PYTHON_BIN, pip_temp_path, "--no-warn-script-location"], capture_output=True, text=True)

    with open(PIP_INSTALL_LOGS, 'a') as file:
        file.write(result.stdout)

    os.remove(pip_temp_path)

try:
    from pip._internal import main

except ImportError:
    bootstrap_pip()

from backend.api.plugins_store import find_all_plugins

config = ["--no-warn-script-location"]

def install_packages(package_names):
    result = subprocess.run([PYTHON_BIN, '-m', 'pip', 'install'] + package_names + config, capture_output=True, text=True)

    with open(PACMAN_LOGS, 'a') as file:
        file.write(result.stdout)

def uninstall_packages(package_names):
    result = subprocess.run([PYTHON_BIN, '-m', 'pip', 'uninstall', '-y'] + package_names + config, capture_output=True, text=True)
    
    with open(PACMAN_LOGS, 'a') as file:
        file.write(result.stdout)


def get_installed_packages():
    package_names = [dist.metadata["Name"] for dist in importlib.metadata.distributions()]
    return package_names


def main():

    installed_packages = get_installed_packages()
    start_time = time.perf_counter()

    # a grouped list of packages that are collectively required by all plugins
    needed_packages = []
    plugins = json.loads(find_all_plugins())

    # iterate over every plugin and check if it has a requirements.txt file
    for plugin in plugins:
        requirements_path = os.path.join(plugin["path"], "requirements.txt")

        if os.path.exists(requirements_path):
            with open(requirements_path, "r") as f:
                for package in f.readlines():
                    if package.strip() not in installed_packages:
                        needed_packages.append(package.strip())


    if needed_packages:
        print("installing packages: ", needed_packages)
        install_packages(needed_packages)
    else:
        print("all packages are installed")

    # uninstall_unneeded_packages(installed_packages, needed_packages)

    elapsed_time_ms = (time.perf_counter()  - start_time) * 1000 
    print(f"watchdog sniped {len(needed_packages)} packages in {elapsed_time_ms:.2f} ms")

main()