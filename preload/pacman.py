import importlib.metadata
import json
import os, var
import subprocess
from backend.core.plugins import find_all_plugins

def get_installed_packages():
    package_names = [dist.metadata["Name"] for dist in importlib.metadata.distributions()]
    return package_names


def pip(cmd):
    with open(var.PACMAN_LOGS, 'a') as file:
        file.write(subprocess.run([var.PYTHON_BIN, '-m', 'pip'] + cmd + ["--no-warn-script-location"], capture_output=True, text=True).stdout)


def install_packages(package_names):
    pip(["install"] + package_names)


def uninstall_packages(package_names):
    pip(["uninstall", "-y"] + package_names)


def needed_packages():

    needed_packages = []
    installed_packages = get_installed_packages()

    for plugin in json.loads(find_all_plugins()):
        requirements_path = os.path.join(plugin["path"], "requirements.txt")

        if not os.path.exists(requirements_path):
            continue

        with open(requirements_path, "r") as f:
            for package in f.readlines():
                if package.strip() not in installed_packages:
                    needed_packages.append(package.strip())

    return needed_packages


def audit():
    packages = needed_packages()

    if packages:
        print(f"installing packages: {packages}")
        install_packages(packages)
    else:
        print("all packages are installed")