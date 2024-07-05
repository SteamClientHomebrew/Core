import json
import os
import subprocess
import sys
import time
import Millennium
import importlib.metadata

# add the root directory to the python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pip._internal import main as pipmain
from backend.api.plugins_store import find_all_plugins

# path to the python executable bundled with steam
python_path = os.path.join(Millennium.steam_path(), "ext", "data", "cache", "python.exe")

def install_packages(package_names):
    subprocess.run([python_path, '-m', 'pip', 'install'] + package_names)


def uninstall_packages(package_names):
    subprocess.run([python_path, '-m', 'pip', 'uninstall', '-y'] + package_names)


def get_installed_packages():
    package_names = [dist.metadata["Name"] for dist in importlib.metadata.distributions()]
    return package_names


def uninstall_unneeded_packages(installed_packages, needed_packages):

    white_listed_packages = ["pip", "setuptools", "wheel", "pkg-resources", "importlib-metadata", "zipp", "pipenv", "pip-tools", "pipdeptree", "pipreqs", "pipreqs", "pipenv-to-requirements", "pip-upgrader", "pip-upgrader"]

    unneeded_packages = [package for package in installed_packages if package not in needed_packages and package not in white_listed_packages]

    if unneeded_packages:
        print("removing unused packages: ", unneeded_packages)
        # uninstall_packages(unneeded_packages)

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
        print("All packages are installed")

    uninstall_unneeded_packages(installed_packages, needed_packages)

    elapsed_time_ms = (time.perf_counter()  - start_time) * 1000 
    print(f"Elapsed time: {elapsed_time_ms:.2f} milliseconds")

main()