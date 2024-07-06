import os
import Millennium

LOCALS = os.path.join(Millennium.steam_path(), "ext", "data")

PYTHON_BIN       = os.path.join(LOCALS, "cache", "python.exe")
PACMAN_LOGS      = os.path.join(LOCALS, "logs", "pacman.log")
PIP_INSTALL_LOGS = os.path.join(LOCALS, "logs", "pip_boot.log")