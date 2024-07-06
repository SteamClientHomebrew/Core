import importlib
import json
import subprocess
import urllib.request

class mpc:

    def __init__(self, m_python_bin):
        self.__python_bin = m_python_bin

    def get_live_version(self):
        url = "https://pypi.org/pypi/millennium/json"
        response = urllib.request.urlopen(url)
        return json.load(response)["info"]["version"]

    def update_millennium(self):
        print("updating millennium...")
        subprocess.run([self.__python_bin, "-m", "pip", "install", "--upgrade", "millennium"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def start(self):
        try:
            if self.get_live_version() != importlib.metadata.version("millennium"):
                self.update_millennium()
            else:
                print("millennium is up to date")
        except importlib.metadata.PackageNotFoundError as e:
            print("millennium is not installed")
            self.update_millennium()