import importlib.metadata
import json
import os
import subprocess
from core.core.plugins import find_all_plugins

def get_installed_packages():
    package_names = [dist.metadata["Name"] for dist in importlib.metadata.distributions()]
    return package_names


def pip(cmd, config):

    python_bin = config.get('package.manager', 'python')
    pip_logs = config.get('package.manager', 'pip_logs')

    with open(pip_logs, 'a') as file:
        file.write(subprocess.run([python_bin, '-m', 'pip'] + cmd + ["--no-warn-script-location"], capture_output=True, text=True).stdout)


def install_packages(package_names, config):
    pip(["install"] + package_names, config)


def uninstall_packages(package_names, config):
    pip(["uninstall", "-y"] + package_names, config)


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


def audit(config):
    packages = needed_packages()

    if packages:
        print(f"installing packages: {packages}")
        install_packages(packages, config)
    else:
        print("all packages are installed")