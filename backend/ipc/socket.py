import asyncio
import os, stat
import shutil
import git
import websockets
import json
import Millennium
from api.user_data import cfg

from api.themes_store import find_all_themes

def get_theme_from_gitpair(repo, owner):
    themes = json.loads(find_all_themes())

    for theme in themes:
        if "data" in theme and "github" in theme["data"]: 
            if "owner" in theme["data"]["github"] and "repo_name" in theme["data"]["github"]:
                if theme["data"]["github"]["owner"] == owner and theme["data"]["github"]["repo_name"] == repo:
                    return theme
                
    return None

def check_install(repo, owner):
    return False if get_theme_from_gitpair(repo, owner) == None else True

def make_dir_writable(function, path, exception):
    """The path on Windows cannot be gracefully removed due to being read-only,
    so we make the directory writable on a failure and retry the original function.
    """
    os.chmod(path, stat.S_IWRITE)
    function(path)

def uninstall_theme(repo, owner):

    target_theme = get_theme_from_gitpair(repo, owner)

    if target_theme == None:
        return json.dumps({'success': False, 'message': "Couldn't locate the target theme on disk!"})
    
    path = os.path.join(Millennium.steam_path(), "steamui", "skins", target_theme["native"])

    if not os.path.exists(path):
        return json.dumps({'success': False, 'message': f"Queried folder [{path}] was not found!"})
    
    try:
        shutil.rmtree(path, onerror=make_dir_writable)
        return json.dumps({'success': True})
    except Exception as e:
        return json.dumps({'success': False, 'message': str(e)})
    

def install_theme(repo, owner):

    try:
        path = os.path.join(Millennium.steam_path(), "steamui", "skins", repo)
        print(f"cloning requested theme to -> {path}")
        os.makedirs(path)

        git.Repo.clone_from(f"https://github.com/{owner}/{repo}.git", path, recursive=True)

    except git.GitCommandError as e:
        return json.dumps({'success': False, 'message': str(e)})
    
    return json.dumps({'success': True})

async def echo(websocket, path):
    async for message in websocket:
        print(f"received message {message}")

        query = json.loads(message)

        if "type" in query:

            type = query["type"]
            message = query["data"] if "data" in query else None

            if type == "checkInstall" and "repo" in message and "owner" in message:

                print(f"checking install for {message['repo']}, {message['owner']}")
                is_installed = check_install(message['repo'], message['owner'])

                await websocket.send(json.dumps({"type": "checkInstall", "status": is_installed}))

            elif type == "uninstallTheme" and "repo" in message and "owner" in message:

                print(f"requesting to uninstall {message['repo']}, {message['owner']}")

                success = uninstall_theme(message['repo'], message['owner'])
                await websocket.send(json.dumps({"type": "uninstallTheme", "status": success}))

            
            elif type == "installTheme" and "repo" in message and "owner" in message:

                print(f"requesting to install {message['repo']}, {message['owner']}")

                success = install_theme(message['repo'], message['owner'])
                await websocket.send(json.dumps({"type": "installTheme", "status": success}))

            elif type == "setActiveTheme" and "repo" in message and "owner" in message:

                print(f"requesting to set new theme {message['repo']}, {message['owner']}")

                target_theme = get_theme_from_gitpair(message['repo'], message['owner'])

                if target_theme == None:
                    return json.dumps({'success': False, 'message': "Couldn't locate the target theme on disk!"})
    
                cfg.change_theme(target_theme["native"])
                Millennium.call_frontend_method("ReloadMillenniumFrontend")

                await websocket.send(json.dumps({"type": "setActiveTheme", "status": True}))

            else:
                await websocket.send(json.dumps({"type": "unknown", "message": "unknown message type"}))

        else:
            await websocket.send(json.dumps({"type": "unknown", "message": "unknown message type"}))



async def serve_websocket():
    async with websockets.serve(echo, "localhost", 9123):
        await asyncio.Future()  # run forever

def start_websocket_server():
    asyncio.set_event_loop(asyncio.new_event_loop())
    asyncio.get_event_loop().run_until_complete(serve_websocket())
