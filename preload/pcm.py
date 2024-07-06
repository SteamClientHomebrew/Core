import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import var
import time
import importlib.metadata
import mpcmon, pip_watchdog, pacman

print("starting pacman watchdog...")

def get_installed_packages():
    package_names = [dist.metadata["Name"] for dist in importlib.metadata.distributions()]
    return package_names

def main():

    start_time = time.perf_counter()
    pip_watchdog.verify_pip()

    # keep millennium module up to date
    watchdog = mpcmon.mpc(var.PYTHON_BIN)
    watchdog.start()

    pacman.audit()

    elapsed_time_ms = (time.perf_counter()  - start_time) * 1000 
    print(f"watchdog finished in {elapsed_time_ms:.2f} ms")

main()