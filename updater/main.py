# this file is responsible for updating Millennium core. 
import argparse
import os
import psutil
import requests

updater_version = "1.0.0"

def terminate_steam():
    # Iterate over all running processes
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            # Check if the process name matches 'Steam'
            if proc.info['name'] and proc.info['name'].lower() == 'steam.exe':
                print(f"Terminating process {proc.info['name']} (PID: {proc.info['pid']})")
                proc.terminate()  # Terminate the process
                proc.wait()       # Wait for the process to be terminated
                print("Process terminated successfully.")

        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

def get_latest(version: str):
    response = requests.get("https://api.github.com/repos/SteamClientHomebrew/Millennium/releases")
    data = response.json()

    latest_version = None
    assets = None

    for release in data:
        if not release['prerelease']:
            latest_version = release['tag_name']
            assets = release['assets']
            break

    if latest_version is None:
        print("No non-prerelease versions found.")
        return False

    if latest_version != version:
        print(f"New version available: {version} -> {latest_version}")
        return assets

    return False


def update_millennium(update_info, path):

    succeeded = []
    failed = []

    for asset in update_info:
        download_response = requests.get(asset['browser_download_url'])
            
        if download_response.status_code == 200:
            os.makedirs(path, exist_ok=True)

            with open(os.path.join(path, asset["name"]), 'wb') as file:
                file.write(download_response.content)
            
            succeeded.append(asset['name'])
        else:
            failed.append(asset['name'])

    print(f"Update completed. {len(succeeded)} succeeded, {len(failed)} failed.")
    print(f"Files added: {succeeded}")


def main(version: str, path: str):

    print(f"starting Millennium updater {updater_version}...")
    print("closing Steam...")
    # Terminate Steam
    terminate_steam()

    # Run the updater
    print("Running Millennium updater...")

    update_info = get_latest(version)

    if update_info:
        update_millennium(update_info, path)

    print("Millennium updater completed.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Example script with parameters.")

    parser.add_argument('--version', type=str, required=True, help='Current version of Millennium')
    parser.add_argument('--path', type=str, required=True, help='Path to install binaries to')
    args = parser.parse_args()
    
    main(args.version, args.path)